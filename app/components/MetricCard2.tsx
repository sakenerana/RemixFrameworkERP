
import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface Product {
  id: string;
  name: string;
  views?: number;
  inventory?: number;
  daysSupply: number;
  replenishmentDays: number;
  avgDailySales?: number;
  totalSales?: string;
  status: 'critical' | 'warning' | 'stable' | 'good';
}

export interface MetricCardProps {
  title: string;
  value: string | number;
  percentage: number;
  percentageColor: string;
  subtitle: string;
  subtitleValue: string;
  topProductLabel: string;
  topProductName: string;
  products: Product[];
  type: 'views' | 'inventory';
}

const MetricCard2: React.FC<MetricCardProps> = ({
  title,
  value,
  percentage, 
  percentageColor,
  subtitle,
  subtitleValue,
  topProductLabel,
  topProductName,
  products,
  type
}) => {
  return (
    <div className="bg-[#1e293b] text-white rounded-sm shadow-sm flex flex-col h-full overflow-hidden">
      {/* Header Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{title}</h3>
          <div className="w-24 h-4 bg-gray-700 rounded-full overflow-hidden relative">
            <div 
              className={`h-full ${percentageColor}`} 
              style={{ width: `${percentage}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold">
              {percentage}% 
            </span>
          </div>
        </div>
        <div className="text-3xl font-light mb-4">{value}</div>
        
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[9px] text-gray-400">{topProductLabel}</span>
            <span className="text-[10px] font-bold text-blue-400 uppercase">{topProductName}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] text-gray-400">Total Sales ($)</span>
            <span className="text-[10px] font-bold">{subtitleValue}</span>
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-white text-gray-800 flex-1 p-2">
        <div className="flex justify-between items-center px-2 py-1 mb-1 border-b border-gray-100">
          <span className="text-[10px] font-bold text-gray-500 uppercase">{title.split(' ')[0]} {type === 'views' ? 'Viewed' : 'Sales'}</span>
          <button className="flex items-center text-[9px] text-gray-400 border border-gray-200 px-2 rounded hover:bg-gray-50">
            Subcategory <ChevronDown className="w-3 h-3 ml-1" />
          </button>
        </div>

        <table className="w-full text-[9px]">
          <thead className="text-gray-400 border-b border-gray-50">
            <tr>
              <th className="text-left font-normal py-1">Product Name</th>
              <th className="text-center font-normal py-1">
                {type === 'views' ? 'Number of Views' : 'Avg Daily Sales'}
              </th>
              <th className="text-right font-normal py-1">
                {type === 'views' ? 'Days Supply' : 'Replenishment'}
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-2 text-[10px]">{p.name}</td>
                <td className="py-2">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-400" 
                        style={{ width: `${(type === 'views' ? (p.views || 0) / 100 : (p.avgDailySales || 0))}%` }}
                      />
                    </div>
                    <span>{type === 'views' ? p.views : p.avgDailySales}</span>
                  </div>
                </td>
                <td className="py-2 text-right">
                  <span className={`px-2 py-0.5 rounded-sm font-bold ${
                    p.status === 'critical' ? 'bg-red-100 text-red-600' :
                    p.status === 'warning' ? 'bg-orange-100 text-orange-600' :
                    p.status === 'stable' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    {type === 'views' ? p.daysSupply : p.replenishmentDays}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 text-center">
          <button className="text-[8px] font-bold text-gray-400 border border-gray-200 px-4 py-1 rounded hover:bg-gray-50">
            View All Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetricCard2;
