import { apiGet, apiPost } from '@/lib/api';
import { toQueryString, type ListQuery } from '@/lib/list-query';
import type { Paginated } from './_factory/create-resource';

export type LoyaltyProgram = {
  id: number;
  name: string;
  description: string;
  status: string;
};

export type Benefit = {
  id: number;
  name: string;
  requiredPoints?: number;
  pointsCost?: number;
  active: boolean;
};

export type ClientLoyalty = {
  id: number;
  clientId: number;
  pointsBalance: number;
  level: string;
  status: string;
};

export function getLoyaltyProgram() {
  return apiGet<LoyaltyProgram>('/loyalty/program');
}

export function getBenefits(params?: ListQuery) {
  return apiGet<Paginated<Benefit>>(`/benefits${toQueryString(params)}`);
}

export function getClientLoyalty(clientId: number) {
  return apiGet<ClientLoyalty>(`/clients/${clientId}/loyalty`);
}

export function redeemBenefit(benefitId: number, clientId: number) {
  return apiPost(`/benefits/${benefitId}/redeem`, { clientId });
}

export function benefitPoints(benefit: Benefit) {
  return benefit.requiredPoints ?? benefit.pointsCost ?? 0;
}
