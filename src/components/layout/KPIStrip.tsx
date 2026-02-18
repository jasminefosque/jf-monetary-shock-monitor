import React from 'react';
import { useLatestValue } from '@/hooks/useData';
import { useAppStore } from '@/app/store';
import { formatPercent, formatBps, formatNumber } from '@/lib/utils';

interface KPICardProps {
  metricId: string;
  label: string;
  unit: 'percent' | 'bps' | 'index';
}

function KPICard({ metricId, label, unit }: KPICardProps) {
  const { startDate, endDate, geography } = useAppStore();
  const { value, loading } = useLatestValue(metricId, { start_date: startDate, end_date: endDate, geography });

  const formatValue = (val: number | null) => {
    if (val === null) return '--';
    switch (unit) {
      case 'percent':
        return formatPercent(val);
      case 'bps':
        return formatBps(val);
      case 'index':
        return formatNumber(val);
      default:
        return formatNumber(val);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-gray-900">
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
        ) : (
          formatValue(value)
        )}
      </div>
    </div>
  );
}

export function KPIStrip() {
  return (
    <div className="grid grid-cols-6 gap-4 mb-6">
      <KPICard metricId="policy_rate_target" label="Policy Rate" unit="percent" />
      <KPICard metricId="yield_10y" label="10Y Yield" unit="percent" />
      <KPICard metricId="curve_slope_10y_2y" label="Curve Slope" unit="bps" />
      <KPICard metricId="real_policy_rate" label="Real Policy Rate" unit="percent" />
      <KPICard metricId="liquidity_stress_index" label="Liquidity Stress" unit="index" />
      <KPICard metricId="risk_off_composite" label="Risk-Off Index" unit="index" />
    </div>
  );
}
