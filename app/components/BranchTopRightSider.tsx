import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Spin } from 'antd';
import dayjs from 'dayjs';
import { useSearchParams } from '@remix-run/react';
import { Info } from 'lucide-react';

interface BranchDataResponse {
  error: boolean;
  message: string;
  workflow_name: string;
  year: number;
  total_count?: number;
  overall_total?: number;
  data: Record<string, number>;
}

interface RankedBranch {
  name: string;
  total: number;
  avgDaily: number;
  billed?: number;
  paid?: number;
}

interface BillingBranchGeo {
  geo: string;
  billed: number;
  paid: number;
}

interface BillingBranchEntry {
  branch: string;
  total_billed: number;
  total_paid: number;
  geos: BillingBranchGeo[];
}

interface BillingBranchResponse {
  error: boolean;
  data: {
    year: string;
    month: string;
    branches: BillingBranchEntry[];
  };
}

interface BranchTopRightSiderProps {
    branchEndpoint?: string;
    branchEndpoints?: string[];
    metricLabel?: string;
    selectedYear?: number;
    selectedMonthRange?: [number, number];
    useBillingBranchApi?: boolean;
}

const formatPesoValue = (value: number) => {
    const sign = value < 0 ? '-' : '';
    return `${sign}₱${Math.abs(value).toLocaleString()}`;
};

