# Visão geral

| Campo | Conteúdo |
| --- | --- |
| Projeto | Raízes do Nordeste |
| Trilha | Qualidade de software |
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

Os canais previstos são APP, WEB, TOTEM e BALCÃO. O canal em operação é o WEB. No pedido é possível marcar retirada no balcão ou consumo no local. APP e TOTEM não existem como aplicativos separados. O balcão usa o mesmo site, com o perfil de atendente.

## Stack

| Camada | Tecnologia |
| --- | --- |
| Interface | Next.js 16, React, pt-BR e en |
| BFF | Rotas `/api/*` no Next.js. O navegador não chama o Nest diretamente |
| API | NestJS, Swagger, Winston, guard de papel |
| Dados | Prisma no PostgreSQL do Supabase |
| Autenticação | Supabase Auth, JWT validado na API |
| Mapa | Leaflet |
| E-mail | Resend |
| Geocodificação | Nominatim |
| Pagamento | Fluxo interno simulado, sem adquirente |
| Testes | Jest na API, Vitest no web e no pacote compartilhado |
| Monorepo | pnpm 9.15 e Turborepo |
