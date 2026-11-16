/* Carwash (protótipo) — telas do cliente: login, cadastro, garagem, serviços, local, horário, pagamento e confirmação. */
'use strict';
/* ============ TELAS DO CLIENTE ============ */
const screens={};

/* TELA 01A — Login */
screens.login=()=>
 '<div class="hero">'+LOGO+'<div class="wordmark">Carwash</div><p class="slogan">Qualidade e Brilho Impecável para o seu Veículo</p></div>'+
 '<form class="card stack" data-form="login" novalidate>'+
  '<h1 style="font-size:20px;margin:0">Entrar</h1>'+
  field({id:'email',label:'E-mail',type:'email',ph:'seunome@gmail.com',attrs:'autocomplete="email" inputmode="email"',hint:'Use um e-mail @gmail ou @outlook.'})+
  field({id:'password',label:'Senha',type:'password',ph:'Sua senha',attrs:'autocomplete="current-password"',pw:true})+
  '<div style="text-align:right;margin-top:-4px"><button type="button" class="linkbtn" data-act="forgot">Esqueci minha senha</button></div>'+
  '<button class="btn primary" type="submit">Entrar</button>'+
 '</form>'+
 '<div class="divider">ainda não tem conta?</div>'+
 '<button class="btn outline" data-act="go" data-to="register">Criar Conta</button>'+
 '<div class="center" style="margin-top:14px"><button class="admin-link" data-act="openAdmin">'+ic('lock')+'Admin</button></div>';

/* TELA 01B — Cadastro */
screens.register=()=>
 backBtn('login','Voltar ao login')+
 '<h1>Criar conta</h1><p class="sub">Leva menos de um minuto.</p>'+
 '<form class="card stack" data-form="register" novalidate>'+
  field({id:'name',label:'Nome completo',ph:'Maria da Silva',attrs:'autocomplete="name"',hint:'Nome e sobrenome.'})+
  field({id:'email',label:'E-mail',type:'email',ph:'seunome@gmail.com',attrs:'autocomplete="email" inputmode="email"',hint:'Use um e-mail @gmail ou @outlook.'})+
  field({id:'phone',label:'Celular',type:'tel',ph:'(11) 98765-4321',attrs:'autocomplete="tel" inputmode="tel" data-mask="phone"',hint:'Com DDD. Ex.: (11) 98765-4321.'})+
  field({id:'password',label:'Senha',type:'password',ph:'Crie uma senha forte',attrs:'autocomplete="new-password"',pw:true})+
  '<ul class="rules" id="rules" aria-label="Requisitos da senha">'+PASS_RULES.map((r,i)=>'<li data-r="'+i+'"><span class="dot">'+ic('check')+'</span>'+r[0]+'</li>').join('')+'</ul>'+
  '<button class="btn primary" type="submit">Criar conta</button>'+
 '</form>';

