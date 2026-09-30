# Integrabilidade e funcionamento

Integrabilidade é a troca de dados entre módulos sem cada um inventar o próprio usuário, pedido ou unidade. Funcionamento é o que o canal web permite do login até o kanban.

## Contratos compartilhados

- Os papéis vivem em `@raizes/shared` e são os mesmos na API, no menu e nos formulários.
- Listagens usam `page`, `pageSize` (máximo 100), `search` e `orderBy`.
- A resposta de lista é `{ data, pagination }`, com total, páginas, `hasNext` e `hasPrev`.
- Status na interface passa pelo badge; o enum não aparece cru.
- Formulários passam pelo Zod. A API valida de novo.

## Pedido de ponta a ponta

1. Após o login, o BFF guarda o cookie e envia o bearer.
2. A API confere o JWT e o papel.
3. O cardápio vem de produto ativo.
4. Na criação, `resolveOrderItems` exige estoque da unidade.
5. O pedido nasce RECEBIDO, com código e total.
6. O histórico registra quem mudou o status.
7. O kanban aceita só a próxima transição da máquina.
8. O pagamento é um para um com o pedido. A confirmação é interna.

Limitação conhecida: a API confere o estoque e não debita a quantidade. Duas vendas simultâneas podem passar se o saldo não for atualizado. A correção prevista é debitar na mesma transação que grava o pedido. Essa baixa automática ainda não está implementada.

## Acesso

1. `POST /auth/register` cria o usuário no Supabase e a linha `usuario` com perfil CLIENTE.
2. O administrador cria conta e perfis no mesmo `POST /users`.
3. `PUT /users/:id/profiles` substitui o conjunto de papéis.
4. O gerente não lista a rede: a consulta filtra pela unidade do funcionário.
5. A listagem administrativa de usuários exclui contas que já são clientes.

## Fidelidade e promoção

O seed possui um programa (Clube Raízes). Cada cliente tem adesão, saldo e nível. O resgate gera código e movimento de débito. O cupom precisa existir, estar ativo, dentro da validade e ligado a uma promoção, que pode restringir unidade e produto.

## Atendimento e auditoria

A abertura do chamado gera protocolo e status ABERTO. Mudanças entram em `hist_atendimento`. Escritas relevantes vão para `log_auditoria`.

## Mapa e relatório

O painel lê unidades e clientes paginados, descarta quem não tem coordenada e desenha os dois conjuntos. Os indicadores respeitam o período escolhido. O relatório por tipo cobre pedido, estoque, promoção e fidelidade.

## Conferência na interface

| Fluxo | Resultado |
| --- | --- |
| Login do administrador | Painel com indicadores |
| Mapa | Unidade em laranja, cliente em verde-água |
| Usuários | Lista da equipe e cadastro com seleção de papel |
| Estoque | Todos os itens da unidade, não só os abaixo do mínimo |
| Pedido e atendimento | Kanban por status |

## Limites

| Limite | Efeito |
| --- | --- |
| APP, TOTEM e BALCÃO | Sem aplicativo nativo. Balcão é o mesmo site, com perfil de atendente |
| Pagamento | Sem adquirente. Confirmar não prova captura financeira |
| Estoque | Conferido na venda, sem baixa automática |
| Item | Produto e quantidade, sem modificador |
| Opt-in promocional | Sem coluna própria |
| Teste com banco | A suíte não sobe o PostgreSQL |

## Como repetir a verificação

```powershell
pnpm install
pnpm --filter @raizes/api exec jest
pnpm --filter @raizes/web test
pnpm --filter @raizes/shared test
pnpm dev
```

Web em `http://localhost:4000`. API em `http://localhost:3001`. O Swagger lista os endpoints protegidos.
