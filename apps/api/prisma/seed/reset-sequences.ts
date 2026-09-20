import { PrismaClient } from '@prisma/client';

const SEQUENCE_TARGETS: Array<{ table: string; column: string }> = [
  { table: 'usuario', column: 'id_usuario' },
  { table: 'perfil', column: 'id_perfil' },
  { table: 'cliente', column: 'id_cliente' },
  { table: 'funcionario', column: 'id_funcionario' },
  { table: 'unidade', column: 'id_unidade' },
  { table: 'produto', column: 'id_produto' },
  { table: 'estoque', column: 'id_estoque' },
  { table: 'estoque_produto', column: 'id_estoque_produto' },
  { table: 'pedido', column: 'id_pedido' },
  { table: 'item_pedido', column: 'id_item_pedido' },
  { table: 'pagamento', column: 'id_pagamento' },
  { table: 'hist_status_pedido', column: 'id_historico_status' },
  { table: 'promocao', column: 'id_promocao' },
  { table: 'cupom', column: 'id_cupom' },
  { table: 'programa_fidelidade', column: 'id_programa' },
  { table: 'cliente_fidelidade', column: 'id_cliente_fidelidade' },
  { table: 'movimentacao_pontos', column: 'id_movimentacao' },
  { table: 'beneficio', column: 'id_beneficio' },
  { table: 'resgate_beneficio', column: 'id_resgate' },
  { table: 'atendimento', column: 'id_atendimento' },
  { table: 'hist_atendimento', column: 'id_historico' },
  { table: 'log_auditoria', column: 'id_log' },
];

export async function resetSeedSequences(prisma: PrismaClient): Promise<void> {
  for (const target of SEQUENCE_TARGETS) {
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('${target.table}', '${target.column}'), COALESCE((SELECT MAX("${target.column}") FROM "${target.table}"), 1), true)`,
    );
  }
}
