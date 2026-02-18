import React, { useRef } from 'react';
import { cn, exportChartAsPNG } from '@/lib/utils';

interface ChartContainerProps {
  title: string;
  unit: string;
  description?: string;
  source?: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartContainer({
  title,
  unit,
  description,
  source = 'Synthetic Data (Portfolio Mode)',
  children,
  className,
}: ChartContainerProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (chartRef.current) {
      exportChartAsPNG(chartRef.current, `${title.toLowerCase().replace(/\s+/g, '-')}.png`);
    }
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 p-6', className)}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500">{unit}</span>
            {description && (
              <span className="text-xs text-gray-400" title={description}>
                ⓘ {description}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleExport}
          className="px-3 py-1 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Export PNG
        </button>
      </div>

      <div ref={chartRef} className="w-full">
        {children}
      </div>

      <div className="mt-4 text-xs text-gray-400">
        Source: {source}
      </div>
    </div>
  );
}
