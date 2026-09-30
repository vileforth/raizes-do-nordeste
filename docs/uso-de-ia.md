# Uso de inteligência artificial

Arquivo à parte. Não entra no índice da documentação da plataforma.

As ferramentas abaixo foram usadas no Cursor para organizar texto, revisar tom, montar tabela, diagrama e um teste pontual. A regra de negócio, o que já estava no código e os números medidos da suíte continuam do repositório.

## Modelos

| Modelo | Onde entrou |
| --- | --- |
| Grok 4.7 | Texto das docs, tom, matriz e cenários |
| Anthropic Opus 4.7 | Revisão de arquitetura, casos de uso e o que a API realmente faz |
| Claude Sonnet | Rascunho de tabela, diagrama HTML e ajuste de teste |

Não houve um modelo só. O mesmo assunto passou por mais de um quando o texto saía genérico ou quando o cenário não batia com o código.

## O que foi pedido

- Documentação da rede: visão, casos de uso, arquitetura, dicionário, MER, testes, endpoints.
- Cupom criado a partir da promoção.
- Sessão vencida: renovar uma vez e, se falhar, voltar ao login.
- Consentimento no cadastro e página de privacidade.
- Oito metas de pedido e pagamento, plano de qualidade, cenários, rastreio e métricas.
- Contagem real da suíte e, depois, cobertura de linha da API (41,65%).
- Revisão de tom: sem primeira pessoa, texto descrevendo o sistema.
- Canais, falha do Nominatim e do Resend, log, auditoria e descrição formal dos casos de uso.
- Diagrama de casos de uso no mesmo estilo do MER.

## O que não foi delegado

- Pagamento sem adquirente.
- Estoque conferido sem baixa automática.
- O que é medido (203 testes, 0 falhas, cobertura da API) e o que é projeção (carga, estresse, UAT, satisfação, MTTR).
- Decisão de não gravar o aceite no banco nesta versão.

## Prompts

Os pedidos abaixo são os que de fato foram feitos, só escritos com mais contexto do que a frase solta do chat.

**Documentação e diagrama**

Quero a documentação da Raízes do Nordeste no nível de quem opera o sistema, não um resumo genérico. Visão, casos de uso, arquitetura, dicionário, MER, testes, como os módulos se encadeiam e a lista de endpoints. O MER precisa abrir no navegador, com zoom no cursor, arraste e clique na tabela mostrando PK, UK, FK e tipo. Tudo na pasta docs.

**Cupom na promoção**

Na tela da promoção, além de listar, preciso criar cupom ligado àquela promoção. Código em maiúsculas, validação no formulário e a API recusando código duplicado.

**Sessão**

Se o token morreu, a tela fica travada e não manda para o login. Só deslogar na mão resolve. Quero renovar a sessão uma vez no BFF e, se o refresh falhar, limpar o cookie e ir para `/login`.

**Qualidade, métricas e privacidade**

Fecha requisitos mensuráveis de pedido e pagamento, plano de qualidade com papéis e cronograma, plano de testes com cenário positivo e negativo, matriz requisito-teste-evidência e planilha de métricas. Onde não houve execução, deixa claro que é projeção. LGPD tem que aparecer na tela: checkbox no cadastro e página pública de privacidade. Nas métricas, usa o número que a suíte realmente devolveu, não um percentual inventado.

**Tom**

Relê todas as docs. Tira linguagem de texto gerado. Sem primeira pessoa. Português direto, bem escrito. O texto descreve o sistema.
