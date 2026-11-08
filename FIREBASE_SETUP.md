# Firebase — configuração pendente

Esta branch é uma implementação inicial e **não está pronta para produção**.

## Arquitetura
- Loja pública: catálogo permanece no código; estoque consultado no Firestore em tempo real.
- Clientes: sem login. Só podem ler quantidades.
- Administradora: login por e-mail/senha com Firebase Authentication e autorização pelo documento `admins/{uid}`.
- Painel: rota `/admin`, ajustes de quantidade e histórico de movimentações.
- Pedidos: WhatsApp permanece como canal de atendimento. Estoque deve ser baixado manualmente depois da venda confirmada.
- Estoque ainda não cadastrado: interface conserva comportamento antigo, sem afirmar disponibilidade.

## Ativar o Firebase
1. Criar projeto em https://console.firebase.google.com/.
2. Adicionar aplicativo web e copiar as quatro variáveis de `.env.example` para o ambiente local e a hospedagem (Vercel ou equivalente).
3. Ativar **Authentication > Sign-in method > Email/Password**.
4. Criar no Authentication uma conta da administradora. Copiar seu UID.
5. Criar banco **Cloud Firestore** e publicar as regras do arquivo `firestore.rules`.
6. Criar manualmente no Firestore o documento `admins/UID_DA_ADMINISTRADORA` (o conteúdo pode ser `{role: "admin"}`). A regra bloqueia a criação desse documento via aplicativo.
7. Abrir `/admin`, entrar e cadastrar as quantidades reais dos produtos. Não presumir quantidades.
8. Testar acesso não autenticado, conta não autorizada, edições de estoque, bloqueio de produto esgotado, carrinho com estoque alterado e WhatsApp.
9. **Regenerar e versionar `package-lock.json` com `npm install`** antes de usar `npm ci`/fazer deploy. O ambiente de edição não permitiu acesso ao registro npm.

## Pendências de revisão
- Não enviar credenciais privadas ou service account ao navegador.
- Adicionar validação transacional do pedido/reserva se vendas simultâneas passarem a acontecer.
- Considerar segurança/privacidade para um histórico de pedidos futuro.
- Conferir build e fluxo de autenticação em ambiente real antes de mesclar.
