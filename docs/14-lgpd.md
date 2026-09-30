# LGPD e privacidade

O canal web exige consentimento visível no cadastro. Abaixo, o que a interface faz hoje e o que ainda não persiste.

## O que o usuário vê

1. Em `/register` o envio só ocorre se o checkbox de aceite estiver marcado.
2. O texto aponta para `/privacidade`, acessível sem sessão.
3. O aviso descreve finalidade, base legal, dados, retenção, direitos e contato.
4. Em `/clients/new`, onde entram CPF e endereço, há o mesmo aviso curto.
5. Os textos existem em pt-BR e en.

O POST `/auth/register` envia nome, e-mail, telefone e senha. O aceite não vai no JSON: o DTO da API recusa campo extra.

## Base legal usada no aviso

| Tratamento | Base | Dados |
| --- | --- | --- |
| Criar conta | Consentimento, art. 7º, I | Nome, e-mail, telefone, senha |
| Pedido, fidelidade e unidade | Execução de contrato, art. 7º, V | CPF, endereço, histórico de pedido |
| Auditoria operacional | Interesse limitado à operação da rede | `log_auditoria` |

## O que o código garante

- `registerSchema` exige `privacyConsent === true`.
- O teste em `login.schema.test.ts` recusa cadastro sem aceite.
- `/privacidade` está na lista pública do middleware.

## O que esta versão não faz

- Não grava o aceite em tabela.
- Não versiona o texto da política.
- Não tem opt-in promocional separado.
- O titular não apaga a conta pela própria interface.
- `privacidade@raizes.local` é o canal de contato da política, não um DPO contratado.

Esses limites aparecem no final da própria página de privacidade.

## Minimização

A conta pede o necessário para autenticar. CPF e endereço entram depois, na ficha comercial do cliente, quando o pedido e a fidelidade passam a precisar deles.
