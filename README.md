# Carwash (beta)

**Qualidade e Brilho Impecável para o seu Veículo**

Site para agendar lavagem de carros e motos nas unidades FMU de São Paulo, com **garagem de veículos**
e **pagamento por cartão, Pix ou no local**. Feito com HTML, CSS e JavaScript puro, sem frameworks e sem servidor.

O site nasceu como um único arquivo HTML (`carwash.html`) e depois foi separado em pastas,
como um site de verdade: estrutura em `index.html`, visual em `css/` e programação em `js/`.
O código é o mesmo do arquivo único, só que dividido por assunto.

## Como abrir

- **No computador:** abra o `index.html` no navegador (dois cliques). Não precisa de servidor.
- **No GitHub Pages:** com o Pages ligado no repositório, o endereço fica `https://labdogui.github.io/InicioProjeto-CWASHa/`.

## Estrutura

```
InicioProjeto-CWASHa/
  index.html                 estrutura da página: carrega o CSS e os scripts na ordem certa
  README.md                  este arquivo
  css/
    estilo.css               todo o visual (modo claro e escuro, telas, painel admin)
  js/                        (carregados nesta ordem; app.js sempre por último)
    tema.js                  aplica o modo claro/escuro antes de a página aparecer
    qrcode.js                biblioteca de QR Code (código aberto, licença MIT, Kazuhiko Arase)
    utilidades.js            funções pequenas: seletores, datas, dinheiro em R$, ids
    icones-e-logotipo.js     ícones SVG e o logotipo
    config.js                serviços, preços, unidades, horários, senhas, chave Pix e dados (localStorage)
    validacoes.js            e-mail, senha forte, celular, placa Mercosul e cartão
    interface.js             campos, avisos, tema, cabeçalho, etapas, botão Voltar e rodapé
    regras-de-negocio.js     horários livres/ocupados, criar agendamento, formas de pagamento
    pix.js                   código Pix Copia e Cola (BR Code) e QR Code
    agenda-e-whatsapp.js     mensagem do WhatsApp, Google Agenda/Outlook e arquivo .ics
    telas-cliente.js         login, cadastro, garagem, serviços, local, horário, pagamento e confirmação
    painel-admin.js          indicadores, pátio em tempo real, clientes, cartões, veículos e lucros
    janelas.js               senha do admin e recuperar senha
    navegacao.js             desenha a tela atual, troca de tela e cronômetro do Pix
    eventos.js               o que acontece em cada toque e em cada formulário
    dados-demonstracao.js    clientes e agendamentos de exemplo para o painel
    app.js                   inicia o app
```

Os arquivos de `js/` dividem as mesmas variáveis (eles rodam como se fossem um script só),
por isso a ordem no `index.html` precisa ser mantida.

## Senha de demonstração

| Acesso | Senha |
|---|---|
| Administrador (botão "Admin" na tela de login) | `Admin@2026` |

No painel admin, o botão "Carregar dados de demonstração" preenche o sistema com clientes e agendamentos de exemplo.

## Observações

- Os dados ficam no navegador de cada aparelho (localStorage).
- Pix e cartão estão em **modo demonstração**: a chave Pix é fictícia e nenhuma cobrança real é feita.
  Do cartão, o app guarda só bandeira, final, titular e validade (nunca o número completo nem o CVV).
