/* Carwash (protótipo) — inicia o app (sessão salva, tema e primeira tela). */
'use strict';
/* ============ início ============ */
(function init(){
  try{const id=localStorage.getItem('carwash.session');const u=id&&D.users.find(x=>x.id===id);if(u){S.user=u;S.screen='garage'}
      if(sessionStorage.getItem('carwash.admin')==='1')S.adminOk=true}catch(e){}
  setTheme(curTheme());
  window.addEventListener('storage',e=>{if(e.key===KEY&&S.screen==='admin'){D=loadDB();S._snap=e.newValue;const a=document.activeElement;if(!(a&&a.tagName==='SELECT'))render()}});
  render();
  window.Carwash={S,go,setTheme,seedDemo,clearDemo,reset:()=>{localStorage.clear();sessionStorage.clear();location.reload()},db:()=>D};
})();
