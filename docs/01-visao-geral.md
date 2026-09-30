# Visão geral

| Campo | Conteúdo |
| --- | --- |
| Projeto | Raízes do Nordeste |
| Tipo | Rede de franquias do setor alimentício |
| Entrega | Interface web, API e PostgreSQL no mesmo monorepo |

## Problema

A rede está em expansão e precisa da mesma regra de pedido, promoção, pontos e atendimento em todas as lojas. O sistema registra o que ocorre em cada unidade e restringe o que cada perfil pode ver. O gerente acessa a própria loja. O administrador acessa a rede.

## Atores

| Ator | Função |
| --- | --- |
| Cliente | Conta, pedido, pagamento, acompanhamento, pontos e chamado |
| Atendente | Balcão, pedido e protocolo |
| Cozinheiro | Preparo e mudança de status |
| Gerente | Equipe, estoque, pedidos e indicadores daquela loja |
| Administrador | Unidades, usuários, permissões, promoções e relatórios |

## Módulos

Acesso, clientes, funcionários, unidades, produtos, estoque, pedidos, pagamento, promoções, cupons, fidelidade, atendimento e indicadores.

## Canais

| Canal | Situação | Como o pedido entra |
| --- | --- | --- |
| WEB | Em operação (`localhost:4000`) | Cliente ou equipe no navegador |
| BALCÃO | Mesmo site, papel ATENDENTE | Atendente cria o pedido |
| PICKUP | Campo do pedido | `consumptionType = RETIRADA_NO_BALCAO` |
| Consumo no local | Campo do pedido | `consumptionType = CONSUMO_NO_LOCAL` |
| APP | Sem aplicativo nativo | Mesma API Nest, se um cliente mobile for ligado depois |
| TOTEM | Sem cliente próprio | Mesma API Nest, se um totem for ligado depois |

A máquina de status, o estoque e o pagamento mock são os mesmos em qualquer origem. O que muda é quem autentica e o `consumptionType`.

## Stack

O inventário com a versão instalada de cada biblioteca está em [03-arquitetura.md](03-arquitetura.md). Resumo:

| Camada | Tecnologia |
| --- | --- |
| Interface | Next.js 16.3.5, React 19.3.0, pt-BR e en |
| BFF | Rotas `/api/*` no Next.js. O navegador não chama o Nest diretamente |
| API | NestJS 10.4.22, Swagger 8.1.1, Winston 3.19.0, guard de papel |
| Dados | Prisma 6.19.3 no PostgreSQL do Supabase |
| Autenticação | Supabase Auth (`supabase-js` 2.116.0), JWT validado na API |
| Mapa | Leaflet 1.9.4 |
| E-mail | Resend, via HTTP, sem SDK |
| Geocodificação | Nominatim, via HTTP, sem SDK |
| Pagamento | Fluxo interno simulado, sem adquirente |
| Testes | Jest 29.7.0 na API, Vitest 2.1.9 no web e no pacote compartilhado |
| Monorepo | Node.js 22.16.0, pnpm 9.15.0 e Turborepo 2.11.2 |
