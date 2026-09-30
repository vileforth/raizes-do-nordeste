# Dicionário de dados

O modelo tem 25 tabelas. `cliente` e `unidade` incluem endereço e coordenadas; os históricos se chamam `hist_status_pedido` e `hist_atendimento`. Colunas acrescentadas depois do desenho inicial estão marcadas.

Tipos: inteiro, texto, booleano, decimal(10,2), data/hora, float e enum do Prisma.

## usuario

Conta de acesso. 7 colunas.

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_usuario | inteiro | PK |
| nome | texto | obrigatório |
| email | texto | único |
| senha_hash | texto | senha fica no Supabase; o banco guarda marcador |
| telefone | texto | obrigatório |
| status | enum | ATIVO, INATIVO, BLOQUEADO |
| data_cadastro | data/hora | default agora |

## perfil

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_perfil | inteiro | PK |
| nome | texto | único. Valores: CLIENTE, ATENDENTE, COZINHEIRO, GERENTE, ADMINISTRADOR |
| descricao | texto | obrigatório |
| ativo | booleano | obrigatório |

## usuario_perfil

Associação N:N entre conta e perfil. Chave composta.

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_usuario | inteiro | PK, FK usuario |
| id_perfil | inteiro | PK, FK perfil |

## cliente

Ficha comercial. Além de CPF e vínculo com a conta, guarda nascimento, endereço e posição no mapa.

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_cliente | inteiro | PK |
| id_usuario | inteiro | único, FK usuario. 1:0..1 |
| cpf | texto | único |
| data_nascimento | data/hora | opcional |
| endereco | texto | default vazio |
| cidade | texto | default vazio |
| estado | texto | default vazio |
| cep | texto | default vazio |
| id_unidade_preferida | inteiro | FK unidade, opcional |
| latitude | float | opcional, mapa |
| longitude | float | opcional, mapa |
| data_cadastro | data/hora | default agora |
| ativo | booleano | obrigatório |

## funcionario

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_funcionario | inteiro | PK |
| id_usuario | inteiro | único, FK usuario |
| id_unidade | inteiro | FK unidade |
| matricula | texto | único |
| cargo | texto | papel operacional |
| ativo | booleano | obrigatório |

## unidade

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_unidade | inteiro | PK |
| nome | texto | obrigatório |
| endereco | texto | obrigatório |
| telefone | texto | obrigatório |
| status | enum | ATIVA, INATIVA, MANUTENCAO |
| data_cadastro | data/hora | default agora |
| latitude | float | opcional |
| longitude | float | opcional |

## produto

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_produto | inteiro | PK |
| nome | texto | obrigatório |
| descricao | texto | obrigatório |
| preco | decimal(10,2) | obrigatório |
| categoria | texto | obrigatório |
| ativo | booleano | obrigatório |

## estoque

Um estoque por unidade.

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_estoque | inteiro | PK |
| id_unidade | inteiro | único, FK unidade |
| status | texto | obrigatório |

## estoque_produto

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_estoque_produto | inteiro | PK |
| id_estoque | inteiro | FK estoque |
| id_produto | inteiro | FK produto |
| quantidade | inteiro | obrigatório |
| estoque_minimo | inteiro | obrigatório |

Único composto: `(id_estoque, id_produto)`.

## pedido

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_pedido | inteiro | PK |
| id_cliente | inteiro | FK cliente |
| id_unidade | inteiro | FK unidade |
| status | enum | RECEBIDO, EM_PREPARACAO, PRONTO, RETIRADO |
| tipo_consumo | enum | CONSUMO_NO_LOCAL, RETIRADA_NO_BALCAO |
| valor_total | decimal(10,2) | calculado pelos itens |
| codigo_pedido | texto | único |
| data_criacao | data/hora | default agora |
| data_atualizacao | data/hora | atualizado pelo Prisma |

## item_pedido

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_item_pedido | inteiro | PK |
| id_pedido | inteiro | FK pedido |
| id_produto | inteiro | FK produto |
| quantidade | inteiro | obrigatório |
| preco_unitario | decimal(10,2) | preço no momento do pedido |
| subtotal | decimal(10,2) | quantidade × preço |

## pagamento

