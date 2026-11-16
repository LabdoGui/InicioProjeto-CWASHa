/* Carwash (protótipo) — campos, avisos, tema, cabeçalho, etapas, botão Voltar e rodapé. */
'use strict';
/* ============ helpers de UI ============ */
function setErr(id,msg){const f=$('[data-f="'+id+'"]');if(!f)return;f.classList.toggle('invalid',!!msg);const e=$('.err',f);if(e)e.textContent=msg||'';const i=$('input,select',f);if(i)i.setAttribute('aria-invalid',msg?'true':'false')}
function failForm(f){
  const bad=$$('.field.invalid',f);let box=$('.formerr',f);
  if(!box){box=document.createElement('div');box.className='formerr';box.setAttribute('role','alert');const btn=$('button[type=submit]',f);btn.parentNode.insertBefore(box,btn)}
  box.textContent=bad.length?'Não foi possível continuar. Corrija: '+bad.map(x=>$('label',x).textContent).join(', ')+'.':'';
  const i=bad[0]&&$('input',bad[0]);if(i){try{i.scrollIntoView({block:'center',behavior:'smooth'})}catch(e){}i.focus({preventScroll:true})}
}
function toast(msg){$$('.toast').forEach(t=>t.remove());const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=msg;document.body.appendChild(t);setTimeout(()=>t.remove(),3200)}
function field({id,label,type='text',ph='',val='',attrs='',hint='',pw=false}){
  const input='<input id="'+id+'" name="'+id+'" type="'+type+'" placeholder="'+esc(ph)+'" value="'+esc(val)+'" aria-describedby="'+id+'-err" '+attrs+'>';
  return '<div class="field" data-f="'+id+'"><label for="'+id+'">'+label+'</label>'+(pw?'<div class="pw">'+input+'<button type="button" class="eye" data-act="togglePw" data-target="'+id+'" aria-label="Mostrar senha">'+ic('eye')+'</button></div>':input)+'<div class="hint">'+hint+'</div><div class="err" id="'+id+'-err" role="alert"></div></div>';
}
function setTheme(t){document.documentElement.setAttribute('data-theme',t);try{localStorage.setItem('carwash.theme',t)}catch(e){}const m=$('meta[name=theme-color]');if(m)m.content=t==='dark'?'#0F172A':'#F8FAFC';$$('.theme button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===t)))}
const curTheme=()=>document.documentElement.getAttribute('data-theme');
function header(){
  const t=curTheme();
  return '<header class="top"><div class="brand">'+LOGO+'<span>Carwash</span></div>'+
  '<div class="theme" role="group" aria-label="Tema do aplicativo">'+
  '<button type="button" data-act="theme" data-t="light" aria-pressed="'+(t==='light')+'">'+ic('sun')+'Claro</button>'+
  '<button type="button" data-act="theme" data-t="dark" aria-pressed="'+(t==='dark')+'">'+ic('moon')+'Escuro</button></div></header>';
}
function stepper(n){
  const L=['Veículo','Serviço','Local','Horário','Pagar'];
  return '<ol class="stepper" aria-label="Etapas do agendamento">'+L.map((l,i)=>'<li class="'+(i<n?'done':i===n?'now':'')+'"'+(i===n?' aria-current="step"':'')+'><i></i>'+l+'</li>').join('')+'</ol>';
}
const backBtn=(to,label)=>'<button class="linkbtn" data-act="go" data-to="'+to+'" style="display:inline-flex;align-items:center;gap:4px;text-decoration:none;margin:-4px 0 8px -6px">'+ic('back').replace('<svg','<svg width="18" height="18"')+(label||'Voltar')+'</button>';
function footer(){
  const logged=S.user&&S.screen!=='admin'&&!['login','register'].includes(S.screen);
  return '<footer class="foot">'+(logged?'<button class="linkbtn" data-act="logout">Sair da conta</button><br>':'')+'Carwash · Qualidade e Brilho Impecável para o seu Veículo</footer>';
}
