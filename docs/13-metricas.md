# Planilha de métricas

## Testes executados

30 de setembro de 2026, Windows, pnpm 9.15. Saída em [evidencias/suite-2026-09-30.md](evidencias/suite-2026-09-30.md).

| Pacote | Ferramenta | Arquivos | Testes | Falhas | Sucesso |
| --- | --- | --- | --- | --- | --- |
| @raizes/api | Jest 29 | 39 | 133 | 0 | 100% |
| @raizes/web | Vitest 2.1.9 | 23 | 68 | 0 | 100% |
| @raizes/shared | Vitest 2.1.9 | 1 | 2 | 0 | 100% |
| Total | — | 63 | 203 | 0 | 100% |

```powershell
pnpm --filter @raizes/api exec jest --coverage --coverageReporters=text-summary
pnpm --filter @raizes/web test
pnpm --filter @raizes/shared test
```

| Indicador | Valor | Origem |
| --- | --- | --- |
| Testes | 203 / 203 | Soma das três suítes |
| Falha nesta execução | 0% | Nenhuma asserção vermelha |
| Tempo da API | 14,9 s | Jest com cobertura |
| Tempo do web | 14,5 s | Vitest |
| Tempo do shared | 0,5 s | Vitest |
| Execução anterior | 202 / 202 | Relatório 06, antes do caso Resend 502 |
| Variação | +1 | `logs error and does not throw when Resend fails` |

## Cobertura de linha (API, medida)

`jest --coverage` em `apps/api`, 30/09/2026.

| Métrica | Coberto / total | % |
| --- | --- | --- |
| Linhas | 884 / 2122 | 41,65 |
| Instruções | 951 / 2277 | 41,76 |
| Funções | 175 / 358 | 48,88 |
| Ramos | 335 / 1195 | 28,03 |

Meta de linha: 80%. Resultado: 41,65%. A diferença está em controllers, DTOs, `main.ts` e cliente HTTP do Supabase, que a suíte não instancia. Services de pedido, pagamento, estoque, cupom, geo e e-mail estão cobertos.

Web sem relatório de linhas (Vitest sem provider de coverage).

## Indicadores operacionais (projeção)

Não misturar com as duas tabelas acima.

| Indicador | Meta | Valor | Coleta | Uso |
| --- | --- | --- | --- | --- |
| Defeito crítico | ≤ 2% | 1,1% (estoque sem baixa) | Checklist do plano 10 | Debitar estoque na transação do pedido |
| Cobertura de linha | ≥ 80% | 41,65% na API | Jest `--coverage` | Subir testes de controller e DTO |
| Tempo de resposta | abaixo de 2 s | 1,6 s (TS11) | `duration` do interceptor / k6 | Aceitar release se P95 real ficar abaixo de 2 s |
| Disponibilidade | ≥ 99,5% | 99,6% | `GET /health` | Investigar se cair |
| Satisfação | > 85% | 88% | Pesquisa 1 a 5 | Revisar mobile se cair |
| MTTR | < 24 h | 6 h | Abertura até o patch | Priorizar sessão e estoque |
