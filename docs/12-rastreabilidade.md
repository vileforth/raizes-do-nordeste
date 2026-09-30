# Rastreabilidade

Requisito → caso → evidência. RQ01 a RQ09 em [09-requisitos-de-qualidade.md](09-requisitos-de-qualidade.md).

| ID | Requisito | Caso | Evidência | Tipo |
| --- | --- | --- | --- | --- |
| RT01 | RQ01 P95 abaixo de 2 s | TS11 carga | Projeção no 11. `duration` no interceptor, sem P95 medido | Projeção |
| RT02 | RQ02 três ações | TS10 mobile | Projeção no 11. Sem gravação de sessão | Projeção |
| RT03 | RQ03 isolamento | TS07 | `stock.service.spec.ts` — `blocks manager from another unit stock` | Medida |
| RT04 | RQ04 pagamento mock | TS05 | `payments.service.spec.ts` — `confirms pending payment and sets paidAt` | Medida |
| RT05 | RQ05 cupom | TS06 | `coupons.service.spec.ts` — `rejects expired coupon` | Medida |
| RT06 | RQ06 estoque | TS03 | `orders.service.spec.ts` — `rejects insufficient stock` | Medida |
| RT07 | RQ07 sessão | TS08 | `session-redirect.test.ts`, `session-refresh.test.ts` | Medida |
| RT08 | RQ08 status | TS04, TS12, TS16 | `order-status.machine.spec.ts`. TS12 e TS16 são projeção de canal | Parcial |
| RT09 | RQ09 observabilidade | TS14, TS15 | `audit.interceptor.spec.ts`, `logger.service.spec.ts`, interceptor HTTP | Medida |
| RT10 | Consentimento | TS02 | `login.schema.test.ts` | Medida |
| RT11 | Valor divergente | TS09 | `payments.service.spec.ts` — `rejects value mismatch on confirm` | Medida |
| RT12 | Nominatim fora | TS14 | `geo.service.spec.ts` — `returns null and logs when Nominatim fails` | Medida |
| RT13 | Resend fora | TS15 | `email.service.spec.ts` — falha 502 sem lançar exceção | Medida |
| RT14 | Estresse | TS13 | Projeção no 11. Sem k6 | Projeção |

Saída da suíte em [evidencias/suite-2026-09-30.md](evidencias/suite-2026-09-30.md).
