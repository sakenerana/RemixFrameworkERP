import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { BudgetCodeService } from "~/services/budget_code.service";
import { BudgetService } from "~/services/budget.service";
import Liquidation from "./liquidation";

interface BudgetCodeParticular {
    id: number | string;
    particulars?: string | null;
    description?: string | null;
    allocatedAmount?: number | null;
}

interface CompletedBudgetWorkflow {
    branch?: string | null;
    branchCode?: string | null;
    branchName?: string | null;
    department?: string | null;
    departmentName?: string | null;
    deptCode?: string | null;
    officeLocation?: string | null;
    particular?: string | null;
    processTitle?: string | null;
    referenceNo?: string | null;
    startDate?: string | null;
    status?: string | null;
    totalAmount?: string | number | null;
    workflowType?: string | null;
}

interface LiquidationRecord {
    key?: string;
    startDate: string;
    referenceNo: string;
    particular: string;
    totalAmount: number;
    status: string;
}

interface BudgetDepartmentItem {
    budget?: number | string | null;
    departments: {
        department: string;
        budget_code?: unknown;
    };
}

const getBudgetCodeIds = (budgetCodes: unknown): number[] => {
    if (Array.isArray(budgetCodes)) {
        return budgetCodes
            .map((code) => {
                if (typeof code === "object" && code !== null) {
                    const budgetCode = code as Record<string, unknown>;
                    return Number(budgetCode.id ?? budgetCode.value ?? budgetCode.budget_code_id);
                }

                return Number(code);
            })
            .filter((code) => Number.isFinite(code));
    }

    if (typeof budgetCodes === "string") {
        const normalized = budgetCodes
            .replace(/[{}[\]"]/g, "")
            .split(",")
            .map((code) => Number(code.trim()))
            .filter((code) => Number.isFinite(code));

        return normalized;
    }

    return [];
};

const getBudgetCodeNames = (budgetCodes: unknown): string[] => {
    if (Array.isArray(budgetCodes)) {
        return budgetCodes
            .map((code) => {
                if (typeof code === "object" && code !== null) {
                    const budgetCode = code as Record<string, unknown>;
                    return String(budgetCode.particulars ?? budgetCode.label ?? budgetCode.name ?? "").trim();
                }

                return Number.isNaN(Number(code)) ? String(code).trim() : "";
            })
            .filter(Boolean);
    }

    if (typeof budgetCodes === "string") {
        return budgetCodes
            .replace(/[{}[\]"]/g, "")
            .split(",")
            .map((code) => code.trim())
            .filter((code) => code && Number.isNaN(Number(code)));
    }

    return [];
};

const matchesDepartment = (record: CompletedBudgetWorkflow, department: string) => {
    if (!department) return true;

    if (
        record.department === "N/A" ||
        record.department === "n/a" ||
        record.department === "NA" ||
        record.department === null
    ) {
        return (
            record.branch === department ||
            record.branchName === department ||
            record.branchCode === department ||
            record.officeLocation === department
        );
    }

    return (
        record.department === department ||
        record.departmentName === department ||
        record.deptCode === department
    );
};

const normalizeText = (value: unknown) => String(value ?? "").trim();

const isBlankParticular = (value: unknown) => !normalizeText(value);

const isNaParticular = (value: unknown) => {
    const normalized = normalizeText(value).toLowerCase();
    return normalized === "n/a" || normalized === "na";
};

const matchesParticularValue = (recordParticular: unknown, budgetParticular: unknown) => {
    if (isNaParticular(budgetParticular)) {
        return isBlankParticular(recordParticular) || isNaParticular(recordParticular);
    }

    return normalizeText(recordParticular) === normalizeText(budgetParticular);
};

export default function Particulars({ item }: { item: BudgetDepartmentItem }) {
    const [particulars, setParticulars] = useState<BudgetCodeParticular[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingAmountSpent, setLoadingAmountSpent] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requisitions, setRequisitions] = useState<CompletedBudgetWorkflow[]>([]);
    const currentYear = new Date().getFullYear();

    /* ===========================
       FETCH PARTICULARS
    ============================ */
    useEffect(() => {
        const fetchParticulars = async () => {
            try {
                setLoading(true);
                setError(null);

                const budgetCodes = item.departments?.budget_code;
                const budgetCodeIds = getBudgetCodeIds(budgetCodes);
                const budgetCodeNames = getBudgetCodeNames(budgetCodes);

                if (budgetCodeIds.length) {
                    const data = await BudgetService.getAllParticularsByDepartment(budgetCodeIds);
                    setParticulars(data || []);
                } else if (budgetCodeNames.length) {
                    const data = await BudgetCodeService.getAllParticulars();
                    const normalizedNames = new Set(budgetCodeNames.map((name) => name.toLowerCase()));
                    setParticulars(
                        (data || []).filter((particular: BudgetCodeParticular) =>
                            normalizedNames.has(String(particular.particulars || "").toLowerCase())
                        )
                    );
                } else {
                    setParticulars([]);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load particulars");
            } finally {
                setLoading(false);
            }
        };

        fetchParticulars();
    }, [item]);

    /* ===========================
       FETCH REQUISITIONS AND LIQUIDATION
    ============================ */
    useEffect(() => {
        const fetchRequisitions = async () => {
            const userId = Number(localStorage.getItem("ab_id"));
            const username = localStorage.getItem("username") || "";

            try {
                setLoadingAmountSpent(true);

                const response = await axios.post<{ data: CompletedBudgetWorkflow[] }>(
                    `${import.meta.env.VITE_API_BASE_URL}/completed-requisition-liquidation`,
                    { userid: userId, username }
                );

                setRequisitions(response.data.data || []);
            } catch (err) {
                console.error("Error fetching requisitions:", err);
            } finally {
                setLoadingAmountSpent(false);
            }
        };

        fetchRequisitions();
    }, [item]);

    /* ===========================
       FORMATTER
    ============================ */
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-PH", {
            style: "currency",
            currency: "PHP"
        }).format(amount);

    const fallbackParticulars = useMemo(() => {
        if (particulars.length || !requisitions.length) return [];

        const uniqueParticulars = new Map<string, BudgetCodeParticular>();

        requisitions.forEach((record) => {
            const isCurrentYear = record.startDate
                ? new Date(record.startDate).getFullYear() === currentYear
                : true;

            if (
                record.workflowType === "Requisition" &&
                record.status === "Completed" &&
                record.particular &&
                isCurrentYear &&
                matchesDepartment(record, item.departments.department)
            ) {
                uniqueParticulars.set(record.particular, {
                    id: record.particular,
                    particulars: record.particular,
                    description: record.processTitle || "From completed requisition",
                    allocatedAmount: Number(record.totalAmount || 0),
                });
            }
        });

        return Array.from(uniqueParticulars.values());
    }, [particulars.length, requisitions, item.departments.department, currentYear]);

    const displayParticulars = particulars.length ? particulars : fallbackParticulars;

    /* ===========================
       EXACT MATCHING LOGIC (CACHED)
    ============================ */
    const spentCache = useMemo(() => {
        if (!requisitions.length) return {};

        const cache: Record<string, number> = {};

        displayParticulars.forEach(particular => {
            const key = `${particular.particulars}__${item.departments.department}`;

            const filtered = requisitions.filter(item2 => {
                let matchesParticular = true;
                let matchesWorkflowType = true;
                let matchesStatus = true;
                let matchesYear = true;

                /* === PARTICULAR MATCH (EXACT) === */
                if (particular.particulars) {
                    matchesParticular = matchesParticularValue(item2.particular, particular.particulars);
                }

                /* === DEPARTMENT MATCH (EXACT) === */
                const hasMatchingDepartment = matchesDepartment(item2, item.departments.department);

                /* === WORKFLOW === */
                matchesWorkflowType = item2.workflowType === "Requisition";
                matchesStatus = item2.status === "Completed";

                /* === YEAR === */
                if (item2.startDate) {
                    matchesYear = new Date(item2.startDate).getFullYear() === currentYear;
                }

                return (
                    matchesParticular &&
                    hasMatchingDepartment &&
                    matchesWorkflowType &&
                    matchesStatus &&
                    matchesYear
                );
            });

            cache[key] = filtered.reduce(
                (sum, r) => sum + Number(r.totalAmount || 0),
                0
            );
        });

        return cache;
    }, [requisitions, displayParticulars, item.departments.department]);

    const { liquidationData, liquidationTotal } = useMemo<{ liquidationData: LiquidationRecord[]; liquidationTotal: number }>(() => {
        if (!requisitions.length) return { liquidationData: [], liquidationTotal: 0 };

        const filteredData = requisitions.filter(item2 => {
            let matchesDepartment = true;
            let matchesWorkflowType = true;
            let matchesStatus = true;
            let matchesYear = true;

            /* === DEPARTMENT MATCH (EXACT) === */
            if (item.departments.department) {
                if (
                    item2.department === "N/A" ||
                    item2.department === "n/a" ||
                    item2.department === "NA" ||
                    item2.department === null
                ) {
                    matchesDepartment =
                        item2.branch === item.departments.department ||
                        item2.branchName === item.departments.department ||
                        item2.branchCode === item.departments.department ||
                        item2.officeLocation === item.departments.department;
                } else {
                    matchesDepartment =
                        item2.department === item.departments.department ||
                        item2.departmentName === item.departments.department ||
                        item2.deptCode === item.departments.department;
                }
            }

            /* === WORKFLOW === */
            matchesWorkflowType = item2.workflowType === "Liquidation";
            matchesStatus = item2.status === "Completed";

            /* === YEAR === */
            if (item2.startDate) {
                matchesYear = new Date(item2.startDate).getFullYear() === currentYear;
            }

            return (
                matchesDepartment &&
                matchesWorkflowType &&
                matchesStatus &&
                matchesYear
            );
        });

        const total = filteredData.reduce((sum, r) => sum + Number(r.totalAmount || 0), 0);

        return {
            liquidationData: filteredData.map((record, index) => ({
                key: record.referenceNo || `liquidation-${index}`,
                startDate: record.startDate || "",
                referenceNo: record.referenceNo || "",
                particular: record.particular || "N/A",
                totalAmount: Number(record.totalAmount || 0),
                status: record.status || "",
            })),
            liquidationTotal: total
        };
    }, [requisitions, item.departments.department]);

    const requisitionTotal = useMemo(() => {
        if (!requisitions.length) return 0;
        let total = 0;
        displayParticulars.forEach(particular => {
            const key = `${particular.particulars}__${item.departments.department}`;

            const filtered = requisitions.filter(item2 => {
                let matchesParticular = true;
                let matchesWorkflowType = true;
                let matchesStatus = true;
                let matchesYear = true;

                /* === PARTICULAR MATCH (EXACT) === */
                if (particular.particulars) {
                    matchesParticular = matchesParticularValue(item2.particular, particular.particulars);
                }

                /* === DEPARTMENT MATCH (EXACT) === */
                const hasMatchingDepartment = matchesDepartment(item2, item.departments.department);

                /* === WORKFLOW === */
                matchesWorkflowType = item2.workflowType === "Requisition";
                matchesStatus = item2.status === "Completed";

                /* === YEAR === */
                if (item2.startDate) {
                    matchesYear = new Date(item2.startDate).getFullYear() === currentYear;
                }

                return (
                    matchesParticular &&
                    hasMatchingDepartment &&
                    matchesWorkflowType &&
                    matchesStatus &&
                    matchesYear
                );
            });

            const totalForParticular = filtered.reduce(
                (sum, r) => sum + Number(r.totalAmount || 0),
                0
            );
            total += totalForParticular;
        });
        return total;
    }, [requisitions, displayParticulars, item.departments.department]);

    const liquidationCount = useMemo(() => {
        if (!requisitions.length) return 0;

        return requisitions.filter(item2 => {
            let matchesDepartment = true;
            let matchesWorkflowType = true;
            let matchesStatus = true;
            let matchesYear = true;

            /* === DEPARTMENT MATCH (EXACT SAME LOGIC) === */
            if (item.departments.department) {
                if (
                    item2.department === "N/A" ||
                    item2.department === "n/a" ||
                    item2.department === "NA" ||
                    item2.department === null
                ) {
                    matchesDepartment =
                        item2.branch === item.departments.department ||
                        item2.branchName === item.departments.department ||
                        item2.branchCode === item.departments.department ||
                        item2.officeLocation === item.departments.department;
                } else {
                    matchesDepartment =
                        item2.department === item.departments.department ||
                        item2.departmentName === item.departments.department ||
                        item2.deptCode === item.departments.department;
                }
            }

            /* === WORKFLOW === */
            matchesWorkflowType = item2.workflowType === "Liquidation";
            matchesStatus = item2.status === "Completed";

            /* === YEAR === */
            if (item2.startDate) {
                matchesYear = new Date(item2.startDate).getFullYear() === currentYear;
            }

            return (
                matchesDepartment &&
                matchesWorkflowType &&
                matchesStatus &&
                matchesYear
            );
        }).length;
    }, [requisitions, item.departments.department]);



    /* ===========================
       LOADING / ERROR
    ============================ */
    if (error) return <div>Error: {error}</div>;

    const isTableLoading = loading || (loadingAmountSpent && !displayParticulars.length);

    return (
        <div className="budget-particulars space-y-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 className="m-0 text-base font-semibold text-slate-950">Requisition Particulars</h3>
                    <p className="m-0 mt-1 text-sm text-slate-500">
                        Mapped budget particulars and completed requisition spend for {currentYear}.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-slate-100 px-3 py-1 font-medium text-slate-700">
                        {displayParticulars.length} particulars
                    </span>
                    <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                        {formatCurrency(requisitionTotal)}
                    </span>
                </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="budget-particulars-table min-w-full divide-y divide-slate-200">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Particular
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Spent Amount
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                        {isTableLoading && (
                            <tr>
                                <td colSpan={3} className="px-4 py-10 text-center">
                                    <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <svg
                                            className="h-4 w-4 animate-spin text-blue-600"
                                            viewBox="0 0 24 24"
                                        >
                                            <circle
                                                className="opacity-25"
                                                cx="12"
                                                cy="12"
                                                r="10"
                                                stroke="currentColor"
                                                strokeWidth="4"
                                            />
                                            <path
                                                className="opacity-75"
                                                fill="currentColor"
                                                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                            />
                                        </svg>
                                        Loading particulars
                                    </span>
                                </td>
                            </tr>
                        )}

                        {!isTableLoading && !displayParticulars.length && (
                            <tr>
                                <td colSpan={3} className="px-4 py-12 text-center">
                                    <div className="font-medium text-slate-600">No particulars found</div>
                                    <div className="mt-1 text-sm text-slate-400">Assign particulars to this department to populate the table.</div>
                                </td>
                            </tr>
                        )}

                        {!isTableLoading && displayParticulars.map((p, index) => {
                            const key = `${p.particulars}__${item.departments.department}`;
                            const spent = spentCache[key] || 0;
                            const allocatedAmount = Number(p.allocatedAmount || 0);
                            const remaining = allocatedAmount - spent;

                            const status =
                                remaining <= 0
                                    ? "Exhausted"
                                    : remaining < allocatedAmount * 0.2
                                        ? "Low"
                                        : "Available";

                            return (
                                <tr key={p.id || index} className="transition-colors hover:bg-slate-50">
                                    <td className="px-4 py-3">
                                        <div className="font-semibold text-slate-900">{p.particulars || "N/A"}</div>
                                        <div className="text-xs text-slate-500">
                                            {p.description || "No description"}
                                        </div>
                                    </td>

                                    <td className="px-4 py-3 text-sm font-semibold text-slate-900">
                                        {loadingAmountSpent ? (
                                            <span className="inline-flex items-center gap-2 text-slate-500">
                                                <svg
                                                    className="h-4 w-4 animate-spin text-blue-600"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle
                                                        className="opacity-25"
                                                        cx="12"
                                                        cy="12"
                                                        r="10"
                                                        stroke="currentColor"
                                                        strokeWidth="4"
                                                    />
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                                    />
                                                </svg>
                                                Loading
                                            </span>
                                        ) : (
                                            formatCurrency(spent)
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${status === "Available"
                                                ? "bg-green-50 text-green-700"
                                                : status === "Low"
                                                    ? "bg-amber-50 text-amber-700"
                                                    : "bg-red-50 text-red-700"
                                                }`}
                                        >
                                            {status}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                </div>
            </div>

            <div>
                <Liquidation
                    item={item}
                    requisitionTotal={
                        requisitionTotal
                    }
                    liquidationTotal={
                        liquidationTotal
                    }
                    liquidationCount={liquidationCount}
                    liquidationData={liquidationData}
                />
            </div>
        </div>
    );
}