Um pagamento por pedido.

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_pagamento | inteiro | PK |
| id_pedido | inteiro | único, FK pedido |
| metodo | enum | CARTAO_DEBITO, CARTAO_CREDITO, PIX |
| valor | decimal(10,2) | obrigatório |
| status | enum | PENDENTE, CONFIRMADO, RECUSADO, CANCELADO |
| data_pagamento | data/hora | opcional |
| codigo_transacao | texto | único |

## hist_status_pedido

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_historico_status | inteiro | PK |
| id_pedido | inteiro | FK pedido |
| status | enum | status registrado |
| data_hora | data/hora | default agora |
| id_usuario | inteiro | FK usuario |
| observacao | texto | opcional |

## promocao

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_promocao | inteiro | PK |
| nome | texto | obrigatório |
| descricao | texto | obrigatório |
| regra | texto | obrigatório |
| data_inicio | data/hora | obrigatório |
| data_fim | data/hora | obrigatório |
| status | enum | ATIVA, INATIVA, ENCERRADA, AGENDADA |

## cupom

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_cupom | inteiro | PK |
| id_promocao | inteiro | FK promocao |
| codigo | texto | único |
| validade | data/hora | obrigatório |
| limite_uso | inteiro | obrigatório |
| ativo | booleano | obrigatório |

## promocao_unidade e promocao_produto

Chaves compostas. Ligam a promoção às unidades e aos produtos participantes.

## programa_fidelidade

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_programa | inteiro | PK |
| nome | texto | obrigatório |
| descricao | texto | obrigatório |
| status | texto | obrigatório |

## cliente_fidelidade

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_cliente_fidelidade | inteiro | PK |
| id_cliente | inteiro | FK cliente |
| id_programa | inteiro | FK programa |
| saldo_pontos | inteiro | obrigatório |
| nivel | enum | BRONZE, PRATA, OURO |
| data_adesao | data/hora | default agora |
| status | texto | obrigatório |

Único composto: `(id_cliente, id_programa)`.

## movimentacao_pontos

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_movimentacao | inteiro | PK |
| id_cliente_fidelidade | inteiro | FK |
| tipo | enum | CREDITO, DEBITO |
| pontos | inteiro | obrigatório |
| origem | texto | obrigatório |
| data_hora | data/hora | default agora |
| observacao | texto | opcional |

## beneficio

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_beneficio | inteiro | PK |
| nome | texto | obrigatório |
| descricao | texto | obrigatório |
| pontos_necessarios | inteiro | obrigatório |
| validade | data/hora | obrigatório |
| ativo | booleano | obrigatório |

## resgate_beneficio

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_resgate | inteiro | PK |
| id_cliente_fidelidade | inteiro | FK |
| id_beneficio | inteiro | FK |
| data_resgate | data/hora | default agora |
| status | texto | obrigatório |
| codigo_resgate | texto | único |

## atendimento

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_atendimento | inteiro | PK |
| id_cliente | inteiro | FK cliente |
| id_usuario_responsavel | inteiro | FK usuario, opcional |
| protocolo | texto | único |
| tipo | enum | PEDIDO, SUPORTE, PAGAMENTO, FIDELIDADE |
| descricao | texto | obrigatório |
| status | enum | ABERTO, EM_ATENDIMENTO, RESOLVIDO, FECHADO, CANCELADO |
| data_abertura | data/hora | default agora |
| data_atualizacao | data/hora | atualizado pelo Prisma |

## hist_atendimento

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_historico | inteiro | PK |
| id_atendimento | inteiro | FK |
| id_usuario | inteiro | FK usuario |
| status | enum | status registrado |
| observacao | texto | opcional |
| data_hora | data/hora | default agora |

## log_auditoria

| Coluna | Tipo | Restrição |
| --- | --- | --- |
| id_log | inteiro | PK |
| id_usuario | inteiro | FK usuario, opcional |
| acao | enum | ALTERAR, ALTERAR_STATUS, APLICAR_CUPOM, CADASTRO, CONSULTAR, CRIAR, LOGIN, PAGAMENTO |
| entidade | texto | nome lógico do recurso |
| id_entidade | inteiro | identificador afetado |
| data_hora | data/hora | default agora |
| detalhes | texto | opcional |
