# Requisitos de qualidade

Recorte: concluir pedido e pagar. Nove metas mensuráveis. A suíte de 30/09/2026 cobre regra e acesso; não cobre latência de campo.

## Canais (vale para RQ01 a RQ09)

| Canal | Origem do pedido | Status da entrega |
| --- | --- | --- |
| WEB | Navegador, papel CLIENTE | Em operação |
| BALCÃO | Mesmo site, papel ATENDENTE | Em operação |
| PICKUP | `RETIRADA_NO_BALCAO` | Campo do pedido |
| Consumo no local | `CONSUMO_NO_LOCAL` | Campo do pedido |
| APP | Cliente nativo | Ausente; mesma API |
| TOTEM | Cliente de totem | Ausente; mesma API |

A API, a máquina de status e o pagamento mock não mudam de canal.

## RQ01 — Tempo de resposta

Meta: criar pedido ou confirmar pagamento em menos de 2 s (P95).

Aceite: P95 abaixo de 2 s sem os 500 usuários simultâneos.

Canais: WEB e BALCÃO medidos no mesmo host. APP e TOTEM herdariam o mesmo SLO.

Evidência: projeção em TS11. O interceptor já registra `duration`; a suíte não afirma o P95.

## RQ02 — Conclusão em três ações

Meta: carrinho pronto → pedido + pagamento em no máximo três ações.

Aceite: confirmar itens, `POST /orders`, `POST /payments/:id/confirm`.

Canais: WEB e mobile (390 px). BALCÃO usa o mesmo formulário. APP/TOTEM repetiriam a sequência.

Evidência: tela existe. Usabilidade cronometrada: TS10 (projeção).

## RQ03 — Isolamento por unidade

Meta: gerente não lê estoque nem pedido de outra loja.

Aceite: API recusa.

Canais: vale para qualquer cliente que chame a API com papel GERENTE.

Evidência: `stock.service.spec.ts`.

## RQ04 — Pagamento sem adquirente

Meta: confirmar não chama gateway.

Aceite: grava `CONFIRMADO` e `paidAt`.

Canais: todos. O mock é único.

Evidência: `payments.service.spec.ts`.

## RQ05 — Cupom inválido recusado

Meta: inativo, vencido ou inexistente não aplica desconto.

Aceite: erro de negócio; pedido segue sem cupom.

Canais: WEB, BALCÃO e um futuro APP usam `POST /coupons/validate`.

Evidência: `coupons.service.spec.ts`.

## RQ06 — Estoque insuficiente bloqueado

Meta: quantidade acima do saldo da unidade não grava pedido.

Aceite: falha antes do código.

Canais: mesma regra em WEB, BALCÃO, APP e TOTEM.

Evidência: `orders.service.spec.ts`.

## RQ07 — Sessão expirada volta ao login

Meta: JWT inválido apaga cookie e redireciona para `/login`.

Aceite: painel não fica com menu desabilitado.

Canais: WEB (cookie do BFF). APP/TOTEM precisariam do mesmo contrato de refresh.

Evidência: `session-redirect.test.ts`, `session-refresh.test.ts`.

## RQ08 — Mesma máquina de status

Meta: RECEBIDO → EM_PREPARACAO → PRONTO → RETIRADO.

Aceite: transição inválida recusada, qualquer origem.

Canais: WEB e BALCÃO no kanban. APP/TOTEM só enviariam o mesmo `PUT /orders/:id/status`.

Evidência: `order-status.machine.spec.ts`. TS12 descreve o balcão.

## RQ09 — Observabilidade do fluxo

Meta: cada criação de pedido ou pagamento deixa rastro de duração e, nas escritas, linha em `log_auditoria`.

Aceite: log Winston com `method`, `path`, `status`, `duration`; auditoria com usuário, entidade e ação.

Canais: o interceptor é global na API. Independente do cliente.

Evidência: `logging.interceptor.ts`, `audit.interceptor.spec.ts`, `logger.service.spec.ts`. Painel APM não existe.

Matriz em [12-rastreabilidade.md](12-rastreabilidade.md).
