import type { TimeSeries, ShockEvent, MetricMetadata, QueryParams } from '@/models/schema';

/**
 * Abstract interface for data providers
 * Allows swapping between synthetic and real data sources without changing UI code
 */
export interface DataProvider {
  /**
   * Get time series data for a specific metric
   */
  getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries>;

  /**
   * Get the latest value for a metric
   */
  getLatest(metricId: string, params?: QueryParams): Promise<number | null>;

  /**
   * Get metadata for a specific metric
   */
  getMetadata(metricId: string): Promise<MetricMetadata>;

  /**
   * Get all shock events within a date range
   */
  getShockEvents(params?: QueryParams): Promise<ShockEvent[]>;
}
