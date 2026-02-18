import { describe, it, expect } from 'vitest';
import {
  generateDates,
  generatePolicyRate,
  generateYields,
  generateShockEvents,
  generateAllMetrics,
} from '../src/data/synthetic/generator';

describe('Synthetic Data Generator', () => {
  describe('generateDates', () => {
    it('should generate daily dates correctly', () => {
      const dates = generateDates('2024-01-01', '2024-01-03', 'daily');
      expect(dates).toEqual(['2024-01-01', '2024-01-02', '2024-01-03']);
    });

    it('should generate weekly dates correctly', () => {
      const dates = generateDates('2024-01-01', '2024-01-15', 'weekly');
      expect(dates.length).toBe(3);
      expect(dates[0]).toBe('2024-01-01');
      expect(dates[1]).toBe('2024-01-08');
    });
  });

  describe('generatePolicyRate', () => {
    it('should generate valid policy rate series', () => {
      const dates = generateDates('2024-01-01', '2024-01-10', 'daily');
      const series = generatePolicyRate(dates);

      expect(series.metric_id).toBe('policy_rate_target');
      expect(series.observations).toHaveLength(dates.length);
      expect(series.frequency).toBe('daily');
      expect(series.unit).toBe('percent');

      // Check all values are reasonable
      series.observations.forEach(obs => {
        expect(obs.value).toBeGreaterThanOrEqual(0);
        expect(obs.value).toBeLessThanOrEqual(6);
      });
    });

    it('should produce consistent results with same seed', () => {
      const dates = generateDates('2024-01-01', '2024-01-05', 'daily');
      const series1 = generatePolicyRate(dates, 42);
      const series2 = generatePolicyRate(dates, 42);

      expect(series1.observations).toEqual(series2.observations);
    });
  });

  describe('generateYields', () => {
    it('should generate 2Y and 10Y yields', () => {
      const dates = generateDates('2024-01-01', '2024-01-10', 'daily');
      const policyRate = generatePolicyRate(dates);
      const { yield2y, yield10y } = generateYields(dates, policyRate);

      expect(yield2y.metric_id).toBe('yield_2y');
      expect(yield10y.metric_id).toBe('yield_10y');
      expect(yield2y.observations).toHaveLength(dates.length);
      expect(yield10y.observations).toHaveLength(dates.length);
    });
  });

  describe('generateShockEvents', () => {
    it('should generate shock events', () => {
      const events = generateShockEvents('2024-01-01', '2024-12-31');

      expect(events.length).toBeGreaterThan(0);
      events.forEach(event => {
        expect(event.event_id).toBeTruthy();
        expect(event.label).toBeTruthy();
        expect(event.start_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(event.severity).toBeGreaterThanOrEqual(1);
        expect(event.severity).toBeLessThanOrEqual(5);
        expect(event.description).toBeTruthy();
      });
    });

    it('should have expected event IDs', () => {
      const events = generateShockEvents('2024-01-01', '2024-12-31');
      const eventIds = events.map(e => e.event_id);

      expect(eventIds).toContain('inflation_surge');
      expect(eventIds).toContain('rapid_tightening_cycle');
      expect(eventIds).toContain('banking_stress');
      expect(eventIds).toContain('liquidity_crunch');
      expect(eventIds).toContain('recession_signal');
      expect(eventIds).toContain('policy_pivot');
    });
  });

  describe('generateAllMetrics', () => {
    it('should generate all required metrics', () => {
      const metrics = generateAllMetrics('2024-01-01', '2024-01-31');

      const requiredMetrics = [
        'policy_rate_target',
        'yield_2y',
        'yield_10y',
        'curve_slope_10y_2y',
        'curve_inversion_flag',
        'inflation_yoy',
        'real_policy_rate',
        'policy_rate_change_3m',
        'money_growth_yoy',
        'central_bank_balance_sheet_index',
        'liquidity_stress_index',
        'ig_credit_spread',
        'hy_credit_spread',
        'funding_stress_proxy',
        'volatility_index_proxy',
        'risk_off_composite',
      ];

      requiredMetrics.forEach(metricId => {
        expect(metrics[metricId]).toBeTruthy();
        expect(metrics[metricId].observations.length).toBeGreaterThan(0);
      });
    });
  });
});
