# Rastreabilidade

Matriz requisito → caso de teste → evidência. Uma linha para cada RQ de [09-requisitos-de-qualidade.md](09-requisitos-de-qualidade.md).

Evidência simulada não teve execução anexada. Evidência medida cita arquivo da suíte de 30/09/2026.

| ID | Requisito | Caso de teste | Evidência | Tipo |
| --- | --- | --- | --- | --- |
| RT01 | RQ01 Tempo de resposta abaixo de 2 s | TS11 Carga de 500 usuários | Cenário TS11 no documento 11. Sem ferramenta de carga | Simulada |
| RT02 | RQ02 Três ações depois do carrinho | TS10 Compra no mobile | Cenário TS10. Sem gravação de sessão | Simulada |
| RT03 | RQ03 Isolamento por unidade | TS07 Gerente em outra loja | `stock.service.spec.ts`, caso `blocks manager from another unit stock` | Medida |
| RT04 | RQ04 Pagamento só simulado | TS05 Confirmação mock | `payments.service.spec.ts`, caso `confirms pending payment and sets paidAt` | Medida |
| RT05 | RQ05 Cupom inválido | TS06 Cupom vencido | `coupons.service.spec.ts`, caso `rejects expired coupon` | Medida |
| RT06 | RQ06 Estoque insuficiente | TS03 Pedido acima do saldo | `orders.service.spec.ts`, caso `rejects insufficient stock` | Medida |
| RT07 | RQ07 Sessão expirada | TS08 Refresh inválido | `session-redirect.test.ts` e `session-refresh.test.ts` | Medida |
| RT08 | RQ08 Mesma máquina de status | TS04 Pedido RECEBIDO e TS12 Balcão | `order-status.machine.spec.ts`. TS12 permanece sem execução | Parcial |
| RT09 | Consentimento no cadastro | TS02 Checkbox obrigatório | `login.schema.test.ts`, cadastro sem `privacyConsent` | Medida |
| RT10 | Divergência no pagamento | TS09 Valor diferente | `payments.service.spec.ts`, caso `rejects value mismatch on confirm` | Medida |

RT09 e RT10 reforçam segurança e integração.

Para conferir evidência medida: abrir o arquivo citado e o nome do caso. A contagem está em [06-relatorio-de-testes.md](06-relatorio-de-testes.md). Se a suíte mudar, a data desse relatório e esta matriz precisam ser atualizadas.
