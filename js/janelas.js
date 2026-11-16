/* Carwash — janelas por cima da tela (senha do admin e recuperar senha).
   O HTML delas está em paginas/login.html, escondido com o atributo hidden. */
'use strict';
/* ============ modais ============ */
function renderJanela(){$$('[data-janela]').forEach(j=>{j.hidden=j.dataset.janela!==S.modal})}
function abrirJanela(nome){
  S.modal=nome;renderJanela();
  const j=$('[data-janela="'+nome+'"]');if(!j)return;
  const f=$('form',j);if(f){f.reset();$$('.field',f).forEach(x=>setErr(x.dataset.f,''));const fe=$('.formerr',f);if(fe)fe.textContent=''}
  const i=$('input',j);if(i)i.focus();
}
