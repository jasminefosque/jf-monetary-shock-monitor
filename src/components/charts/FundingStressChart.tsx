
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useTimeSeries } from '@/hooks/useData';
import { useAppStore } from '@/app/store';
import { formatDate, formatBps } from '@/lib/utils';

export function FundingStressChart() {
  const { startDate, endDate, geography } = useAppStore();
  const { data, loading } = useTimeSeries('funding_stress_proxy', { start_date: startDate, end_date: endDate, geography });

  if (loading) {
    return (
      <ChartContainer title="Funding Stress Proxy" unit="Basis Points">
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
      title="Funding Stress Proxy"
      unit="Basis Points"
      description="Short-term funding market stress indicator. Higher values indicate greater funding pressure."
    >
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
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
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                    <p className="text-xs text-gray-500">{payload[0].payload.displayDate}</p>
                    <p className="text-sm font-semibold">{formatBps(payload[0].value as number)}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area type="monotone" dataKey="stress" stroke="#f59e0b" strokeWidth={2} fill="url(#colorFunding)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
