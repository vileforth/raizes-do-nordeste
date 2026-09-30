# Planilha de métricas

## Testes executados

30 de setembro de 2026, Windows, pnpm 9.15.

| Pacote | Ferramenta | Arquivos | Testes | Falhas | Sucesso |
| --- | --- | --- | --- | --- | --- |
| @raizes/api | Jest 29 | 39 | 132 | 0 | 100% |
| @raizes/web | Vitest 2.1.9 | 23 | 68 | 0 | 100% |
| @raizes/shared | Vitest 2.1.9 | 1 | 2 | 0 | 100% |
| Total | — | 63 | 202 | 0 | 100% |

```powershell
pnpm --filter @raizes/api exec jest
pnpm --filter @raizes/web test
pnpm --filter @raizes/shared test
```

| Indicador | Valor | Origem |
| --- | --- | --- |
| Testes | 202 / 202 | Soma das três suítes |
| Falha nesta execução | 0% | Nenhuma asserção vermelha |
| Tempo da API | 11,6 s | Jest |
| Tempo do web | 15,0 s | Vitest |
| Tempo do shared | 0,9 s | Vitest |
| Execução anterior | 189 / 189 em 28/09/2026 | Relatório 06 |
| Variação | +13 | Refresh, cupom, sessão, consentimento |

Prisma e serviços externos estão mockados. Estes números não são cobertura de linha, teste de carga nem teste contra o banco.

## Indicadores operacionais (projeção)

Valores abaixo não vieram de APM, pesquisa nem `--coverage`. São metas e projeções para acompanhamento. Não misturar com a tabela da suíte.

| Indicador | Meta | Valor projetado | Forma de coleta | Uso |
| --- | --- | --- | --- | --- |
| Defeito crítico | ≤ 2% | 1,1% (estoque sem baixa automática) | Falhas abertas / itens do checklist | Registrar o débito e seguir o release |
| Cobertura de linha | ≥ 80% | Não gerada. Existem 202 testes unitários | Jest/Vitest `--coverage` | Só afirmar cobertura depois do relatório |
| Tempo de resposta | < 2 s | 1,4 s (projeção) | Latência de `/api/orders` e `/api/payments` | Aceitar o release se o P95 real ficar abaixo de 2 s |
| Disponibilidade | ≥ 99,5% | 99,6% | `GET /health` no mês | Investigar se cair abaixo da meta |
| Satisfação | > 85% | 88% | Pesquisa 1 a 5 depois do pedido | Revisar usabilidade mobile se cair |
| MTTR | < 24 h | 6 h | Abertura do defeito até o patch | Priorizar sessão e estoque |
