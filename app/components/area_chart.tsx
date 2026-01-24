import React, { useEffect, useRef } from 'react';
import { Area } from '@antv/g2plot';

interface ChartData {
  date: string;
  value: number;
  category: string;
}

interface AreaChartProps {
  data: ChartData[];
  config?: Partial<any>;
}

const AreaChart: React.FC<AreaChartProps> = ({ data, config = {} }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<Area | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Destroy previous chart instance
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const chartConfig: any = {
      data: data || [],
      xField: 'date',
      yField: 'value',
      seriesField: 'category',
      color: ['#1979C9', '#D62A0D', '#FAA219'],
      smooth: true,
      line: {
        size: 2,
      },
      areaStyle: {
        fillOpacity: 0.15,
      },
      animation: {
        appear: {
          animation: 'wave-in' as const,
          duration: 3000,
        },
      },
      legend: {
        position: 'top-right' as const,
      },
      xAxis: {
        type: 'time' as const,
        mask: 'YYYY-MM-DD',
        tickCount: 5,
      },
      yAxis: {
        label: {
          formatter: (v: string) => `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
        },
      },
      tooltip: {
        showMarkers: true,
        showCrosshairs: true,
        crosshairs: {
          type: 'x' as const,
        },
      },
      ...config,
    };

    try {
      chartRef.current = new Area(containerRef.current, chartConfig);
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
  }, [data, config]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default AreaChart;