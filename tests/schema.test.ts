import { describe, it, expect } from 'vitest';
import { TimeSeriesSchema, ShockEventSchema, ObservationSchema } from '../src/models/schema';

describe('Schema Validation', () => {
  describe('ObservationSchema', () => {
    it('should validate correct observation', () => {
      const observation = {
        date: '2024-01-01',
        value: 2.5,
      };

      const result = ObservationSchema.safeParse(observation);
      expect(result.success).toBe(true);
    });

    it('should reject invalid date format', () => {
      const observation = {
        date: '01/01/2024',
        value: 2.5,
      };

      const result = ObservationSchema.safeParse(observation);
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric value', () => {
      const observation = {
        date: '2024-01-01',
        value: 'invalid',
      };

      const result = ObservationSchema.safeParse(observation);
      expect(result.success).toBe(false);
    });
  });

  describe('TimeSeriesSchema', () => {
    it('should validate correct time series', () => {
      const timeSeries = {
        metric_id: 'policy_rate_target',
        label: 'Policy Rate',
        unit: 'percent',
        frequency: 'daily',
        observations: [
          { date: '2024-01-01', value: 2.5 },
          { date: '2024-01-02', value: 2.5 },
        ],
        geography: 'United States',
      };

      const result = TimeSeriesSchema.safeParse(timeSeries);
      expect(result.success).toBe(true);
    });

    it('should reject invalid frequency', () => {
      const timeSeries = {
        metric_id: 'policy_rate_target',
        label: 'Policy Rate',
        unit: 'percent',
        frequency: 'invalid',
        observations: [],
      };

      const result = TimeSeriesSchema.safeParse(timeSeries);
      expect(result.success).toBe(false);
    });
  });

  describe('ShockEventSchema', () => {
    it('should validate correct shock event', () => {
      const event = {
        event_id: 'test_event',
        label: 'Test Event',
        start_date: '2024-01-01',
        end_date: '2024-01-10',
        severity: 3,
        description: 'A test event',
      };

      const result = ShockEventSchema.safeParse(event);
      expect(result.success).toBe(true);
    });

    it('should allow missing end_date', () => {
      const event = {
        event_id: 'test_event',
        label: 'Test Event',
        start_date: '2024-01-01',
        severity: 3,
        description: 'A test event',
      };

      const result = ShockEventSchema.safeParse(event);
      expect(result.success).toBe(true);
    });

    it('should reject invalid severity', () => {
      const event = {
        event_id: 'test_event',
        label: 'Test Event',
        start_date: '2024-01-01',
        severity: 6,
        description: 'A test event',
      };

      const result = ShockEventSchema.safeParse(event);
      expect(result.success).toBe(false);
    });
  });
});
