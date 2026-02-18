import type { DataProvider } from '../DataProvider';
import type { TimeSeries, ShockEvent, MetricMetadata, QueryParams } from '@/models/schema';

/**
 * Open Data Provider - Stub Implementation
 * 
 * This is a placeholder showing how to integrate with open data sources.
 * To implement:
 * 1. Choose open data sources (e.g., FRED API, ECB Data Portal)
 * 2. Add API client integration
 * 3. Map external data to our TimeSeries schema
 * 4. Handle rate limits and caching
 * 
 * IMPORTANT: Do not commit API keys. Use environment variables.
 */
export class OpenDataProvider implements DataProvider {
  private apiKey?: string;

  constructor() {
    // Load API key from environment if provided
    this.apiKey = import.meta.env.VITE_FRED_API_KEY;
    
    if (!this.apiKey) {
      console.warn(
        'OpenDataProvider: No API key found. Set VITE_FRED_API_KEY in .env to enable real data.'
      );
    }
  }

  async getSeries(metricId: string, params?: QueryParams): Promise<TimeSeries> {
    // TODO: Implement API calls to open data sources
    // Example implementation for FRED API:
    // 
    // const seriesMap = {
    //   'policy_rate_target': 'DFF', // Federal Funds Rate
    //   'yield_2y': 'DGS2',
    //   'yield_10y': 'DGS10',
    //   'inflation_yoy': 'CPIAUCSL',
    // };
    //
    // const fredSeriesId = seriesMap[metricId];
    // if (!fredSeriesId) {
    //   throw new Error(`No mapping for metric: ${metricId}`);
    // }
    //
    // const response = await fetch(
    //   `https://api.stlouisfed.org/fred/series/observations?` +
    //   `series_id=${fredSeriesId}&api_key=${this.apiKey}&file_type=json`
    // );
    //
    // const data = await response.json();
    // return transformFredToTimeSeries(data, metricId);

    throw new Error(
      `OpenDataProvider not fully implemented. ` +
      `Add your implementation for metric: ${metricId}. ` +
      `See src/data/adapters/OpenDataProvider.ts for guidance.`
    );
  }

  async getLatest(metricId: string, params?: QueryParams): Promise<number | null> {
    // TODO: Optimize to fetch only latest value if API supports it
    const series = await this.getSeries(metricId, params);
    if (series.observations.length === 0) return null;
    return series.observations[series.observations.length - 1].value;
  }

  async getMetadata(metricId: string): Promise<MetricMetadata> {
    // TODO: Fetch metadata from API or maintain local mapping
    throw new Error(
      `OpenDataProvider.getMetadata not implemented for: ${metricId}`
    );
  }

  async getShockEvents(params?: QueryParams): Promise<ShockEvent[]> {
    // TODO: Implement event detection or manual curation
    // Options:
    // 1. Manual curated list based on historical research
    // 2. Algorithmic detection from data (e.g., volatility spikes)
    // 3. Integration with news/event APIs
    
    console.warn('OpenDataProvider: Shock events not available in open mode');
    return [];
  }
}

/**
 * Helper function to transform FRED API response to TimeSeries
 * (Template - not implemented)
 */
// function transformFredToTimeSeries(fredData: any, metricId: string): TimeSeries {
//   return {
//     metric_id: metricId,
//     label: fredData.series_name || metricId,
//     unit: fredData.units || 'unknown',
//     frequency: 'daily',
//     observations: fredData.observations.map((obs: any) => ({
//       date: obs.date,
//       value: parseFloat(obs.value),
//     })),
//     geography: 'United States',
//   };
// }
