import { useEffect, useMemo, useState } from "react";
import { ConfigProvider, Avatar } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { useSearchParams } from "@remix-run/react";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { ArrowLeftFromLine, Home } from "lucide-react";
import MetricCardPersonnel from "~/components/MetricCardPersonnel";
import BranchTopRightSider from "~/components/BranchTopRightSider";

interface Staff {
    id: string;
    name: string;
    tasks?: number;
    inventory?: number;
    taskCompleted: number;
    replenishmentDays: number;
    avgDailySales?: number;
    totalSales?: string;
    status: "critical" | "warning" | "stable" | "good";
}

interface PersonnelUser {
    user_id: number;
    name: string;
    completed: number;
}

interface PersonnelBranch {
    branch_name: string;
    user_count: number;
    branch_total_activities: number;
    users: PersonnelUser[];
}

interface PersonnelBranchResponse {
    error: boolean;
    message: string;
    year: number;
    grand_total?: number;
    data: PersonnelBranch[];
}

interface BranchCardData {
    id: number;
    title: string;
    subtitle: string;
    value: string;
    percentage: number;
    percentageColor: string;
    subtitleValue: string;
    topStaffLabel: string;
    topStaffName: string;
    staffs: Staff[];
    type: "tasks";
    branchName: string;
}

const getPercentageColor = (rank: number) => {
    if (rank === 0) return "bg-green-500";
    if (rank === 1) return "bg-orange-500";
    return "bg-red-500";
};

const getStatusByRank = (rank: number): Staff["status"] => {
    if (rank === 0) return "good";
    if (rank === 1) return "stable";
    if (rank === 2) return "warning";
    return "critical";
};

