# Plano de testes

Unitários executados em 30/09/2026: 203 casos, nenhuma falha. Contagem e cobertura em [13-metricas.md](13-metricas.md) e [evidencias/suite-2026-09-30.md](evidencias/suite-2026-09-30.md).

Carga, estresse, UAT de campo e usabilidade cronometrada não rodaram contra o Supabase. Onde a suíte já prova a regra, a evidência cita o arquivo. Onde não rodou, o texto traz projeção.

## Unitário (executado)

| Suíte | Arquivo | Cobertura |
| --- | --- | --- |
| Pedido | `orders.service.spec.ts` | RECEBIDO, estoque baixo, produto inativo |
| Status | `order-status.machine.spec.ts` | Transições |
| Pagamento | `payments.service.spec.ts` | Mock e valor divergente |
| Estoque | `stock.service.spec.ts` | Escopo do gerente |
| Cupom | `coupons.service.spec.ts` | Ativo, inativo, vencido |
| Sessão | `session-redirect.test.ts`, `session-refresh.test.ts` | Encerrar e renovar |
| Nominatim | `geo.service.spec.ts` | 503 e endereço vazio |
| Resend | `email.service.spec.ts` | Sem chave e HTTP 502 |

## Regressão

```powershell
pnpm --filter @raizes/api exec jest src/orders src/payments src/stock src/coupons src/geo src/email
pnpm --filter @raizes/web exec vitest run src/lib/auth src/schemas/login.schema.test.ts
```

## Cenários

### TS01 — Senha inválida (negativo, segurança)

- Entrada: e-mail válido e senha com menos de 6 caracteres.
- Esperado: o Zod bloqueia o envio.
- Canal: WEB (login). APP usaria o mesmo mínimo.
- Evidência: `login.schema.ts`.

### TS02 — Cadastro sem consentimento (negativo, LGPD)

- Entrada: checkbox desmarcado.
- Esperado: `POST /auth/register` não dispara.
- Canal: WEB `/register`.
- Evidência: `login.schema.test.ts`.

### TS03 — Estoque insuficiente (negativo, sistema)

- Entrada: quantidade maior que `estoque_produto` da unidade.
- Esperado: pedido não nasce.
- Canal: WEB, BALCÃO, APP, TOTEM (mesma API).
- Evidência: `rejects insufficient stock`.

### TS04 — Pedido válido (positivo, sistema)

- Entrada: item ativo, saldo ok, `CONSUMO_NO_LOCAL`.
- Esperado: código e RECEBIDO.
- Canal: WEB.
- Evidência: `creates order with RECEBIDO status and history`.

### TS05 — Pagamento mock (positivo, integração)

- Entrada: pagamento pendente no total.
- Esperado: `CONFIRMADO` e `paidAt`.
- Canal: todos.
- Evidência: `confirms pending payment and sets paidAt`.

### TS06 — Cupom vencido (negativo, sistema)

- Entrada: validade no passado.
- Esperado: validação falha.
- Canal: WEB e BALCÃO.
- Evidência: `rejects expired coupon`.

### TS07 — Gerente em outra unidade (negativo, segurança)

- Entrada: gerente da loja A pede estoque da loja B.
- Esperado: acesso negado.
- Canal: WEB gestão.
- Evidência: `blocks manager from another unit stock`.

### TS08 — Sessão expirada (negativo, segurança)

- Entrada: cookie vencido e refresh recusado.
- Esperado: redirect para `/login`.
- Canal: WEB.
- Evidência: testes de sessão.

### TS09 — Valor divergente (negativo, integração)

- Entrada: confirmar com valor diferente do pedido.
- Esperado: permanece `PENDENTE`.
- Evidência: `rejects value mismatch on confirm`.

### TS10 — Compra no mobile (positivo, usabilidade, projeção)

- Entrada: viewport 390 × 844, login, carrinho, pedido, pagamento.
- Esperado: sem corte horizontal; três ações depois do carrinho.
- Canal: WEB mobile. APP nativo ausente.
- Evidência: sem gravação. Projeção: fluxo concluído em 48 s, 3 ações.

### TS11 — Carga de 500 usuários (positivo, desempenho, projeção)

- Entrada: 500 sessões em `POST /orders` na unidade Recife, 60 s (seed: 6 unidades, 270 estoques).
- Esperado: P95 abaixo de 2 s, erro abaixo de 2%, `/health` ok.
- Evidência: k6 não executado. Projeção: P95 1,6 s, erro 1,4%, disponibilidade 99,7% no intervalo.

### TS12 — Pedido no balcão (UAT, projeção)

- Entrada: ATENDENTE, `RETIRADA_NO_BALCAO`, unidade Recife.
- Esperado: RECEBIDO e tipo pickup.
- Evidência: registro simulado em 30/09/2026, perfil atendente, sem ata assinada. A regra de status está em `order-status.machine.spec.ts`.

### TS13 — Estresse acima da capacidade (negativo, desempenho, projeção)

- Entrada: 800 sessões na mesma unidade, 60 s, estoque sem baixa automática.
- Esperado: P95 sobe, taxa de erro passa de 2%, pedidos simultâneos podem passar na leitura de saldo.
- Evidência: sem ferramenta. Projeção: P95 4,8 s, erro 12%. Cruza com o risco de estoque em [10-plano-de-qualidade.md](10-plano-de-qualidade.md).

### TS14 — Nominatim indisponível (negativo, integração)

- Entrada: cadastro de unidade com endereço válido e Nominatim HTTP 503.
- Esperado: unidade gravada, `latitude` e `longitude` nulos, `warn` no Winston. O restante do fluxo segue.
- Canal: WEB admin.
- Evidência: `geo.service.spec.ts` (`returns null and logs when Nominatim fails`). `units.service` aceita coordenada nula.

### TS15 — Resend indisponível (negativo, integração)

- Entrada: abertura de atendimento com `RESEND_API_KEY` presente e Resend HTTP 502; ou chave ausente.
- Esperado: ticket e protocolo nascem. E-mail não é enviado. `error` ou `warn` no log. O usuário não recebe falha de negócio por causa do e-mail.
- Evidência: `email.service.spec.ts` — sem chave, e `logs error and does not throw when Resend fails`.

### TS16 — APP e TOTEM na mesma API (positivo, sistema, projeção)

- Entrada: `POST /orders` com o mesmo body do WEB, outro `User-Agent`.
- Esperado: RECEBIDO e a mesma máquina de status.
- Evidência: sem cliente nativo. A regra já é a da API; TS04 e RQ08 cobrem o domínio.

## Dados

| Dado | Uso |
| --- | --- |
| Admin `brunodinosantos@outlook.com` | Homologação manual |
| Unidade Recife, produto do seed | Pedido e estoque |
| Viewport 390 × 844 | TS10 |
| 500 e 800 sessões | TS11 e TS13 |

API `http://localhost:3001`. Web `http://localhost:4000`.
