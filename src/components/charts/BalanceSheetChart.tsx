
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartContainer } from './ChartContainer';
import { useTimeSeries } from '@/hooks/useData';
import { useAppStore } from '@/app/store';
import { formatDate, formatNumber } from '@/lib/utils';

export function BalanceSheetChart() {
  const { startDate, endDate, geography } = useAppStore();
  const { data: balanceSheetData, loading: loadingBS } = useTimeSeries('central_bank_balance_sheet_index', { start_date: startDate, end_date: endDate, geography });
  const { data: moneyGrowthData, loading: loadingMG } = useTimeSeries('money_growth_yoy', { start_date: startDate, end_date: endDate, geography });

  if (loadingBS || loadingMG) {
    return (
      <ChartContainer title="Balance Sheet & Money Growth" unit="Index / Percent">
        <div className="h-80 flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      </ChartContainer>
    );
  }

  if (!balanceSheetData || !moneyGrowthData) return null;

  const chartData = balanceSheetData.observations.map((obs, i) => ({
    date: obs.date,
    balanceSheet: obs.value,
    moneyGrowth: moneyGrowthData.observations[i]?.value || 0,
    displayDate: formatDate(obs.date),
  }));

  return (
    <ChartContainer
      title="Central Bank Balance Sheet & Money Growth"
      unit="Index / Percent"
      description="Central bank balance sheet index (left) and money supply growth YoY (right)"
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
          <YAxis yAxisId="left" tick={{ fontSize: 12 }} label={{ value: 'Index', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} label={{ value: 'YoY %', angle: 90, position: 'insideRight', style: { fontSize: 12 } }} />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
                    <p className="text-xs text-gray-500 mb-1">{payload[0].payload.displayDate}</p>
                    <p className="text-xs">Balance Sheet: <span className="font-semibold">{formatNumber(payload[0].payload.balanceSheet)}</span></p>
                    <p className="text-xs">Money Growth: <span className="font-semibold">{formatNumber(payload[0].payload.moneyGrowth)}%</span></p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Line yAxisId="left" type="monotone" dataKey="balanceSheet" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Balance Sheet" />
          <Line yAxisId="right" type="monotone" dataKey="moneyGrowth" stroke="#10b981" strokeWidth={2} dot={false} name="Money Growth" />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-sky-500" />
          <span>Balance Sheet Index</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-emerald-500" />
          <span>Money Growth YoY</span>
        </div>
      </div>
    </ChartContainer>
  );
}
