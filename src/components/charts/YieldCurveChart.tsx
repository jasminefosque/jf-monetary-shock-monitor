
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useTimeSeries } from '@/hooks/useData';
import { useAppStore } from '@/app/store';
import { formatDate, formatPercent } from '@/lib/utils';

export function YieldCurveChart() {
  const { startDate, endDate, geography } = useAppStore();
  const { data: data2y, loading: loading2y } = useTimeSeries('yield_2y', { start_date: startDate, end_date: endDate, geography });
  const { data: data10y, loading: loading10y } = useTimeSeries('yield_10y', { start_date: startDate, end_date: endDate, geography });
  const { data: inversionData } = useTimeSeries('curve_inversion_flag', { start_date: startDate, end_date: endDate, geography });

  if (loading2y || loading10y) {
    return (
      <ChartContainer title="Yield Curve (2Y vs 10Y)" unit="Percent">
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </ChartContainer>
    );
  }

  if (!data2y || !data10y) return null;

  const chartData = data2y.observations.map((obs, i) => ({
    date: obs.date,
    yield2y: obs.value,
    yield10y: data10y.observations[i]?.value || 0,
    inverted: inversionData?.observations[i]?.value === 1,
    displayDate: formatDate(obs.date),
  }));

  // Find inversion periods for shading
  const inversionPeriods: Array<{ start: string; end: string }> = [];
  let inversionStart: string | null = null;

  chartData.forEach((point, i) => {
    if (point.inverted && !inversionStart) {
      inversionStart = point.displayDate;
    } else if (!point.inverted && inversionStart) {
      inversionPeriods.push({ start: inversionStart, end: chartData[i - 1].displayDate });
      inversionStart = null;
    }
  });

  if (inversionStart) {
    inversionPeriods.push({ start: inversionStart, end: chartData[chartData.length - 1].displayDate });
  }

  return (
    <ChartContainer
      title="Yield Curve (2Y vs 10Y)"
      unit="Percent"
      description="2-year and 10-year Treasury yields with inversion periods highlighted"
    >
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          {inversionPeriods.map((period, i) => (
            <ReferenceArea
              key={i}
              x1={period.start}
              x2={period.end}
              fill="#fecaca"
              fillOpacity={0.3}
            />
          ))}
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
                    <p className="text-xs">2Y: <span className="font-semibold">{formatPercent(payload[0].value as number)}</span></p>
                    <p className="text-xs">10Y: <span className="font-semibold">{formatPercent(payload[1].value as number)}</span></p>
                    {payload[0].payload.inverted && (
                      <p className="text-xs text-red-600 mt-1 font-medium">Inverted</p>
                    )}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line type="monotone" dataKey="yield2y" stroke="#f59e0b" strokeWidth={2} dot={false} name="2Y" />
          <Line type="monotone" dataKey="yield10y" stroke="#0ea5e9" strokeWidth={2} dot={false} name="10Y" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-amber-500" />
          <span>2-Year Yield</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-sky-500" />
          <span>10-Year Yield</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-3 bg-red-200 opacity-50" />
          <span>Inversion Period</span>
        </div>
      </div>
    </ChartContainer>
  );
}
