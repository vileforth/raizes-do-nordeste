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
  pointsCost: number;
  active: boolean;
};

export function getLoyaltyProgram() {
  return apiGet<LoyaltyProgram>('/loyalty/program');
}

export function getBenefits() {
  return apiGet<Benefit[]>('/benefits');
}

export function redeemBenefit(benefitId: number, clientId: number) {
  return apiPost(`/benefits/${benefitId}/redeem`, { clientId });
}
