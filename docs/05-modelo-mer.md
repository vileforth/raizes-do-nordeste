# Modelo entidade-relacionamento

O diagrama está em [mer.html](mer.html). Abra o arquivo no navegador. A roda do mouse aproxima e afasta o ponto sob o cursor. Arrastar o fundo move o diagrama. Os botões `+`, `−`, `Ajustar` e `100%` repetem esses controles. Um clique na tabela mostra colunas, PK, UK, FK e tipo.

## Cores

| Cor | Área | Tabelas |
| --- | --- | --- |
| Petróleo | Acesso e pessoas | usuario, perfil, usuario_perfil, cliente, funcionario |
| Laranja | Rede e estoque | unidade, estoque, estoque_produto |
| Verde | Cardápio | produto |
| Marrom | Pedidos | pedido, item_pedido, pagamento, hist_status_pedido |
| Roxo | Promoções | promocao, cupom, promocao_unidade, promocao_produto |
| Âmbar | Fidelidade | programa_fidelidade, cliente_fidelidade, movimentacao_pontos, beneficio, resgate_beneficio |
| Azul | Atendimento | atendimento, hist_atendimento, log_auditoria |

## Cardinalidades

| Relação | Cardinalidade |
| --- | --- |
| usuario — cliente | 1 para 0..1 |
| usuario — funcionario | 1 para 0..1 |
| usuario — perfil | N para N, via usuario_perfil |
| unidade — estoque | 1 para 0..1 |
| estoque — produto | N para N, via estoque_produto |
| cliente — pedido | 1 para N |
| unidade — pedido | 1 para N |
| pedido — pagamento | 1 para 0..1 |
| pedido — item_pedido | 1 para N |
| promocao — unidade / produto | N para N |
| cliente — programa_fidelidade | N para N, via cliente_fidelidade |
| cliente — atendimento | 1 para N |

## O que o modelo cobre

- Uma conta pode ser cliente, funcionário, os dois ou nenhum. O administrador da rede não precisa de ficha de funcionário.
- A unidade concentra equipe, estoque, pedido e promoção.
- O item do pedido guarda o preço no momento da venda, separado do preço atual do produto.
- Pontos não ficam só no saldo. Cada crédito e débito vira linha em `movimentacao_pontos`.
- Pedido e atendimento têm histórico de quem registrou a mudança de status.
- `log_auditoria` liga a ação ao usuário quando existe sessão.

O schema fonte é `apps/api/prisma/schema.prisma`.
