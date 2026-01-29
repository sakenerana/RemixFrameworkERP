import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { BudgetService } from "~/services/budget.service";
import Liquidation from "./liquidation";

export default function Particulars({ item }: { item: any }) {
    const [particulars, setParticulars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingAmountSpent, setLoadingAmountSpent] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [requisitions, setRequisitions] = useState<any[]>([]);

    /* ===========================
       FETCH PARTICULARS
    ============================ */
    useEffect(() => {
        const fetchParticulars = async () => {
            try {
                setLoading(true);
                setError(null);

                const budgetCodes = item.departments?.budget_code;

                if (budgetCodes?.length) {
                    const idArray = budgetCodes.map((code: any) => parseInt(code, 10));
                    const data = await BudgetService.getAllParticularsByDepartment(idArray);
                    setParticulars(data);
                } else {
                    setParticulars([]);
                }
            } catch (err: any) {
                setError(err.message || "Failed to load particulars");
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

                const response = await axios.post<{ data: any[] }>(
                    `${import.meta.env.VITE_API_BASE_URL}/completed-requisition-liquidation`,
                    { userid: userId, username }
                );

                setRequisitions(response.data.data || []);
                console.log("Fetched requisitions nad liquidation:", response.data.data);
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

    /* ===========================
       EXACT MATCHING LOGIC (CACHED)
    ============================ */
    const spentCache = useMemo(() => {
        if (!requisitions.length) return {};

        const cache: Record<string, number> = {};

        particulars.forEach(particular => {
            const key = `${particular.particulars}__${item.departments.department}`;

            const filtered = requisitions.filter(item2 => {
                let matchesParticular = true;
                let matchesDepartment = true;
                let matchesWorkflowType = true;
                let matchesStatus = true;
                let matchesYear = true;

                /* === PARTICULAR MATCH (EXACT) === */
                if (particular.particulars) {
                    matchesParticular = item2.particular === particular.particulars;
                }

                /* === DEPARTMENT MATCH (EXACT) === */
                if (item.departments.department) {
                    if (
                        item2.department === "N/A" ||
                        item2.department === "n/a" ||
                        item2.department === "NA"
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
                matchesWorkflowType = item2.workflowType === "Requisition";
                matchesStatus = item2.status === "Completed";

                /* === YEAR === */
                if (item2.startDate) {
                    matchesYear = new Date(item2.startDate).getFullYear() === 2024;
                }

                return (
                    matchesParticular &&
                    matchesDepartment &&
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
    }, [requisitions, particulars, item.departments.department]);

    const liquidationTotal = useMemo(() => {
        if (!requisitions.length) return 0;

        const total = requisitions
            .filter(item2 => {
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
                    matchesYear = new Date(item2.startDate).getFullYear() === 2024;
                }

                return (
                    matchesDepartment &&
                    matchesWorkflowType &&
                    matchesStatus &&
                    matchesYear
                );
            })
            .reduce((sum, r) => sum + Number(r.totalAmount || 0), 0);

        return total;
    }, [requisitions, item.departments.department]);

    const requisitionTotal = useMemo(() => {
        if (!requisitions.length) return 0;
        let total = 0;
        particulars.forEach(particular => {
            const key = `${particular.particulars}__${item.departments.department}`;

            const filtered = requisitions.filter(item2 => {
                let matchesParticular = true;
                let matchesDepartment = true;
                let matchesWorkflowType = true;
                let matchesStatus = true;
                let matchesYear = true;

                /* === PARTICULAR MATCH (EXACT) === */
                if (particular.particulars) {
                    matchesParticular = item2.particular === particular.particulars;
                }

                /* === DEPARTMENT MATCH (EXACT) === */
                if (item.departments.department) {
                    if (
                        item2.department === "N/A" ||
                        item2.department === "n/a" ||
                        item2.department === "NA"
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
                matchesWorkflowType = item2.workflowType === "Requisition";
                matchesStatus = item2.status === "Completed";

                /* === YEAR === */
                if (item2.startDate) {
                    matchesYear = new Date(item2.startDate).getFullYear() === 2024;
                }

                return (
                    matchesParticular &&
                    matchesDepartment &&
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
    }, [requisitions, item.departments.department]);

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
                matchesYear = new Date(item2.startDate).getFullYear() === 2024;
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
    if (loading) return <div>Loading particulars...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="space-y-6">
            <h4 className="text-lg font-semibold mb-3">Requisition</h4>

            <div className="overflow-x-auto border border-gray-200 rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Particular
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Spent Amount
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {particulars.map((p, index) => {
                            const key = `${p.particulars}__${item.departments.department}`;
                            const spent = spentCache[key] || 0;
                            const remaining = p.allocatedAmount - spent;

                            const status =
                                remaining <= 0
                                    ? "Exhausted"
                                    : remaining < p.allocatedAmount * 0.2
                                        ? "Low"
                                        : "Available";

                            return (
                                <tr key={p.id || index}>
                                    <td className="px-4 py-3">
                                        <div className="font-medium">{p.particulars}</div>
                                        <div className="text-xs text-gray-500">
                                            {p.description || "No description"}
                                        </div>
                                    </td>

                                    {/* INLINE LOADING */}
                                    <td className="px-4 py-3 text-sm font-medium text-red-800">
                                        {loadingAmountSpent ? (
                                            <span className="inline-flex items-center gap-2 text-gray-500">
                                                <svg
                                                    className="h-4 w-4 animate-spin text-red-600"
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
                                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${status === "Available"
                                                ? "bg-green-100 text-green-800"
                                                : status === "Low"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
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

            {/* LIQUIDATION */}
            <div>
                {/* <h4 className="text-lg font-semibold mb-3">Liquidation</h4> */}
                <Liquidation
                    item={item}
                    requisitionTotal={
                        requisitionTotal
                    }
                    liquidationTotal={
                        liquidationTotal
                    }
                    liquidationCount={liquidationCount}
                />
            </div>
        </div>
    );
}
