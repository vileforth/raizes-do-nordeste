# Arquitetura e integração

## Camadas (e onde testar)

O monorepo não usa pastas Domain/Application/Infrastructure. A separação abaixo é a que o código pratica.

| Camada | Onde vive | Responsabilidade | Ponto de teste |
| --- | --- | --- | --- |
| Interface | `apps/web` (App Router, Zod, React Query) | Telas, formulário, i18n, cookie de sessão | Vitest: schema, sessão, kanban, menu |
| Aplicação (BFF) | `apps/web/src/app/api/[...path]/route.ts` | Encaminha `/api/*` ao Nest, refresh e redirect | `session-refresh.test.ts`, `session-cookies.test.ts` |
| API | Controllers Nest + guards | HTTP, Swagger, papel, filtro de erro | `jwt-auth.guard.spec.ts`, `roles.guard.spec.ts` |
| Domínio | Services e regras (`order-status.machine`, cupom, fidelidade) | Status, estoque, pagamento mock, pontos | `*.service.spec.ts` com Prisma mockado |
| Infraestrutura | Prisma, Supabase Auth, Resend, Nominatim, Winston | Persistência e serviços externos | `geo.service.spec.ts`, `email.service.spec.ts`, `logger.service.spec.ts` |

Caminho: navegador → Next `:4000` → BFF `/api` → Nest `:3001` → PostgreSQL.

## ISO/IEC 25010 no recorte de pedido e pagamento

| Característica | Como a plataforma trata | Requisito |
| --- | --- | --- |
| Adequação funcional | Pedido RECEBIDO, pagamento 1:1, cupom validado | RQ04, RQ05, RQ06 |
| Eficiência de desempenho | Meta P95 abaixo de 2 s; `LoggingInterceptor` grava `duration` | RQ01, RQ09 |
| Compatibilidade | Mesma API para WEB, BALCÃO e um futuro APP/TOTEM | RQ08 |
| Usabilidade | Três ações depois do carrinho; pt-BR e en | RQ02 |
| Confiabilidade | Estoque insuficiente bloqueia; transição inválida recusada | RQ06, RQ08 |
| Segurança | JWT, papel, escopo do gerente, sessão expirada | RQ03, RQ07 |
| Manutenibilidade | Enums em `@raizes/shared`, suíte unitária, Swagger | — |
| Portabilidade | Canal WEB hoje; APP e TOTEM reutilizariam o Nest | RQ08 |

## Função do BFF

A URL da API e o token não ficam no bundle. O Next guarda cookie e encaminha o bearer. Token vencido: uma tentativa de refresh. Se falhar, os cookies saem e a tela volta ao login.

## Integrações e falha

| Integração | Uso | Falha observada no código |
| --- | --- | --- |
| Supabase Auth | Login, cadastro, senha | Sem chave, o serviço de auth não autentica |
| Supabase Postgres | Prisma | Fora da suíte automatizada |
| Resend | E-mail transacional | Sem `RESEND_API_KEY`, o envio é pulado e vira `warn`. HTTP 502 vira `error` e o fluxo segue |
| Nominatim | Coordenada da unidade | HTTP não ok ou lista vazia: `latitude`/`longitude` ficam nulos; a unidade é gravada |
| Carto | Fundo do mapa | Sem chave |
| Pagamento | Fluxo interno | Sem adquirente. Valor divergente mantém `PENDENTE` |

Nomes das variáveis, sem valores: `apps/api/.env.example` e `apps/web/.env.example`.

## Observabilidade já no código

- Winston em JSON (`timestamp`, `level`, mensagem).
- `LoggingInterceptor`: `method`, `path`, `status`, `duration` em cada HTTP.
- `AuditInterceptor`: escritas (não GET) em `log_auditoria`.
- `GET /health` público devolve `{ status: "ok" }`.

## Portas e seed

| Processo | Porta |
| --- | --- |
| Nest | 3001 |
| Next | 4000 |

Seed: 120 clientes, 6 unidades, 45 produtos, 270 itens de estoque, 12100 pedidos, 12100 pagamentos, 12 promoções/cupons, 120 fidelidades, 899 atendimentos. Depois, `keep-admin-staff` mantém `brunodinosantos@outlook.com` e esvazia a equipe extra.

Mapa: unidade em laranja, cliente em pin verde-água.
