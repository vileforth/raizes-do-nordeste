# Visão geral

## Identificação

| Campo | Conteúdo |
| --- | --- |
| Projeto | Raízes do Nordeste |
| Trilha | Qualidade de software |
| Autor de referência do enunciado | Bruno Villefort Hostalacio |
| Tipo | Rede de franquias do setor alimentício |
| Entrega técnica | Monorepo web + API + banco PostgreSQL |

## Problema

A rede está em expansão e precisa padronizar o atendimento, integrar as unidades e manter pedidos, promoções, fidelização e operação com o mesmo conjunto de regras. O sistema registra o que acontece em cada loja e restringe o que cada perfil pode ver.

## Atores

| Ator | Escopo |
| --- | --- |
| Cliente | Cadastro, pedidos, pagamento, acompanhamento, fidelidade e atendimento |
| Atendente | Operação de balcão, pedidos e protocolos |
| Cozinheiro | Preparação e mudança de status do pedido |
| Gerente | Uma unidade: equipe, estoque, pedidos e indicadores daquela loja |
| Administrador | A rede inteira: unidades, usuários, permissões, promoções e relatórios |

## Módulos

Acesso, clientes, funcionários, unidades, produtos, estoque, pedidos, pagamento, promoções, cupons, fidelidade, atendimento e indicadores.

## Canais

O enunciado prevê APP, WEB, TOTEM e BALCÃO. A implementação entregue é o canal WEB. O tipo de consumo do pedido cobre retirada no balcão e consumo no local. APP e TOTEM não são aplicativos separados.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Interface | Next.js 16, React, next-intl (pt-BR e en) |
| BFF | Rotas `/api/*` do Next.js. O navegador não chama a API Nest direto |
| API | NestJS, Swagger, Winston, guards de papel |
| Dados | Prisma, PostgreSQL no Supabase |
| Autenticação | Supabase Auth, JWT validado na API |
| Mapas | Leaflet, tiles Carto Positron |
| E-mail | Resend |
| Geocodificação | Nominatim |
| Pagamento | Fluxo interno simulado, sem adquirente real |
| Testes | Jest na API, Vitest no web e no pacote compartilhado |
| Monorepo | pnpm 9.15 e Turborepo |
