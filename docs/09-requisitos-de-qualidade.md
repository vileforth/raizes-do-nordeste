# Requisitos de qualidade

Oito metas mensuráveis no fluxo de pedido e pagamento.

O canal em operação é o WEB. APP, TOTEM e BALCÃO, se existissem como clientes próprios, usariam a mesma API. O balcão, hoje, é o site com perfil ATENDENTE. Retirada no balcão corresponde a `RETIRADA_NO_BALCAO` no pedido.

Quando a suíte de 30/09/2026 não prova o número, o status fica parcial ou simulado.

## RQ01 — Tempo de resposta

Meta: criar pedido ou confirmar pagamento em menos de 2 segundos.

Critério de aceitação: P95 abaixo de 2 s em ambiente controlado, sem carga de 500 usuários.

Canal: WEB. A mesma meta valeria para os demais canais.

Evidência: sem medição de latência. A suíte unitária não cronometra resposta.

## RQ02 — Conclusão em três ações

Meta: com o carrinho montado, concluir pedido e pagamento em no máximo três ações.

Critério de aceitação: confirmar itens, criar o pedido e confirmar o pagamento simulado.

Canal: WEB.

Evidência: a tela existe. Não há teste de usabilidade cronometrado.

## RQ03 — Isolamento por unidade

Meta: estoque e pedido de outra unidade não aparecem para o gerente.

Critério de aceitação: a API recusa o acesso.

Evidência: medida. `stock.service.spec.ts` recusa gerente de outra loja.

## RQ04 — Pagamento sem adquirente

Meta: confirmar pagamento não chama gateway.

Critério de aceitação: `POST /payments/:id/confirm` grava status interno e `paidAt`.

Evidência: medida. `payments.service.spec.ts`.

## RQ05 — Cupom inválido recusado

Meta: código inativo, vencido ou inexistente não aplica desconto.

Critério de aceitação: a API devolve erro de negócio e o pedido segue sem o cupom.

Evidência: medida. `coupons.service.spec.ts`.

## RQ06 — Estoque insuficiente bloqueado

Meta: quantidade acima do saldo da unidade não grava pedido.

Critério de aceitação: a criação falha antes de nascer o código.

Evidência: medida. `orders.service.spec.ts`.

## RQ07 — Sessão expirada volta ao login

Meta: JWT inválido apaga os cookies e redireciona para `/login`.

Critério de aceitação: a interface não permanece no painel com o menu desabilitado.

Evidência: medida no cliente. `session-redirect.test.ts` e `session-refresh.test.ts`.

## RQ08 — Mesma máquina de status

Meta: RECEBIDO → EM_PREPARACAO → PRONTO → RETIRADO, uma única sequência.

Critério de aceitação: transição inválida é recusada, qualquer que seja a origem do pedido.

Evidência: medida na regra. `order-status.machine.spec.ts`. Não há aplicativo nativo.

A matriz com RQ01 a RQ08 está em [12-rastreabilidade.md](12-rastreabilidade.md).
