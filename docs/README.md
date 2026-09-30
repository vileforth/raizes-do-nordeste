# Documentação — Raízes do Nordeste

Documentação técnica da plataforma. O [README da raiz](../README.md) descreve o problema, a arquitetura e como executar o sistema.

| Documento | Conteúdo |
| --- | --- |
| [01-visao-geral.md](01-visao-geral.md) | Problema, atores, módulos e stack |
| [02-casos-de-uso.md](02-casos-de-uso.md) | UC01 a UC10 e o que o código cobre |
| [02-descricoes-casos-de-uso.md](02-descricoes-casos-de-uso.md) | Ator, fluxo, alternativa e regra |
| [casos-de-uso.html](casos-de-uso.html) | Diagrama de casos de uso com zoom |
| [03-arquitetura.md](03-arquitetura.md) | Camadas, ISO 25010, falhas de integração |
| [04-dicionario-de-dados.md](04-dicionario-de-dados.md) | Tabelas e colunas |
| [05-modelo-mer.md](05-modelo-mer.md) | Como ler o diagrama |
| [mer.html](mer.html) | MER com zoom e ficha da tabela |
| [06-relatorio-de-testes.md](06-relatorio-de-testes.md) | 203 testes, 30/09/2026 |
| [evidencias/suite-2026-09-30.md](evidencias/suite-2026-09-30.md) | Saída Jest/Vitest e cobertura da API |
| [07-integrabilidade-e-funcionamento.md](07-integrabilidade-e-funcionamento.md) | Encadeamento entre módulos e limites |
| [08-endpoints.md](08-endpoints.md) | Rotas da API |
| [09-requisitos-de-qualidade.md](09-requisitos-de-qualidade.md) | Nove metas de pedido, pagamento e observabilidade |
| [10-plano-de-qualidade.md](10-plano-de-qualidade.md) | Papéis, cronograma e checklist |
| [11-plano-de-testes.md](11-plano-de-testes.md) | Unitário executado e demais cenários documentados |
| [12-rastreabilidade.md](12-rastreabilidade.md) | Requisito, caso de teste e evidência |
| [13-metricas.md](13-metricas.md) | 203 testes e cobertura de linha da API |
| [14-lgpd.md](14-lgpd.md) | Consentimento na interface e o que ainda não persiste |
| [15-relatorio-de-conformidade.md](15-relatorio-de-conformidade.md) | Situação da qualidade: o que está medido e o que ainda falta |

`mer.html` e `casos-de-uso.html` abrem no navegador, sem servidor.

A execução de 30/09/2026 está em [13-metricas.md](13-metricas.md): 203 testes, nenhuma falha. Cobertura de linha da API: 41,65%. Carga, satisfação, disponibilidade e MTTR continuam como projeção.
