import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useTimeSeries, useShockEvents } from '@/hooks/useData';
import { useAppStore } from '@/app/store';
import { formatDate, formatPercent } from '@/lib/utils';

export function PolicyRateChart() {
  const { startDate, endDate, geography, showEvents, setSelectedEvent } = useAppStore();
  const { data, loading } = useTimeSeries('policy_rate_target', { start_date: startDate, end_date: endDate, geography });
  const { events } = useShockEvents({ start_date: startDate, end_date: endDate });

  if (loading) {
    return (
      <ChartContainer title="Policy Rate Timeline" unit="Percent">
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </ChartContainer>
    );
  }

  if (!data) return null;

  const chartData = data.observations.map(obs => ({
    date: obs.date,
    value: obs.value,
    displayDate: formatDate(obs.date),
  }));

  return (
    <ChartContainer
      title="Policy Rate Timeline"
      unit="Percent"
      description="Central bank policy rate target with shock event markers"
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
          <YAxis tick={{ fontSize: 12 }} domain={['auto', 'auto']} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                    <p className="text-xs text-gray-500">{payload[0].payload.displayDate}</p>
                    <p className="text-sm font-semibold">{formatPercent(payload[0].value as number)}</p>
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
              stroke="#ef4444"
              strokeDasharray="3 3"
              label={{
                value: event.label,
                position: 'top',
                fontSize: 10,
                fill: '#ef4444',
                cursor: 'pointer',
                onClick: () => setSelectedEvent(event),
              }}
            />
          ))}
          <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
