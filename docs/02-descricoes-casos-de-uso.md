# Descrição dos casos de uso

Formato: ator, pré-condição, fluxo, alternativa e regra. Endpoints em [08-endpoints.md](08-endpoints.md). Diagrama em [casos-de-uso.html](casos-de-uso.html).

## UC01 — Acesso e cadastro

- Ator principal: cliente. Outros: administrador.
- Pré-condição: e-mail livre no Supabase Auth e em `usuario`.
- Pós-condição: conta com perfil CLIENTE ou, no cadastro admin, com os perfis escolhidos.
- Fluxo base: `/register` com checkbox marcado → `POST /auth/register` (nome, e-mail, telefone, senha) → login → `GET /auth/me`.
- Alternativa: administrador usa `POST /users` e `PUT /users/:id/profiles`. Senha curta ou e-mail inválido para no Zod. Token vencido: BFF tenta `/auth/refresh` uma vez e, se falhar, vai para `/login`.
- Regras: e-mail único. Papéis CLIENTE, ATENDENTE, COZINHEIRO, GERENTE, ADMINISTRADOR. O aceite não vai no JSON do register.

## UC02 — Pedidos

- Atores: cliente, atendente, cozinheiro, gerente, administrador.
- Pré-condição: produto ativo e saldo em `estoque_produto` da unidade.
- Pós-condição: pedido RECEBIDO, código único, itens com preço da venda, linha em `hist_status_pedido`.
- Fluxo base: cardápio → itens → `POST /orders` com `consumptionType` `CONSUMO_NO_LOCAL` ou `RETIRADA_NO_BALCAO` → kanban.
- Alternativa: estoque insuficiente ou produto inativo recusa a criação. Personalização de item não existe.
- Canais: WEB e BALCÃO (atendente). APP e TOTEM usariam o mesmo `POST /orders`. PICKUP = `RETIRADA_NO_BALCAO`.
- Regras: máquina RECEBIDO → EM_PREPARACAO → PRONTO → RETIRADO. Estoque é conferido e não debitado.

## UC03 — Pagamento

- Atores: cliente, atendente.
- Pré-condição: pedido existente, um pagamento por pedido.
- Pós-condição: `CONFIRMADO` e `paidAt`, ou permanece `PENDENTE`.
- Fluxo base: `POST /payments` (PIX, CARTAO_DEBITO ou CARTAO_CREDITO) → `POST /payments/:id/confirm`.
- Alternativa: valor diferente do total recusa a confirmação. Sem chave de adquirente.
- Canais: todos passam pela mesma API. O mock não muda por canal.

## UC04 — Acompanhar pedido

- Atores: cliente, cozinheiro, gerente.
- Pré-condição: pedido gravado.
- Fluxo base: `GET /orders/:id/status` e histórico.
- Alternativa: transição inválida recusada em `order-status.machine`.
- Canais: a consulta é a mesma; o kanban da cozinha é WEB.

## UC05 — Promoções e cupons

- Atores: administrador, gerente, atendente, cliente.
- Fluxo base: CRUD em `/promotions`, vínculo com unidade e produto, `POST /coupons/validate`.
- Alternativa: cupom inativo, vencido ou inexistente falha a validação.
- Regras: código de cupom único, gravado em maiúsculas.

## UC06 — Fidelidade

- Atores: cliente, administrador.
- Pré-condição: programa único do seed (Clube Raízes).
- Fluxo base: saldo, movimentos, `POST /benefits/:id/redeem`.
- Regras: resgate gera código e débito em `movimentacao_pontos`. Níveis BRONZE, PRATA, OURO.

## UC07 — Atendimento

- Atores: cliente, atendente.
- Fluxo base: `POST /support` gera protocolo e status ABERTO → kanban.
- Alternativa: mudança de status em `hist_atendimento`.
- Observabilidade: `log_auditoria` nas escritas; Resend avisa se a chave existir.

## UC08 — Operação da unidade

- Ator: gerente.
- Pré-condição: `funcionario.unidade` preenchido.
- Fluxo base: equipe, estoque e pedidos filtrados pela loja.
- Alternativa: estoque de outra unidade retorna acesso negado.

## UC09 — Gestão da rede

- Ator: administrador.
- Fluxo base: unidades, usuários, perfis, promoções e fidelidade sem filtro de loja.
- Alternativa: a lista admin de usuários exclui quem já é cliente.

## UC10 — Indicadores

- Atores: gerente, administrador.
- Fluxo base: `GET /reports/indicators` e `GET /reports/:type` no período escolhido.
- Regras: gerente vê a unidade; administrador vê a rede.