const getDaysInYear = (year: number) =>
    (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 366 : 365;

export default function PersonnelLayoutIndex() {
    const [searchParams] = useSearchParams();
    const currentYear = dayjs().year();
    const queryYear = Number(searchParams.get("year"));
    const selectedYear =
        Number.isInteger(queryYear) && queryYear > 0 ? queryYear : currentYear;

    const [branches, setBranches] = useState<BranchCardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        const fetchPersonnelBranchData = async () => {
            setIsLoading(true);
            setHasError(false);

            const userId = Number(localStorage.getItem("ab_id"));
            const username = localStorage.getItem("username") || "";

            try {
                const response = await axios.get<PersonnelBranchResponse>(
                    `${import.meta.env.VITE_IACCS_API_BASE_URL}/api/external/activitybuilder/branches-satellites-summary/${selectedYear}`,
                    {
                        params: { userid: userId, username },
                        signal: controller.signal,
                    }
                );

                if (ignore) {
                    return;
                }

                const apiBranches = Array.isArray(response.data?.data) ? response.data.data : [];
                const daysInYear = getDaysInYear(selectedYear);
                const grandTotal =
                    Number(response.data?.grand_total ?? 0) ||
                    apiBranches.reduce(
                        (sum, branch) => sum + Number(branch.branch_total_activities ?? 0),
                        0
                    );

                const mappedBranches = apiBranches
                    .map((branch) => {
                        const sortedUsers = [...(branch.users ?? [])].sort(
                            (a, b) => Number(b.completed ?? 0) - Number(a.completed ?? 0)
                        );

                        const staffs: Staff[] =
                            sortedUsers.length > 0
                                ? sortedUsers.map((user, index) => ({
                                      id: `${branch.branch_name}-${user.user_id}-${index}`,
                                      name: user.name,
                                      tasks: Number(
                                          (Number(user.completed ?? 0) / Math.max(daysInYear, 1)).toFixed(1)
                                      ),
                                      taskCompleted: Number(user.completed ?? 0),
                                      replenishmentDays: 0,
                                      status: getStatusByRank(index),
                                  }))
                                : [
                                      {
                                          id: `${branch.branch_name}-no-user`,
                                          name: "N/A",
                                          tasks: 0,
                                          taskCompleted: 0,
                                          replenishmentDays: 0,
                                          status: "good",
                                      },
                                  ];

                        return {
                            branchName: branch.branch_name,
                            branchTotal: Number(branch.branch_total_activities ?? 0),
                            userCount: Number(branch.user_count ?? sortedUsers.length ?? 0),
                            topUser: sortedUsers[0]?.name ?? "N/A",
                            staffs,
                        };
                    })
                    .sort((a, b) => b.branchTotal - a.branchTotal)
                    .map((branch, index) => ({
                        id: index + 1,
                        title: branch.branchName,
                        subtitle: "Personnel",
                        value: branch.branchTotal.toLocaleString(),
                        percentage:
                            grandTotal > 0
                                ? Math.round((branch.branchTotal / grandTotal) * 100)
                                : 0,
                        percentageColor: getPercentageColor(index),
                        subtitleValue: branch.userCount.toLocaleString(),
                        topStaffLabel: "Most Active Personnel",
                        topStaffName: branch.topUser,
                        staffs: branch.staffs,
                        type: "tasks" as const,
                        branchName: branch.branchName,
                    }));

                setBranches(mappedBranches);
            } catch {
                if (!ignore) {
                    setBranches([]);
                    setHasError(true);
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        fetchPersonnelBranchData();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [selectedYear]);

    const content = useMemo(() => {
        if (isLoading) {
            return (
                <div className="rounded-sm border border-gray-300 bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-sm">
                    Loading personnel branch cards...
                </div>
            );
        }

        if (hasError) {
            return (
                <div className="rounded-sm border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-600 shadow-sm">
                    Unable to load personnel data for {selectedYear}.
                </div>
            );
        }

        if (branches.length === 0) {
            return (
                <div className="rounded-sm border border-gray-300 bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-sm">
                    No personnel branch data available for {selectedYear}.
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {branches.map((branch) => (
                    <MetricCardPersonnel
                        key={branch.id}
                        title={branch.title}
                        subtitle={branch.subtitle}
                        value={branch.value}
                        percentage={branch.percentage}
                        percentageColor={branch.percentageColor}
                        subtitleValue={branch.subtitleValue}
                        topStaffLabel={branch.topStaffLabel}
                        topStaffName={branch.topStaffName}
                        staffs={branch.staffs}
                        type={branch.type}
                        branchName={branch.branchName}
                    />
                ))}
            </div>
        );
    }, [branches, hasError, isLoading, selectedYear]);

    return (
        <ProtectedRoute>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: "#1890ff",
                        borderRadius: 4,
                    },
                }}
            >
                <div className="flex h-screen bg-[#f3f4f6] overflow-hidden">
                    <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
                        <header className="bg-[#1890ff] px-0 flex items-center justify-between h-14 sticky top-0 z-50 shadow-md">
                            <div className="flex items-center">
                                <div className="flex items-center h-14">
                                    <a href="/landing-page" className="h-full">
                                        <button className="h-full px-6 flex items-center justify-center hover:bg-blue-600 transition-colors border-r border-blue-400 bg-blue-700">
                                            <Home className="text-white w-5 h-5" />
                                        </button>
                                    </a>
                                    <a href="/performancereport" className="h-full">
                                        <button className="h-full px-6 flex items-center justify-center hover:bg-blue-600 transition-colors border-r border-blue-400">
                                            <ArrowLeftFromLine className="text-white w-5 h-5" />
                                        </button>
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-center px-6 gap-4">
                                <div className="hidden md:flex flex-col items-end text-white leading-tight">
                                    <span className="text-xs font-bold">CFI Management System</span>
                                    <span className="text-[10px] opacity-80">Online</span>
                                </div>
                                <Avatar src="/img/cfi-circle.png" />
                            </div>
                        </header>

                        <main className="p-6 space-y-8">
                            <section>
                                <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    Personnel by Branches
                                </h2>
                                {content}
                            </section>
                        </main>
                    </div>

                    <BranchTopRightSider
                        selectedYear={selectedYear}
                        metricLabel="personnel task completion"
                        usePersonnelSummaryApi
                    />
                </div>
            </ConfigProvider>
        </ProtectedRoute>
    );
}
