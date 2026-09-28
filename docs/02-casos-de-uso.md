# Casos de uso e rastreio da implementação

Cada caso de uso do enunciado está ligado ao que o código faz hoje. Status `implementado` significa fluxo principal disponível na API e na interface web. `parcial` significa que a regra existe, mas um canal ou um efeito colateral do enunciado ainda não fecha o ciclo.

| UC | Caso de uso | Atores | Status | Onde está |
| --- | --- | --- | --- | --- |
| UC01 | Acesso e cadastro | Cliente, administrador | Implementado | `POST /auth/register`, `POST /auth/login`, `GET /auth/me`, `POST /users` com perfis |
| UC02 | Pedidos | Cliente, atendente, cozinheiro, gerente, administrador | Parcial | Cardápio, criação, código, status Recebido e quadro kanban. Personalização de item não é um campo próprio |
| UC03 | Pagamento | Cliente, atendente | Parcial | `POST /payments` e confirmação. O retorno do adquirente é simulado |
| UC04 | Acompanhar pedido | Cliente, cozinheiro, gerente | Implementado | `GET /orders/:id/status` e histórico `hist_status_pedido` |
| UC05 | Promoções | Administrador, gerente, atendente, cliente | Implementado | CRUD de promoção, ativação, vínculo com unidade e produto, validação de cupom |
| UC06 | Fidelidade | Cliente, administrador | Implementado | Programa, saldo, movimentos, benefícios e resgate |
| UC07 | Atendimento | Cliente, atendente | Implementado | Protocolo, status e quadro kanban |
| UC08 | Operação da unidade | Gerente | Implementado | Escopo do gerente filtrado pela unidade do funcionário |
| UC09 | Gestão da rede | Administrador | Implementado | Unidades, usuários, perfis, promoções e fidelidade sem filtro de uma loja |
| UC10 | Indicadores | Gerente, administrador | Implementado | `GET /reports/indicators` e `GET /reports/:type` com escopo por papel |

## Regras que o código aplica

- E-mail de usuário é único. CPF de cliente é único. Código de pedido, cupom, protocolo, matrícula e código de transação são únicos.
- Papéis permitidos: CLIENTE, ATENDENTE, COZINHEIRO, GERENTE, ADMINISTRADOR.
- Gerente consulta e altera dados da própria unidade. Administrador consulta a rede.
- Pedido nasce com status RECEBIDO. A máquina de status segue RECEBIDO, EM_PREPARACAO, PRONTO, RETIRADO.
- Antes de gravar o pedido, a API confere se o produto está ativo e se a quantidade cabe no estoque da unidade.
- A baixa automática da quantidade em estoque não acontece na criação do pedido. A quantidade muda pelo endpoint de estoque.
- Pagamento confirmado não conversa com um gateway externo.
- Atendimento gera protocolo e histórico de status.
- Mutações relevantes geram `log_auditoria`.

## Diferença entre cliente e usuário

Usuário é a conta de acesso (`usuario`): nome, e-mail, telefone, status e perfis. Cliente é o cadastro comercial ligado a essa conta (`cliente`): CPF, endereço, unidade preferida e coordenadas. A listagem de usuários da área administrativa mostra contas sem ficha de cliente, para o administrador cadastrar a equipe e escolher os perfis.
