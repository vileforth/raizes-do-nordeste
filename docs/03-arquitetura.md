# Arquitetura e integração

## Fluxo de uma requisição

1. O navegador fala só com o Next.js, na origem da aplicação web.
2. A página usa React Query para ler e gravar dados.
3. O serviço do front chama `/api/...`.
4. A rota BFF `apps/web/src/app/api/[...path]/route.ts` repassa a chamada para a API Nest, com o token da sessão.
5. A API valida o JWT do Supabase, lê os perfis e aplica o guard de papel.
6. O serviço usa Prisma contra o PostgreSQL.
7. A resposta volta no formato `{ data, pagination }` nas listagens.

## Por que o BFF existe

Credencial, URL da API e regras de sessão ficam no servidor Next. O bundle do browser não escolhe o host da API. Isso reduz acoplamento e evita expor a configuração do backend no cliente.

## Fronteiras

| Integração | Papel | Contrato |
| --- | --- | --- |
| Supabase Auth | Cadastro, login e recuperação de senha | HTTP na API de auth do Supabase |
| Supabase Postgres | Persistência | `DATABASE_URL` via Prisma |
| Resend | E-mail transacional | Chave de API no servidor |
| Nominatim | Coordenadas a partir do endereço da unidade | HTTP de leitura |
| Tiles de mapa | Fundo do mapa do painel | Carto Positron, sem chave |

Variáveis esperadas, sem valores: `DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_JWT_SECRET`, `RESEND_API_KEY`, `NOMINATIM_BASE_URL`, `WEB_ORIGIN`, `PORT` na API; `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `API_URL`, `NEXT_PUBLIC_APP_URL` no web. Os exemplos estão em `apps/api/.env.example` e `apps/web/.env.example`.

## Portas locais

| Processo | Porta |
| --- | --- |
| API Nest | 3001 |
| Web Next | 4000 |

## Volumes do seed

O gerador realista grava a base de demonstração com estas quantidades de projeto:

| Conjunto | Quantidade |
| --- | --- |
| Clientes | 120 |
| Funcionários de seed | 60 |
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

Depois do seed, o script `keep-admin-staff` remove usuários de equipe que não são o administrador, preservando os clientes. A conta operacional de administração permanece `brunodinosantos@outlook.com`. A tela de funcionários fica vazia até novos cadastros. O estoque de 270 itens permanece.

## Mapa

O painel plota unidades em laranja e clientes em pins verde-água, com latitude e longitude gravadas em `unidade` e `cliente`.
