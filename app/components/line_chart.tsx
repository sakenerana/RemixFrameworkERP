import React, { useEffect, useRef } from 'react';
import { Line } from '@antv/g2plot';
import type { LineOptions } from '@antv/g2plot';

interface DataItem {
  date: string;
  value: number;
  category?: string;
}

interface LineChartProps {
  data: DataItem[];
  width?: number;
  height?: number;
  title?: string;
  xField?: string;
  yField?: string;
  seriesField?: string;
  color?: string | string[];
  smooth?: boolean;
  showPoints?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({
  data,
  width = '100%',
  height = 400,
  title = 'Trend Analysis',
  xField = 'date',
  yField = 'value',
  seriesField,
  color = '#5B8FF9',
  smooth = true,
  showPoints = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || data.length === 0) return;

    const config: LineOptions = {
      data,
      xField,
      yField,
      seriesField,
      color: Array.isArray(color) ? color : [color],
      smooth,
      point: showPoints ? {
        size: 4,
        shape: 'circle',
        style: {
          fill: 'white',
          stroke: Array.isArray(color) ? color[0] : color,
          lineWidth: 2,
        },
      } : undefined,
      animation: false, // Disable animations to prevent the error
      // Alternative animation config if needed:
      // animation: {
      //   appear: {
      //     animation: 'fade-in', // Use simpler animation
      //     duration: 1000,
      //   },
      //   update: {
      //     animation: 'fade-in',
      //   }
      // },
      xAxis: {
        label: {
          formatter: (val: string) => val, // Simplified formatter
        },
      },
    };

    const linePlot = new Line(containerRef.current, config);
    linePlot.render();

    return () => {
      linePlot.destroy();
    };
  }, [data, xField, yField, seriesField, color, smooth, showPoints]);

  return (
    <div className="line-chart-container p-4 bg-white rounded-lg shadow">
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      <div 
        ref={containerRef} 
        style={{ width, height }}
        className="w-full"
      />
    </div>
  );
};

export default LineChart;