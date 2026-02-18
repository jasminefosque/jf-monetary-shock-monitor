
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useTimeSeries } from '@/hooks/useData';
import { useAppStore } from '@/app/store';
import { formatDate, formatBps } from '@/lib/utils';

export function CreditSpreadsChart() {
  const { startDate, endDate, geography } = useAppStore();
  const { data: igData, loading: loadingIG } = useTimeSeries('ig_credit_spread', { start_date: startDate, end_date: endDate, geography });
  const { data: hyData, loading: loadingHY } = useTimeSeries('hy_credit_spread', { start_date: startDate, end_date: endDate, geography });

  if (loadingIG || loadingHY) {
    return (
      <ChartContainer title="Credit Spreads" unit="Basis Points">
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </ChartContainer>
    );
  }

  if (!igData || !hyData) return null;

  const chartData = igData.observations.map((obs, i) => ({
    date: obs.date,
    ig: obs.value,
    hy: hyData.observations[i]?.value || 0,
    displayDate: formatDate(obs.date),
  }));

  return (
    <ChartContainer
      title="Credit Spreads (IG vs HY)"
      unit="Basis Points"
      description="Investment grade and high yield corporate bond spreads over treasuries"
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
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                    <p className="text-xs text-gray-500 mb-1">{payload[0].payload.displayDate}</p>
                    <p className="text-xs">IG: <span className="font-semibold">{formatBps(payload[0].payload.ig)}</span></p>
                    <p className="text-xs">HY: <span className="font-semibold">{formatBps(payload[0].payload.hy)}</span></p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line yAxisId="left" type="monotone" dataKey="ig" stroke="#0ea5e9" strokeWidth={2} dot={false} name="IG" />
          <Line yAxisId="right" type="monotone" dataKey="hy" stroke="#f59e0b" strokeWidth={2} dot={false} name="HY" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-sky-500" />
          <span>Investment Grade (IG)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-amber-500" />
          <span>High Yield (HY)</span>
        </div>
      </div>
    </ChartContainer>
  );
}
