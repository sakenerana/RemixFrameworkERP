
import React, { useMemo, useState } from 'react';
import { Select } from 'antd';
import dayjs from 'dayjs';
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
    secondary: '#94A3B8', // slate-400
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

const DailyDetailsChart: React.FC<Props> = ({ selectedYear }) => {
    const currentMonth = dayjs().month();
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const dailyChartData = useMemo(() => {
        const daysInMonth = dayjs().year(selectedYear).month(selectedMonth).daysInMonth();
        const monthShort = dayjs().year(selectedYear).month(selectedMonth).format('MMM');

        return Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const base = selectedYear * 100 + selectedMonth * 31 + day;

            return {
                date: `${monthShort} ${day}`,
                newmembership: 1800 + (base * 37) % 3200,
                loanreleases: 700 + (base * 17) % 1400,
                collections: 350 + (base * 13) % 900,
            };
        });
    }, [selectedMonth, selectedYear]);

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

    const membershipAverage = Math.round(
        monthTotals.newmembership / Math.max(dailyChartData.length, 1)
    );

    return (
        <div className="bg-white p-6  shadow-sm border border-gray-300 flex flex-col h-full">
            <div className="flex flex-col gap-4 mb-8 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Daily Details (Month)</h3>
                    <div className="flex gap-12">
                        <div>
                            <p className="text-xl font-bold text-gray-800">{monthTotals.newmembership.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Membership</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-800">{monthTotals.loanreleases.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loan Release</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-800">{monthTotals.collections.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Collection</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-3 xl:items-end">
                    <Select
                        value={selectedMonth}
                        options={MONTH_OPTIONS}
                        onChange={setSelectedMonth}
                        className="w-full min-w-[180px] xl:w-[200px]"
                    />
                    <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-gray-500">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                            <span>New Membership</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span>Loan Release</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>Collection</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex-grow min-h-[300px]">
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
                        <ReferenceLine y={membershipAverage} stroke="#CBD5E1" strokeDasharray="3 3" label={{ position: 'top', value: `Membership Avg: ${membershipAverage}`, fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} />

                        <Bar dataKey="newmembership" fill="#E2E8F0" radius={[4, 4, 0, 0]} barSize={24} />
                        <Bar dataKey="loanreleases" fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={16} />
                        <Bar dataKey="collections" fill={COLORS.accent} radius={[4, 4, 0, 0]} barSize={16} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DailyDetailsChart;
