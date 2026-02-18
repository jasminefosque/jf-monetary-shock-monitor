import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useTimeSeries } from '@/hooks/useData';
import { useAppStore } from '@/app/store';
import { formatDate, formatBps } from '@/lib/utils';

export function CurveSlopeChart() {
  const { startDate, endDate, geography } = useAppStore();
  const { data, loading } = useTimeSeries('curve_slope_10y_2y', { start_date: startDate, end_date: endDate, geography });

  if (loading) {
    return (
      <ChartContainer title="Yield Curve Slope" unit="Basis Points">
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </ChartContainer>
    );
  }

  if (!data) return null;

  const chartData = data.observations.map(obs => ({
    date: obs.date,
    slope: obs.value,
    displayDate: formatDate(obs.date),
  }));

  return (
    <ChartContainer
      title="Yield Curve Slope (10Y-2Y)"
      unit="Basis Points"
      description="Difference between 10-year and 2-year yields. Negative values indicate inversion."
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorSlope" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value as number;
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                    <p className="text-xs text-gray-500">{payload[0].payload.displayDate}</p>
                    <p className="text-sm font-semibold">{formatBps(value)}</p>
                    {value < 0 && (
                      <p className="text-xs text-red-600 mt-1">Inverted</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine y={0} stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" />
          <Area type="monotone" dataKey="slope" stroke="#0ea5e9" strokeWidth={2} fill="url(#colorSlope)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
