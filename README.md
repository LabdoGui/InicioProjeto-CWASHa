# Carwash (beta)

**Qualidade e Brilho Impecável para o seu Veículo**

Site para agendar lavagem de carros e motos nas unidades FMU de São Paulo, com **garagem de veículos**
e **pagamento por cartão, Pix ou no local**. Feito com HTML, CSS e JavaScript puro, sem frameworks e sem servidor.

O site nasceu como um único arquivo HTML (`carwash.html`) e foi separado como um site de verdade:
**cada tela é uma página `.html`** na pasta `paginas/`, o visual fica em `css/` e a programação em `js/`.

## Como abrir

- **No computador:** abra o `index.html` no navegador (dois cliques). Ele leva para a tela de login. Não precisa de servidor.
- **No GitHub Pages:** com o Pages ligado no repositório, o endereço fica `https://labdogui.github.io/InicioProjeto-CWASHa/`.

## Estrutura

```
InicioProjeto-CWASHa/
  index.html                 página inicial: abre paginas/login.html
  README.md                  este arquivo
  paginas/                   uma página por tela
    login.html               TELA 01A  entrar (e as janelas de senha do admin e "esqueci minha senha")
    cadastro.html            TELA 01B  criar conta
    garagem.html             TELA 02   escolher ou cadastrar o veículo
    servicos.html            TELA 03   escolher o tipo de lavagem
    local.html               TELA 04   escolher a unidade
    horario.html             TELA 05   escolher o dia e o horário
    pagamento.html           TELA 06   resumo do pedido e forma de pagamento
    pix.html                 TELA 06A  QR Code e Pix Copia e Cola
    cartao.html              TELA 06B  pagamento com cartão
    confirmacao.html         TELA 07   agendamento confirmado (WhatsApp, agenda, .ics)
    admin.html               painel administrativo
  css/
    estilo.css               todo o visual (modo claro e escuro, telas, painel admin)
  js/                        os mesmos arquivos em todas as páginas; app.js sempre por último
    tema.js                  aplica o modo claro/escuro antes de a página aparecer
    qrcode.js                biblioteca de QR Code (código aberto, licença MIT, Kazuhiko Arase)
    utilidades.js            funções pequenas: seletores, datas, dinheiro em R$, ids
    icones-e-logotipo.js     ícones SVG e o logotipo da gota
    config.js                serviços, preços, unidades, horários, senhas, chave Pix e dados guardados
    validacoes.js            e-mail, senha forte, celular, placa Mercosul e cartão
    interface.js             erros nos campos, avisos e tema claro/escuro
    regras-de-negocio.js     horários livres/ocupados, criar agendamento, formas de pagamento
    pix.js                   código Pix Copia e Cola (BR Code) e QR Code
    agenda-e-whatsapp.js     mensagem do WhatsApp, Google Agenda/Outlook e arquivo .ics
    telas-cliente.js         preenche as partes que mudam em cada tela do cliente
    painel-admin.js          calcula os indicadores e preenche as tabelas do painel
    janelas.js               abre e fecha as janelas da tela de login
    navegacao.js             qual página é cada tela, troca de página e cronômetro do Pix
    eventos.js               o que acontece em cada toque e em cada formulário
    dados-demonstracao.js    clientes e agendamentos de exemplo para o painel
    app.js                   inicia a página aberta
```

## Como as páginas conversam

- Cada página diz qual tela ela é no `<body data-tela="...">` e carrega os mesmos arquivos de `js/`.
- O HTML fixo da tela (títulos, formulários, botões) está na própria página. O JavaScript só preenche
  o que muda: a lista de veículos, os horários livres, o resumo do pedido, o QR Code, as tabelas do painel.
- O que o cliente vai escolhendo (veículo, serviço, unidade, horário, Pix) passa de uma página para a outra
  guardado na aba do navegador (`sessionStorage`). Cadastros e agendamentos ficam no `localStorage`.
- Se alguém abrir uma página fora de ordem (por exemplo `horario.html` sem ter escolhido a unidade),
  o app volta para a etapa que falta. As páginas do cliente exigem login, e o `admin.html` exige a senha do admin.

## Senha de demonstração

| Acesso | Senha |
|---|---|
| Administrador (botão "Admin" na tela de login) | `Admin@2026` |

No painel admin, o botão "Carregar dados de demonstração" preenche o sistema com clientes e agendamentos de exemplo.

## Observações

- Os dados ficam no navegador de cada aparelho (localStorage).
- Pix e cartão estão em **modo demonstração**: a chave Pix é fictícia e nenhuma cobrança real é feita.
  Do cartão, o app guarda só bandeira, final, titular e validade (nunca o número completo nem o CVV).
