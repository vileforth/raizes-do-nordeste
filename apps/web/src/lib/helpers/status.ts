export type StatusTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'muted';

const STATUS_TONE: Record<string, StatusTone> = {
  ATIVO: 'success',
  ATIVA: 'success',
  INATIVO: 'muted',
  INATIVA: 'muted',
  BLOQUEADO: 'danger',
  MANUTENCAO: 'warning',
  RECEBIDO: 'info',
  EM_PREPARACAO: 'warning',
  PRONTO: 'success',
  RETIRADO: 'muted',
  PENDENTE: 'warning',
  CONFIRMADO: 'success',
  RECUSADO: 'danger',
  CANCELADO: 'danger',
  ENCERRADA: 'muted',
  AGENDADA: 'info',
  ABERTO: 'info',
  EM_ATENDIMENTO: 'warning',
  RESOLVIDO: 'success',
  FECHADO: 'muted',
  BRONZE: 'muted',
  PRATA: 'info',
  OURO: 'warning',
  CLIENTE: 'muted',
  ATENDENTE: 'info',
  COZINHEIRO: 'warning',
  GERENTE: 'success',
  ADMINISTRADOR: 'info',
};

export function humanizeStatus(code: string): string {
  if (!code) {
    return '';
  }
  const text = code.replace(/_/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function toneFor(status: string): StatusTone {
  return STATUS_TONE[status] ?? 'neutral';
}

export function statusFromBoolean(active: boolean): 'ATIVO' | 'INATIVO' {
  return active ? 'ATIVO' : 'INATIVO';
}
