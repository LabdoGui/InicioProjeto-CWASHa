/* Carwash — inicia a página aberta: recupera a sessão, confere se a tela pode abrir e preenche a tela. */
'use strict';
/* ============ início ============ */
(function init(){
  try{const id=localStorage.getItem('carwash.session');const u=id&&D.users.find(x=>x.id===id);if(u)S.user=u;
      if(sessionStorage.getItem('carwash.admin')==='1')S.adminOk=true}catch(e){}
  setTheme(curTheme());
  const destino=paraOnde(S.screen);
  if(destino){go(destino,true);return}
  window.addEventListener('storage',e=>{if(e.key===KEY&&S.screen==='admin'){D=loadDB();S._snap=e.newValue;const a=document.activeElement;if(!(a&&a.tagName==='SELECT'))render()}});
  window.addEventListener('pagehide',salvarEstado);
  const t=telas[S.screen];if(t&&t.montar)t.montar();
  if(S.screen==='admin')S._snap=localStorage.getItem(KEY);
  render();
  mostrarAviso();
  if(S.screen!=='login'){const h=$('#main h1');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}}
  window.Carwash={S,go,setTheme,seedDemo,clearDemo,reset:()=>{localStorage.clear();sessionStorage.clear();location.href=PAGINAS.login},db:()=>D};
})();
