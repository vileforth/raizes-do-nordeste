**PROJETO MULTIDISCIPLINAR**  
**TRILHA: QUALIDADE DE SOFTWARE**  
**REDE “RAIZES DO NORDESTE”**

Bruno Villefort Hostalacio  
Curso:  
Área: 

**Analise do problema e requisitos**

Trata-se de uma rede de franquias do setor alimentício em processo de expansão.A rede precisa de um sistema integrado que visa padronizar o atendimento ao cliente, integrar operações entre unidades e assegurar desempenho, confiabilidade, segurança e consistência na experiência digital oferecida aos usuários gerenciar pedidos, promoções; sistema de fidelização e operação de várias unidades.

# **Tabela de escopo técnico**

| UC | Funcionalidade | Entrada | Processamento principal | Saída / Resultado | Dados envolvidos | Perfis envolvidos | API necessária  proposta inicial |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| UC01 | Gerenciar acesso e cadastro | Dados cadastrais e credenciais | Validar dados, cadastrar, autenticar e atualizar informações | Conta criada/atualizada ou acesso autorizado | Cliente, credenciais, dados cadastrais | Cliente, Atendente | POST /clientes · POST /auth/login · GET /clientes/{id} · PUT /clientes/{id} |
| UC02 | Gerenciar pedidos | Cliente, produtos, quantidades e personalizações | Consultar cardápio, montar carrinho, validar disponibilidade, registrar pedido e controlar alterações | Pedido registrado com status Recebido | Cliente, produto, pedido, itens do pedido, unidade | Cliente, Atendente, Cozinheiro | GET /produtos · POST /pedidos · GET /pedidos/{id} · PUT /pedidos/{id} · PUT /pedidos/{id}/status |
| UC03 | Realizar pagamento | Pedido, valor e método de pagamento | Selecionar método, enviar solicitação, validar retorno e registrar pagamento | Pagamento confirmado ou recusado | Pedido, pagamento, transação | Cliente, Atendente | POST /pagamentos · GET /pagamentos/{id} · POST /pagamentos/{id}/confirmar |
| UC04 | Acompanhar pedido | Identificador do pedido | Consultar o status atual do pedido | Status apresentado ao usuário | Pedido, status, histórico | Cliente, Cozinheiro | GET /pedidos/{id}/status |
| UC05 | Gerenciar promoções | Dados da promoção, regras, validade e unidades | Criar/configurar, consultar, validar, ativar/desativar e aplicar promoções | Promoção registrada/atualizada ou benefício aplicado | Promoção, regras, cupom, unidade, produto | Cliente, Atendente, Gerente, Administrador | GET /promocoes · POST /promocoes · PUT /promocoes/{id} · POST /promocoes/{id}/ativar · POST /cupons/validar |
| UC06 | Gerenciar fidelização | Cliente, pontos, benefícios e regras do programa | Consultar saldo/histórico, acumular pontos, gerenciar níveis e resgatar benefícios | Saldo/benefício atualizado | Cliente, pontos, benefícios, níveis, histórico | Cliente, Administrador | GET /clientes/{id}/fidelidade · GET /clientes/{id}/pontos · GET /beneficios · POST /beneficios/{id}/resgate |
| UC07 | Realizar atendimento | Solicitação do cliente | Registrar solicitação, gerar protocolo, acompanhar e atualizar atendimento | Atendimento registrado/atualizado | Cliente, atendimento, protocolo, histórico | Cliente, Atendente | POST /atendimentos · GET /atendimentos/{id} · PUT /atendimentos/{id} |
| UC08 | Gerenciar operação da unidade | Dados da unidade, pedidos, estoque e funcionários | Consultar e operar informações da unidade conforme permissões | Dados consultados/atualizados | Unidade, funcionários, estoque, pedidos | Gerente | GET /unidades/{id} · GET /unidades/{id}/pedidos · GET /unidades/{id}/estoque · GET /unidades/{id}/funcionarios |
| UC09 | Gerenciar rede | Dados das unidades, usuários, promoções, fidelização e operações | Administrar informações e configurações em nível de rede | Dados da rede cadastrados/alterados | Unidades, usuários, permissões, promoções, fidelização | Administrador | GET /unidades · POST /unidades · PUT /unidades/{id} · GET /usuarios · PUT /usuarios/{id}/permissoes |
| UC10 | Consultar indicadores e relatórios | Filtros, período e tipo de indicador | Consultar, processar e consolidar dados | Indicadores e relatórios apresentados | Pedidos, unidades, estoque, promoções, fidelização | Gerente, Administrador | GET /indicadores · GET /relatorios · GET /relatorios/{tipo} |