const BranchTopRightSider: React.FC<BranchTopRightSiderProps> = ({
    branchEndpoint = 'loanprocessingv2/branch-data',
    branchEndpoints,
    metricLabel = 'loan release',
    selectedYear: selectedYearProp,
    selectedMonthRange,
    useBillingBranchApi = false,
}) => {
    const [searchParams] = useSearchParams();
    const currentYear = dayjs().year();
    const queryYear = Number(searchParams.get('year'));
    const selectedYear =
        selectedYearProp ?? (Number.isInteger(queryYear) && queryYear > 0 ? queryYear : currentYear);

    const [branches, setBranches] = useState<RankedBranch[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        const fetchBranches = async () => {
            setIsLoading(true);
            setHasError(false);

            const userId = Number(localStorage.getItem('ab_id'));
            const username = localStorage.getItem('username') || '';
            const endpoints = branchEndpoints?.length ? branchEndpoints : [branchEndpoint];

            try {
                let mergedBranchTotals: Record<string, { total: number; billed?: number; paid?: number }> = {};

                if (useBillingBranchApi) {
                    const monthParam = selectedMonthRange
                        ? selectedMonthRange[0] === selectedMonthRange[1]
                            ? `${selectedMonthRange[0] + 1}`
                            : `${selectedMonthRange[0] + 1}-${selectedMonthRange[1] + 1}`
                        : '1';

                    const response = await axios.get<BillingBranchResponse>(
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

                    mergedBranchTotals = (response.data?.data?.branches ?? []).reduce<Record<string, { total: number; billed?: number; paid?: number }>>((acc, branch) => {
                        const branchName = branch.branch ?? 'No branch';
                        const currentBranch = acc[branchName] ?? { total: 0, billed: 0, paid: 0 };
                        acc[branchName] = {
                            total: currentBranch.total + Number(branch.total_paid ?? 0),
                            paid: (currentBranch.paid ?? 0) + Number(branch.total_paid ?? 0),
                            billed: (currentBranch.billed ?? 0) + Number(branch.total_billed ?? 0),
                        };
                        return acc;
                    }, {});
                } else {
                    const responses = await Promise.all(
                        endpoints.map((endpoint) =>
                            axios.get<BranchDataResponse>(
                                `${import.meta.env.VITE_API_BASE_URL}/${endpoint}/${selectedYear}`,
                                {
                                    params: { userid: userId, username },
                                    signal: controller.signal,
                                }
                            )
                        )
                    );

                    mergedBranchTotals = responses.reduce<Record<string, { total: number }>>((acc, response) => {
                        Object.entries(response.data?.data ?? {}).forEach(([name, total]) => {
                            const currentBranch = acc[name] ?? { total: 0 };
                            acc[name] = { total: currentBranch.total + Number(total ?? 0) };
                        });

                        return acc;
                    }, {});
                }

                if (ignore) {
                    return;
                }

                const nextBranches = Object.entries(mergedBranchTotals)
                    .map(([name, totals]) => ({
                        name,
                        total: Number(totals.total ?? 0),
                        billed: totals.billed,
                        paid: totals.paid,
                    }))
                    .sort((a, b) => b.total - a.total)
                    .slice(0, 10);

                const daysInRange = selectedMonthRange
                    ? dayjs().year(selectedYear).month(selectedMonthRange[1]).endOf('month').diff(
                        dayjs().year(selectedYear).month(selectedMonthRange[0]).startOf('month'),
                        'day'
                    ) + 1
                    : ((selectedYear % 4 === 0 && selectedYear % 100 !== 0) || selectedYear % 400 === 0
                        ? 366
                        : 365);

                setBranches(
                    nextBranches.map((branch) => ({
                        ...branch,
                        avgDaily: Number((branch.total / Math.max(daysInRange, 1)).toFixed(1)),
                    }))
                );
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

        fetchBranches();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [branchEndpoint, branchEndpoints, selectedMonthRange, selectedYear, useBillingBranchApi]);

    const leadingBranch = branches[0]?.name ?? 'No data';
    const metricLabelLower = metricLabel.toLowerCase();
    const isCollectionBillingView = useBillingBranchApi && metricLabelLower === 'collection';
    const maxAvgDaily = useMemo(
        () => Math.max(
            ...branches.map((branch) => (isCollectionBillingView ? Number(branch.paid ?? 0) : branch.avgDaily)),
            0
        ),
        [branches, isCollectionBillingView]
    );

    return (
        <aside className="w-80 bg-[#1e293b] text-white flex flex-col h-screen overflow-y-auto">
            <div className="p-5">
                <h2 className="text-lg font-bold mb-4 tracking-wide">BRANCH PERFORMANCE</h2>

                <div className="mb-6">
                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-2">Selected Year</label>
                    <div className="w-full rounded-sm bg-[#334155] px-3 py-2 text-xs font-semibold text-gray-200">
                        {selectedYear}
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-[11px] font-semibold text-gray-300 mb-3">Top 10 Branches</h3>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 text-[9px] text-gray-500 font-bold border-b border-gray-700 pb-1">
                            <div className="col-span-1">Branch Name</div>
                            <div className="text-center">{isCollectionBillingView ? 'Paid' : 'Avg Daily'}</div>
                            <div className="text-right">{isCollectionBillingView ? 'Billed' : 'Overall Total'}</div>
                        </div>

                        {isLoading ? (
                            <div className="flex justify-center py-8">
                                <Spin size="large" />
                            </div>
                        ) : hasError ? (
                            <div className="py-6 text-[10px] text-red-300 text-center">
                                Unable to load branch data.
                            </div>
                        ) : branches.length === 0 ? (
                            <div className="py-6 text-[10px] text-gray-400 text-center">
                                No branch data available for {selectedYear}.
                            </div>
                        ) : (
                            branches.map((branch) => (
                                <div key={branch.name} className="grid grid-cols-3 items-center text-[10px] py-1 gap-2">
                                    <div className="col-span-1 leading-tight text-gray-300 font-medium">
                                        {branch.name}
                                    </div>
                                    <div className="flex justify-center items-center gap-1">
                                        <div className="w-8 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{
                                                    width: `${maxAvgDaily > 0 ? ((isCollectionBillingView ? Number(branch.paid ?? 0) : branch.avgDaily) / maxAvgDaily) * 100 : 0}%`,
                                                }}
                                            />
                                        </div>
                                        <span className="text-[9px]">
                                            {isCollectionBillingView ? formatPesoValue(Number(branch.paid ?? 0)) : branch.avgDaily}
                                        </span>
                                    </div>
                                    <div className="text-right font-bold text-orange-400">
                                        {isCollectionBillingView ? formatPesoValue(Number(branch.billed ?? 0)) : branch.total.toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <div className="mt-3 p-2 bg-[#0f172a] rounded text-[10px] text-gray-400 italic">
                        Driven by performance variations across <span className="font-bold text-white">Branches</span>, with <span className="font-bold text-white">{leadingBranch}</span> showing the highest {metricLabelLower} volume and impact for <span className="font-bold text-white">{selectedYear}</span>.
                    </div>
                </div>

                <div className="bg-[#0f172a] p-4 border border-blue-900/50 rounded-sm">
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                        <Info className="w-4 h-4" />
                        <span className="text-[11px] font-bold">Recommendations</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-300">
                        Focus on improving {metricLabelLower} efficiency and completion rates in every <span className="font-bold text-white">Branch</span>, especially by learning from the stronger performance trends in <span className="font-bold text-white">{leadingBranch}</span>.
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default BranchTopRightSider;
