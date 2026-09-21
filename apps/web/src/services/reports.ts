import { apiGet } from '@/lib/api';
import type { Indicators } from '@/lib/helpers/kpi-mapper';

export type ReportQuery = {
  from?: string;
  to?: string;
  unitId?: number;
};

export function getIndicators(query: ReportQuery) {
  const params = new URLSearchParams();
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  if (query.unitId) params.set('unitId', String(query.unitId));
  const qs = params.toString();
  return apiGet<Indicators>(`/reports/indicators${qs ? `?${qs}` : ''}`);
}

export function getReport(type: string, query: ReportQuery) {
  const params = new URLSearchParams();
  if (query.from) params.set('from', query.from);
  if (query.to) params.set('to', query.to);
  if (query.unitId) params.set('unitId', String(query.unitId));
  const qs = params.toString();
  return apiGet<Record<string, unknown>[]>(`/reports/${type}${qs ? `?${qs}` : ''}`);
}
