import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useTimeSeries, useShockEvents } from '@/hooks/useData';
import { useAppStore } from '@/app/store';
import { formatDate, formatNumber } from '@/lib/utils';

export function VolatilityChart() {
  const { startDate, endDate, geography, showEvents } = useAppStore();
  const { data, loading } = useTimeSeries('volatility_index_proxy', { start_date: startDate, end_date: endDate, geography });
  const { events } = useShockEvents({ start_date: startDate, end_date: endDate });

  if (loading) {
    return (
      <ChartContainer title="Volatility Index" unit="Index">
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </ChartContainer>
    );
  }

  if (!data) return null;

  const chartData = data.observations.map(obs => ({
    date: obs.date,
    volatility: obs.value,
    displayDate: formatDate(obs.date),
  }));

  return (
    <ChartContainer
      title="Volatility Index Proxy"
      unit="Index"
      description="Market volatility indicator (VIX-equivalent). Higher values indicate greater uncertainty."
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
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
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                    <p className="text-xs text-gray-500">{payload[0].payload.displayDate}</p>
                    <p className="text-sm font-semibold">{formatNumber(payload[0].value as number)}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          {showEvents && events.map((event) => (
            <ReferenceLine
              key={event.event_id}
              x={formatDate(event.start_date)}
              stroke="#8b5cf6"
              strokeDasharray="3 3"
            />
          ))}
          <Line type="monotone" dataKey="volatility" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
