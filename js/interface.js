/* Carwash — ajudas de tela: erros nos campos, avisos (toast) e tema claro/escuro.
   O cabeçalho, as etapas, o botão Voltar e o rodapé agora estão escritos direto em cada página .html. */
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

/* Aviso que aparece na próxima página (quando a tela troca logo depois de um toast). */
function guardarAviso(){const t=$('.toast');if(t)try{sessionStorage.setItem('carwash.aviso',t.textContent)}catch(e){}}
function mostrarAviso(){try{const m=sessionStorage.getItem('carwash.aviso');if(m){sessionStorage.removeItem('carwash.aviso');toast(m)}}catch(e){}}

function setTheme(t){document.documentElement.setAttribute('data-theme',t);try{localStorage.setItem('carwash.theme',t)}catch(e){}const m=$('meta[name=theme-color]');if(m)m.content=t==='dark'?'#0F172A':'#F8FAFC';$$('.theme button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.t===t)))}
const curTheme=()=>document.documentElement.getAttribute('data-theme');