/* TELA 02 — Garagem */
screens.garage=()=>{
  const g=S.gv,list=myVehicles(),show=S.showForm||!list.length;
  const vlist=list.length?'<div role="radiogroup" aria-label="Seus veículos" style="margin-bottom:14px">'+list.map(v=>
    '<div class="opt'+(S.draft.vehicleId===v.id?' sel':'')+'" role="radio" aria-checked="'+(S.draft.vehicleId===v.id)+'" tabindex="0" data-act="selVeh" data-id="'+v.id+'">'+
    '<span class="ico">'+ic(v.cat==='Moto'?'moto':'car')+'</span><span class="txt"><b>'+esc(v.model)+'</b><span>'+esc(v.cat)+' · '+esc(v.sub)+' · '+esc(v.color)+'</span></span>'+
    '<span class="plate">'+esc(v.plate)+'</span>'+
    '<button class="iconbtn" data-act="delVeh" data-id="'+v.id+'" aria-label="Remover '+esc(v.model)+'">'+ic('trash')+'</button>'+
    '<span class="tick">'+ic('check')+'</span></div>').join('')+'</div>':'';
  const form=show?
   '<form class="card stack" data-form="vehicle" novalidate><h2 style="font-size:17px">Cadastrar veículo</h2>'+
    '<div><div class="small" style="font-weight:600;margin-bottom:8px" id="catlbl">Categoria</div><div class="seg" role="radiogroup" aria-labelledby="catlbl">'+
      ['Carro','Moto'].map(c=>'<button type="button" role="radio" aria-checked="'+(g.cat===c)+'" data-act="selCat" data-v="'+c+'">'+ic(c==='Moto'?'moto':'car')+c+'</button>').join('')+'</div></div>'+
    '<div><div class="small" style="font-weight:600;margin-bottom:8px" id="sublbl">Tipo</div><div class="chips" role="radiogroup" aria-labelledby="sublbl">'+
      SUBS[g.cat].map(s=>'<button type="button" class="chip" role="radio" aria-checked="'+(g.sub===s)+'" data-act="selSub" data-v="'+s+'">'+s+'</button>').join('')+'</div></div>'+
    field({id:'model',label:'Modelo',ph:g.cat==='Moto'?'Ex.: CB 500':'Ex.: Corolla',val:g.model,attrs:'data-gv="model" autocomplete="off"'})+
    '<div class="field" data-f="color"><label for="color">Cor</label><input id="color" name="color" list="colors" placeholder="Ex.: Prata" value="'+esc(g.color)+'" data-gv="color" autocomplete="off" aria-describedby="color-err"><datalist id="colors">'+COLORS.map(c=>'<option value="'+c+'">').join('')+'</datalist><div class="hint"></div><div class="err" id="color-err" role="alert"></div></div>'+
    field({id:'plate',label:'Placa (padrão Mercosul)',ph:'ABC1D23',val:g.plate,attrs:'data-gv="plate" data-mask="plate" maxlength="7" autocapitalize="characters" autocomplete="off"',hint:'3 letras, 1 número, 1 letra e 2 números.'})+
    '<button class="btn primary" type="submit">Salvar veículo</button></form>'
   :'<button class="btn ghost" data-act="showForm">'+ic('plus')+'Cadastrar novo veículo</button>';
  return stepper(0)+'<h1>Olá '+esc(firstName(S.user.name))+', gostaria de usar qual veículo?</h1><p class="sub">Escolha um veículo salvo ou cadastre um novo.</p>'+vlist+form+
    '<div style="margin-top:18px"><button class="btn primary" data-act="go" data-to="services" '+(S.draft.vehicleId?'':'disabled')+'>Continuar</button></div>';
};

/* TELA 03 — Serviços */
screens.services=()=>{
  const v=vehById(S.draft.vehicleId);if(!v)return '';
  const sel=S.draft.serviceId,sv=svcById(sel);
  return stepper(1)+backBtn('garage')+'<h1>Olá '+esc(firstName(S.user.name))+', gostaria de lavar o veículo de qual maneira?</h1>'+
  '<p class="sub">'+esc(v.model)+' · <span class="plate">'+esc(v.plate)+'</span></p>'+
  '<div class="svc"><table><caption class="sr">Tabela de serviços e valores</caption><thead><tr><th scope="col"><span class="sr">Selecionar</span></th><th scope="col">Serviço</th><th scope="col" style="text-align:right">Valor</th></tr></thead><tbody>'+
  SERVICES.map(s=>'<tr data-act="selSvc" data-id="'+s.id+'" class="'+(sel===s.id?'sel':'')+'"><td style="width:44px"><input type="radio" name="svc" aria-label="'+esc(s.name)+'" '+(sel===s.id?'checked':'')+'></td><td><b>'+s.name+'</b><small>'+s.desc+'</small></td><td class="pr">'+money(s.price)+'</td></tr>').join('')+'</tbody></table></div>'+
  '<div style="margin-top:18px"><button class="btn primary" data-act="go" data-to="unit" '+(sel?'':'disabled')+'>'+(sv?'Continuar · '+money(sv.price):'Continuar')+'</button></div>';
};

/* TELA 04 — Local */
screens.unit=()=>
  stepper(2)+backBtn('services')+'<h1>Onde você quer lavar?</h1><p class="sub">Escolha a unidade mais conveniente.</p>'+
  '<div role="radiogroup" aria-label="Unidades">'+UNITS.map(u=>'<div class="opt'+(S.draft.unit===u.id?' sel':'')+'" role="radio" aria-checked="'+(S.draft.unit===u.id)+'" tabindex="0" data-act="selUnit" data-id="'+u.id+'"><span class="ico">'+ic('pin')+'</span><span class="txt"><b>'+u.id+'</b><span>'+u.city+'</span></span><span class="tick">'+ic('check')+'</span></div>').join('')+'</div>'+
  '<div style="margin-top:18px"><button class="btn primary" data-act="go" data-to="time" '+(S.draft.unit?'':'disabled')+'>Continuar</button></div>';

