/* Carwash — navegação entre as páginas, atualização da tela atual e cronômetro do Pix. */
'use strict';
/* ============ páginas ============ */
const PAGINAS={
  login:'login.html',register:'cadastro.html',
  garage:'garagem.html',services:'servicos.html',unit:'local.html',time:'horario.html',
  checkout:'pagamento.html',pix:'pix.html',card:'cartao.html',confirm:'confirmacao.html',
  admin:'admin.html'
};
const PROTECTED=['garage','services','unit','time','checkout','pix','card','confirm'];

/* Se a página não pode ser aberta agora, devolve para qual tela ir (senão null).
   Ex.: abrir horario.html sem ter escolhido a unidade volta para local.html. */
function paraOnde(tela){
  if(PROTECTED.includes(tela)&&!S.user)return 'login';
  if(tela==='admin'&&!S.adminOk)return 'login';
  if((tela==='login'||tela==='register')&&S.user)return 'garage';
  const d=S.draft;
  const passos=[['garage',()=>vehById(d.vehicleId)],['services',()=>svcById(d.serviceId)],['unit',()=>UNITS.some(u=>u.id===d.unit)],['time',()=>d.date&&d.time]];
  const precisa={services:1,unit:2,time:3,checkout:4,pix:4,card:4}[tela]||0;
  for(let i=0;i<precisa;i++)if(!passos[i][1]())return passos[i][0];
  if(tela==='confirm'&&!S.last)return 'garage';
  return null;
}

/* ============ render / navegação ============ */
function clearTimers(){timers.forEach(clearInterval);timers=[]}
function render(){
  const t=telas[S.screen];if(t&&t.atualizar)t.atualizar();
  renderJanela();salvarEstado();
  after[S.screen]&&after[S.screen]();
}
const after={
  pix(){clearTimers();tickPix();timers.push(setInterval(tickPix,1000))},
  admin(){clearTimers();timers.push(setInterval(()=>{const a=document.activeElement;if(a&&a.tagName==='SELECT')return;const u=$('#upd');if(S.screen==='admin'){const n=new Date();if(u)u.textContent=pad(n.getHours())+':'+pad(n.getMinutes())+':'+pad(n.getSeconds())}const snap=localStorage.getItem(KEY);if(snap!==S._snap){S._snap=snap;D=loadDB();render()}},3000))}
};
/* Troca de tela = abre a página .html da tela. trocar=true substitui no histórico (usado nos redirecionamentos). */
function go(to,trocar){
  clearTimers();if(to!=='pix')S.pix=null;S.modal=null;
  guardarAviso();salvarEstado();
  const url=PAGINAS[to];if(trocar)location.replace(url);else location.href=url;
}
function tickPix(){
  const t=$('#pixTimer');if(!t||!S.pix)return;
  const left=Math.max(0,S.pix.expires-Date.now()),s=Math.ceil(left/1000);
  t.textContent=pad(Math.floor(s/60))+':'+pad(s%60);
  const bar=$('#pixBar');if(bar)bar.style.width=(left/S.pix.total*100)+'%';
  const exp=left<=0;const q=$('#qr');if(q)q.classList.toggle('expired',exp);
  const sim=$('#simPix'),nw=$('#newPix');if(sim)sim.style.display=exp?'none':'';if(nw)nw.style.display=exp?'':'none';
  if(exp){t.textContent='expirado'}
}
