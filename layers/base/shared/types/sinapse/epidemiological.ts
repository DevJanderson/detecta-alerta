import { z } from 'zod'

// ============================================================================
// Tipos base
// ============================================================================

export type AggregationLevel = 'unit' | 'city' | 'state' | 'region'
export type TrendType = 'up' | 'down' | 'stable'
export type AlertStatus = 'green' | 'yellow' | 'red'

// ============================================================================
// Métricas de agregação epidemiológica
// ============================================================================

export interface EpidemiologicalMetrics {
  unit_name: string
  epidemiological_week: string
  location_lat: number | null
  location_lng: number | null
  average_occupancy_week: number
  data_points_week: number
  moving_avg_week: number
  z_score_week: number
  trend_week: TrendType
  average_occupancy_weekday: number
  data_points_weekday: number
  moving_avg_weekday: number
  z_score_weekday: number
  trend_weekday: TrendType
  alert_status: AlertStatus
  status_week: AlertStatus
  status_weekday: AlertStatus
  alert_reason: string | null
  warning: string | null
  vs_previous_week_week: number
  vs_previous_week_weekday: number
  calculated_at: string
  confidence_level: 'high' | 'medium' | 'low'
}

export interface EpidemiologicalAggregation {
  aggregation_level: AggregationLevel
  aggregation_key: string
  unit_type: string
  week_ending_date: string
  metrics: EpidemiologicalMetrics
  min_percentage: number
  max_percentage: number
  units_count: number
}

// ============================================================================
// Request / Response
// ============================================================================

export interface EpidemiologicalAggregationsParams {
  cursor?: string
  limit?: number
  order_by?: 'week_ending_date' | 'id'
  direction?: 'asc' | 'desc'
  aggregation_level?: AggregationLevel
  aggregation_key?: string
  state?: string
  region?: string
  unit_type?: string
  weeks?: number
}

export interface EpidemiologicalAggregationsResponse {
  data: EpidemiologicalAggregation[]
  pagination?: {
    next_cursor: string | null
    has_next: boolean
    limit: number
  }
}

// ============================================================================
// Zod schemas
// ============================================================================

const metricsSchema = z.object({
  unit_name: z.string(),
  epidemiological_week: z.string(),
  location_lat: z.number().nullable(),
  location_lng: z.number().nullable(),
  average_occupancy_week: z.number(),
  data_points_week: z.number(),
  moving_avg_week: z.number(),
  z_score_week: z.number(),
  trend_week: z.enum(['up', 'down', 'stable']),
  average_occupancy_weekday: z.number(),
  data_points_weekday: z.number(),
  moving_avg_weekday: z.number(),
  z_score_weekday: z.number(),
  trend_weekday: z.enum(['up', 'down', 'stable']),
  alert_status: z.enum(['green', 'yellow', 'red']),
  status_week: z.enum(['green', 'yellow', 'red']),
  status_weekday: z.enum(['green', 'yellow', 'red']),
  alert_reason: z.string().nullable(),
  warning: z.string().nullable(),
  vs_previous_week_week: z.number(),
  vs_previous_week_weekday: z.number(),
  calculated_at: z.string(),
  confidence_level: z.enum(['high', 'medium', 'low'])
})

export const epidemiologicalAggregationSchema = z.object({
  aggregation_level: z.enum(['unit', 'city', 'state', 'region']),
  aggregation_key: z.string(),
  unit_type: z.string(),
  week_ending_date: z.string(),
  metrics: metricsSchema,
  min_percentage: z.number(),
  max_percentage: z.number(),
  units_count: z.number()
})

export const epidemiologicalAggregationsResponseSchema = z.object({
  data: z.array(epidemiologicalAggregationSchema)
})
