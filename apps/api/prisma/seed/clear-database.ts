import { PrismaClient } from '@prisma/client';

const TABLES = [
  'log_auditoria',
  'hist_atendimento',
  'atendimento',
  'resgate_beneficio',
  'movimentacao_pontos',
  'cliente_fidelidade',
  'beneficio',
  'programa_fidelidade',
  'promocao_produto',
  'promocao_unidade',
  'cupom',
  'promocao',
  'hist_status_pedido',
  'pagamento',
  'item_pedido',
  'pedido',
  'estoque_produto',
  'estoque',
  'produto',
  'funcionario',
  'cliente',
  'usuario_perfil',
  'unidade',
  'usuario',
  'perfil',
];

export async function clearDatabase(prisma: PrismaClient): Promise<void> {
  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${TABLES.map((table) => `"${table}"`).join(', ')} RESTART IDENTITY CASCADE`,
  );
}
