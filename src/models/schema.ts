import { z } from 'zod';

/**
 * Frequency of time series observations
 */
export const FrequencySchema = z.enum(['daily', 'weekly', 'monthly', 'quarterly']);
export type Frequency = z.infer<typeof FrequencySchema>;

/**
 * Single observation in a time series
 */
export const ObservationSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // ISO 8601 date format
  value: z.number(),
});
export type Observation = z.infer<typeof ObservationSchema>;

/**
 * Core time series data structure
 */
export const TimeSeriesSchema = z.object({
  metric_id: z.string(),
  label: z.string(),
  unit: z.string(),
  frequency: FrequencySchema,
  observations: z.array(ObservationSchema),
  geography: z.string().optional(),
  notes: z.string().optional(),
});
export type TimeSeries = z.infer<typeof TimeSeriesSchema>;

/**
 * Shock event severity levels
 */
export const SeveritySchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);
export type Severity = z.infer<typeof SeveritySchema>;

/**
 * Shock event definition
 */
export const ShockEventSchema = z.object({
  event_id: z.string(),
  label: z.string(),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  severity: SeveritySchema,
  description: z.string(),
});
export type ShockEvent = z.infer<typeof ShockEventSchema>;

/**
 * Policy regime types
 */
export const PolicyRegimeSchema = z.enum(['easing', 'neutral', 'tightening', 'crisis']);
export type PolicyRegime = z.infer<typeof PolicyRegimeSchema>;

/**
 * Metric metadata
 */
export const MetricMetadataSchema = z.object({
  metric_id: z.string(),
  label: z.string(),
  description: z.string(),
  unit: z.string(),
  source_type: z.string(),
  expected_range: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
  }).optional(),
});
export type MetricMetadata = z.infer<typeof MetricMetadataSchema>;

/**
 * Data query parameters
 */
export const QueryParamsSchema = z.object({
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  geography: z.string().optional(),
});
export type QueryParams = z.infer<typeof QueryParamsSchema>;
