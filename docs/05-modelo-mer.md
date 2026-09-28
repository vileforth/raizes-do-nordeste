# Modelo entidade-relacionamento

O diagrama navegável está em [mer.html](mer.html). Abra o arquivo no navegador. A roda do mouse aproxima e afasta o ponto sob o cursor. Arrastar o fundo move o diagrama. Os botões `+`, `−`, `Ajustar` e `100%` repetem esses controles. Clicar numa tabela abre as colunas, o papel (PK, UK, FK) e o tipo.

## Domínios

| Cor | Domínio | Tabelas |
| --- | --- | --- |
| Petróleo | Acesso e pessoas | usuario, perfil, usuario_perfil, cliente, funcionario |
| Laranja | Rede e estoque | unidade, estoque, estoque_produto |
| Verde | Catálogo | produto |
| Marrom | Pedidos | pedido, item_pedido, pagamento, hist_status_pedido |
| Roxo | Promoções | promocao, cupom, promocao_unidade, promocao_produto |
| Âmbar | Fidelidade | programa_fidelidade, cliente_fidelidade, movimentacao_pontos, beneficio, resgate_beneficio |
| Azul | Atendimento | atendimento, hist_atendimento, log_auditoria |

## Cardinalidades principais

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

## Características do projeto refletidas no modelo

- Uma conta pode ser cliente, funcionário, os dois ou nenhum. O administrador da rede não precisa de ficha de funcionário.
- A unidade concentra equipe, estoque, pedidos e promoções.
- O pedido guarda o preço do item no momento da venda, separado do preço atual do produto.
- Pontos não ficam só num saldo: cada crédito e débito vira `movimentacao_pontos`.
- Status de pedido e de atendimento têm histórico, com o usuário que registrou a mudança.
- `log_auditoria` liga a ação ao usuário quando a sessão existe.

O schema fonte é `apps/api/prisma/schema.prisma`.
