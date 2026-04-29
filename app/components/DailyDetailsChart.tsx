
import React, { useEffect, useMemo, useState } from 'react';
import { Select } from 'antd';
import dayjs from 'dayjs';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine
} from 'recharts';

export interface DailyData {
    date: string;
    newmembership: number;
    loanreleases: number;
    collections: number;
}

export const COLORS = {
    primary: '#10B981', // green-500
    secondary: '#1D4ED8', // blue-700
    accent: '#3B82F6', // blue-500
    danger: '#EF4444', // red-500
    background: '#F8FAFC',
};

const MONTH_OPTIONS = [
    { label: 'January', value: 0 },
    { label: 'February', value: 1 },
    { label: 'March', value: 2 },
    { label: 'April', value: 3 },
    { label: 'May', value: 4 },
    { label: 'June', value: 5 },
    { label: 'July', value: 6 },
    { label: 'August', value: 7 },
    { label: 'September', value: 8 },
    { label: 'October', value: 9 },
    { label: 'November', value: 10 },
    { label: 'December', value: 11 },
];

interface Props {
    selectedYear: number;
}

type DailyMetricFilter = 'overall' | 'newmembership' | 'loanreleases' | 'collections';

interface DailyCountApiResponse {
    error: boolean;
    message: string;
    workflow_name: string;
    year: number;
    month: number;
    total_count: number;
    daily_counts: Record<string, number>;
}

interface BillingDayEntry {
    day: number;
    billed: number;
    cash_payment?: number;
    non_cash_payment?: number;
}

interface BillingByDateDailyResponse {
    error: boolean;
    data: {
        year: number;
        month: number;
        total_billed: number;
        total_cash_payment?: number;
        total_non_cash_payment?: number;
        days: BillingDayEntry[];
    };
}

interface SummaryStatProps {
    label: string;
    value: number;
    isLoading: boolean;
    formatter?: (value: number) => string;
}

const formatPeso = (value: number) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}).format(value ?? 0);

const formatPesoCompact = (value: number) => new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    notation: 'compact',
    maximumFractionDigits: 1,
}).format(value ?? 0);

const SummaryStat: React.FC<SummaryStatProps> = ({ label, value, isLoading, formatter }) => (
    <div>
        {isLoading ? (
            <div className="space-y-2">
                <div className="h-7 w-14 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            </div>
        ) : (
            <>
                <p className="text-xl font-bold text-gray-800">{formatter ? formatter(value) : value.toLocaleString()}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
            </>
        )}
    </div>
);

const DETAIL_FILTER_OPTIONS = [
    { label: 'All', value: 'overall' },
    { label: 'New Membership', value: 'newmembership' },
    { label: 'Loan Release', value: 'loanreleases' },
    { label: 'Collection', value: 'collections' },
];

