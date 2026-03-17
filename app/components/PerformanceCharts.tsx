import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    ResponsiveContainer,
    Tooltip,
    Cell
} from 'recharts';
import { LayoutGrid, BarChart2, MousePointer2 } from 'lucide-react';

export interface PerformanceData {
    name: string;
    value: number;
}

type PerformanceMetric = 'newMembership' | 'loanRelease' | 'collection';

interface PerformanceMetricConfig {
    label: string;
    branchTitle: string;
    satelliteTitle: string;
    branchEndpoint?: string;
    satelliteEndpoint?: string;
}

interface BranchDataResponse {
    error: boolean;
    message: string;
    workflow_name: string;
    year: number;
    total_count?: number;
    overall_total?: number;
    data: Record<string, number>;
}

interface SatelliteEntry {
    satellite_name: string;
    satellite_total: number;
}

interface SatelliteBranch {
    branch_name: string;
    branch_total: number;
    satellites: SatelliteEntry[];
}

interface SatelliteDataResponse {
    error: boolean;
    message: string;
    workflow_name: string;
    year: number;
    overall_total?: number;
    data: SatelliteBranch[];
}

interface PerformanceChartsProps {
    selectedYear: number;
}

export const COLORS = {
    primary: '#10B981',
    secondary: '#94A3B8',
    accent: '#3B82F6',
    danger: '#EF4444',
    background: '#F8FAFC',
};

const PERFORMANCE_DATA: Record<PerformanceMetric, PerformanceMetricConfig> = {
    newMembership: {
        label: 'New Membership',
        branchTitle: 'Top Branch Membership Performance',
        satelliteTitle: 'Top Satellite Membership Performance',
        branchEndpoint: 'newmembers/branch-data',
        satelliteEndpoint: 'newmembers/branch-satellite-data',
    },
    loanRelease: {
        label: 'Loan Release',
        branchTitle: 'Top Branch Loan Release Performance',
        satelliteTitle: 'Top Satellite Loan Release Performance',
        branchEndpoint: 'loanprocessingv2/branch-data',
        satelliteEndpoint: 'loanprocessingv2/branch-satellite-data',
    },
    collection: {
        label: 'Collection',
        branchTitle: 'Top Branch Collection Performance',
        satelliteTitle: 'Top Satellite Collection Performance',
    },
};

interface ChartCardProps {
    title: string;
    data: PerformanceData[];
    isLoading?: boolean;
}

const chartLabelFormatter = (
    value: string | number | boolean | null | undefined | readonly (string | number)[]
) => {
    if (Array.isArray(value)) {
        return value.join(', ');
    }

    if (typeof value === 'number') {
        return value.toLocaleString();
    }

    if (typeof value === 'string') {
        return value;
    }

    if (typeof value === 'boolean') {
        return String(value);
    }

    return '';
};

