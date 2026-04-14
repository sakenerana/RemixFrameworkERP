import { useEffect, useMemo, useState } from "react";
import { ConfigProvider, Avatar, DatePicker, Spin } from "antd";
import axios from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useSearchParams } from "@remix-run/react";
import { ProtectedRoute } from "~/components/ProtectedRoute";
import { ArrowLeftFromLine, Home } from "lucide-react";
import MetricCardCollection from "~/components/MetricCardCollection";
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
    geos?: string[];
}

interface CollectionGeoEntry {
    geo: string;
    departments: CollectionDepartmentEntry[];
}

interface CollectionDepartmentEntry {
    department: string;
    billed: number;
    paid: number;
}

interface CollectionBranch {
    branch: string;
    total_billed: number;
    total_paid: number;
    geos: CollectionGeoEntry[];
}

interface CollectionBranchResponse {
    error: boolean;
    data: {
        year: string;
        month: string;
        branches: CollectionBranch[];
    };
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
    selectedYear: number;
    selectedMonthLabel: string;
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

const getRangeMonthParam = (months: [number, number]) => {
    const [startMonth, endMonth] = months;
    const startValue = startMonth + 1;
    const endValue = endMonth + 1;

    return startValue === endValue ? `${startValue}` : `${startValue}-${endValue}`;
};

const getMonthsDivisorForRange = (months: [number, number]) => {
    const [startMonth, endMonth] = months;
    return endMonth - startMonth + 1;
};

export default function CollectionsLayoutIndex() {
    const [searchParams] = useSearchParams();
    const currentYear = dayjs().year();
    const queryYear = Number(searchParams.get("year"));
    const initialYear =
        Number.isInteger(queryYear) && queryYear > 0 ? queryYear : currentYear;
    const [selectedYear, setSelectedYear] = useState(initialYear);

    const [branches, setBranches] = useState<BranchCardData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const defaultMonth = initialYear === currentYear ? dayjs().month() : 0;
    const [selectedMonthRange, setSelectedMonthRange] = useState<[number, number]>([defaultMonth, defaultMonth]);
    const monthParam = useMemo(() => getRangeMonthParam(selectedMonthRange), [selectedMonthRange]);
    const monthsDivisor = useMemo(
        () => getMonthsDivisorForRange(selectedMonthRange),
        [selectedMonthRange]
    );

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        const fetchCollectionBranchData = async () => {
            setIsLoading(true);
            setHasError(false);

            const userId = Number(localStorage.getItem("ab_id"));
            const username = localStorage.getItem("username") || "";

            try {
                const response = await axios.get<CollectionBranchResponse>(
                    `${import.meta.env.VITE_IACCS_API_BASE_URL}/api/external/iaccs-monitoring/billing/department`,
                    {
                        params: {
                            year: selectedYear,
                            month: monthParam,
                            userid: userId,
                            username,
                        },
                        signal: controller.signal,
                    }
                );

                if (ignore) {
                    return;
                }

                const branchMap = new Map<
                    string,
                    {
                        branchTotal: number;
                        branchBilled: number;
                        satellites: Map<string, { paid: number; billed: number; geos: string[] }>;
                    }
                >();

                const apiBranches = Array.isArray(response.data?.data?.branches) ? response.data.data.branches : [];
                const overallTotal = apiBranches.reduce(
                    (sum, branch) => sum + Number(branch.total_paid ?? 0),
                    0
                );

                apiBranches.forEach((branch) => {
                    const branchName = branch.branch;
                    const existingBranch = branchMap.get(branchName) ?? {
                        branchTotal: 0,
                        branchBilled: 0,
                        satellites: new Map<string, { paid: number; billed: number; geos: string[] }>(),
                    };

                    existingBranch.branchTotal += Number(branch.total_paid ?? 0);
                    existingBranch.branchBilled += Number(branch.total_billed ?? 0);

                    (branch.geos ?? []).forEach((geo) => {
                        (geo.departments ?? []).forEach((department) => {
                            const departmentName = department.department;
                            const currentTotal = existingBranch.satellites.get(departmentName) ?? {
                                paid: 0,
                                billed: 0,
                                geos: [],
                            };
                            const nextGeos = currentTotal.geos.includes(geo.geo)
                                ? currentTotal.geos
                                : [...currentTotal.geos, geo.geo];
                            existingBranch.satellites.set(
                                departmentName,
                                {
                                    paid: currentTotal.paid + Number(department.paid ?? 0),
                                    billed: currentTotal.billed + Number(department.billed ?? 0),
                                    geos: nextGeos,
                                }
                            );
                        });
                    });

                    branchMap.set(branchName, existingBranch);
                });

                const mappedBranches = Array.from(branchMap.entries())
                    .map(([branchName, branchData]) => {
                        const sortedSatellites = Array.from(branchData.satellites.entries())
                            .map(([satelliteName, satelliteTotals]) => ({
                                satellite_name: satelliteName,
                                satellite_total: satelliteTotals.paid,
                                satellite_billed: satelliteTotals.billed,
                                geos: satelliteTotals.geos,
                            }))
                            .sort((a, b) => b.satellite_total - a.satellite_total);

                        const staffs: Staff[] =
                            sortedSatellites.length > 0
                                ? sortedSatellites.map((satellite, index) => ({
                                      id: `${branchName}-${satellite.satellite_name}-${index}`,
                                      name: satellite.satellite_name,
                                      tasks: Number(satellite.satellite_total ?? 0),
                                      taskCompleted: Number(satellite.satellite_billed ?? 0),
                                      replenishmentDays: 0,
                                      status: getStatusByRank(index),
                                      geos: satellite.geos,
                                  }))
                                : [
                                      {
                                          id: `${branchName}-no-satellite`,
                                          name: "N/A",
                                          tasks: 0,
                                          taskCompleted: 0,
                                          replenishmentDays: 0,
                                          status: "good",
                                          geos: [],
                                      },
                                  ];

                        const satelliteTotal = sortedSatellites.reduce(
                            (sum, satellite) => sum + satellite.satellite_total,
                            0
                        );

                        return {
                            branchName,
                            branchTotal: branchData.branchTotal,
                            branchBilled: branchData.branchBilled,
                            topSatellite: sortedSatellites[0]?.satellite_name ?? "N/A",
                            staffs,
                        };
                    })
                    .sort((a, b) => b.branchTotal - a.branchTotal)
                    .map((branch, index) => ({
                        id: index + 1,
                        title: branch.branchName,
                        subtitle: "Total Collection",
                        value: branch.branchTotal.toLocaleString(),
                        percentage:
                            overallTotal > 0
                                ? Math.round((branch.branchTotal / overallTotal) * 100)
                                : 0,
                        percentageColor: getPercentageColor(index),
                        subtitleValue: branch.branchBilled.toLocaleString(),
                        topStaffLabel: "Most Active Department",
                        topStaffName: branch.topSatellite,
                        staffs: branch.staffs,
                        type: "tasks" as const,
                        branchName: branch.branchName,
                        selectedYear,
                        selectedMonthLabel: monthParam,
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

        fetchCollectionBranchData();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [monthParam, monthsDivisor, selectedYear]);

    useEffect(() => {
        setSelectedMonthRange((currentRange) => {
            const fallbackMonth = selectedYear === currentYear ? dayjs().month() : 0;

            if (selectedYear === currentYear) {
                const clampedEnd = Math.min(currentRange[1], dayjs().month());
                const clampedStart = Math.min(currentRange[0], clampedEnd);
                return [clampedStart, clampedEnd];
            }

            if (currentRange[0] === currentRange[1] && currentRange[0] === fallbackMonth) {
                return [fallbackMonth, fallbackMonth];
            }

            return currentRange;
        });
    }, [currentYear, selectedYear]);

    const selectedRangeValue = useMemo<[Dayjs, Dayjs]>(
        () => [
            dayjs().year(selectedYear).month(selectedMonthRange[0]).startOf("month"),
            dayjs().year(selectedYear).month(selectedMonthRange[1]).startOf("month"),
        ],
        [selectedMonthRange, selectedYear]
    );

    const handleRangeChange = (dates: null | [Dayjs | null, Dayjs | null]) => {
        if (!dates || !dates[0] || !dates[1]) {
            return;
        }

        const rangeYear = dates[0].year();
        const startMonth = dates[0].month();
        const endMonth = dates[1].month();

        setSelectedYear(rangeYear);
        setSelectedMonthRange(startMonth <= endMonth ? [startMonth, endMonth] : [endMonth, startMonth]);
    };

    const content = useMemo(() => {
        if (isLoading) {
            return (
                <div className="rounded-sm border border-gray-300 bg-white px-6 py-16 shadow-sm">
                    <div className="flex items-center justify-center">
                        <Spin size="large" />
                    </div>
                </div>
            );
        }

        if (hasError) {
            return (
                <div className="rounded-sm border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-600 shadow-sm">
                    Unable to load collection data for {selectedYear}.
                </div>
            );
        }

        if (branches.length === 0) {
            return (
                <div className="rounded-sm border border-gray-300 bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-sm">
                    No collection branch data available for {selectedYear}.
                </div>
            );
        }

        return (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {branches.map((branch) => (
                    <MetricCardCollection
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
                        selectedYear={branch.selectedYear}
                        selectedMonthLabel={branch.selectedMonthLabel}
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
                                <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                    <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                                        Collections by Branches
                                    </h2>
                                    <DatePicker.RangePicker
                                        picker="month"
                                        allowClear={false}
                                        value={selectedRangeValue}
                                        onChange={handleRangeChange}
                                        className="self-start md:self-auto"
                                    />
                                </div>
                                {content}
                            </section>
                        </main>
                    </div>

                    <BranchTopRightSider
                        selectedYear={selectedYear}
                        selectedMonthRange={selectedMonthRange}
                        useBillingBranchApi
                        metricLabel="collection"
                    />
                </div>
            </ConfigProvider>
        </ProtectedRoute>
    );
}
