
import React from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Legend
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

export const DAILY_CHART_DATA: DailyData[] = Array.from({ length: 30 }, (_, i) => ({
    date: `Jan ${i + 1}`,
    newmembership: 3000 + Math.random() * 4000,
    loanreleases: 800 + Math.random() * 1200,
    collections: 400 + Math.random() * 800,
}));

const DailyDetailsChart: React.FC = () => {
    const membershipTotalMonth = 4215;
    const avgProfit = 1195;

    return (
        <div className="bg-white p-6  shadow-sm border border-gray-300 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase mb-4">Daily Details (Month)</h3>
                    <div className="flex gap-12">
                        <div>
                            <p className="text-xl font-bold text-gray-800">1234</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">New Memberships</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-800">4567</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loan Releases</p>
                        </div>
                        <div>
                            <p className="text-xl font-bold text-gray-800">789</p>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Collections</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold tracking-widest uppercase text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                        <span>New Memberships</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                        <span>Loan Releases</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span>Collections</span>
                    </div>
                </div>
            </div>

            <div className="flex-grow min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={DAILY_CHART_DATA}
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
                        <ReferenceLine y={membershipTotalMonth} stroke="#CBD5E1" strokeDasharray="3 3" label={{ position: 'top', value: `Membership: ${membershipTotalMonth}`, fill: '#94A3B8', fontSize: 10, fontWeight: 700 }} />

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
