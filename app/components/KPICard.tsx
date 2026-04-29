
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Users, HandCoins, FileUser, ContactRound } from 'lucide-react';

export interface KPIData {
  label: string;
  value: string;
  trend: number;
  comparison: string;
  cashPayment?: number;
  nonCashPayment?: number;
  history: { month: string; fullMonth?: string; value: number }[];
  isLoading?: boolean;
  isError?: boolean;
}

export const COLORS = {
    primary: '#10B981', // green-500
    secondary: '#94A3B8', // slate-400
    accent: '#3B82F6', // blue-500
    danger: '#EF4444', // red-500
    background: '#F8FAFC',
};

export const KPI_DATA: KPIData[] = [
    {
        label: 'SALES',
        value: '$130,659',
        trend: 16.58,
        comparison: 'vs prev month $112,272',
        history: [
            { month: 'O', value: 40 }, { month: 'N', value: 70 }, { month: 'D', value: 50 },
            { month: 'J', value: 80 }, { month: 'F', value: 60 }, { month: 'M', value: 90 },
            { month: 'A', value: 75 }, { month: 'M', value: 85 }, { month: 'J', value: 100 },
            { month: 'J', value: 95 }, { month: 'A', value: 110 }, { month: 'S', value: 120 }
        ]
    },
    {
        label: 'COGS',
        value: '$93,592',
        trend: 16.85,
        comparison: 'vs prev month $80,098',
        history: [
            { month: 'O', value: 30 }, { month: 'N', value: 50 }, { month: 'D', value: 40 },
            { month: 'J', value: 60 }, { month: 'F', value: 45 }, { month: 'M', value: 70 },
            { month: 'A', value: 55 }, { month: 'M', value: 65 }, { month: 'J', value: 80 },
            { month: 'J', value: 75 }, { month: 'A', value: 85 }, { month: 'S', value: 90 }
        ]
    },
    {
        label: 'PROFIT',
        value: '$37,067',
        trend: 15.21,
        comparison: 'vs prev month $32,174',
        history: [
            { month: 'O', value: 10 }, { month: 'N', value: 20 }, { month: 'D', value: 10 },
            { month: 'J', value: 20 }, { month: 'F', value: 15 }, { month: 'M', value: 20 },
            { month: 'A', value: 20 }, { month: 'M', value: 20 }, { month: 'J', value: 20 },
            { month: 'J', value: 20 }, { month: 'A', value: 25 }, { month: 'S', value: 30 }
        ]
    },
    {
        label: 'PROFIT MARGIN',
        value: '28.37%',
        trend: -0.29,
        comparison: 'vs prev month 28.66%',
        history: [
            { month: 'O', value: 28 }, { month: 'N', value: 29 }, { month: 'D', value: 27 },
            { month: 'J', value: 28 }, { month: 'F', value: 28 }, { month: 'M', value: 29 },
            { month: 'A', value: 28 }, { month: 'M', value: 28 }, { month: 'J', value: 28 },
            { month: 'J', value: 28 }, { month: 'A', value: 28 }, { month: 'S', value: 28 }
        ]
    }
];

interface Props {
    data: KPIData;
    index: number;
}

const formatTooltipValue = (value: number) => {
    return value.toLocaleString('en-PH', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    });
};

const formatPesoCompact = (value: number) =>
    new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value ?? 0);

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value?: number; payload?: { month?: string; fullMonth?: string } }> }) => {
    if (!active || !payload?.length) {
        return null;
    }

    const point = payload[0];

    return (
        <div className="rounded border border-slate-200 bg-white px-2 py-1 text-[10px] shadow-sm">
            <p className="font-semibold text-slate-700">{point.payload?.fullMonth ?? point.payload?.month}</p>
            <p className="text-slate-500">{formatTooltipValue(Number(point.value ?? 0))}</p>
        </div>
    );
};

const KPICard: React.FC<Props> = ({ data, index }) => {
    const isPositive = data.trend >= 0;
    const showLoading = Boolean(data.isLoading);
    const showError = Boolean(data.isError);

    const getIcon = () => {
        switch (data.label) {
            case 'NEW MEMBERSHIP':
            case 'NEW MEMBERSHIPS': return <Users size={20} className="text-gray-300" />;
            case 'LOAN RELEASE':
            case 'LOAN RELEASES': return <FileUser size={20} className="text-gray-300" />;
            case 'COLLECTION':
            case 'COLLECTIONS': return <HandCoins size={20} className="text-gray-300" />;
            case 'PERSONNEL TASK COMPLETION': return <ContactRound size={20} className="text-gray-300" />;
            default: return null;
        }
    };

    return (
        <div className="bg-white p-6 shadow-sm border border-gray-300 flex flex-col">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-gray-500 tracking-widest">{data.label}</span>
                {getIcon()}
            </div>

            {showLoading ? (
                <>
                    <div className="mb-1 h-8 w-24 animate-pulse rounded bg-slate-200" />
                    <div className="mb-6 h-3 w-28 animate-pulse rounded bg-slate-100" />
                    <div className="mt-auto">
                        <div className="flex h-16 w-full items-end gap-1">
                            {Array.from({ length: 12 }, (_, i) => (
                                <div
                                    key={i}
                                    className="animate-pulse rounded-t bg-slate-200"
                                    style={{
                                        height: `${20 + ((i % 5) * 8)}px`,
                                        width: '100%',
                                    }}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between mt-1 text-[8px] text-gray-300 font-bold px-1 uppercase">
                            {data.history.map((h, i) => <span key={i}>{h.month}</span>)}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-2xl font-bold text-gray-800">{data.value}</span>
                        {!showError && (
                            <div className={`flex items-center text-xs font-semibold ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                                {Math.abs(data.trend)}%
                            </div>
                        )}
                    </div>

                    <p className={`text-[10px] font-medium mb-6 uppercase tracking-tight ${showError ? 'text-rose-400' : 'text-gray-400'}`}>
                        <span className="flex items-center justify-between gap-2">
                            <span>{data.comparison}</span>
                            {data.label === 'COLLECTION' && !showError && (
                                <span className="text-[9px] normal-case tracking-normal text-gray-500 text-right">
                                    Cash {formatPesoCompact(Math.abs(Number(data.cashPayment ?? 0)))} | Non-Cash {formatPesoCompact(Math.abs(Number(data.nonCashPayment ?? 0)))}
                                </span>
                            )}
                        </span>
                    </p>

                    <div className="h-16 w-full mt-auto">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.history}>
                                <Tooltip
                                    content={<CustomTooltip />}
                                    cursor={{ fill: 'rgba(148, 163, 184, 0.12)' }}
                                />
                                <Bar dataKey="value" radius={[2, 2, 0, 0]}>
                                    {data.history.map((entry, i) => (
                                        <Cell
                                            key={`cell-${i}`}
                                            fill={showError ? '#FECACA' : i === data.history.length - 1 ? COLORS.primary : '#E2E8F0'}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="flex justify-between mt-1 text-[8px] text-gray-400 font-bold px-1 uppercase">
                            {data.history.map((h, i) => <span key={i}>{h.month}</span>)}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default KPICard;
