# Relatório de testes

## Ambiente da execução

| Item | Valor |
| --- | --- |
| Data | 28 de setembro de 2026 |
| Sistema | Windows |
| Gerenciador | pnpm 9.15.0 |
| API | Jest 29, 39 suítes |
| Web | Vitest 2.1.9, 20 arquivos |
| Compartilhado | Vitest 2.1.9, 1 arquivo |
| Comando | `pnpm --filter @raizes/api exec jest`, `pnpm --filter @raizes/web test`, `pnpm --filter @raizes/shared test` |

Os testes são unitários, com Prisma e clientes externos substituídos por mocks. Eles provam regras, validação e escopo de acesso. Não substituem um teste de ponta a ponta contra o Supabase.

## Resultado consolidado

| Pacote | Arquivos | Testes | Falhas |
| --- | --- | --- | --- |
| @raizes/api | 39 | 128 | 0 |
| @raizes/web | 20 | 59 | 0 |
| @raizes/shared | 1 | 2 | 0 |
| Total | 60 | 189 | 0 |

## Correção antes da execução final

`apps/web/src/schemas/login.schema.test.ts` ainda esperava que um cliente só com CPF fosse válido. O schema passou a exigir endereço, cidade, UF e CEP. O teste foi alinhado para rejeitar esse payload incompleto. A suíte web foi executada de novo e fechou 59/59.

## API — suítes e o que cada uma cobre

| Suíte | Testes | O que verifica |
| --- | --- | --- |
| auth.service.spec | 3 | Login, cadastro e conflito de e-mail |
| supabase-jwt.strategy.spec | 3 | Extração de papéis do token |
| supabase-jwt-key.spec | 3 | Chave de verificação do JWT |
| jwt-auth.guard.spec | 2 | Rotas públicas e proteção |
| roles.guard.spec | 3 | Bloqueio quando o papel não alcança a rota |
| users.service.spec | 7 | Lista sem clientes, criação com perfis, escopo do gerente, proibição de apagar a si mesmo |
| clients.service.spec | 5 | CRUD e acesso |
| clients.mapper.spec | 4 | Resposta com endereço, fidelidade e coordenadas |
| employees.service.spec | 4 | Escopo por unidade |
| employees.mapper.spec | 3 | Junção usuário e unidade |
| units.service.spec | 2 | Criação de unidade com estoque e geocodificação |
| products.service.spec | 3 | Produto ativo e preço |
| stock.service.spec | 6 | Estoque da unidade, bloqueio entre unidades, listagem geral e itens abaixo do mínimo |
| orders.service.spec | 6 | Criação, alteração antes da preparação, estoque insuficiente |
| order-status.machine.spec | 3 | Transições RECEBIDO → EM_PREPARACAO → PRONTO → RETIRADO |
| payments.service.spec | 5 | Criação e confirmação simulada |
| promotions.service.spec | 4 | Promoção e vínculos |
| coupons.service.spec | 4 | Validação de cupom |
| loyalty.service.spec | 4 | Saldo, pontos e resgate |
| loyalty-level.spec | 3 | Faixas BRONZE, PRATA, OURO |
| support.service.spec | 3 | Protocolo e status |
| support-protocol.spec | 1 | Formato do protocolo |
| reports.service.spec | 4 | Indicadores e tipos de relatório |
| profiles.service.spec | 1 | Catálogo de perfis |
| geo.service.spec | 3 | Leitura de latitude e longitude |
| email.service.spec | 2 | Envio via Resend mockado |
| pagination.spec | 3 | Página, tamanho e metadados |
| cascade-delete.spec | 8 | Exclusão em grafo sem órfão |
| http-exception.filter.spec | 2 | Corpo de erro padronizado |
| logger.service.spec | 4 | Winston |
| audit.interceptor.spec | 3 | Gravação de auditoria |
| audit-entity.parser.spec | 2 | Entidade a partir da rota |
| health.controller.spec | 1 | Saúde da API |
| app.controller.spec | 1 | Rota raiz |
| schema.spec | 1 | Presença das tabelas do enunciado |
| client-profile.spec | 2 | Endereço coerente com o DDD |
| realistic-catalog.spec | 4 | Unidades no Nordeste e preços do cardápio |
| sheet-allowlist.spec | 3 | Abas aceitas na importação |
| excel-date.spec | 3 | Datas de planilha |

## Web — arquivos e o que cada um cobre

| Arquivo | Testes | O que verifica |
| --- | --- | --- |
| session-cookies.test.ts | 9 | Gravação e leitura da sessão no BFF |
| login.schema.test.ts | 4 | Login, e-mail inválido, cliente incompleto, pedido sem item |
| user.schema.test.ts | 3 | Cadastro com papel, rejeição sem papel, edição sem senha |
| client.schema.test.ts | 2 | Cliente completo e CPF curto |
| support.schema.test.ts | 2 | Abertura de atendimento |
| status.test.ts | 3 | Rótulos de status |
| support-status.test.ts | 3 | Colunas do kanban de atendimento |
| order-status.test.ts | 3 | Colunas do kanban de pedidos |
| board-drop.test.ts | 3 | Soltar card só em transição válida |
| dashboard-series.test.ts | 1 | Série diária de pedidos |
| kpi-mapper.test.ts | 1 | Indicadores para os cartões |
| money.test.ts | 4 | Formatação em real |
| cpf.test.ts | 2 | Máscara de CPF |
| cep.test.ts | 2 | Máscara de CEP |
| list-query.test.ts | 2 | Query string de paginação |
| api.test.ts | 3 | Montagem de URL e erro HTTP |
| health.test.ts | 1 | Leitura do health pelo BFF |
| create-resource.test.ts | 2 | Chaves do React Query |
| categories.test.ts | 6 | Menu por categoria |
| menu.test.ts | 3 | Itens visíveis por papel |

## Compartilhado

| Arquivo | Testes | O que verifica |
| --- | --- | --- |
| user-role.enum.test.ts | 2 | Os cinco papéis e o subconjunto de equipe |

## O que esta suíte não cobre

Não houve, nesta execução, teste de browser automatizado, teste de carga nem teste contra o banco remoto. A conferência de tela (mapa, usuários, estoque) foi feita manualmente nas sessões de desenvolvimento e não entra nesta contagem de 189.
