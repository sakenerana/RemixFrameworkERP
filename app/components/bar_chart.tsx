// bar_chart.tsx
import React, { useEffect, useRef } from 'react';
import { Bar } from '@antv/g2plot';

export interface BarChartData {
  category: string;
  value: number;
  color?: string; // Custom color for each bar
}

interface BarChartProps {
  data: BarChartData[];
  title?: string;
  xField?: string;
  yField?: string;
  colorField?: string; // NEW: Field name for colors
  height?: number;
  width?: number;
  config?: Partial<any>;
}

const BarChart: React.FC<BarChartProps> = ({
  data,
  title = '',
  xField = 'category',
  yField = 'value',
  colorField = 'color', // NEW prop
  height = 350,
  width = '100%',
  config = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Bar | null>(null);

  useEffect(() => {
    if (!containerRef.current || !data || data.length === 0) return;

    // Destroy previous chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    // Prepare data with color as a regular field
    const chartData = data.map((item, index) => ({
      ...item,
      // Ensure color exists, fallback to generated color
      [colorField]: item.color || generateColor(index)
    }));

    const chartConfig: any = {
      data: chartData,
      xField,
      yField,
      colorField, // Tell G2Plot to use this field for colors
      color: colorField, // This is the key part - map colors from data field
      xAxis: {
        label: {
          autoHide: true,
          autoRotate: false,
        },
      },
      yAxis: {
        label: {
          formatter: (v: string) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
        },
      },
      meta: {
        [yField]: {
          alias: 'Value',
        },
        [xField]: {
          alias: 'Category',
        },
      },
      label: {
        position: 'middle',
        style: {
          fill: '#FFFFFF',
          fontSize: 12,
        },
        formatter: (datum: any) => {
          return datum.value.toLocaleString();
        },
      },
      tooltip: {
        showMarkers: false,
        formatter: (datum: any) => {
          return { name: datum[xField], value: datum[yField].toLocaleString() };
        },
      },
      ...config,
    };

    try {
      chartRef.current = new Bar(containerRef.current, chartConfig);
      chartRef.current.render();
    } catch (error) {
      console.error('Error creating chart:', error);
    }

    return () => {
      if (chartRef.current) {
        try {
          chartRef.current.destroy();
          chartRef.current = null;
        } catch (error) {
          console.error('Error destroying chart:', error);
        }
      }
    };
  }, [data, xField, yField, colorField, config]);

  return <div ref={containerRef} style={{ width, height }} />;
};

// Helper function to generate colors if not provided
const generateColor = (index: number): string => {
  const colors = [
    '#16a34a', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', '#ec4899',
    '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#d946ef', '#10b981'
  ];
  return colors[index % colors.length];
};

export default BarChart;