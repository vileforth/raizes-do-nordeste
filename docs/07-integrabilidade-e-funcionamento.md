# Integrabilidade e funcionamento

Integrabilidade aqui é a capacidade dos módulos trocarem dados sem cada um inventar o próprio usuário, pedido ou unidade. O funcionamento descreve o que um operador consegue fazer de ponta a ponta no canal web.

## Contratos compartilhados

- Papéis vivem em `@raizes/shared` e são os mesmos na API, no menu e nos formulários.
- Listagens usam `page`, `pageSize` (máximo 100), `search` e `orderBy`.
- A resposta de lista é `{ data, pagination }` com `total`, `totalPages`, `hasNext` e `hasPrev`.
- Status não aparece cru na interface. O componente de badge traduz a enum.
- Formulários passam por Zod antes do envio. A API valida de novo com class-validator.

## Cadeia de um pedido

1. O ator autentica. O BFF guarda a sessão e envia o bearer para a API.
2. A API confere o JWT e o papel.
3. O cardápio vem de `produto` ativo.
4. Ao criar o pedido, `resolveOrderItems` exige estoque da unidade e quantidade suficiente.
5. O pedido nasce RECEBIDO, com código único e total calculado.
6. O histórico grava quem mudou o status.
7. O kanban só aceita a próxima transição da máquina de estados.
8. O pagamento referencia esse pedido, um para um, e a confirmação é interna.

Ponto em aberto: a checagem de estoque não debita `quantidade`. Duas vendas simultâneas podem passar na leitura se ninguém atualizar o saldo. A correção natural é debitar na mesma transação que grava o pedido.

## Cadeia de acesso

1. `POST /auth/register` cria o usuário no Supabase e a linha `usuario` com perfil CLIENTE.
2. `POST /users`, restrito ao administrador, cria a conta e os perfis escolhidos no mesmo pedido.
3. `PUT /users/:id/profiles` substitui o conjunto de papéis.
4. Gerente não lista a rede: a consulta filtra `funcionario.unidade`.
5. A lista administrativa de usuários exclui contas que já são clientes.

## Cadeia de fidelidade e promoção

O programa é único no seed (Clube Raízes). Cada cliente tem uma adesão, saldo e nível. Resgate gera código e movimento de débito. Cupom válido precisa existir, estar ativo e dentro da validade, ligado a uma promoção que pode estar restrita a unidades e produtos.

## Cadeia de atendimento e auditoria

Abrir um ticket gera protocolo único e status ABERTO. Mudanças entram em `hist_atendimento`. O interceptor de auditoria registra ações de escrita em `log_auditoria` com usuário, entidade e identificador.

## Mapa e indicadores

O painel lê unidades e clientes paginados, descarta quem não tem coordenada e desenha os dois conjuntos com ícones diferentes. Indicadores de pedidos, receita, promoções, membros de fidelidade e unidades respeitam o período escolhido. O relatório por tipo aceita pedidos, estoque, promoções e fidelidade.

## Funcionamento observado na interface

| Fluxo | Resultado |
| --- | --- |
| Login do administrador | Sessão válida e painel com indicadores |
| Mapa | Unidades em laranja e clientes em pin verde-água |
| Usuários | Lista da equipe, cadastro com seleção de papéis |
| Estoque | Lista dos itens por unidade, não só os que estão abaixo do mínimo |
| Pedidos e atendimento | Quadros kanban com colunas de status |

## Limites conhecidos

| Limite | Efeito |
| --- | --- |
| APP, TOTEM e BALCÃO | Não há clientes nativos. O balcão é o mesmo web com papel de atendente |
| Pagamento | Sem adquirente. Confirmar não prova captura financeira |
| Estoque | Validado na venda, sem baixa automática |
| Personalização de item | Quantidade e produto. Sem modificadores |
| Consentimento promocional | Não há coluna própria para opt-in |
| Teste de integração com banco | A suíte não sobe Postgres. O schema é aplicado com Prisma no Supabase de desenvolvimento |

## Como repetir a verificação

```powershell
pnpm install
pnpm --filter @raizes/api exec jest
pnpm --filter @raizes/web test
pnpm --filter @raizes/shared test
pnpm dev
```

Web em `http://localhost:4000`. API em `http://localhost:3001`. Swagger da API documenta os endpoints protegidos.
