# Raízes do Nordeste

Sistema web da rede de franquias alimentícias, feito para a trilha de qualidade de software. Padroniza acesso, pedidos, pagamento, promoções, fidelidade, atendimento e a operação das unidades.

A documentação completa do trabalho está na pasta [`docs`](docs/README.md). Este arquivo é a capa: problema, como rodar, arquitetura, resultado dos testes e o diagrama.

## Documentos

| Documento | Conteúdo |
| --- | --- |
| [Visão geral](docs/01-visao-geral.md) | Atores, módulos, canais e stack |
| [Casos de uso](docs/02-casos-de-uso.md) | UC01 a UC10 e o que foi implementado |
| [Arquitetura](docs/03-arquitetura.md) | BFF, integrações e volume de dados |
| [Dicionário de dados](docs/04-dicionario-de-dados.md) | 25 tabelas, colunas e chaves |
| [Modelo MER](docs/05-modelo-mer.md) | Cardinalidades e domínios |
| [Diagrama interativo](docs/mer.html) | Zoom, arraste e ficha de cada tabela |
| [Relatório de testes](docs/06-relatorio-de-testes.md) | 189 testes, suíte a suíte |
| [Integrabilidade e funcionamento](docs/07-integrabilidade-e-funcionamento.md) | Cadeias entre módulos e limites |
| [Endpoints](docs/08-endpoints.md) | Rotas da API por caso de uso |

Abra [`docs/mer.html`](docs/mer.html) no navegador. A roda do mouse dá zoom no ponto do cursor. Arrastar o fundo move o diagrama. `Ajustar` encaixa as 25 tabelas. Clicar numa tabela lista PK, UK, FK e tipo.

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

Execução de 28/09/2026: **189 testes, 0 falhas**.

| Pacote | Testes |
| --- | --- |
| API (Jest) | 128 |
| Web (Vitest) | 59 |
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
