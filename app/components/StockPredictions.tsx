
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
  { name: 'QUILTED WAISTCOAT', avgDailySales: 42, replenishmentDays: 30, daysOutOfStock: 25 },
  { name: 'FEATHER TRIM JACKET', avgDailySales: 35, replenishmentDays: 21, daysOutOfStock: 18 },
  { name: 'LONG OVERCOAT', avgDailySales: 24, replenishmentDays: 19, daysOutOfStock: 15 },
  { name: 'BOMBER JACKET', avgDailySales: 19, replenishmentDays: 16, daysOutOfStock: 11 },
  { name: 'FELTED WOOL JACKET', avgDailySales: 6, replenishmentDays: 11, daysOutOfStock: 9 },
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
                <h2 className="text-lg font-bold mb-4 tracking-wide">STOCK PREDICTIONS</h2>

                <div className="mb-6">
                    <label className="text-[10px] text-gray-400 uppercase font-bold block mb-2">Select Sub Category</label>
                    <div className="relative">
                        <select className="w-full bg-[#334155] border-none rounded-sm px-3 py-2 text-xs appearance-none cursor-pointer focus:ring-1 focus:ring-blue-500">
                            <option>COATS & JACKETS</option>
                            <option>TROUSERS</option>
                            <option>KNITWEAR</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-[11px] font-semibold text-gray-300 mb-3">Predicted Days Out of Stock</h3>
                    <div className="space-y-3">
                        <div className="grid grid-cols-4 text-[9px] text-gray-500 font-bold border-b border-gray-700 pb-1">
                            <div className="col-span-1">Product Name</div>
                            <div className="text-center">Avg Daily</div>
                            <div className="text-center">Replen.</div>
                            <div className="text-right">Days Out</div>
                        </div>
                        {PREDICTIONS.map((p, i) => (
                            <div key={i} className="grid grid-cols-4 items-center text-[10px] py-1">
                                <div className="col-span-1 leading-tight text-gray-300 font-medium">{p.name}</div>
                                <div className="flex justify-center items-center gap-1">
                                    <div className="w-8 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${p.avgDailySales * 2}%` }} />
                                    </div>
                                    <span className="text-[9px]">{p.avgDailySales}</span>
                                </div>
                                <div className="text-center text-gray-400">{p.replenishmentDays}</div>
                                <div className="text-right font-bold text-orange-400">{p.daysOutOfStock}</div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3 p-2 bg-[#0f172a] rounded text-[10px] text-gray-400 italic">
                        Total number of days out of stock for <span className="text-blue-400 font-bold">COATS & JACKETS: 78</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-[11px] font-semibold text-gray-300 mb-4">What If Analysis</h3>

                    <div className="mb-4">
                        <div className="flex justify-between text-[10px] mb-2">
                            <span className="text-gray-400">Fulfillment Cycle Time Variance (%)</span>
                            <span className="text-green-400 font-bold">-20%</span>
                        </div>
                        <input type="range" className="w-full accent-blue-500 bg-gray-700 h-1 rounded-lg appearance-none cursor-pointer" />
                        <div className="flex justify-between text-[8px] text-gray-500 mt-1">
                            <span>-100%</span>
                            <span>0</span>
                            <span>100%</span>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex justify-between text-[10px] mb-2">
                            <span className="text-gray-400">Markdown Variance (%)</span>
                            <span className="text-orange-400 font-bold">30%</span>
                        </div>
                        <input type="range" className="w-full accent-orange-500 bg-gray-700 h-1 rounded-lg appearance-none cursor-pointer" />
                        <div className="flex justify-between text-[8px] text-gray-500 mt-1">
                            <span>-100%</span>
                            <span>0</span>
                            <span>100%</span>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-[11px] font-semibold text-gray-300 mb-2">Simulated Days Out of Stock</h3>
                    <div className="h-40 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis type="number" dataKey="x" name="Days" tick={{ fontSize: 8, fill: '#64748b' }} />
                                <YAxis type="number" dataKey="y" name="Sales" tick={{ fontSize: 8, fill: '#64748b' }} />
                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                <Scatter name="Products" data={SCATTER_DATA} fill="#f59e0b" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-[#0f172a] p-4 border border-blue-900/50 rounded-sm">
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                        <Info className="w-4 h-4" />
                        <span className="text-[11px] font-bold">Recommendations</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-gray-300">
                        Increase Inventory in Stock and reduce Replenishment days for <span className="font-bold text-white">Quilted Waistcoat</span>, <span className="font-bold text-white">Feather Trim Jacket</span> and <span className="font-bold text-white">Long Overcoat</span> to meet increased sales demand.
                    </p>
                </div>
            </div>
        </aside>
    );
};

export default StockPredictions;