const ChartCard: React.FC<ChartCardProps> = ({ title, data, isLoading = false }) => (
    <div className="bg-white p-6 shadow-sm border border-gray-300">
        <div className="flex justify-between items-center mb-6">
            <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase">{title}</h3>
            <div className="flex gap-2 text-gray-300">
                <MousePointer2 size={16} />
                <LayoutGrid size={16} />
                <BarChart2 size={16} className="text-gray-400" />
            </div>
        </div>
        <p className="text-[10px] text-gray-400 font-medium mb-4 italic flex items-center gap-1">
            <MousePointer2 size={10} /> Click on points|bars to filter dashboard
        </p>
        <div className="h-[220px]">
            {isLoading ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    Loading data...
                </div>
            ) : data.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                    No data available
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart layout="vertical" data={data} margin={{ left: 10, right: 40 }}>
                        <XAxis type="number" hide />
                        <YAxis
                            type="category"
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            width={120}
                            tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }}
                        />
                        <Tooltip cursor={{ fill: 'transparent' }} formatter={(value) => chartLabelFormatter(value)} />
                        <Bar
                            dataKey="value"
                            radius={[0, 4, 4, 0]}
                            barSize={16}
                            label={{
                                position: 'right',
                                fontSize: 10,
                                fill: '#1E293B',
                                fontWeight: 700,
                                formatter: chartLabelFormatter,
                            }}
                        >
                            {data.map((_, index) => (
                                <Cell key={index} fill={index < 3 ? COLORS.primary : '#E2E8F0'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    </div>
);

const PerformanceCharts: React.FC<PerformanceChartsProps> = ({ selectedYear }) => {
    const [selectedMetric, setSelectedMetric] = useState<PerformanceMetric>('newMembership');
    const [metricBranchData, setMetricBranchData] = useState<PerformanceData[]>([]);
    const [metricSatelliteData, setMetricSatelliteData] = useState<PerformanceData[]>([]);
    const [isMetricLoading, setIsMetricLoading] = useState(false);

    const activeMetric = PERFORMANCE_DATA[selectedMetric];
    const activeBranchData = useMemo(() => {
        if (activeMetric.branchEndpoint) {
            return metricBranchData;
        }

        return [];
    }, [activeMetric.branchEndpoint, metricBranchData]);

    const activeSatelliteData = useMemo(() => {
        if (activeMetric.satelliteEndpoint) {
            return metricSatelliteData;
        }

        return [];
    }, [activeMetric.satelliteEndpoint, metricSatelliteData]);

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        const fetchMetricData = async () => {
            if (!activeMetric.branchEndpoint || !activeMetric.satelliteEndpoint) {
                setMetricBranchData([]);
                setMetricSatelliteData([]);
                setIsMetricLoading(false);
                return;
            }

            setIsMetricLoading(true);
            const userId = Number(localStorage.getItem("ab_id"));
            const username = localStorage.getItem("username") || "";

            try {
                const [branchResponse, satelliteResponse] = await Promise.all([
                    axios.get<BranchDataResponse>(
                        `${import.meta.env.VITE_API_BASE_URL}/${activeMetric.branchEndpoint}/${selectedYear}`,
                        {
                            params: { userid: userId, username },
                            signal: controller.signal,
                        }
                    ),
                    axios.get<SatelliteDataResponse>(
                        `${import.meta.env.VITE_API_BASE_URL}/${activeMetric.satelliteEndpoint}/${selectedYear}`,
                        {
                            params: { userid: userId, username },
                            signal: controller.signal,
                        }
                    ),
                ]);

                if (ignore) {
                    return;
                }

                const nextBranchData = Object.entries(branchResponse.data?.data ?? {})
                    .map(([name, value]) => ({ name, value: Number(value ?? 0) }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 6);

                const nextSatelliteData = (satelliteResponse.data?.data ?? [])
                    .flatMap((branch) => branch.satellites ?? [])
                    .filter((satellite) => satellite.satellite_name?.toLowerCase() !== 'no satellite')
                    .map((satellite) => ({
                        name: satellite.satellite_name,
                        value: Number(satellite.satellite_total ?? 0),
                    }))
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 6);

                setMetricBranchData(nextBranchData);
                setMetricSatelliteData(nextSatelliteData);
            } catch {
                if (!ignore) {
                    setMetricBranchData([]);
                    setMetricSatelliteData([]);
                }
            } finally {
                if (!ignore) {
                    setIsMetricLoading(false);
                }
            }
        };

        fetchMetricData();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [activeMetric.branchEndpoint, activeMetric.satelliteEndpoint, selectedYear]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Display Metric</p>
                    <p className="text-xs text-gray-500 mt-1">{activeMetric.label}</p>
                </div>
                <select
                    value={selectedMetric}
                    onChange={(event) => setSelectedMetric(event.target.value as PerformanceMetric)}
                    className="min-w-[180px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                    aria-label="Select performance metric"
                >
                    <option value="newMembership">New Membership</option>
                    <option value="loanRelease">Loan Release</option>
                    <option value="collection">Collection</option>
                </select>
            </div>

            <ChartCard
                title={activeMetric.branchTitle}
                data={activeBranchData}
                isLoading={Boolean(activeMetric.branchEndpoint) && isMetricLoading}
            />
            <ChartCard
                title={activeMetric.satelliteTitle}
                data={activeSatelliteData}
                isLoading={Boolean(activeMetric.satelliteEndpoint) && isMetricLoading}
            />
        </div>
    );
};

export default PerformanceCharts;