/* TELA 05 — Horário */
screens.time=()=>{
  const d=S.draft,opts=dateOptions(d.unit);
  if(!d.date||!opts.find(o=>o.k===d.date&&o.free)){const f=opts.find(o=>o.free);d.date=f?f.k:opts[0].k;if(d.time&&!slotFree(d.unit,d.date,d.time))d.time=null}
  return stepper(3)+backBtn('unit')+'<h1>Escolha o dia e o horário</h1><p class="sub">'+esc(d.unit)+' · horários de 1 em 1 hora, das 08:00 às 17:00.</p>'+
  '<div class="dates" role="group" aria-label="Datas">'+opts.map(o=>'<button class="date" data-act="selDate" data-k="'+o.k+'" aria-pressed="'+(d.date===o.k)+'" '+(o.free?'':'disabled')+' aria-label="'+wkShort(o.k)+', '+brDate(o.k)+(o.free?'':' (sem horários)')+'"><small>'+o.wd+'</small><b>'+o.day+'</b></button>').join('')+'</div>'+
  '<div class="slots" role="group" aria-label="Horários disponíveis em '+brDate(d.date)+'" style="margin-top:6px">'+SLOTS.map(t=>{const free=slotFree(d.unit,d.date,t),taken=slotTaken(d.unit,d.date,t);return '<button class="slot" data-act="selTime" data-t="'+t+'" aria-pressed="'+(d.time===t)+'" '+(free?'':'disabled')+'>'+t+(free?'':'<small>'+(taken?'Ocupado':'Encerrado')+'</small>')+'</button>'}).join('')+'</div>'+
  '<div style="margin-top:18px"><button class="btn primary" data-act="go" data-to="checkout" '+(d.time?'':'disabled')+'>'+(d.time?'Continuar · '+brDate(d.date)+' às '+d.time:'Continuar')+'</button></div>';
};

function summaryHtml(){
  const d=S.draft,v=vehById(d.vehicleId),s=svcById(d.serviceId);
  return '<div class="card sum"><div><span>Veículo</span><span>'+esc(v.model)+' · '+esc(v.plate)+'</span></div><div><span>Serviço</span><span>'+s.name+'</span></div><div><span>Unidade</span><span>'+esc(d.unit)+'</span></div><div><span>Data e hora</span><span>'+wkShort(d.date)+', '+brDate(d.date)+' · '+d.time+'</span></div><div class="total"><span>Total</span><span>'+money(s.price)+'</span></div></div>';
}

/* TELA 06 — Checkout */
screens.checkout=()=>{
  const sel=S.draft.pay;
  const opts=[['pix','pix','Pix Instantâneo','QR Code e Copia e Cola'],['cartao','card','Cartão','Crédito ou débito'],['local','cash','Pagar no Local','Pague na unidade, no dia']];
  return stepper(4)+backBtn('time')+'<h1>Como prefere pagar?</h1><p class="sub">Revise o pedido e escolha a forma de pagamento.</p>'+summaryHtml()+
  '<h2 style="font-size:16px;margin:20px 0 10px" id="paylbl">Forma de pagamento</h2><div role="radiogroup" aria-labelledby="paylbl">'+
  opts.map(o=>'<div class="opt'+(sel===o[0]?' sel':'')+'" role="radio" aria-checked="'+(sel===o[0])+'" tabindex="0" data-act="selPay" data-id="'+o[0]+'"><span class="ico">'+ic(o[1])+'</span><span class="txt"><b>'+o[2]+'</b><span>'+o[3]+'</span></span><span class="tick">'+ic('check')+'</span></div>').join('')+'</div>'+
  '<div style="margin-top:18px"><button class="btn primary" data-act="payGo" '+(sel?'':'disabled')+'>'+(sel==='local'?'Confirmar agendamento':'Continuar')+'</button></div>';
};

/* TELA 06A — Pix */
screens.pix=()=>{
  const s=svcById(S.draft.serviceId);
  if(!S.pix||S.pix.expires<=0){S.pix={payload:pixPayload(s.price),expires:Date.now()+PIX_MINUTES*60000,total:PIX_MINUTES*60000}}
  return backBtn('checkout')+'<h1>Pix Instantâneo</h1><p class="sub">Escaneie o QR Code no app do seu banco ou use o Copia e Cola.</p>'+
  '<div class="card center"><div class="muted small">Valor a pagar</div><div style="font-size:30px;font-weight:800;letter-spacing:-.02em;margin-bottom:12px">'+money(s.price)+'</div>'+
  '<div class="qr" id="qr">'+qrSvg(S.pix.payload)+'</div>'+
  '<div class="timer" aria-live="off">'+ic('clock')+'<span>Expira em <b id="pixTimer">--:--</b></span></div><div class="bar" aria-hidden="true"><span id="pixBar" style="width:100%"></span></div></div>'+
  '<div class="card stack" style="margin-top:14px"><label for="copia" style="font-weight:600;font-size:14px">Pix Copia e Cola</label><textarea id="copia" class="copybox" readonly>'+esc(S.pix.payload)+'</textarea>'+
  '<button class="btn outline" data-act="copyPix">'+ic('copy')+'Copiar código</button></div>'+
  '<p class="notice" style="margin:14px 0">Ambiente de demonstração: o código usa uma chave fictícia e nenhuma cobrança real é feita. Use o botão abaixo para simular a confirmação do pagamento.</p>'+
  '<button class="btn primary" id="simPix" data-act="simPix">Simular pagamento aprovado</button>'+
  '<button class="btn ghost" id="newPix" data-act="newPix" style="margin-top:10px;display:none">Gerar novo código Pix</button>';
};

