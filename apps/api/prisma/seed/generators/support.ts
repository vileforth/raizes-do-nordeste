import { AuditAction, Prisma, SupportStatus, SupportType } from '@prisma/client';
import { SEED_COUNTS } from '../counts';
import { createSeedFaker, padCode, pick } from '../helpers';

const TICKET_TEMPLATES: Array<{ type: SupportType; description: string }> = [
  { type: SupportType.PEDIDO, description: 'Meu pedido saiu incompleto, faltou a batata frita.' },
  { type: SupportType.PEDIDO, description: 'O combo Sertão demorou mais de 30 minutos na unidade.' },
  { type: SupportType.PAGAMENTO, description: 'O pagamento via Pix foi debitado, mas o pedido não confirmou.' },
  { type: SupportType.PAGAMENTO, description: 'Quero a nota fiscal do pedido feito ontem no Recife.' },
  { type: SupportType.FIDELIDADE, description: 'Os pontos da compra de sábado não caíram no Clube Raízes.' },
  { type: SupportType.FIDELIDADE, description: 'Não consegui resgatar a tapioca cortesia no aplicativo.' },
  { type: SupportType.SUPORTE, description: 'O cupom RAIZES10 não aplicou no balcão de Boa Viagem.' },
  { type: SupportType.SUPORTE, description: 'Gostaria de atualizar o telefone da minha conta.' },
];

const STATUS_FLOW: SupportStatus[][] = [
  [SupportStatus.ABERTO],
  [SupportStatus.ABERTO, SupportStatus.EM_ATENDIMENTO],
  [SupportStatus.ABERTO, SupportStatus.EM_ATENDIMENTO, SupportStatus.RESOLVIDO],
  [SupportStatus.ABERTO, SupportStatus.EM_ATENDIMENTO, SupportStatus.RESOLVIDO, SupportStatus.FECHADO],
  [SupportStatus.ABERTO, SupportStatus.CANCELADO],
];

export function buildSupport(staffUserIds: number[]) {
  const faker = createSeedFaker();
  const tickets: Prisma.SupportTicketCreateManyInput[] = [];
  const histories: Prisma.SupportHistoryCreateManyInput[] = [];
  const audits: Prisma.AuditLogCreateManyInput[] = [];

  for (let id = 1; id <= SEED_COUNTS.supportTickets; id += 1) {
    const template = pick(faker, TICKET_TEMPLATES);
    const flow = pick(faker, STATUS_FLOW);
    const openedAt = faker.date.between({ from: '2025-10-01', to: '2026-09-18' });
    const responsibleUserId = pick(faker, staffUserIds);
    tickets.push({
      id,
      clientId: ((id - 1) % SEED_COUNTS.clients) + 1,
      responsibleUserId,
      protocol: padCode('ATD', id, 6),
      type: template.type,
      description: template.description,
      status: flow[flow.length - 1],
      openedAt,
      updatedAt: openedAt,
    });
    flow.forEach((status, index) => {
      if (histories.length >= SEED_COUNTS.supportHistories) return;
      histories.push({
        id: histories.length + 1,
        supportTicketId: id,
        userId: responsibleUserId,
        status,
        notes:
          status === SupportStatus.ABERTO
            ? 'Chamado aberto pelo cliente'
            : status === SupportStatus.EM_ATENDIMENTO
              ? 'Atendente assumiu o chamado'
              : status === SupportStatus.RESOLVIDO
                ? 'Solução aplicada e validada com o cliente'
                : status === SupportStatus.FECHADO
                  ? 'Chamado encerrado'
                  : 'Chamado cancelado a pedido do cliente',
        occurredAt: new Date(openedAt.getTime() + index * 45 * 60_000),
      });
    });
  }

  while (histories.length < SEED_COUNTS.supportHistories) {
    const ticketId = ((histories.length - 1) % SEED_COUNTS.supportTickets) + 1;
    histories.push({
      id: histories.length + 1,
      supportTicketId: ticketId,
      userId: pick(faker, staffUserIds),
      status: SupportStatus.EM_ATENDIMENTO,
      notes: 'Cliente retornou com complemento da solicitação',
      occurredAt: faker.date.between({ from: '2025-10-01', to: '2026-09-18' }),
    });
  }

  const entities = ['pedido', 'cliente', 'promocao', 'cupom', 'unidade', 'produto'];
  for (let id = 1; id <= SEED_COUNTS.auditLogs; id += 1) {
    audits.push({
      id,
      userId: pick(faker, staffUserIds),
      action: pick(faker, [
        AuditAction.LOGIN,
        AuditAction.CONSULTAR,
        AuditAction.CRIAR,
        AuditAction.ALTERAR,
        AuditAction.ALTERAR_STATUS,
        AuditAction.PAGAMENTO,
        AuditAction.APLICAR_CUPOM,
        AuditAction.CADASTRO,
      ]),
      entity: pick(faker, entities),
      entityId: faker.number.int({ min: 1, max: 200 }),
      occurredAt: faker.date.between({ from: '2025-09-21', to: '2026-09-21' }),
      details: 'Registro automático da operação no painel.',
    });
  }

  return { tickets, histories, audits };
}
