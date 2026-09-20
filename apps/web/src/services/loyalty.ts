import { apiGet, apiPost } from '@/lib/api';

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

export function getBenefits() {
  return apiGet<Benefit[]>('/benefits');
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