/* TELA 06B — Cartão */
screens.card=()=>{
  const s=svcById(S.draft.serviceId);
  return backBtn('checkout')+'<h1>Pagamento com cartão</h1><p class="sub">Total: <b>'+money(s.price)+'</b></p>'+
  '<form class="card stack" data-form="card" novalidate>'+
   field({id:'cnum',label:'Número do cartão',ph:'0000 0000 0000 0000',attrs:'inputmode="numeric" autocomplete="cc-number" data-mask="card"',hint:'<span id="cbrand"></span>'})+
   field({id:'cname',label:'Nome impresso no cartão',ph:'MARIA DA SILVA',attrs:'autocomplete="cc-name" autocapitalize="characters" data-mask="upper"'})+
   '<div class="row2">'+field({id:'cexp',label:'Validade',ph:'MM/AA',attrs:'inputmode="numeric" maxlength="5" autocomplete="cc-exp" data-mask="exp"'})+field({id:'ccvv',label:'CVV',ph:'123',type:'password',attrs:'inputmode="numeric" maxlength="4" autocomplete="cc-csc" data-mask="cvv"'})+'</div>'+
   '<label style="display:flex;gap:10px;align-items:flex-start;font-size:14px"><input type="checkbox" id="csave" checked style="width:20px;height:20px;accent-color:var(--primary);margin-top:1px"><span>Salvar cartão para próximas lavagens<br><span class="muted small">Guardamos apenas bandeira, final, titular e validade — nunca o número completo nem o CVV.</span></span></label>'+
   '<p class="notice">Ambiente de demonstração: nenhuma cobrança real é feita.</p>'+
   '<button class="btn primary" type="submit">Pagar '+money(s.price)+'</button></form>';
};

/* TELA 07 — Confirmação */
screens.confirm=()=>{
  const b=S.last;if(!b)return '';
  const v=vehById(b.vehicleId),s=svcById(b.serviceId),u=userById(b.userId);
  return '<div class="center"><div class="okmark">'+ic('check')+'</div><h1>Agendamento confirmado!</h1><p class="sub">Código <span class="code">'+b.code+'</span></p></div>'+
  '<div class="card sum"><div><span>Cliente</span><span>'+esc(u.name)+'</span></div><div><span>Veículo</span><span>'+esc(v.model)+' · '+esc(v.plate)+'</span></div><div><span>Serviço</span><span>'+s.name+'</span></div><div><span>Unidade</span><span>'+esc(b.unit)+'</span></div><div><span>Data e hora</span><span>'+wkShort(b.date)+', '+brDate(b.date)+' · '+b.time+'</span></div><div><span>Pagamento</span><span>'+payLabel(b)+' · '+payState(b)+'</span></div><div class="total"><span>Total</span><span>'+money(b.price)+'</span></div></div>'+
  '<div class="stack" style="margin-top:18px">'+
   '<a class="btn wa" target="_blank" rel="noopener" href="https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(bookingText(b))+'">'+ic('wa')+'<span style="display:flex;flex-direction:column;align-items:center;line-height:1.2">Enviar por WhatsApp<small style="font-weight:500;opacity:.9">'+WA_DISPLAY+'</small></span></a>'+
   '<a class="btn outline" target="_blank" rel="noopener" href="'+(/@outlook/i.test(u.email)?calLinks(b).outlook:calLinks(b).google)+'">'+ic('cal')+'Adicionar à Agenda ('+(/@outlook/i.test(u.email)?'Outlook':'Google')+')</a>'+
   '<button class="btn ghost" data-act="ics">Baixar arquivo .ics</button>'+
   '<button class="btn primary" data-act="newBooking">Novo agendamento</button></div>';
};
