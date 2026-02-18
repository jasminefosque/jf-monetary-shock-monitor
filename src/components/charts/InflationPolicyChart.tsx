import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useTimeSeries } from '@/hooks/useData';
import { useAppStore } from '@/app/store';
import { formatDate, formatPercent } from '@/lib/utils';

export function InflationPolicyChart() {
  const { startDate, endDate, geography } = useAppStore();
  const { data: policyData, loading: loadingPolicy } = useTimeSeries('policy_rate_target', { start_date: startDate, end_date: endDate, geography });
  const { data: inflationData, loading: loadingInflation } = useTimeSeries('inflation_yoy', { start_date: startDate, end_date: endDate, geography });
  const { data: realRateData, loading: loadingReal } = useTimeSeries('real_policy_rate', { start_date: startDate, end_date: endDate, geography });

  if (loadingPolicy || loadingInflation || loadingReal) {
    return (
      <ChartContainer title="Inflation vs Policy Rate" unit="Percent">
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </ChartContainer>
    );
  }

  if (!policyData || !inflationData || !realRateData) return null;

  const chartData = policyData.observations.map((obs, i) => ({
    date: obs.date,
    policyRate: obs.value,
    inflation: inflationData.observations[i]?.value || 0,
    realRate: realRateData.observations[i]?.value || 0,
    displayDate: formatDate(obs.date),
  }));

  return (
    <ChartContainer
      title="Inflation vs Policy Rate"
      unit="Percent"
      description="Policy rate, inflation, and real policy rate (policy minus inflation)"
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
                    <p className="text-xs text-gray-500 mb-1">{payload[0].payload.displayDate}</p>
                    <p className="text-xs">Policy Rate: <span className="font-semibold">{formatPercent(payload[0].payload.policyRate)}</span></p>
                    <p className="text-xs">Inflation: <span className="font-semibold">{formatPercent(payload[0].payload.inflation)}</span></p>
                    <p className="text-xs">Real Rate: <span className="font-semibold">{formatPercent(payload[0].payload.realRate)}</span></p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Line type="monotone" dataKey="policyRate" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Policy Rate" />
          <Line type="monotone" dataKey="inflation" stroke="#ef4444" strokeWidth={2} dot={false} name="Inflation" />
          <Line type="monotone" dataKey="realRate" stroke="#10b981" strokeWidth={2} dot={false} name="Real Policy Rate" />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
