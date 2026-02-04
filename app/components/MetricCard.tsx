
import React from 'react';
import { Card, Button } from 'antd';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Eye } from 'lucide-react';

export interface ChartDataItem {
  name: string;
  value: number;
  color: string;
}

export interface MetricCardProps {
  title: string;
  link?: string;
  data: ChartDataItem[];
  centerLabel?: string;
  centerValue?: string | number;
  legend: { label: string; value: string | number; color: string }[];
  icon?: React.ReactNode;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}


export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  link,
  data,
  centerLabel,
  centerValue,
  legend,
  icon
}) => {
  return (
    <Card
      title={<span className="text-sm font-bold text-gray-700 uppercase tracking-tight">{title}</span>}
      className="shadow-sm border-none hover:shadow-md transition-shadow h-full flex flex-col"
      headStyle={{ borderBottom: '1px solid #f0f0f0', minHeight: '40px', padding: '0 16px' }}
      bodyStyle={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}
    >
      <div className="relative flex-1 flex flex-col items-center justify-center">
        {/* Chart Area */}
        <div className="w-full h-40 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={65}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Centered Icon/Label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {icon && <div className="opacity-80 scale-90">{icon}</div>}
            {centerValue && (
              <div className="absolute inset-0 flex items-center justify-center pt-8">
                <span className="text-lg font-bold text-red-500">{centerValue}</span>
              </div>
            )}
          </div>
        </div>

        {/* Center Labels for specific cards */}
        {centerLabel && (
          <div className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-2 flex gap-2">
            {centerLabel.split(' / ').map((l, i) => (
              <span key={i} className={i === 1 ? 'text-[#9cc332]' : ''}>{l}</span>
            ))}
          </div>
        )}

        {/* Dynamic Legend */}
        {legend.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 mt-4 mb-2">
            {legend.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[10px] text-gray-500 font-bold uppercase">{item.label}</span>
                <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto pt-4 border-t border-gray-50">
        <Button size="small" type="primary" className="w-full cursor-default flex-1 bg-blue-500 text-[10px] uppercase font-bold h-7">
          <span>Access Granted</span>
        </Button>
        <a href={link} className="flex-1">
          <Button size="small" className="w-full text-[10px] uppercase font-bold h-7">
            <Eye className="w-3 h-3 mr-1" /> View
          </Button>
        </a>
      </div>
    </Card>
  );
};

export default MetricCard;