# Mapa funcional do sistema:

**Atores**

* Cliente  
* Atendente  
* Cozinheiro  
* Gerente  
* Administrador

**Módulos**

* Atendimento  
* Pedidos  
* Pagamento  
* Promoções  
* Fidelização  
* Gestão das unidades  
* Indicadores/relatórios

**Canais**

* APP  
* WEB  
* TOTEM  
* BALCÃO

# Mapa geral do sistema 

[**https://app.diagrams.net/**](https://app.diagrams.net/) 

| UC | Caso de uso | Atores principais | Requisitos funcionais | Requisitos nao funcionais |
| ----- | ----- | ----- | ----- | ----- |
| UC01 | Gerenciar acesso e cadastro | Cliente, funcionários |  |  |
| UC02 | Gerenciar pedidos | Cliente, Atendente, Cozinheiro, Gerente, Administrador |  |  |
| UC03 | Realizar pagamento | Cliente, Atendente |  |  |
| UC04 | Acompanhar pedido | Cliente, Atendente, Cozinheiro, Gerente |  |  |
| UC05 | Gerenciar promoções | Administrador, Gerente, Atendente, Cliente |  |  |
| UC06 | Gerenciar fidelização | Cliente, Gerente, Administrador |  |  |
| UC07 | Realizar atendimento | Cliente, Atendente |  |  |
| UC08 | Gerenciar operação da unidade | Gerente |  |  |
| UC09 | Gerenciar rede | Administrador |  |  |
| UC10 | Consultar indicadores e relatórios | Gerente, Administrador |  |  |

# Dados 

[dicionario de dados](https://docs.google.com/spreadsheets/d/1cI-PHNKVeLZLjm665kBOnwuxNlDJu-aIxFYdnv-mxrc/edit?gid=1110511202#gid=1110511202)[base de dados - 1 ano - teste](https://docs.google.com/spreadsheets/d/1fqSEz0KB9gSYNCxiASm2bk3ASFCkFB8Manf_7A3i1ug/edit?gid=206880106#gid=206880106)

#  Use cases 

# UC 01 – Gerenciar acesso e cadastro

**Descrição:** Permitir que o cliente realize seu cadastro no sistema e posteriormente utilize suas credenciais para acessar sua conta e consultar ou atualizar seus dados.

**Ator principal:** Cliente.

**Demais atores:** N/C.

**Pré-condições:**

* Para cadastro: sistema disponível e cliente ainda não cadastrado conforme as regras de identificação.  
* Para acesso: cliente possui cadastro e credenciais de acesso.

**Pós-condições:**

* Cadastro realizado/atualizado com sucesso; ou  
* Cliente autenticado e com acesso às funcionalidades permitidas.

**Origem das informações:** dados fornecidos pelo cliente e dados armazenados pelo sistema.

**Usuários responsáveis:** Cliente.

**Pendências:** Definir campos obrigatórios e regras de identificação do cliente.

**Fluxo base:cadastro**

1. **Sistema apresenta a opção de cadastro.**  
2. **Cliente informa os dados solicitados.**  
3. **Sistema valida os dados informados.**  
4. **Cliente confirma o cadastro.**  
5. **Sistema registra os dados.**  
6. **Sistema informa a conclusão do cadastro.**

**Fluxo base \- acesso**

1. **Cliente informa suas credenciais.**  
2. **Sistema valida as informações.**  
3. **Sistema autentica o cliente.**  
4. **Sistema disponibiliza as funcionalidades correspondentes ao seu perfil.**

**Fluxo alternativo**

1. **Caso os dados informados sejam inválidos, o sistema informa o erro e solicita a correção.**  
2. **Caso o cliente já possua cadastro, o sistema não deve criar um novo cadastro para os mesmos dados identificadores definidos pelas regras do sistema.**

**Regras de negócio:**

* RN01: campos obrigatórios devem ser preenchidos.  
* RN02: credenciais devem ser validadas antes da autenticação.  
* RN03: sistema gera identificador interno único para cada cliente.  
* RN04: definir quais dados cadastrais são obrigatórios e quais serão utilizados para identificação/comunicação.  
* RN05: definir como será registrada a preferência/autorização para comunicação promocional.

---

# UC 02 – Gerenciar pedidos

**Descrição: P**rocesso pelo qual o cliente ou atendente consulta o cardápio, seleciona e personaliza os itens, confirma o pedido e o encaminha para a etapa de preparação.

**Ator principal:**  
Cliente (canais APP, WEB e TOTEM) ou Atendente (canal BALCÃO).

**Demais atores:**  
Gerente.

**Pré-condições:**

1. O sistema deve estar operacional.  
2. A unidade deve estar aberta para recebimento de pedidos.  
3. O cardápio deve estar disponível no sistema.  
4. Os produtos devem possuir informações de disponibilidade atualizadas.

**Pós-condições:**

1. O pedido é gravado no banco de dados.  
2. O pedido recebe o status **"Recebido"**.  
3. O pedido é disponibilizado para a etapa de preparação.  
4. O sistema gera um código/senha de identificação do pedido.  
5. O sistema apresenta ao cliente as informações necessárias para acompanhamento do pedido.

**Origem das informações:**

1. Dados inseridos pelo cliente ou atendente.  
2. Cadastro de produtos do sistema.  
3. Informações de disponibilidade dos produtos.  
4. Dados do cadastro do cliente, quando identificado.

**Usuários responsáveis:**  
Cliente e Atendente

**Pendências:**  
N/C.

## **Fluxo base**

1. O ator inicia a navegação pelo canal escolhido: APP, WEB, TOTEM ou BALCÃO.  
2. O sistema apresenta o cardápio disponível, organizado por categorias.  
3. O ator seleciona o produto desejado.  
4. O ator realiza a personalização do produto, quando disponível.  
5. O sistema valida as opções selecionadas e atualiza o conteúdo do carrinho.  
6. O ator confirma os itens do carrinho.  
7. O ator informa ou seleciona o tipo de consumo: **Retirada no Balcão** ou **Consumo no Local**.  
8. O sistema valida as informações do pedido.  
9. O sistema registra o pedido.  
10. O sistema gera um código/senha de identificação.  
11. O sistema atribui ao pedido o status **"Recebido"**.  
12. O sistema disponibiliza o pedido para a etapa de preparação.  
13. O sistema apresenta a confirmação do pedido e as informações necessárias para seu acompanhamento.

## **Fluxos alternativos**

**FA01 – Alteração do pedido antes do início da preparação**

1. O ator solicita a alteração de um pedido com status **"Recebido"**.  
2. O sistema verifica se o pedido ainda permite alterações.  
3. O ator adiciona, remove ou modifica itens do pedido.  
4. O sistema valida as alterações.  
5. O sistema recalcula as informações do pedido.  
6. O sistema registra a alteração.  
7. O sistema mantém o pedido com status **"Recebido"**.

**FA02 – Tentativa de alteração após início da preparação**

1. O ator solicita a alteração de um pedido com status **"Em Preparação"**.  
2. O sistema identifica que o pedido já iniciou a preparação.  
3. O sistema bloqueia a alteração direta do pedido.  
4. O sistema informa ao ator que o pedido não pode mais ser alterado por esse fluxo.  
5. O caso de uso é encerrado sem alteração.

**FA03 – Produto indisponível**

1. O ator seleciona um produto que não está disponível.  
2. O sistema identifica a indisponibilidade.  
3. O sistema impede a inclusão do produto no pedido.  
4. O sistema informa a indisponibilidade ao ator.  
5. O ator pode selecionar outro produto disponível.

## **Regras de negócio**

**RN01 – Disponibilidade de produtos**  
O sistema não deve permitir a inclusão de produtos indisponíveis no pedido.

**RN02 – Personalização dos produtos**  
Cada produto deve respeitar as opções de personalização e os limites definidos em seu cadastro.

**RN03 – Alteração do pedido**  
O pedido poderá ser alterado enquanto estiver com status **"Recebido"**. Após o início da preparação, alterações diretas pelo cliente devem ser bloqueadas.

**RN04 – Status do pedido**  
O pedido deve seguir a sequência:

**Recebido → Em Preparação → Pronto → Retirado.**

**RN05 – Identificação do pedido**  
Cada pedido deve possuir um identificador único gerado pelo sistema para permitir seu acompanhamento.

**RN06 – Associação ao cliente**  
Quando o cliente estiver identificado, o pedido deve ser associado ao seu cadastro para permitir o acesso ao histórico de pedidos e demais funcionalidades relacionadas.

**RN07 – Tipo de consumo**  
O pedido deve registrar uma das modalidades disponíveis: **Retirada no Balcão** ou **Consumo no Local**.

**RN08 – Registro das alterações**  
As alterações realizadas em um pedido devem ser registradas pelo sistema.

---

# **UC03 – Realizar pagamento**

### **Descrição**

Explique que este caso de uso representa o **processo de pagamento de um pedido já registrado**, independentemente do canal.

### **Ator principal**

**Cliente** — APP, WEB ou TOTEM  
**Atendente** — BALCÃO

### **Demais atores**

Aqui você pode considerar o **serviço/gateway de pagamento**, porque existe uma interação do sistema com um serviço externo.

### **Pré-condições**

Você precisa decidir coisas como:

* O pedido precisa estar confirmado?  
* O valor precisa estar calculado?  
* O pedido precisa possuir um identificador?  
* O sistema de pagamento precisa estar disponível?

### **Pós-condições**

Pense no que acontece depois de um pagamento bem-sucedido:

* pagamento registrado;  
* pedido associado ao pagamento;  
* status do pagamento atualizado;  
* sistema permite que o pedido prossiga.

### **Origem das informações**

* dados do pedido;  
* valor da compra;  
* dados fornecidos pelo cliente/atendente;  
* retorno do serviço de pagamento.

### **Usuários responsáveis**

Cliente e Atendente.

### **Fluxo base**

Monte aproximadamente nesta lógica:

1. Sistema apresenta as opções de pagamento.  
2. Usuário seleciona o método.  
3. Sistema solicita as informações necessárias.  
4. Usuário fornece as informações.  
5. Sistema valida os dados.  
6. Sistema envia a solicitação ao serviço de pagamento.  
7. Serviço retorna o resultado.  
8. Sistema registra o resultado.  
9. Sistema apresenta a confirmação.

**Importante:** cartão, PIX, parcelamento etc. podem aparecer como **etapas/variações dentro desse UC**, e não necessariamente como novos UCs.

### **Fluxos alternativos**

Pelo menos:

* pagamento recusado;  
* dados inválidos;  
* serviço de pagamento indisponível.

### **Regras de negócio**

Defina, por exemplo:

* um pedido não pode ser considerado pago antes da confirmação;  
* o valor pago deve corresponder ao valor do pedido;  
* uma transação recusada não pode liberar o pedido como pago.

---

# **UC04 – Acompanhar pedido**

### **Descrição**

Aqui você vai descrever como o cliente consulta a situação do pedido desde o recebimento até a retirada.

### **Ator principal**

**Cliente**

### **Demais atores**

Você pode avaliar se precisa colocar **Atendente/Cozinheiro**. Eles alteram o status, mas não necessariamente participam diretamente desse UC.

### **Pré-condições**

* pedido registrado;  
* pedido associado a um identificador;  
* sistema disponível.

### **Pós-condições**

O cliente consegue visualizar o status atualizado do pedido.

### **Origem**

* identificador do pedido;  
* informações do pedido;  
* status atualizado pela operação.

### **Fluxo base**

1. Cliente acessa acompanhamento.  
2. Sistema solicita/identifica o pedido.  
3. Sistema localiza o pedido.  
4. Sistema consulta o status atual.  
5. Sistema apresenta o status.  
6. Sistema permite visualizar informações relevantes do pedido.

Aqui você deve usar a sequência que já definiu no UC02:

**Recebido → Em Preparação → Pronto → Retirado**

### **Fluxos alternativos**

* pedido não encontrado;  
* identificador inválido;  
* status temporariamente indisponível.

### **Regras**

* somente pedidos existentes podem ser consultados;  
* o status deve respeitar a sequência definida;  
* o cliente só deve visualizar pedidos aos quais tenha acesso.

---

# **UC05 – Gerenciar promoções**

Esse é um dos UCs mais importantes porque envolve **Administrador, Gerente, Atendente e Cliente**, mas com permissões diferentes.

### **Ator principal**

Aqui você precisa escolher o ator principal de acordo com a ação central do UC.

Uma forma coerente seria considerar:

**Administrador**

porque ele é quem efetivamente gerencia a configuração das promoções.

### **Demais atores**

* Gerente  
* Atendente  
* Cliente

Mas atenção: coloque um ator somente se ele realmente participar das interações descritas no UC.

### **O que deve estar contemplado**

Você definiu anteriormente:

* criação de promoções;  
* regras e condições;  
* validade;  
* unidades participantes;  
* ativação/desativação;  
* consulta;  
* validação/aplicação de cupom.

### **Pré-condições**

Pense:

* administrador autenticado;  
* permissão adequada;  
* unidade(s) cadastrada(s);  
* produtos disponíveis.

### **Pós-condições**

Uma promoção pode ficar:

* cadastrada;  
* ativa;  
* inativa;  
* associada a determinadas unidades.

### **Fluxo base**

Você pode organizar o fluxo como:

1. Administrador acessa gestão de promoções.  
2. Sistema apresenta promoções existentes.  
3. Administrador seleciona criar/alterar.  
4. Sistema apresenta formulário.  
5. Administrador informa regras e condições.  
6. Define validade.  
7. Define unidades participantes.  
8. Sistema valida as informações.  
9. Administrador confirma.  
10. Sistema registra a promoção.  
11. Sistema apresenta a confirmação.

### **Fluxos alternativos**

Pense principalmente em:

* dados inválidos;  
* período de validade inválido;  
* unidade inexistente;  
* promoção desativada;  
* cupom inválido/expirado.

### **Regras de negócio**

Aqui entram as regras que você definiu sobre **quem pode fazer o quê**.

Exemplo de decisão que você precisa registrar:

| Ator | Ação |
| ----- | ----- |
| Administrador | Criar/configurar/ativar/desativar |
| Gerente | Consultar promoções da unidade |
| Atendente | Consultar/validar/aplicar cupom |
| Cliente | Consultar/utilizar promoção |
| Cozinheiro | Não participa |

---

# **UC06 – Gerenciar fidelização**

### **Atores**

**Cliente** como principal.

Dependendo de como você modelar, o **Administrador** pode participar da configuração do programa.

Você já definiu:

* cadastro no programa;  
* acúmulo de pontos;  
* resgate;  
* níveis;  
* histórico.

### **Pré-condições**

* cliente cadastrado;  
* programa de fidelidade disponível.

### **Pós-condições**

Dependendo da operação:

* cliente inscrito;  
* pontos atualizados;  
* benefício resgatado;  
* histórico registrado.

### **Fluxo base**

Você pode separar o fluxo em operações:

1. Cliente acessa o programa de fidelidade.  
2. Sistema identifica o cliente.  
3. Sistema apresenta saldo e informações.  
4. Cliente seleciona uma operação.  
5. Sistema processa a solicitação.  
6. Sistema atualiza as informações.  
7. Sistema apresenta o resultado.

### **Alternativas**

* cliente não cadastrado;  
* saldo insuficiente;  
* benefício indisponível;  
* benefício expirado.

### **Regras de negócio**

Você precisa definir, por exemplo:

* como os pontos são acumulados;  
* quando os pontos ficam disponíveis;  
* condições para resgate;  
* regras dos níveis;  
* registro das movimentações.

Não invente regras muito específicas se elas não forem necessárias ao projeto.

---

# **UC07 – Realizar atendimento**

Aqui entram **suporte/SAC**, que você colocou no módulo Atendimento ao Cliente.

### **Ator principal**

**Cliente**

### **Demais atores**

**Atendente**

### **Pré-condições**

* cliente identificado;  
* canal de atendimento disponível.

### **Pós-condições**

* solicitação registrada;  
* protocolo gerado;  
* atendimento atualizado/concluído.

### **Fluxo base**

1. Cliente acessa atendimento.  
2. Sistema apresenta opções.  
3. Cliente seleciona o tipo de atendimento.  
4. Cliente informa a solicitação.  
5. Sistema registra a solicitação.  
6. Sistema gera protocolo.  
7. Atendente consulta a solicitação.  
8. Atendente registra o atendimento.  
9. Sistema atualiza o status.  
10. Cliente pode consultar o andamento.

### **Alternativas**

* informações insuficientes;  
* solicitação não localizada;  
* atendimento indisponível.

### **Regras**

Pense em:

* geração de protocolo;  
* identificação do cliente;  
* registro do histórico;  
* controle de status.

---

# **UC08 – Gerenciar operação da unidade**

Esse UC representa a **visão do Gerente sobre uma unidade específica**.

### **Ator principal**

**Gerente**

### **O que você já definiu para ele**

* consultar informações da unidade;  
* funcionários;  
* pedidos;  
* estoque;  
* indicadores/relatórios;  
* consultar promoções;  
* consultar informações de fidelização.

### **Pré-condições**

* gerente autenticado;  
* gerente associado a uma unidade;  
* unidade cadastrada.

### **Pós-condições**

Depende da operação realizada.

### **Fluxo base**

Aqui eu sugiro você pensar primeiro em um **menu da unidade**:

1. Gerente acessa o sistema.  
2. Sistema identifica a unidade vinculada.  
3. Sistema apresenta as funcionalidades disponíveis.  
4. Gerente seleciona uma funcionalidade.  
5. Sistema apresenta os dados correspondentes.  
6. Gerente consulta ou realiza a operação permitida.  
7. Sistema registra/atualiza as informações quando necessário.

### **Alternativas**

* usuário sem permissão;  
* unidade indisponível;  
* informação não encontrada;  
* estoque indisponível para consulta.

### **Regra fundamental**

**Gerente \= visão e operação de uma unidade.**

Ele não deve conseguir realizar as funções exclusivas do Administrador da rede, como configurar promoções para toda a rede.

---

# **UC09 – Gerenciar rede**

Esse é o equivalente ao UC08, mas para o **Administrador**.

### **Ator principal**

**Administrador**

### **Escopo que você definiu**

* unidades;  
* estoque;  
* usuários/permissões;  
* pedidos;  
* promoções;  
* fidelização.

### **Pré-condições**

* administrador autenticado;  
* permissão administrativa.

### **Pós-condições**

As informações da rede são cadastradas, alteradas ou consultadas conforme a operação.

### **Fluxo base**

1. Administrador acessa a área administrativa.  
2. Sistema apresenta os módulos disponíveis.  
3. Administrador seleciona um módulo.  
4. Sistema apresenta os dados.  
5. Administrador realiza a operação permitida.  
6. Sistema valida os dados.  
7. Sistema registra a alteração.  
8. Sistema apresenta a confirmação.

### **Alternativas**

Aqui você pode incluir:

* dados inválidos;  
* usuário sem permissão;  
* unidade inexistente;  
* tentativa de alteração de informação protegida.

### **Regra de negócio central**

**Administrador \= visão e gestão da rede.**

Essa regra é importante porque diferencia o UC08 do UC09.

---

# **UC10 – Consultar indicadores e relatórios**

### **Ator principal**

**Gerente ou Administrador**

Aqui existe uma decisão de modelagem interessante.

Como você estabeleceu:

> Gerente \= uma unidade  
> Administrador \= rede

você pode manter os dois como atores desse UC, com diferentes níveis de visualização.

### **Pré-condições**

* usuário autenticado;  
* permissão para visualizar indicadores;  
* dados disponíveis.

### **Pós-condições**

O usuário visualiza os indicadores/relatórios correspondentes ao seu nível de acesso.

### **Origem das informações**

* pedidos;  
* unidades;  
* estoque;  
* promoções;  
* fidelização;  
* demais dados registrados pelo sistema.

### **Fluxo base**

1. Usuário acessa indicadores e relatórios.  
2. Sistema identifica o perfil do usuário.  
3. Sistema determina o escopo de dados permitido.  
4. Usuário seleciona indicador ou relatório.  
5. Sistema consulta os dados.  
6. Sistema processa as informações.  
7. Sistema apresenta os resultados.

### **Alternativas**

* período sem dados;  
* dados indisponíveis;  
* usuário sem permissão;  
* falha na geração do relatório.

### **Regras**

Uma regra especialmente importante:

**Gerente visualiza dados relacionados à sua unidade; Administrador pode visualizar dados conforme o escopo da rede.**

