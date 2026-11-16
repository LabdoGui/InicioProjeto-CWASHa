/* Carwash (protótipo) — desenha a tela atual, troca de tela e cronômetro do Pix. */
'use strict';
/* ============ render / navegação ============ */
const PROTECTED=['garage','services','unit','time','checkout','pix','card','confirm'];
function clearTimers(){timers.forEach(clearInterval);timers=[]}
function render(){
  if(PROTECTED.includes(S.screen)&&!S.user)S.screen='login';
  if(S.screen==='admin'&&!S.adminOk)S.screen='login';
  const app=$('#app');const fid=document.activeElement&&document.activeElement.id;
  app.className='app'+(S.screen==='admin'?' wide':'');
  app.innerHTML=header()+'<main id="main" tabindex="-1">'+screens[S.screen]()+'</main>'+footer()+modalHtml();
  if(fid){const el=document.getElementById(fid);if(el&&el.focus)el.focus()}
  if(S.modal){const i=$('.modal input');if(i)i.focus()}
  after[S.screen]&&after[S.screen]();
}
const after={
  pix(){tickPix();timers.push(setInterval(tickPix,1000))},
  admin(){timers.push(setInterval(()=>{const a=document.activeElement;if(a&&a.tagName==='SELECT')return;const u=$('#upd');if(S.screen==='admin'){const n=new Date();if(u)u.textContent=pad(n.getHours())+':'+pad(n.getMinutes())+':'+pad(n.getSeconds())}const snap=localStorage.getItem(KEY);if(snap!==S._snap){S._snap=snap;D=loadDB();render()}},3000))}
};
function go(to){clearTimers();if(to!=='pix')S.pix=null;S.screen=to;S.modal=null;render();window.scrollTo(0,0);const h=$('#main h1');if(h){h.setAttribute('tabindex','-1');h.focus({preventScroll:true})}}
function tickPix(){
  const t=$('#pixTimer');if(!t||!S.pix)return;
  const left=Math.max(0,S.pix.expires-Date.now()),s=Math.ceil(left/1000);
  t.textContent=pad(Math.floor(s/60))+':'+pad(s%60);
  const bar=$('#pixBar');if(bar)bar.style.width=(left/S.pix.total*100)+'%';
  const exp=left<=0;const q=$('#qr');if(q)q.classList.toggle('expired',exp);
  const sim=$('#simPix'),nw=$('#newPix');if(sim)sim.style.display=exp?'none':'';if(nw)nw.style.display=exp?'':'none';
  if(exp){t.textContent='expirado'}
}
