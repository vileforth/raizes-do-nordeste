# Endpoints implementados

API local: `http://localhost:3001`. No site o caminho é `http://localhost:4000/api`. Sem token, só login, register, forgot-password e health.

| Método | Caminho | Papéis | UC |
| --- | --- | --- | --- |
| POST | /auth/register | público | UC01 |
| POST | /auth/login | público | UC01 |
| POST | /auth/forgot-password | público | UC01 |
| GET | /auth/me | autenticado | UC01 |
| GET | /users | administrador, gerente | UC09 |
| POST | /users | administrador | UC09 |
| PUT | /users/:id | administrador | UC09 |
| PUT | /users/:id/profiles | administrador | UC09 |
| DELETE | /users/:id | administrador | UC09 |
| GET | /profiles | autenticado conforme guard | UC09 |
| GET POST PUT DELETE | /clients e /clients/:id | conforme papel da rota | UC01 |
| GET POST PUT DELETE | /employees e /employees/:id | gerente, administrador | UC08 |
| GET POST PUT DELETE | /units e /units/:id | gerente, administrador | UC08 UC09 |
| GET | /units/:id/stock | gerente, administrador | UC08 |
| GET | /stock | gerente, administrador | UC08 |
| GET | /stock/low | gerente, administrador | UC08 |
| PATCH DELETE | /stock/products/:id | gerente, administrador | UC08 |
| GET POST PUT DELETE | /products e /products/:id | operação de cardápio | UC02 |
| GET POST PUT DELETE | /orders, /orders/:id | cliente e operação | UC02 UC04 |
| GET | /orders/:id/status | acompanhamento | UC04 |
| PUT | /orders/:id/status | cozinha e gestão | UC02 UC04 |
| POST | /payments | cliente, atendente | UC03 |
| GET | /payments/:id | cliente, atendente | UC03 |
| POST | /payments/:id/confirm | cliente, atendente | UC03 |
| GET POST PUT PATCH DELETE | /promotions | gestão | UC05 |
| POST | /promotions/:id/units | administrador | UC05 |
| POST | /promotions/:id/products | administrador | UC05 |
| PATCH | /promotions/:id/activate | gestão | UC05 |
| POST | /coupons/validate | atendimento e cliente | UC05 |
| GET POST PUT DELETE | /coupons | gestão | UC05 |
| GET | /loyalty/program | autenticado | UC06 |
| GET | /clients/:id/loyalty | cliente e gestão | UC06 |
| GET | /clients/:id/points | cliente e gestão | UC06 |
| GET | /benefits | autenticado | UC06 |
| POST | /benefits/:id/redeem | cliente | UC06 |
| GET POST PUT DELETE | /support e /support/:id | cliente, atendente | UC07 |
| GET | /reports/indicators | gerente, administrador | UC10 |
| GET | /reports/:type | gerente, administrador | UC10 |
| GET | /health | público | operação |

Parâmetro completo está no Swagger da API. Esta tabela é o mapa das rotas por caso de uso.
