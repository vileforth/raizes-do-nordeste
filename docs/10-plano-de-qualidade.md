# Plano de qualidade

Como a qualidade é controlada na plataforma. Os papéis abaixo são da equipe. No software permanecem CLIENTE, ATENDENTE, COZINHEIRO, GERENTE e ADMINISTRADOR.

## Papéis e responsabilidades

| Papel | Quem assume | Responsabilidade |
| --- | --- | --- |
| QA | Responsável de qualidade | Plano de testes, rastreio, métricas e homologação |
| Desenvolvimento | Equipe do monorepo | Código, Jest, Vitest e correção de defeito |
| Produto | Representante da rede | Aceite do fluxo de pedido, pagamento simulado e fidelidade |
| Revisor de privacidade | Responsável pela seção LGPD | Consentimento na interface, cookies e escopo por papel |

## Escopo

- As oito metas de pedido e pagamento, em [09-requisitos-de-qualidade.md](09-requisitos-de-qualidade.md).
- Os 202 testes unitários já executados, em [06-relatorio-de-testes.md](06-relatorio-de-testes.md).
- Os demais tipos de teste em [11-plano-de-testes.md](11-plano-de-testes.md). Onde não houve execução, o documento registra.
- LGPD da interface, em [14-lgpd.md](14-lgpd.md).

Fora do plano: adquirente real, operação comercial das lojas e infraestrutura física.

## Cronograma semanal

| Semana | Atividade | Dono | Saída |
| --- | --- | --- | --- |
| 1 | Fechar RQ01 a RQ08 | QA | Documento 09 |
| 2 | Revisar Jest e Vitest do fluxo de pedido | Desenvolvimento | Documento 06, se a suíte mudar |
| 3 | Escrever cenários de sistema, carga e segurança | QA | Documento 11 |
| 4 | Homologar cadastro, aviso e pedido no site | Produto e QA | Checklist abaixo |
| 5 | Consolidar métricas e conformidade | QA | Documentos 13 e 15 |

## Checklist de release

- [ ] Jest da API sem falha
- [ ] Vitest do web sem falha
- [ ] Login, cadastro com consentimento e `/privacidade` acessíveis sem sessão
- [ ] Pedido na unidade correta; estoque insuficiente recusado
- [ ] Pagamento confirmado sem gateway
- [ ] Cupom vencido ou inativo recusado
- [ ] Sessão inválida devolve ao login
- [ ] Gerente não lê estoque de outra loja
- [ ] Textos de privacidade em pt-BR e en
- [ ] Matriz de rastreio do release preenchida

## Ferramentas

| Atividade | Ferramenta | Evidência |
| --- | --- | --- |
| Unitário da API | Jest | Executada |
| Unitário do web | Vitest | Executada |
| Integração com banco | Documento 11 | Documentada, sem execução |
| Carga de 500 usuários | Documento 11 | Documentada, sem execução |
| Indicadores de SLA | Documento 13 | Documentados, sem medição de campo |

## Riscos acompanhados

| Risco | Efeito | Tratamento |
| --- | --- | --- |
| Estoque conferido sem baixa | Duas vendas podem passar na leitura | Cenário negativo no plano de testes; correção futura na mesma transação do pedido |
| Cookie mais longo que o JWT | Tela travada | Refresh no BFF e redirecionamento ao login |
| Consentimento só no formulário | Sem prova persistida do aceite | Declarado em 14-lgpd.md |