const DailyDetailsChart: React.FC<Props> = ({ selectedYear }) => {
    const currentMonth = dayjs().month();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedMetric, setSelectedMetric] = useState<DailyMetricFilter>('overall');
    const [dailyCounts, setDailyCounts] = useState<{
        newmembership: Record<string, number>;
        loanreleases: Record<string, number>;
        collections: Record<string, number>;
    }>({
        newmembership: {},
        loanreleases: {},
        collections: {},
    });
    const [collectionTotalPaid, setCollectionTotalPaid] = useState(0);
    const [collectionCashPayment, setCollectionCashPayment] = useState(0);
    const [collectionNonCashPayment, setCollectionNonCashPayment] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        const fetchDailyCounts = async () => {
            setIsLoading(true);
            const userId = Number(localStorage.getItem("ab_id"));
            const username = localStorage.getItem("username") || "";
            const monthValue = selectedMonth + 1;

            try {
                const [membershipResponse, loanReleaseResponse, collectionResponse] = await Promise.all([
                    axios.get<DailyCountApiResponse>(
                        `${import.meta.env.VITE_IACCS_API_BASE_URL}/api/external/activitybuilder/newmembers/count/${selectedYear}/${monthValue}`,
                        {
                            params: { userid: userId, username },
                            signal: controller.signal,
                        }
                    ),
                    axios.get<DailyCountApiResponse>(
                        `${import.meta.env.VITE_IACCS_API_BASE_URL}/api/external/activitybuilder/loanprocessingv2/count/${selectedYear}/${monthValue}`,
                        {
                            params: { userid: userId, username },
                            signal: controller.signal,
                        }
                    ),
                    axios.get<BillingByDateDailyResponse>(
                        `${import.meta.env.VITE_IACCS_API_BASE_URL}/api/external/iaccs-monitoring/billing/date`,
                        {
                            params: {
                                year: selectedYear,
                                month: monthValue,
                            },
                            signal: controller.signal,
                        }
                    ),
                ]);

                if (!ignore) {
                    const collectionDays = collectionResponse.data?.data?.days ?? [];
                    const collectionDailyCounts = collectionDays.reduce<Record<string, number>>((acc, item) => {
                        acc[String(item.day)] = Math.abs(
                            Number(item.cash_payment ?? 0) + Number(item.non_cash_payment ?? 0)
                        );
                        return acc;
                    }, {});

                    setDailyCounts({
                        newmembership: membershipResponse.data?.daily_counts ?? {},
                        loanreleases: loanReleaseResponse.data?.daily_counts ?? {},
                        collections: collectionDailyCounts,
                    });
                    const totalCashPayment = Math.abs(Number(collectionResponse.data?.data?.total_cash_payment ?? 0));
                    const totalNonCashPayment = Math.abs(Number(collectionResponse.data?.data?.total_non_cash_payment ?? 0));
                    setCollectionTotalPaid(
                        totalCashPayment + totalNonCashPayment
                    );
                    setCollectionCashPayment(totalCashPayment);
                    setCollectionNonCashPayment(totalNonCashPayment);
                }
            } catch {
                if (!ignore) {
                    setDailyCounts({
                        newmembership: {},
                        loanreleases: {},
                        collections: {},
                    });
                    setCollectionTotalPaid(0);
                    setCollectionCashPayment(0);
                    setCollectionNonCashPayment(0);
                }
            } finally {
                if (!ignore) {
                    setIsLoading(false);
                }
            }
        };

        fetchDailyCounts();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [selectedMonth, selectedYear]);

    const dailyChartData = useMemo(() => {
        const daysInMonth = dayjs().year(selectedYear).month(selectedMonth).daysInMonth();
        const monthShort = dayjs().year(selectedYear).month(selectedMonth).format('MMM');

        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;

            return {
                date: `${monthShort} ${day}`,
                newmembership: Number(dailyCounts.newmembership[String(day)] ?? 0),
                loanreleases: Number(dailyCounts.loanreleases[String(day)] ?? 0),
                collections: Number(dailyCounts.collections[String(day)] ?? 0),
            };
        });
    }, [dailyCounts, selectedMonth, selectedYear]);

    const monthTotals = useMemo(() => (
        dailyChartData.reduce(
            (acc, item) => ({
                newmembership: acc.newmembership + item.newmembership,
                loanreleases: acc.loanreleases + item.loanreleases,
                collections: acc.collections + item.collections,
            }),
            { newmembership: 0, loanreleases: 0, collections: 0 }
        )
    ), [dailyChartData]);

    const activeAverage = useMemo(() => {
        if (selectedMetric === 'overall') {
            return Math.round(
                monthTotals.newmembership / Math.max(dailyChartData.length, 1)
            );
        }

        const total = dailyChartData.reduce((sum, item) => sum + Number(item[selectedMetric] ?? 0), 0);
        return Math.round(total / Math.max(dailyChartData.length, 1));
    }, [dailyChartData, monthTotals.newmembership, selectedMetric]);

    const visibleBars = useMemo(() => {
        const allBars = [
            { key: 'newmembership', label: 'New Membership', fill: COLORS.secondary, barSize: 24 },
            { key: 'loanreleases', label: 'Loan Release', fill: COLORS.primary, barSize: 16 },
            { key: 'collections', label: 'Collection', fill: COLORS.accent, barSize: 16 },
        ] as const;

        if (selectedMetric === 'overall') {
            return allBars;
        }

        return allBars.filter((bar) => bar.key === selectedMetric);
    }, [selectedMetric]);

    return (
        <div className="bg-white p-6  shadow-sm border border-gray-300 flex flex-col h-full">
            <div className="flex flex-col gap-4 mb-8 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Daily Details (Month)</h3>
                    <div className="flex gap-12">
                        <SummaryStat
                            label="New Membership"
                            value={monthTotals.newmembership}
                            isLoading={isLoading}
                        />
                        <SummaryStat
                            label="Loan Release"
                            value={monthTotals.loanreleases}
                            isLoading={isLoading}
                        />
                        <div>
                            <SummaryStat
                                label="Collection"
                                value={collectionTotalPaid}
                                isLoading={isLoading}
                                formatter={formatPeso}
                            />
                            {!isLoading && (
                                <p className="mt-1 text-[11px] text-gray-500">
                                    Cash {formatPesoCompact(collectionCashPayment)} | Non-Cash {formatPesoCompact(collectionNonCashPayment)}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 xl:items-end">
                    <Select
                        value={selectedMetric}
                        options={DETAIL_FILTER_OPTIONS}
                        onChange={setSelectedMetric}
                        className="w-full min-w-[180px] xl:w-[200px]"
                        disabled={isLoading}
                    />
                    <Select
                        value={selectedMonth}
                        options={MONTH_OPTIONS}
                        onChange={setSelectedMonth}
                        className="w-full min-w-[180px] xl:w-[200px]"
                        disabled={isLoading}
                    />
                    <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-gray-500">
                        {visibleBars.map((bar) => (
                            <div key={bar.key} className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: bar.fill }}></div>
                                <span>{bar.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="flex-grow min-h-[300px]">
                {isLoading ? (
                    <div className="flex h-full flex-col justify-end gap-3">
                        <div className="h-6 w-40 animate-pulse rounded bg-slate-100" />
                        <div className="flex h-full items-end gap-2">
                            {Array.from({ length: 12 }, (_, index) => (
                                <div
                                    key={index}
                                    className="animate-pulse rounded-t bg-slate-200"
                                    style={{ height: `${80 + ((index % 6) * 18)}px`, width: '100%' }}
                                />
                            ))}
                        </div>
                        <p className="text-center text-sm text-gray-400">Loading daily details...</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={dailyChartData}
                            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                            barGap={-16}
                        >
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#F1F5F9" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}
                                interval={4}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: '#94A3B8', fontWeight: 600 }}
                                tickFormatter={(value) => `${value}`}
                            />
                            <Tooltip
                                cursor={{ fill: 'rgba(226, 232, 240, 0.4)' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                            />
                            <ReferenceLine
                                y={activeAverage}
                                stroke="#CBD5E1"
                                strokeDasharray="3 3"
                                label={{
                                    position: 'top',
                                    value: `${selectedMetric === 'overall' ? 'Membership' : visibleBars[0]?.label} Avg: ${activeAverage}`,
                                    fill: '#94A3B8',
                                    fontSize: 10,
                                    fontWeight: 700,
                                }}
                            />

                            {visibleBars.map((bar) => (
                                <Bar
                                    key={bar.key}
                                    dataKey={bar.key}
                                    fill={bar.fill}
                                    radius={[4, 4, 0, 0]}
                                    barSize={bar.barSize}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default DailyDetailsChart;
