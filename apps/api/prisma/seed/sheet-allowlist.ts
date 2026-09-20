export const SKIPPED_SHEET_NAMES = ['Resumo', 'LEIA-ME'] as const;

export const SEED_SHEET_NAMES = [
  'USUARIO',
  'PERFIL',
  'USUARIO_PERFIL',
  'CLIENTE',
  'FUNCIONARIO',
  'UNIDADE',
  'PRODUTO',
  'ESTOQUE',
  'ESTOQUE_PRODUTO',
  'PEDIDO',
  'ITEM_PEDIDO',
  'PAGAMENTO',
  'HIST_STATUS_PEDIDO',
  'PROMOCAO',
  'CUPOM',
  'PROMOCAO_UNIDADE',
  'PROMOCAO_PRODUTO',
  'PROGRAMA_FIDELIDADE',
  'CLIENTE_FIDELIDADE',
  'MOVIMENTACAO_PONTOS',
  'BENEFICIO',
  'RESGATE_BENEFICIO',
  'ATENDIMENTO',
  'HIST_ATENDIMENTO',
  'LOG_AUDITORIA',
] as const;

export type SeedSheetName = (typeof SEED_SHEET_NAMES)[number];

export function isSeedSheetName(sheetName: string): sheetName is SeedSheetName {
  return (SEED_SHEET_NAMES as readonly string[]).includes(sheetName);
}

export function isSkippedSheetName(sheetName: string): boolean {
  return (SKIPPED_SHEET_NAMES as readonly string[]).includes(sheetName);
}

export function filterSeedSheetNames(sheetNames: string[]): SeedSheetName[] {
  return sheetNames.filter(isSeedSheetName);
}
