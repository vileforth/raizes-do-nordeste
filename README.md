# Raízes do Nordeste

Sistema web da rede de franquias alimentícias Raízes do Nordeste. Padroniza acesso, pedidos, pagamento, promoções, fidelidade, atendimento e a operação das unidades.

A documentação técnica está na pasta [`docs`](docs/README.md). Este arquivo resume o problema, como executar, a arquitetura, o resultado dos testes e o diagrama.

## Documentos

| Documento | Conteúdo |
| --- | --- |
| [Visão geral](docs/01-visao-geral.md) | Atores, módulos, canais e stack |
| [Casos de uso](docs/02-casos-de-uso.md) | UC01 a UC10 e o que foi implementado |
| [Descrições de UC](docs/02-descricoes-casos-de-uso.md) | Fluxo, alternativa e regra |
| [Diagrama de casos de uso](docs/casos-de-uso.html) | Zoom e ficha de cada UC |
| [Arquitetura](docs/03-arquitetura.md) | Camadas, ISO 25010 e integrações |
| [Dicionário de dados](docs/04-dicionario-de-dados.md) | 25 tabelas, colunas e chaves |
| [Modelo MER](docs/05-modelo-mer.md) | Cardinalidades e domínios |
| [Diagrama MER](docs/mer.html) | Zoom, arraste e ficha de cada tabela |
| [Relatório de testes](docs/06-relatorio-de-testes.md) | 203 testes, suíte a suíte |
| [Evidência da suíte](docs/evidencias/suite-2026-09-30.md) | Jest, Vitest e cobertura da API |
| [Métricas](docs/13-metricas.md) | 203/203 e 41,65% de linha na API |
| [Integrabilidade e funcionamento](docs/07-integrabilidade-e-funcionamento.md) | Cadeias entre módulos e limites |
| [Endpoints](docs/08-endpoints.md) | Rotas da API por caso de uso |
| Versão de demonstração publicada: https://raizes-do-nordeste-web.vercel.app/login
| Usuário
bruno@raizesdonordeste.com.br
Senha
raizes123
Perfis
Atendente e administrador |

Abra [`docs/mer.html`](docs/mer.html) ou [`docs/casos-de-uso.html`](docs/casos-de-uso.html) no navegador. A roda do mouse dá zoom. Arrastar o fundo move o desenho.

## Problema

A rede cresce e precisa do mesmo atendimento em todas as lojas: pedido com código, status de preparo, promoção, pontos e protocolo. Gerente enxerga a própria unidade. Administrador enxerga a rede.

| UC | Funcionalidade | Situação |
| --- | --- | --- |
| UC01 | Acesso e cadastro | Implementado |
| UC02 | Pedidos | Implementado, sem personalização de item |
| UC03 | Pagamento | Implementado de forma simulada |
| UC04 | Acompanhar pedido | Implementado |
| UC05 | Promoções e cupons | Implementado |
| UC06 | Fidelidade | Implementado |
| UC07 | Atendimento | Implementado |
| UC08 | Operação da unidade | Implementado |
| UC09 | Gestão da rede | Implementado |
| UC10 | Indicadores | Implementado |

## Arquitetura

O navegador só fala com o Next.js. As rotas `/api/*` fazem de BFF e encaminham à API Nest. A API valida o JWT do Supabase, aplica o papel e usa Prisma no PostgreSQL.

```
navegador → Next.js :4000 (/api) → NestJS :3001 → PostgreSQL (Supabase)
```

Papéis: CLIENTE, ATENDENTE, COZINHEIRO, GERENTE, ADMINISTRADOR.

## Pré-requisitos

- Node.js 22+
- pnpm 9.15.0
- Projeto Supabase (Postgres + Auth)

## Executar

```powershell
pnpm install
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.example apps/web/.env
pnpm db:generate
pnpm dev
```

Preencha as variáveis nos `.env` a partir dos exemplos. Não versione esses arquivos.

| Serviço | Endereço |
| --- | --- |
| Web | http://localhost:4000 |
| API | http://localhost:3001 |

Seed da base de demonstração:

```powershell
pnpm db:seed
```

## Testes

Execução de 30/09/2026: **203 testes, 0 falhas**. Cobertura de linha da API: **41,65%**. Detalhe em [docs/13-metricas.md](docs/13-metricas.md).

| Pacote | Testes |
| --- | --- |
| API (Jest) | 133 |
| Web (Vitest) | 68 |
| Compartilhado (Vitest) | 2 |

```powershell
pnpm --filter @raizes/api exec jest
pnpm --filter @raizes/web test
pnpm --filter @raizes/shared test
```

O detalhe de cada suíte, o que ela garante e o que ficou fora (carga, browser automatizado, banco real) está no [relatório de testes](docs/06-relatorio-de-testes.md). O comportamento entre módulos está em [integrabilidade e funcionamento](docs/07-integrabilidade-e-funcionamento.md).

## Limites registrados

- APP e TOTEM não são aplicativos à parte. O canal entregue é o web.
- Pagamento não chama adquirente.
- O pedido confere o estoque e não debita a quantidade sozinho.
- A suíte automatizada usa mocks. Ela não sobe o Postgres.
