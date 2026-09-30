# Arquitetura e integração

## Caminho de uma requisição

1. O navegador conversa apenas com o Next.js, na porta 4000.
2. A página lê e grava dados com React Query.
3. O serviço do front chama `/api/...`.
4. O BFF em `apps/web/src/app/api/[...path]/route.ts` encaminha a chamada ao Nest, com o token do cookie.
5. O Nest valida o JWT do Supabase e o papel.
6. O serviço persiste com Prisma no PostgreSQL.
7. Listagens retornam `{ data, pagination }`.

## Função do BFF

A URL da API e o token não ficam expostos no bundle do navegador. O Next.js guarda a sessão em cookie e encaminha o bearer. Se o token estiver vencido, o BFF tenta renovar uma vez. Se a renovação falhar, os cookies são apagados e o usuário volta ao login.

## Integrações

| Integração | Uso |
| --- | --- |
| Supabase Auth | Login, cadastro e recuperação de senha |
| Supabase Postgres | Persistência |
| Resend | E-mail transacional |
| Nominatim | Coordenadas da unidade |
| Carto | Fundo do mapa, sem chave |

Os nomes das variáveis, sem valores, estão em `apps/api/.env.example` e `apps/web/.env.example`. Segredos não entram neste arquivo.

## Portas

| Processo | Porta |
| --- | --- |
| Nest | 3001 |
| Next | 4000 |

## Volume do seed

| Conjunto | Quantidade |
| --- | --- |
| Clientes | 120 |
| Funcionários do seed | 60 |
| Unidades | 6 |
| Produtos | 45 |
| Estoques | 6 |
| Itens de estoque | 270 |
| Pedidos | 12100 |
| Itens de pedido | 35869 |
| Pagamentos | 12100 |
| Promoções e cupons | 12 |
| Fidelidades | 120 |
| Atendimentos | 899 |

Depois do seed, o script `keep-admin-staff` remove a equipe extra e mantém o administrador `brunodinosantos@outlook.com`. Os clientes permanecem. A tela de funcionários fica vazia até novos cadastros. Os 270 itens de estoque continuam.

## Mapa

Unidades em laranja e clientes em pin verde-água. Latitude e longitude ficam em `unidade` e `cliente`.
