import React, { useEffect, useRef } from 'react';
import { Pie } from '@antv/g2plot';
import type { PieOptions } from '@antv/g2plot';

interface PieChartProps {
  data: Array<{ type: string; value: number }>;
  width?: number;
  height?: number;
  title?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  data,
  width = '100%',
  height = 400,
  title = 'Pie Chart',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const config: PieOptions = {
      data,
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,
      label: {
        type: 'inner',
        offset: '-30%',
        content: '{percentage}',
        style: {
          fontSize: 14,
          textAlign: 'center',
        },
      },
      interactions: [{ type: 'element-active' }],
    };

    const piePlot = new Pie(containerRef.current, config);
    piePlot.render();

    return () => piePlot.destroy();
  }, [data]);

  return (
    <div className="pie-chart-container p-4">
      {title && <h2 className="text-lg font-semibold mb-2">{title}</h2>}
      <div 
        ref={containerRef} 
        style={{ width, height }}
        className="w-full"
      />
    </div>
  );
};

export default PieChart;