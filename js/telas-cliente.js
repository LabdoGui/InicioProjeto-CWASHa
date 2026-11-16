/* Carwash — telas do cliente. O HTML de cada tela está em paginas/*.html;
   aqui ficam só as partes que mudam (listas, valores, botões ligados/desligados). */
'use strict';
/* ============ TELAS DO CLIENTE ============ */
const telas={};
const preencherNome=()=>$$('[data-nome]').forEach(e=>{e.textContent=firstName(S.user&&S.user.name)});

/* TELA 01A — Login (paginas/login.html) e TELA 01B — Cadastro (paginas/cadastro.html):
   o HTML é fixo; quem cuida dos formulários é o js/eventos.js. */

/* TELA 02 — Garagem (paginas/garagem.html) */
telas.garage={
  montar(){
    $('#colors').innerHTML=COLORS.map(c=>'<option value="'+c+'">').join('');
    const f=$('form[data-form=vehicle]');f.model.value=S.gv.model;f.color.value=S.gv.color;f.plate.value=S.gv.plate;
  },
  atualizar(){
    preencherNome();
    const g=S.gv,list=myVehicles(),show=S.showForm||!list.length;
    $('#lista-veiculos').innerHTML=list.length?'<div role="radiogroup" aria-label="Seus veículos" style="margin-bottom:14px">'+list.map(v=>
      '<div class="opt'+(S.draft.vehicleId===v.id?' sel':'')+'" role="radio" aria-checked="'+(S.draft.vehicleId===v.id)+'" tabindex="0" data-act="selVeh" data-id="'+v.id+'">'+
      '<span class="ico">'+ic(v.cat==='Moto'?'moto':'car')+'</span><span class="txt"><b>'+esc(v.model)+'</b><span>'+esc(v.cat)+' · '+esc(v.sub)+' · '+esc(v.color)+'</span></span>'+
      '<span class="plate">'+esc(v.plate)+'</span>'+
      '<button class="iconbtn" data-act="delVeh" data-id="'+v.id+'" aria-label="Remover '+esc(v.model)+'">'+ic('trash')+'</button>'+
      '<span class="tick">'+ic('check')+'</span></div>').join('')+'</div>':'';
    $('#form-veiculo').hidden=!show;
    $('#btn-novo-veiculo').hidden=show;
    $$('[data-act=selCat]').forEach(b=>b.setAttribute('aria-checked',String(g.cat===b.dataset.v)));
    $('#tipos').innerHTML=SUBS[g.cat].map(s=>'<button type="button" class="chip" role="radio" aria-checked="'+(g.sub===s)+'" data-act="selSub" data-v="'+s+'">'+s+'</button>').join('');
    $('#model').placeholder=g.cat==='Moto'?'Ex.: CB 500':'Ex.: Corolla';
    $('#continuar').disabled=!S.draft.vehicleId;
  }
};

/* TELA 03 — Serviços (paginas/servicos.html) */
telas.services={
  atualizar(){
    preencherNome();
    const v=vehById(S.draft.vehicleId),sel=S.draft.serviceId,sv=svcById(sel);
    $('#veiculo-modelo').textContent=v.model;$('#veiculo-placa').textContent=v.plate;
    $('#lista-servicos').innerHTML=SERVICES.map(s=>'<tr data-act="selSvc" data-id="'+s.id+'" class="'+(sel===s.id?'sel':'')+'"><td style="width:44px"><input type="radio" name="svc" aria-label="'+esc(s.name)+'" '+(sel===s.id?'checked':'')+'></td><td><b>'+s.name+'</b><small>'+s.desc+'</small></td><td class="pr">'+money(s.price)+'</td></tr>').join('');
    const b=$('#continuar');b.disabled=!sel;b.textContent=sv?'Continuar · '+money(sv.price):'Continuar';
  }
};

/* TELA 04 — Local (paginas/local.html) */
telas.unit={
  atualizar(){
    $('#lista-unidades').innerHTML=UNITS.map(u=>'<div class="opt'+(S.draft.unit===u.id?' sel':'')+'" role="radio" aria-checked="'+(S.draft.unit===u.id)+'" tabindex="0" data-act="selUnit" data-id="'+u.id+'"><span class="ico">'+ic('pin')+'</span><span class="txt"><b>'+u.id+'</b><span>'+u.city+'</span></span><span class="tick">'+ic('check')+'</span></div>').join('');
    $('#continuar').disabled=!S.draft.unit;
  }
};

