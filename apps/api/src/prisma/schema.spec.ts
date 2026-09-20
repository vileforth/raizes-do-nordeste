import { readFileSync } from 'fs';
import { join } from 'path';

const EXPECTED_TABLES = [
  'usuario',
  'perfil',
  'usuario_perfil',
  'cliente',
  'funcionario',
  'unidade',
  'produto',
  'estoque',
  'estoque_produto',
  'pedido',
  'item_pedido',
  'pagamento',
  'hist_status_pedido',
  'promocao',
  'cupom',
  'promocao_unidade',
  'promocao_produto',
  'programa_fidelidade',
  'cliente_fidelidade',
  'movimentacao_pontos',
  'beneficio',
  'resgate_beneficio',
  'atendimento',
  'hist_atendimento',
  'log_auditoria',
];

describe('Prisma schema', () => {
  it('maps all 24 domain tables', () => {
    const schemaPath = join(__dirname, '..', '..', 'prisma', 'schema.prisma');
    const schemaContent = readFileSync(schemaPath, 'utf-8');

    for (const tableName of EXPECTED_TABLES) {
      expect(schemaContent).toMatch(new RegExp(`@@map\\("${tableName}"\\)`));
    }
  });
});
