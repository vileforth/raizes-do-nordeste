# Casos de uso

A tabela associa cada caso de uso ao que o código cobre. `Implementado` significa fluxo principal disponível no site e na API. `Parcial` significa que a regra existe, mas ainda falta canal extra, gateway ou personalização de item.

| UC | Caso | Atores | Status | Onde está |
| --- | --- | --- | --- | --- |
| UC01 | Acesso e cadastro | Cliente, administrador | Implementado | register, login, me, cadastro de usuário com perfil |
| UC02 | Pedidos | Cliente, atendente, cozinheiro, gerente, administrador | Parcial | Cardápio, criação, código, Recebido, kanban. Item sem personalização |
| UC03 | Pagamento | Cliente, atendente | Parcial | `POST /payments` e confirmação. Sem adquirente |
| UC04 | Acompanhar pedido | Cliente, cozinheiro, gerente | Implementado | Status e `hist_status_pedido` |
| UC05 | Promoções | Administrador, gerente, atendente, cliente | Implementado | CRUD, ativação, unidade, produto, cupom |
| UC06 | Fidelidade | Cliente, administrador | Implementado | Programa, saldo, movimento, benefício, resgate |
| UC07 | Atendimento | Cliente, atendente | Implementado | Protocolo, status, kanban |
| UC08 | Operação da unidade | Gerente | Implementado | Filtro pela unidade do funcionário |
| UC09 | Gestão da rede | Administrador | Implementado | Sem filtro de uma loja |
| UC10 | Indicadores | Gerente, administrador | Implementado | Relatórios com escopo do papel |

## Regras aplicadas no código

- E-mail, CPF, código de pedido, cupom, protocolo, matrícula e transação são únicos.
- Papéis: CLIENTE, ATENDENTE, COZINHEIRO, GERENTE, ADMINISTRADOR.
- O gerente altera dados da própria unidade. O administrador altera a rede.
- O pedido nasce RECEBIDO e segue EM_PREPARACAO, PRONTO, RETIRADO.
- Na gravação, a API verifica se o produto está ativo e se o estoque da unidade comporta a quantidade. A quantidade não é debitada automaticamente; a alteração passa pelo endpoint de estoque.
- O pagamento confirmado não conversa com gateway.
- O chamado recebe protocolo e histórico.
- Escritas relevantes entram em `log_auditoria`.

## Cliente e usuário

Usuário é a conta de acesso (`usuario`): nome, e-mail, telefone, status e perfis. Cliente é a ficha comercial (`cliente`): CPF, endereço, unidade preferida e coordenadas. A listagem administrativa de usuários mostra contas sem ficha de cliente, para cadastro da equipe.
