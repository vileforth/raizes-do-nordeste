# Relatório de conformidade

Situação em 30/09/2026. Suíte: 203 testes, 0 falhas. Cobertura de linha da API: 41,65%. Evidência em [evidencias/suite-2026-09-30.md](evidencias/suite-2026-09-30.md).

| Área | Documentos | Situação |
| --- | --- | --- |
| Problema e casos de uso | [01](01-visao-geral.md), [02](02-casos-de-uso.md), [02-descricoes](02-descricoes-casos-de-uso.md), [casos-de-uso.html](casos-de-uso.html) | UC01 a UC10 descritos. Diagrama com zoom. Canais WEB, BALCÃO, PICKUP, APP e TOTEM explícitos |
| Arquitetura e qualidade | [03](03-arquitetura.md), [07](07-integrabilidade-e-funcionamento.md), [09](09-requisitos-de-qualidade.md) | Camadas, ISO 25010, falha de Resend e Nominatim. RQ01 e RQ02 ainda sem P95 de campo |
| Testes | [10](10-plano-de-qualidade.md), [11](11-plano-de-testes.md), [12](12-rastreabilidade.md), [06](06-relatorio-de-testes.md) | 16 cenários. Unitário e integração mock medidos. Carga, estresse, UAT e mobile em projeção |
| Métricas | [13](13-metricas.md) | 203/203 e cobertura de linha medidos. SLA restante em projeção |
| Privacidade | [14](14-lgpd.md) | Consentimento na tela. Aceite ainda não grava no banco |
| Diagramas | [mer.html](mer.html), [casos-de-uso.html](casos-de-uso.html) | MER e casos de uso no navegador |

## Fechamento

Pedido, estoque, pagamento mock e papéis seguem a mesma regra no canal web. Winston, auditoria e `/health` dão o rastro do fluxo.

Ainda aberto: débito automático de estoque, persistência do aceite, clientes APP/TOTEM e carga real com k6.
