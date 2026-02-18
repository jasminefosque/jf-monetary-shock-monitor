import type { DataProvider } from '../DataProvider';
import type { TimeSeries, ShockEvent, MetricMetadata, QueryParams } from '@/models/schema';
import { generateAllMetrics, generateShockEvents } from './generator';
import { METRIC_DEFINITIONS } from '@/domains/monetaryShock/metricDefinitions';

/**
 * Synthetic data provider implementation
 * Generates realistic monetary shock data on the fly
 */
export class SyntheticDataProvider implements DataProvider {
  private data: Record<string, TimeSeries>;
  private events: ShockEvent[];
  private readonly startDate: string;
  private readonly endDate: string;

  constructor(startDate: string = '2022-01-01', endDate: string = '2024-12-31') {
    this.startDate = startDate;
    this.endDate = endDate;
    this.data = generateAllMetrics(startDate, endDate);
    this.events = generateShockEvents(startDate, endDate);
  }

  async getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries> {
    const series = this.data[metricId];
    if (!series) {
      throw new Error(`Metric not found: ${metricId}`);
    }

    // Filter by date range if provided
    if (params?.start_date || params?.end_date) {
      const filtered = { ...series };
      filtered.observations = series.observations.filter(obs => {
        const date = obs.date;
        if (params.start_date && date < params.start_date) return false;
        if (params.end_date && date > params.end_date) return false;
        return true;
      });
      return filtered;
    }

    return series;
  }

  async getLatest(metricId: string, params?: QueryParams): Promise<number | null> {
    const series = await this.getSeries(metricId, params);
    if (series.observations.length === 0) return null;
    return series.observations[series.observations.length - 1].value;
  }

  async getMetadata(metricId: string): Promise<MetricMetadata> {
    const definition = METRIC_DEFINITIONS[metricId];
    if (!definition) {
      throw new Error(`Metric metadata not found: ${metricId}`);
    }
    return definition;
  }

  async getShockEvents(params?: QueryParams): Promise<ShockEvent[]> {
    let filtered = this.events;

    if (params?.start_date || params?.end_date) {
      filtered = this.events.filter(event => {
        if (params.start_date && event.start_date < params.start_date) return false;
        if (params.end_date && event.start_date > params.end_date) return false;
        return true;
      });
    }

    return filtered;
  }

  /**
   * Export current dataset as JSON
   */
  exportData(metricIds?: string[]): string {
    const metricsToExport = metricIds || Object.keys(this.data);
    const exportData = {
      metadata: {
        generated_at: new Date().toISOString(),
        start_date: this.startDate,
        end_date: this.endDate,
        mode: 'synthetic',
      },
      metrics: metricsToExport.reduce((acc, id) => {
        acc[id] = this.data[id];
        return acc;
      }, {} as Record<string, TimeSeries>),
      events: this.events,
    };

    return JSON.stringify(exportData, null, 2);
  }
}
