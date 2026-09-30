# Plano de testes

Os testes unitários foram executados em 30/09/2026. A contagem está em [13-metricas.md](13-metricas.md) e o detalhe em [06-relatorio-de-testes.md](06-relatorio-de-testes.md): 202 casos, nenhuma falha, Prisma e serviços externos mockados.

Integração de ponta a ponta, UAT, usabilidade, carga, pentest e mobile não foram executados contra o Supabase nem contra 500 usuários. Cada cenário abaixo indica se já existe caso na suíte ou se o texto é apenas descrição.

## Unitário (executado)

| Suíte | Arquivo | Cobertura |
| --- | --- | --- |
| Pedido | `orders.service.spec.ts` | RECEBIDO, estoque insuficiente, produto inativo |
| Status | `order-status.machine.spec.ts` | Transições da máquina |
| Pagamento | `payments.service.spec.ts` | Criação, confirmação mock, valor divergente |
| Estoque | `stock.service.spec.ts` | Escopo do gerente |
| Cupom | `coupons.service.spec.ts` | Ativo, inativo, vencido, inexistente |
| Sessão | `session-redirect.test.ts`, `session-refresh.test.ts` | Encerrar sessão e renovar uma vez |

Esta seção não reexecuta a suíte. A data da evidência permanece 30/09/2026.

## Regressão (procedimento)

Após correção em pedido, pagamento, estoque, cupom ou sessão:

```powershell
pnpm --filter @raizes/api exec jest src/orders src/payments src/stock src/coupons
pnpm --filter @raizes/web exec vitest run src/lib/auth src/schemas/login.schema.test.ts
```

O procedimento está registrado. Não há segunda execução anexada neste arquivo.

## Cenários

Doze cenários, positivos e negativos, cobrindo sistema, integração, segurança, usabilidade, carga e aceitação.

### TS01 — Senha inválida (negativo)

- Entrada: e-mail cadastrado e senha curta ou incorreta.
- Saída esperada: a sessão não abre.
- Mensagem: `E-mail ou senha inválidos.`
- Tipo: segurança.
- Evidência: o schema de login recusa senha curta. O fluxo completo de tela não está automatizado.

### TS02 — Cadastro sem consentimento (negativo)

- Entrada: dados válidos e checkbox desmarcado.
- Saída esperada: `POST /auth/register` não dispara.
- Tipo: LGPD.
- Evidência: medida no schema. `privacyConsent` é obrigatório.

### TS03 — Estoque insuficiente (negativo)

- Entrada: quantidade maior que o saldo da unidade.
- Saída esperada: o pedido não é criado.
- Tipo: sistema.
- Evidência: medida em `rejects insufficient stock`. Integração com o banco real não entra.

### TS04 — Pedido válido (positivo)

- Entrada: cliente, unidade e item ativo com saldo.
- Saída esperada: código único, status RECEBIDO e histórico.
- Tipo: sistema.
- Evidência: medida em `creates order with RECEBIDO status and history`.

### TS05 — Pagamento simulado (positivo)

- Entrada: pagamento pendente no valor do pedido.
- Saída esperada: status pago e `paidAt` preenchido. Nenhum gateway é chamado.
- Tipo: integração (mock).
- Evidência: medida no serviço. A ausência de adquirente faz parte do escopo.

### TS06 — Cupom vencido (negativo)

- Entrada: código com validade no passado.
- Saída esperada: a validação falha.
- Tipo: sistema.
- Evidência: medida em `rejects expired coupon`.

### TS07 — Gerente em outra unidade (negativo)

- Entrada: gerente da unidade A consulta estoque da unidade B.
- Saída esperada: acesso negado.
- Tipo: segurança.
- Evidência: medida em `blocks manager from another unit stock`.

### TS08 — Sessão expirada (negativo)

- Entrada: cookie vencido e refresh recusado.
- Saída esperada: cookies apagados e redirecionamento para `/login`.
- Tipo: segurança.
- Evidência: medida no cliente. A renovação com o Supabase em produção não foi cronometrada.

### TS09 — Valor divergente no pagamento (negativo)

- Entrada: confirmação com valor diferente do pedido.
- Saída esperada: o pagamento permanece pendente.
- Tipo: integração.
- Evidência: medida em `rejects value mismatch on confirm`.

### TS10 — Compra no mobile (positivo, sem execução)

- Entrada: viewport de 390 px, login, carrinho, pedido e pagamento.
- Saída esperada: formulários usáveis e no máximo três ações depois do carrinho.
- Tipo: usabilidade.
- Evidência: sem gravação de sessão e sem cronômetro.

### TS11 — Carga de 500 usuários (positivo, sem execução)

- Entrada: 500 sessões criando pedido na mesma unidade, durante um minuto.
- Saída esperada: P95 abaixo de 2 s, disponibilidade da API acima de 99,5% e taxa de erro abaixo de 2%.
- Tipo: carga.
- Evidência: nenhuma ferramenta de carga foi executada.

### TS12 — Pedido no balcão (UAT, sem execução)

- Entrada: atendente cria pedido de retirada.
- Saída esperada: status RECEBIDO e tipo `RETIRADA_NO_BALCAO`.
- Tipo: aceitação.
- Evidência: sem ata assinada por representante da franquia.

## Dados de teste

| Dado | Uso |
| --- | --- |
| Conta de administrador do ambiente de desenvolvimento | Login e homologação manual |
| Unidade Recife e produto ativo do seed | Pedido e estoque |
| Cupom vencido | TS06 |
| Viewport 390 × 844 | TS10 |

## Ambiente

API em `http://localhost:3001`. Web em `http://localhost:4000`. O Supabase entra só na conferência manual. A suíte automatizada não o utiliza.
