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

## Stack instalada

Leitura de `pnpm list -r --depth 0` em 30/09/2026. A versão é a resolvida no `node_modules`, não o intervalo `^` do `package.json`. O grafo transitivo (centenas de pacotes puxados por esses) não entra nesta lista, salvo o Express, que é o servidor HTTP de fato.

### Ambiente

| Peça | Versão | Papel |
| --- | --- | --- |
| Node.js | 22.16.0 | Runtime |
| pnpm | 9.15.0 | Gerenciador do monorepo |
| Turborepo (`turbo`) | 2.11.2 | Scripts `dev`, `build`, `test` |
| TypeScript | 5.9.3 | Linguagem, nos três pacotes |
| ESLint | 8.57.1 | Lint |
| @typescript-eslint/eslint-plugin | 8.70.0 | Regras TypeScript |
| @typescript-eslint/parser | 8.70.0 | Parser do ESLint |
| Prettier | 3.9.8 | Formatação, só na raiz |
| @types/node | 22.20.4 | Tipos do Node, API e web |

Pacotes do monorepo: `@raizes/api` 0.0.1, `@raizes/web` 0.0.1, `@raizes/shared` 0.0.1.

### API (`apps/api`) — execução

| Biblioteca | Versão | Uso |
| --- | --- | --- |
| @nestjs/common | 10.4.22 | Módulos, pipes, filtros |
| @nestjs/core | 10.4.22 | Bootstrap |
| @nestjs/platform-express | 10.4.22 | Adaptador HTTP |
| express | 4.22.1 | Servidor HTTP (transitivo do platform-express) |
| @nestjs/swagger | 8.1.1 | Documentação em `/docs` |
| @nestjs/passport | 10.0.3 | Guard de autenticação |
| passport | 0.7.0 | Estratégia de login |
| passport-jwt | 4.0.1 | Validação do JWT do Supabase |
| @prisma/client | 6.19.3 | Acesso ao PostgreSQL |
| class-validator | 0.14.4 | DTO |
| class-transformer | 0.5.1 | Transformação do body |
| reflect-metadata | 0.2.2 | Decorators do Nest |
| rxjs | 7.8.2 | Interceptors |
| winston | 3.19.0 | Log JSON |
| xlsx | 0.18.5 | Importação de planilha |
| @raizes/shared | 0.0.1 | Enums compartilhados |

### API — desenvolvimento e teste

| Biblioteca | Versão | Uso |
| --- | --- | --- |
| prisma | 6.19.3 | Migração, generate e seed |
| @nestjs/cli | 10.4.9 | `nest start` |
| @nestjs/schematics | 10.2.3 | Schematics do CLI |
| @nestjs/testing | 10.4.22 | Módulo de teste |
| jest | 29.7.0 | Suíte unitária |
| ts-jest | 29.4.12 | Jest com TypeScript |
| ts-node | 10.9.2 | Seed |
| @faker-js/faker | 8.4.1 | Dados do seed |
| @types/express | 5.0.6 | Tipos |
| @types/jest | 29.5.14 | Tipos |
| @types/passport-jwt | 4.0.1 | Tipos |

### Web (`apps/web`) — execução

| Biblioteca | Versão | Uso |
| --- | --- | --- |
| next | 16.3.5 | App Router, BFF `/api` e páginas |
| react | 19.3.0 | Interface |
| react-dom | 19.3.0 | Render |
| next-intl | 4.14.5 | pt-BR e en |
| @tanstack/react-query | 5.103.1 | Leitura e gravação no cliente |
| zod | 3.25.76 | Schema dos formulários |
| react-hook-form | 7.88.0 | Formulário |
| @hookform/resolvers | 4.1.3 | Liga Zod ao formulário |
| @supabase/supabase-js | 2.116.0 | Auth no servidor Next |
| @supabase/ssr | 0.6.1 | Cookie de sessão |
| @heroui/react | 3.0.3 | Componentes |
| @phosphor-icons/react | 2.1.10 | Ícones |
| framer-motion | 12.43.0 | Animação |
| @dnd-kit/core | 6.3.1 | Arraste do kanban |
| @nivo/bar | 0.88.0 | Gráfico de barras |
| @nivo/line | 0.88.0 | Gráfico de linha |
| leaflet | 1.9.4 | Mapa |
| react-leaflet | 5.0.0 | Mapa no React |
| @raizes/shared | 0.0.1 | Enums compartilhados |

### Web — desenvolvimento e teste

| Biblioteca | Versão | Uso |
| --- | --- | --- |
| tailwindcss | 4.3.3 | Estilo |
| @tailwindcss/postcss | 4.3.3 | Pipeline do Tailwind |
| vitest | 2.1.9 | Suíte unitária |
| jsdom | 30.1.0 | Ambiente do Vitest |
| @vitejs/plugin-react | 6.1.1 | Transform do teste |
| @testing-library/react | 16.3.3 | Dependência de teste de componente |
| @testing-library/jest-dom | 7.0.1 | Matchers de DOM |
| @types/react | 19.3.0 | Tipos |
| @types/react-dom | 19.3.0 | Tipos |
| @types/leaflet | 1.9.22 | Tipos |

### Pacote compartilhado (`packages/shared`)

Sem dependência de execução. No desenvolvimento: TypeScript 5.9.3, Vitest 2.1.9, ESLint 8.57.1 e o plugin TypeScript-ESLint 8.70.0. O pacote só exporta enums e tipos.

### Fora do npm

| Serviço | Uso | Cliente no código |
| --- | --- | --- |
| PostgreSQL (Supabase) | Banco | Prisma 6.19.3. Versão do servidor não está neste repositório |
| Supabase Auth | Login, cadastro, refresh | `@supabase/supabase-js` 2.116.0 e JWT na API |
| Resend | E-mail | `fetch` para `api.resend.com`, sem SDK |
| Nominatim | Geocodificação | `fetch`, sem SDK |
| Carto Positron | Tiles do mapa | Leaflet 1.9.4, sem chave |

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

O Swagger fica em `http://localhost:3001/docs` e só abre com `SWAGGER_USER` e `SWAGGER_PASSWORD`. Sem as duas, a página responde 401. Dentro do Swagger, a rota protegida ainda usa o bearer do login da plataforma.

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
