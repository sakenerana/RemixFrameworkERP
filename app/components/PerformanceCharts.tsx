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

interface CollectionDepartmentEntry {
    department: string;
    billed: number;
    paid: number;
}

interface CollectionGeoEntry {
    geo: string;
    departments: CollectionDepartmentEntry[];
}

interface CollectionBranchEntry {
    branch: string;
    total_billed: number;
    total_paid: number;
    geos: CollectionGeoEntry[];
}

interface CollectionDepartmentResponse {
    error: boolean;
    data: {
        year: string;
        month: string | number;
        branches: CollectionBranchEntry[];
    };
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
    isError?: boolean;
    isCurrency?: boolean;
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

const formatChartMetricValue = (value: number, isCurrency = false) => {
    const safeValue = Number.isFinite(value) ? value : 0;

    if (!isCurrency) {
        return safeValue.toLocaleString();
    }

    const sign = safeValue < 0 ? '-' : '';
    return `${sign}\u20B1${Math.abs(safeValue).toLocaleString()}`;
};

const ChartCard: React.FC<ChartCardProps> = ({ title, data, isLoading = false, isError = false, isCurrency = false }) => (
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
                <div className="flex h-full flex-col justify-end gap-3">
                    <div className="space-y-3">
                        {Array.from({ length: 5 }, (_, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
                                <div
                                    className="h-4 animate-pulse rounded bg-slate-200"
                                    style={{ width: `${45 + index * 12}%` }}
                                />
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-sm text-gray-400">Loading data...</p>
                </div>
            ) : isError ? (
                <div className="flex h-full items-center justify-center text-sm text-rose-400">
                    Unable to sync chart data
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
                        <Tooltip
                            cursor={{ fill: 'transparent' }}
                            formatter={(value) => formatChartMetricValue(Number(value ?? 0), isCurrency)}
                        />
                        <Bar
                            dataKey="value"
                            radius={[0, 4, 4, 0]}
                            barSize={16}
                            label={{
                                position: 'right',
                                fontSize: 10,
                                fill: '#1E293B',
                                fontWeight: 700,
                                formatter: (value: number) => formatChartMetricValue(Number(value ?? 0), isCurrency),
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
    const [isBranchLoading, setIsBranchLoading] = useState(false);
    const [isSatelliteLoading, setIsSatelliteLoading] = useState(false);
    const [branchError, setBranchError] = useState(false);
    const [satelliteError, setSatelliteError] = useState(false);

    const activeMetric = PERFORMANCE_DATA[selectedMetric];
    const activeBranchData = useMemo(() => {
        if (selectedMetric === 'collection' || activeMetric.branchEndpoint) {
            return metricBranchData;
        }

        return [];
    }, [activeMetric.branchEndpoint, metricBranchData, selectedMetric]);

    const activeSatelliteData = useMemo(() => {
        if (selectedMetric === 'collection' || activeMetric.satelliteEndpoint) {
            return metricSatelliteData;
        }

        return [];
    }, [activeMetric.satelliteEndpoint, metricSatelliteData, selectedMetric]);

    useEffect(() => {
        let ignore = false;
        const controller = new AbortController();

        const fetchMetricData = async () => {
            const userId = Number(localStorage.getItem("ab_id"));
            const username = localStorage.getItem("username") || "";
            setIsBranchLoading(true);
            setIsSatelliteLoading(true);
            setBranchError(false);
            setSatelliteError(false);

            if (selectedMetric === 'collection') {
                axios.get<CollectionDepartmentResponse>(
                    `${import.meta.env.VITE_IACCS_API_BASE_URL}/api/external/iaccs-monitoring/billing/department`,
                    {
                        params: {
                            year: selectedYear,
                            month: 0,
                            userid: userId,
                            username,
                        },
                        signal: controller.signal,
                    }
                )
                    .then((response) => {
                        if (ignore) {
                            return;
                        }

                        const branches = response.data?.data?.branches ?? [];
                        console.log('Fetched collection department data:', branches);
                        const nextBranchData = branches
                            .map((branch) => ({
                                name: branch.branch,
                                value: Number(branch.total_paid ?? 0),
                            }))
                            .sort((a, b) => b.value - a.value)
                            .slice(0, 6);

                        const departmentTotals = new Map<string, number>();
                        branches.forEach((branch) => {
                            (branch.geos ?? []).forEach((geo) => {
                                (geo.departments ?? []).forEach((department) => {
                                    departmentTotals.set(
                                        department.department,
                                        (departmentTotals.get(department.department) ?? 0) + Number(department.paid ?? 0)
                                    );
                                });
                            });
                        });

                        const nextSatelliteData = Array.from(departmentTotals.entries())
                            .map(([name, value]) => ({ name, value }))
                            .sort((a, b) => b.value - a.value)
                            .slice(0, 6);

                        setMetricBranchData(nextBranchData);
                        setMetricSatelliteData(nextSatelliteData);
                        setBranchError(false);
                        setSatelliteError(false);
                    })
                    .catch(() => {
                        if (!ignore) {
                            setMetricBranchData([]);
                            setMetricSatelliteData([]);
                            setBranchError(true);
                            setSatelliteError(true);
                        }
                    })
                    .finally(() => {
                        if (!ignore) {
                            setIsBranchLoading(false);
                            setIsSatelliteLoading(false);
                        }
                    });

                return;
            }

            if (!activeMetric.branchEndpoint || !activeMetric.satelliteEndpoint) {
                setMetricBranchData([]);
                setMetricSatelliteData([]);
                setIsBranchLoading(false);
                setIsSatelliteLoading(false);
                setBranchError(false);
                setSatelliteError(false);
                return;
            }

            axios.get<BranchDataResponse>(
                `${import.meta.env.VITE_API_BASE_URL}/${activeMetric.branchEndpoint}/${selectedYear}`,
                {
                    params: { userid: userId, username },
                    signal: controller.signal,
                }
            )
                .then((branchResponse) => {
                    if (ignore) {
                        return;
                    }

                    const nextBranchData = Object.entries(branchResponse.data?.data ?? {})
                        .map(([name, value]) => ({ name, value: Number(value ?? 0) }))
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 6);

                    setMetricBranchData(nextBranchData);
                    setBranchError(false);
                })
                .catch(() => {
                    if (!ignore) {
                        setMetricBranchData([]);
                        setBranchError(true);
                    }
                })
                .finally(() => {
                    if (!ignore) {
                        setIsBranchLoading(false);
                    }
                });

            axios.get<SatelliteDataResponse>(
                `${import.meta.env.VITE_API_BASE_URL}/${activeMetric.satelliteEndpoint}/${selectedYear}`,
                {
                    params: { userid: userId, username },
                    signal: controller.signal,
                }
            )
                .then((satelliteResponse) => {
                    if (ignore) {
                        return;
                    }

                    const nextSatelliteData = (satelliteResponse.data?.data ?? [])
                        .flatMap((branch) => branch.satellites ?? [])
                        .filter((satellite) => satellite.satellite_name?.toLowerCase() !== 'no satellite')
                        .map((satellite) => ({
                            name: satellite.satellite_name,
                            value: Number(satellite.satellite_total ?? 0),
                        }))
                        .sort((a, b) => b.value - a.value)
                        .slice(0, 6);

                    setMetricSatelliteData(nextSatelliteData);
                    setSatelliteError(false);
                })
                .catch(() => {
                    if (!ignore) {
                        setMetricSatelliteData([]);
                        setSatelliteError(true);
                    }
                })
                .finally(() => {
                    if (!ignore) {
                        setIsSatelliteLoading(false);
                    }
                });
        };

        fetchMetricData();

        return () => {
            ignore = true;
            controller.abort();
        };
    }, [activeMetric.branchEndpoint, activeMetric.satelliteEndpoint, selectedMetric, selectedYear]);

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
                isLoading={selectedMetric === 'collection' ? isBranchLoading : Boolean(activeMetric.branchEndpoint) && isBranchLoading}
                isError={selectedMetric === 'collection' ? branchError : Boolean(activeMetric.branchEndpoint) && branchError}
                isCurrency={selectedMetric === 'collection'}
            />
            <ChartCard
                title={activeMetric.satelliteTitle}
                data={activeSatelliteData}
                isLoading={selectedMetric === 'collection' ? isSatelliteLoading : Boolean(activeMetric.satelliteEndpoint) && isSatelliteLoading}
                isError={selectedMetric === 'collection' ? satelliteError : Boolean(activeMetric.satelliteEndpoint) && satelliteError}
                isCurrency={selectedMetric === 'collection'}
            />
        </div>
    );
};

export default PerformanceCharts;
