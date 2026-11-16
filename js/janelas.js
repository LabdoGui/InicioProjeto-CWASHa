/* Carwash (protótipo) — janelas por cima da tela (senha do admin e recuperar senha). */
'use strict';
/* ============ modais ============ */
function modalHtml(){
  if(S.modal==='admin')return '<div class="overlay" data-act="closeModal"><form class="modal stack" data-form="admin" role="dialog" aria-modal="true" aria-labelledby="mt" novalidate><h2 id="mt">Acesso restrito</h2><p class="muted small">Área exclusiva da equipe Carwash.</p>'+field({id:'apass',label:'Senha do administrador',type:'password',attrs:'autocomplete="off"',pw:true})+'<div class="row2"><button type="button" class="btn ghost" data-act="closeModal">Cancelar</button><button class="btn primary" type="submit">Entrar</button></div></form></div>';
  if(S.modal==='forgot')return '<div class="overlay" data-act="closeModal"><form class="modal stack" data-form="forgot" role="dialog" aria-modal="true" aria-labelledby="mt" novalidate><h2 id="mt">Recuperar senha</h2><p class="muted small">Informe seu e-mail para receber as instruções de redefinição.</p>'+field({id:'femail',label:'E-mail',type:'email',ph:'seunome@gmail.com',attrs:'inputmode="email"'})+'<p class="notice">Protótipo: nenhum e-mail é realmente enviado.</p><div class="row2"><button type="button" class="btn ghost" data-act="closeModal">Fechar</button><button class="btn primary" type="submit">Enviar</button></div></form></div>';
  return '';
}