/* TELA 05 — Horário (paginas/horario.html) */
telas.time={
  atualizar(){
    const d=S.draft,opts=dateOptions(d.unit);
    if(!d.date||!opts.find(o=>o.k===d.date&&o.free)){const f=opts.find(o=>o.free);d.date=f?f.k:opts[0].k;if(d.time&&!slotFree(d.unit,d.date,d.time))d.time=null}
    $('#unidade-escolhida').textContent=d.unit;
    $('#datas').innerHTML=opts.map(o=>'<button class="date" data-act="selDate" data-k="'+o.k+'" aria-pressed="'+(d.date===o.k)+'" '+(o.free?'':'disabled')+' aria-label="'+wkShort(o.k)+', '+brDate(o.k)+(o.free?'':' (sem horários)')+'"><small>'+o.wd+'</small><b>'+o.day+'</b></button>').join('');
    const h=$('#horarios');h.setAttribute('aria-label','Horários disponíveis em '+brDate(d.date));
    h.innerHTML=SLOTS.map(t=>{const free=slotFree(d.unit,d.date,t),taken=slotTaken(d.unit,d.date,t);return '<button class="slot" data-act="selTime" data-t="'+t+'" aria-pressed="'+(d.time===t)+'" '+(free?'':'disabled')+'>'+t+(free?'':'<small>'+(taken?'Ocupado':'Encerrado')+'</small>')+'</button>'}).join('');
    const b=$('#continuar');b.disabled=!d.time;b.textContent=d.time?'Continuar · '+brDate(d.date)+' às '+d.time:'Continuar';
  }
};

function summaryHtml(){
  const d=S.draft,v=vehById(d.vehicleId),s=svcById(d.serviceId);
  return '<div class="card sum"><div><span>Veículo</span><span>'+esc(v.model)+' · '+esc(v.plate)+'</span></div><div><span>Serviço</span><span>'+s.name+'</span></div><div><span>Unidade</span><span>'+esc(d.unit)+'</span></div><div><span>Data e hora</span><span>'+wkShort(d.date)+', '+brDate(d.date)+' · '+d.time+'</span></div><div class="total"><span>Total</span><span>'+money(s.price)+'</span></div></div>';
}

/* TELA 06 — Pagamento (paginas/pagamento.html) */
telas.checkout={
  atualizar(){
    $('#resumo').innerHTML=summaryHtml();
    const sel=S.draft.pay;
    $$('[data-act=selPay]').forEach(o=>{const on=o.dataset.id===sel;o.classList.toggle('sel',on);o.setAttribute('aria-checked',String(on))});
    const b=$('#continuar');b.disabled=!sel;b.textContent=sel==='local'?'Confirmar agendamento':'Continuar';
  }
};

/* TELA 06A — Pix (paginas/pix.html) */
telas.pix={
  atualizar(){
    const s=svcById(S.draft.serviceId);
    if(!S.pix||S.pix.expires<=0){S.pix={payload:pixPayload(s.price),expires:Date.now()+PIX_MINUTES*60000,total:PIX_MINUTES*60000}}
    $('#valor-pix').textContent=money(s.price);
    $('#qr').innerHTML=qrSvg(S.pix.payload);
    $('#copia').value=S.pix.payload;
  }
};

/* TELA 06B — Cartão (paginas/cartao.html) */
telas.card={
  atualizar(){const s=svcById(S.draft.serviceId);$$('[data-total]').forEach(e=>{e.textContent=money(s.price)})}
};

/* TELA 07 — Confirmação (paginas/confirmacao.html) */
telas.confirm={
  atualizar(){
    const b=S.last,v=vehById(b.vehicleId),s=svcById(b.serviceId),u=userById(b.userId)||S.user;
    const escrever=(id,txt)=>{$('#'+id).textContent=txt};
    escrever('codigo',b.code);
    escrever('r-cliente',u.name);
    escrever('r-veiculo',v?v.model+' · '+v.plate:'—');
    escrever('r-servico',s.name);
    escrever('r-unidade',b.unit);
    escrever('r-data',wkShort(b.date)+', '+brDate(b.date)+' · '+b.time);
    escrever('r-pagamento',payLabel(b)+' · '+payState(b));
    escrever('r-total',money(b.price));
    $('#link-whatsapp').href='https://wa.me/'+WA_NUMBER+'?text='+encodeURIComponent(bookingText(b));
    escrever('whatsapp-numero',WA_DISPLAY);
    const outlook=/@outlook/i.test(u.email),c=calLinks(b);
    $('#link-agenda').href=outlook?c.outlook:c.google;
    escrever('agenda-nome','Adicionar à Agenda ('+(outlook?'Outlook':'Google')+')');
  }
};
