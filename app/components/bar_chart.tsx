import React, { useEffect, useRef } from 'react';
import { Bar } from '@antv/g2plot';
import type { BarOptions } from '@antv/g2plot';

interface BarChartProps {
  data: Array<{ category: string; value: number }>;
  width?: number;
  height?: number;
  title?: string;
  color?: string;
  xField?: string;
  yField?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  width = '100%',
  height = 400,
  title = 'Bar Chart',
  color = '#6395f9',
  xField = 'category',
  yField = 'value',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const config: BarOptions = {
      data,
      xField,
      yField,
      seriesField: xField, // For color mapping
      color,
      legend: { position: 'top-left' },
      interactions: [{ type: 'active-region' }],
      barStyle: { radius: [4, 4, 0, 0] },
      label: {
        position: 'middle',
        style: { fill: '#fff' },
      },
    };

    const barPlot = new Bar(containerRef.current, config);
    barPlot.render();

    return () => {
      barPlot.destroy();
    };
  }, [data, color, xField, yField]);

  return (
    <div className="bar-chart-container p-4 bg-white rounded-lg shadow">
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      <div 
        ref={containerRef} 
        style={{ width, height }}
        className="w-full"
      />
    </div>
  );
};

export default BarChart;