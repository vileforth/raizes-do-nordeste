# Relatório de testes

## Ambiente da execução

| Item | Valor |
| --- | --- |
| Data | 30 de setembro de 2026 |
| Sistema | Windows |
| Gerenciador | pnpm 9.15.0 |
| API | Jest 29, 39 suítes |
| Web | Vitest 2.1.9, 23 arquivos |
| Compartilhado | Vitest 2.1.9, 1 arquivo |
| Comando | `pnpm --filter @raizes/api exec jest`, `pnpm --filter @raizes/web test`, `pnpm --filter @raizes/shared test` |

A suíte é unitária. Prisma e serviços externos estão mockados. Os casos cobrem regra, validação e escopo de acesso. Não sobem o PostgreSQL e não abrem o navegador.

## Resultado consolidado

| Pacote | Arquivos | Testes | Falhas |
| --- | --- | --- | --- |
| @raizes/api | 39 | 132 | 0 |
| @raizes/web | 23 | 68 | 0 |
| @raizes/shared | 1 | 2 | 0 |
| Total | 63 | 202 | 0 |

## Correção antes da execução final

Antes da execução final, um teste do web ainda aceitava cliente só com CPF. O schema já exigia endereço, cidade, UF e CEP. O teste foi ajustado para rejeitar o cadastro incompleto. Em seguida a suíte fechou 202/202. Totais em [13-metricas.md](13-metricas.md).

## API — suítes e o que cada uma cobre

| Suíte | Testes | O que verifica |
| --- | --- | --- |
| auth.service.spec | 4 | Login, cadastro, refresh e conflito de e-mail |
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
| coupons.service.spec | 7 | Validação, listagem, criação e código duplicado |
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
| schema.spec | 1 | Presença das tabelas do modelo |
| client-profile.spec | 2 | Endereço coerente com o DDD |
| realistic-catalog.spec | 4 | Unidades no Nordeste e preços do cardápio |
| sheet-allowlist.spec | 3 | Abas aceitas na importação |
| excel-date.spec | 3 | Datas de planilha |

## Web — arquivos e o que cada um cobre

| Arquivo | Testes | O que verifica |
| --- | --- | --- |
| session-cookies.test.ts | 9 | Gravação e leitura da sessão no BFF |
| login.schema.test.ts | 6 | Login, e-mail inválido, cadastro com e sem consentimento, cliente incompleto, pedido sem item |
| coupon.schema.test.ts | 2 | Código em maiúsculas e rejeição de limite inválido |
| session-redirect.test.ts | 3 | Login público, `/privacidade` e fim de sessão |
| session-refresh.test.ts | 2 | Renovar uma vez e não renovar login |
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

Não houve, nesta execução, teste de navegador automatizado, teste de carga nem teste contra o banco remoto. Mapa, usuários e estoque foram conferidos manualmente no site e não entram na contagem de 202.
