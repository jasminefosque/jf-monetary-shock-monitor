
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useTimeSeries, useShockEvents } from '@/hooks/useData';
import { useAppStore } from '@/app/store';
import { formatDate, formatNumber } from '@/lib/utils';

export function LiquidityStressChart() {
  const { startDate, endDate, geography, showEvents } = useAppStore();
  const { data, loading } = useTimeSeries('liquidity_stress_index', { start_date: startDate, end_date: endDate, geography });
  const { events } = useShockEvents({ start_date: startDate, end_date: endDate });

  if (loading) {
    return (
      <ChartContainer title="Liquidity Stress Index" unit="Index (0-100)">
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </ChartContainer>
    );
  }

  if (!data) return null;

  const chartData = data.observations.map(obs => ({
    date: obs.date,
    stress: obs.value,
    displayDate: formatDate(obs.date),
  }));

  return (
    <ChartContainer
      title="Liquidity Stress Index"
      unit="Index (0-100)"
      description="Composite measure of market liquidity stress. Higher values indicate greater stress."
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
          <YAxis tick={{ fontSize: 12 }} domain={[0, 100]} />
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
          {showEvents && events.filter(e => e.event_id.includes('liquidity') || e.event_id.includes('banking')).map((event) => (
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
              }}
            />
          ))}
          <Line type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
