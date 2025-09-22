import { z } from "zod";

/** PRE — Detection */
export const AnomalyItemSchema = z.object({
  type: z.string(),
  month: z.string(),
  deviation_percent: z.number().optional(),
  description: z.string().optional(),
  severity: z.enum(["low", "medium", "high"])
});

export const AnomalyReportSchema = z.object({
  system_id: z.string(),
  anomalies_detected: z.array(AnomalyItemSchema),
  total_anomalies: z.number(),
  risk_assessment: z.string()
});

export const RiskScoreSchema = z.object({
  system_id: z.string(),
  overall_score: z.number(),
  breakdown: z.record(z.number()),
  recommendations: z.array(z.string())
});

/** outros schemas podem seguir a mesma linha… */
export type AnomalyReport = z.infer<typeof AnomalyReportSchema>;
export type RiskScore = z.infer<typeof RiskScoreSchema>;