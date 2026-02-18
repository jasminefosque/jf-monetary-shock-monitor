import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useTimeSeries, useLatestValue } from '@/hooks/useData';
import { useAppStore } from '@/app/store';
import { formatDate, formatNumber } from '@/lib/utils';

export function RiskOffChart() {
  const { startDate, endDate, geography } = useAppStore();
  const { data, loading } = useTimeSeries('risk_off_composite', { start_date: startDate, end_date: endDate, geography });
  const { value: latestValue } = useLatestValue('risk_off_composite', { start_date: startDate, end_date: endDate, geography });

  if (loading) {
    return (
      <ChartContainer title="Risk-Off Composite" unit="Index (0-100)">
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </ChartContainer>
    );
  }

  if (!data) return null;

  const chartData = data.observations.map(obs => ({
    date: obs.date,
    riskOff: obs.value,
    displayDate: formatDate(obs.date),
  }));

  const getRiskLevel = (value: number | null): { label: string; color: string } => {
    if (value === null) return { label: '--', color: 'text-gray-500' };
    if (value < 30) return { label: 'Low', color: 'text-green-600' };
    if (value < 50) return { label: 'Moderate', color: 'text-yellow-600' };
    if (value < 70) return { label: 'Elevated', color: 'text-orange-600' };
    return { label: 'High', color: 'text-red-600' };
  };

  const riskLevel = getRiskLevel(latestValue);

  return (
    <ChartContainer
      title="Risk-Off Composite Index"
      unit="Index (0-100)"
      description="Composite measure of risk aversion across markets. Higher values indicate flight to safety."
    >
      <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
        <div>
          <div className="text-xs text-gray-500 uppercase tracking-wide">Current Risk Sentiment</div>
          <div className={`text-2xl font-bold mt-1 ${riskLevel.color}`}>
            {latestValue !== null ? formatNumber(latestValue) : '--'}
          </div>
        </div>
        <div className={`text-lg font-semibold ${riskLevel.color}`}>
          {riskLevel.label}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="displayDate"
            tick={{ fontSize: 12 }}
            interval="preserveStartEnd"
            minTickGap={50}
          />
          <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const value = payload[0].value as number;
                const level = getRiskLevel(value);
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                    <p className="text-xs text-gray-500">{payload[0].payload.displayDate}</p>
                    <p className="text-sm font-semibold">{formatNumber(value)}</p>
                    <p className={`text-xs font-medium mt-1 ${level.color}`}>{level.label}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line type="monotone" dataKey="riskOff" stroke="#dc2626" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
