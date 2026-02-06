
import React from 'react';
import { ChevronDown, Info } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export interface PredictionData {
  name: string;
  avgDailySales: number;
  replenishmentDays: number;
  daysOutOfStock: number;
}

export const PREDICTIONS: PredictionData[] = [
  { name: 'Main Office', avgDailySales: 42, replenishmentDays: 30, daysOutOfStock: 25 },
  { name: 'Batangas Branch', avgDailySales: 35, replenishmentDays: 21, daysOutOfStock: 18 },
  { name: 'Catarman Branch', avgDailySales: 24, replenishmentDays: 19, daysOutOfStock: 15 },
  { name: 'Davao Branch', avgDailySales: 19, replenishmentDays: 16, daysOutOfStock: 11 },
  { name: 'Ormoc Branch', avgDailySales: 6, replenishmentDays: 11, daysOutOfStock: 9 },
];

export const SCATTER_DATA = [
  { x: 2, y: 70 },
  { x: 3, y: 88 },
  { x: 5, y: 55 },
  { x: 7, y: 82 },
  { x: 8, y: 45 },
  { x: 10, y: 78 },
  { x: 12, y: 35 },
  { x: 15, y: 65 },
  { x: 17, y: 92 },
  { x: 19, y: 50 },
];

const StockPredictions: React.FC = () => {
    return (
        <aside className="w-80 bg-[#1e293b] text-white flex flex-col h-screen overflow-y-auto">
            <div className="p-5">
                <h2 className="text-lg font-bold mb-4 tracking-wide">BRANCH PERFORMANCE</h2>

                <div className="mb-6">
                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-2">Select Sub Category</label>
                    <div className="relative">
                        <select className="w-full bg-[#334155] border-none rounded-sm px-3 py-2 text-xs appearance-none cursor-pointer focus:ring-1 focus:ring-blue-500">
                            <option>THIS YEAR</option>
                            <option>1st QUARTER</option>
                            <option>2nd QUARTER</option>
                            <option>3rd QUARTER</option>
                            <option>4th QUARTER</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-[11px] font-semibold text-gray-300 mb-3">Top 5 Branches</h3>
                    <div className="space-y-3">
                        <div className="grid grid-cols-3 text-[9px] text-gray-500 font-bold border-b border-gray-700 pb-1">
                            <div className="col-span-1">Branch Name</div>
                            <div className="text-center">Avg Daily</div>
                            <div className="text-right">Overall Total</div>
                        </div>
                        {PREDICTIONS.map((p, i) => (
                            <div key={i} className="grid grid-cols-3 items-center text-[10px] py-1">
                                <div className="col-span-1 leading-tight text-gray-300 font-medium">{p.name}</div>
                                <div className="flex justify-center items-center gap-1">
                                    <div className="w-8 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${p.avgDailySales * 2}%` }} />
                                    </div>
                                    <span className="text-[9px]">{p.avgDailySales}</span>
                                </div>
                                <div className="text-right font-bold text-orange-400">{p.daysOutOfStock}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 p-2 bg-[#0f172a] rounded text-[10px] text-gray-400 italic">
                        Driven by performance variations across <span className="font-bold text-white">Branches</span>, with <span className="font-bold text-white">Main Office</span> showing the highest task volume and impact due to their consistently strong daily and overall performance.
                    </div>
                </div>

                <div className="bg-[#0f172a] p-4 border border-blue-900/50 rounded-sm">
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                        <Info className="w-4 h-4" />
                        <span className="text-[11px] font-bold">Recommendations</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-300">
                        Focus on improving task efficiency and completion rates in every <span className="font-bold text-white">Main Office</span> and <span className="font-bold text-white">Branches</span>.
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default StockPredictions;
