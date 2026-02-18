import { useState, useEffect } from 'react';
import type { TimeSeries, QueryParams, ShockEvent } from '@/models/schema';
import { getDataProvider } from '@/data/dataProviderFactory';

/**
 * Hook to fetch time series data
 */
export function useTimeSeries(metricId: string, params?: QueryParams) {
  const [data, setData] = useState<TimeSeries | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const provider = getDataProvider();
        const series = await provider.getSeries(metricId, params);
        if (!cancelled) {
          setData(series);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [metricId, params?.start_date, params?.end_date, params?.geography]);

  return { data, loading, error };
}

/**
 * Hook to fetch latest value
 */
export function useLatestValue(metricId: string, params?: QueryParams) {
  const [value, setValue] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const provider = getDataProvider();
        const latest = await provider.getLatest(metricId, params);
        if (!cancelled) {
          setValue(latest);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [metricId, params?.start_date, params?.end_date, params?.geography]);

  return { value, loading, error };
}

/**
 * Hook to fetch shock events
 */
export function useShockEvents(params?: QueryParams) {
  const [events, setEvents] = useState<ShockEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        const provider = getDataProvider();
        const eventsList = await provider.getShockEvents(params);
        if (!cancelled) {
          setEvents(eventsList);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Unknown error'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [params?.start_date, params?.end_date]);

  return { events, loading, error };
}
