
import React from 'react';
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

export const COLORS = {
    primary: '#10B981', // green-500
    secondary: '#94A3B8', // slate-400
    accent: '#3B82F6', // blue-500
    danger: '#EF4444', // red-500
    background: '#F8FAFC',
};

export const CITIES_DATA: PerformanceData[] = [
    { name: 'Main Office', value: 37447 },
    { name: 'Danao Branch', value: 32338 },
    { name: 'Lapu-Lapu Branch', value: 24793 },
    { name: 'Bantayan Branch', value: 12554 },
    { name: 'Makati Branch', value: 11953 },
    { name: 'Tacloban Branch', value: 11572 },
];

export const CATEGORIES_DATA: PerformanceData[] = [
    { name: 'Main Office', value: 48586 },
    { name: 'Danao Branch', value: 28355 },
    { name: 'Lapu-Lapu Branch', value: 22667 },
    { name: 'Bantayan Branch', value: 18832 },
    { name: 'Makati Branch', value: 12219 },
];

const PerformanceCharts: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Branch Performance */}
            <div className="bg-white p-6 shadow-sm border border-gray-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase">New Membership Performance</h3>
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
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={CITIES_DATA} margin={{ left: 10, right: 40 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                type="category"
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                width={120}
                                tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }}
                            />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} label={{ position: 'right', fontSize: 10, fill: '#1E293B', fontWeight: 700, formatter: (val: any) => `${val.toLocaleString()}` }}>
                                {CITIES_DATA.map((entry, index) => (
                                    <Cell key={index} fill={index < 3 ? COLORS.primary : '#E2E8F0'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Categories Performance */}
            <div className="bg-white p-6 shadow-sm border border-gray-300">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xs font-bold text-gray-500 tracking-widest uppercase">Collection Performance</h3>
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
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={CATEGORIES_DATA} margin={{ left: 10, right: 40 }}>
                            <XAxis type="number" hide />
                            <YAxis
                                type="category"
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                width={120}
                                tick={{ fontSize: 10, fill: '#64748B', fontWeight: 600 }}
                            />
                            <Tooltip cursor={{ fill: 'transparent' }} />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={16} label={{ position: 'right', fontSize: 10, fill: '#1E293B', fontWeight: 700, formatter: (val: any) => `${val.toLocaleString()}` }}>
                                {CATEGORIES_DATA.map((entry, index) => (
                                    <Cell key={index} fill={index < 3 ? COLORS.primary : '#E2E8F0'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default PerformanceCharts;
