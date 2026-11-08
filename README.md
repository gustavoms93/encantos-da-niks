# Encantos da Niks

Loja responsiva em português com catálogo de 19 produtos, fotos e preços extraídos do site original informado pelo usuário em 7 de novembro de 2026. A grafia do cabeçalho segue o nome público do Instagram (`Encantos da Niks`); o símbolo original, que contém `Encantos da Nick`, foi preservado.

## Funcionalidades

- Catálogo por categoria e coleções temáticas.
- Busca com normalização de acentos e ordenação por preço ou nome.
- Detalhes de produtos, favoritos e sacola persistidos no navegador.
- Quantidades, remoção de itens e subtotal calculado em centavos.
- Produtos na sacola marcados com ✓, destaque roxo e quantidade, inclusive após recarregar.
- Resumo de pedido copiável, com nome e observações opcionais.
- Finalização pelo WhatsApp (89) 98814-7230, com itens, quantidades, subtotal, nome e observações preenchidos na mensagem.
- FAQ, informações de pagamento e explicação de privacidade.
- Navegação por teclado, foco contido em diálogos e respeito à preferência de movimento reduzido.

## Conteúdo

Produtos, preços e descrições estão em `app/page.tsx`. Fotos otimizadas estão em `public/products`. Estilos e adaptações móveis estão em `app/globals.css`. Metadados ficam em `app/layout.tsx`.

Fontes: https://sites.google.com/view/encantosdanick/in%C3%ADcio e https://www.instagram.com/encantosdaniks/ . Imagens pertencem ao catálogo da marca. Não foram inventados depoimentos, avaliações, vendas, descontos, disponibilidade, especificações técnicas, frete ou condições de parcelamento.

## Limites comerciais atuais

Esta versão prepara pedidos para atendimento pelo WhatsApp. O link usa `https://api.whatsapp.com/send?phone=5589988147230` com mensagem codificada; o cliente confirma o envio na conversa. Não cobra pagamentos, calcula frete, reserva estoque, registra vendas em servidor nem envia mensagens automaticamente. Para checkout transacional, a lojista precisa fornecer o provedor/conta de pagamento, catálogo de estoque e variantes, política de entrega/troca, dados comerciais e canais oficiais. Esses pontos dependem da operação real da loja.

## Verificação realizada

TypeScript e build de produção; revisão visual desktop e em viewport móvel de 375 px; busca, ordenação, filtros, favoritos, detalhe de produto, quantidade, subtotal, remoção, persistência da sacola, resumo e cópia do pedido. Nenhuma mensagem de teste foi enviada à loja.

## Executar localmente

Requer Node.js 22.13 ou superior.

```bash
npm ci
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

A configuração de hospedagem atual do ChatGPT Sites foi preservada em `.openai/hosting.json`. O envio ao GitHub é uma cópia do código; alterações no GitHub não são publicadas automaticamente no site.
