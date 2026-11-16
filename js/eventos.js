/* Carwash (protótipo) — o que acontece em cada toque e em cada formulário. */
'use strict';
/* ============ eventos ============ */
const actions={
  theme:t=>setTheme(t.dataset.t),
  go:t=>go(t.dataset.to),
  togglePw:t=>{const i=document.getElementById(t.dataset.target);const show=i.type==='password';i.type=show?'text':'password';t.innerHTML=ic(show?'eyeoff':'eye');t.setAttribute('aria-label',show?'Ocultar senha':'Mostrar senha')},
  logout:()=>{S.user=null;S.draft={vehicleId:null,serviceId:null,unit:null,date:null,time:null};try{localStorage.removeItem('carwash.session')}catch(e){};go('login')},
  openAdmin:()=>{if(S.adminOk){go('admin')}else{S.modal='admin';render()}},
  closeModal:(t,e)=>{if(e.target===t||t.tagName==='BUTTON'){S.modal=null;render()}},
  forgot:()=>{S.modal='forgot';render()},
  exitAdmin:()=>{S.adminOk=false;try{sessionStorage.removeItem('carwash.admin')}catch(e){};go('login')},
  seedDemo:()=>{seedDemo();toast('Dados de demonstração carregados');render()},
  clearDemo:()=>{clearDemo();toast('Dados de demonstração removidos');render()},
  selCat:t=>{S.gv.cat=t.dataset.v;S.gv.sub=SUBS[S.gv.cat][0];render()},
  selSub:t=>{S.gv.sub=t.dataset.v;render()},
  showForm:()=>{S.showForm=true;render();const m=$('#model');if(m)m.focus()},
  selVeh:(t,e)=>{if(e.target.closest('[data-act="delVeh"]'))return;S.draft.vehicleId=t.dataset.id;render()},
  delVeh:(t,e)=>{e.stopPropagation();const id=t.dataset.id;if(D.bookings.some(b=>b.vehicleId===id)){toast('Este veículo possui agendamentos e não pode ser removido.');return}
    if(!confirm('Remover este veículo da garagem?'))return;D.vehicles=D.vehicles.filter(v=>v.id!==id);if(S.draft.vehicleId===id)S.draft.vehicleId=null;save();render()},
  selSvc:t=>{S.draft.serviceId=t.dataset.id;render()},
  selUnit:t=>{S.draft.unit=t.dataset.id;S.draft.time=null;render()},
  selDate:t=>{S.draft.date=t.dataset.k;S.draft.time=null;render()},
  selTime:t=>{S.draft.time=t.dataset.t;render()},
  selPay:t=>{S.draft.pay=t.dataset.id;render()},
  payGo:()=>{const p=S.draft.pay;if(p==='pix')go('pix');else if(p==='cartao')go('card');else if(p==='local'){if(createBooking('local',false))go('confirm')}},
  copyPix:async()=>{const txt=S.pix.payload;try{await navigator.clipboard.writeText(txt);toast('Código Pix copiado')}catch(e){const ta=$('#copia');ta.select();try{document.execCommand('copy');toast('Código Pix copiado')}catch(_){toast('Selecione e copie o código manualmente')}}},
  newPix:()=>{S.pix=null;clearTimers();render()},
  simPix:()=>{if(S.pix.expires<=Date.now()){toast('Este Pix expirou. Gere um novo código.');return}if(createBooking('pix',true))go('confirm')},
  ics:()=>downloadIcs(S.last),
  newBooking:()=>{S.draft={vehicleId:null,serviceId:null,unit:null,date:null,time:null};go('garage')}
};
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t)return;const a=actions[t.dataset.act];if(a){if(t.tagName==='A')return;a(t,e)}});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&S.modal){S.modal=null;render();return}
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('[role=radio][data-act]')){e.preventDefault();e.target.click()}
});
document.addEventListener('input',e=>{
  const t=e.target,m=t.dataset&&t.dataset.mask;
  if(m==='phone')t.value=maskPhone(t.value);
  if(m==='plate')t.value=maskPlate(t.value);
  if(m==='card'){t.value=maskCard(t.value);const b=$('#cbrand');if(b){const n=digits(t.value);b.textContent=n.length>=2?brand(n):''}}
  if(m==='exp')t.value=maskExp(t.value);
  if(m==='upper')t.value=t.value.toUpperCase();
  if(m==='cvv')t.value=digits(t.value).slice(0,4);
  if(t.dataset&&t.dataset.gv)S.gv[t.dataset.gv]=t.value;
  if(t.id==='password'&&t.closest('[data-form=register]')){const p=t.value;$$('#rules li').forEach((li,i)=>li.classList.toggle('ok',PASS_RULES[i][1](p)))}
  if(t.id&&t.closest('.field'))setErr(t.id,'');const fe=t.closest&&t.closest('form')&&t.closest('form').querySelector('.formerr');if(fe)fe.textContent='';
});
document.addEventListener('change',e=>{
  const t=e.target;
  if(t.matches('[data-status]')){const b=D.bookings.find(x=>x.id===t.dataset.status);if(b){b.status=t.value;save();S._snap=localStorage.getItem(KEY);render();const el=document.getElementById('st-'+b.id);if(el)el.focus()}}
});
document.addEventListener('submit',async e=>{
  const f=e.target.closest('form[data-form]');if(!f)return;e.preventDefault();
  const h=forms[f.dataset.form];if(h)await h(f);
});

const forms={
  async login(f){
    const email=f.email.value.trim().toLowerCase(),pw=f.password.value;let ok=true;setErr('email','');setErr('password','');
    if(!email){setErr('email','Informe seu e-mail.');ok=false}else if(!EMAIL_RE.test(email)){setErr('email','Use um e-mail @gmail ou @outlook.');ok=false}
    if(!pw){setErr('password','Informe sua senha.');ok=false}
    if(!ok){failForm(f);return}
    const u=D.users.find(x=>x.email===email&&x.hash),h=await hashPw(email,pw);
    if(!u||u.hash!==h){setErr('password','E-mail ou senha incorretos.');failForm(f);return}
    startSession(u);
  },
  async register(f){
    const name=f.name.value.trim().replace(/\s+/g,' '),email=f.email.value.trim().toLowerCase(),phone=f.phone.value,pw=f.password.value;let ok=true;
    ['name','email','phone','password'].forEach(x=>setErr(x,''));
    if(name.split(' ').filter(x=>x.length>1).length<2){setErr('name','Informe nome e sobrenome.');ok=false}
    if(!EMAIL_RE.test(email)){setErr('email','Use um e-mail @gmail ou @outlook válido.');ok=false}
    else if(D.users.some(u=>u.email===email)){setErr('email','Este e-mail já está cadastrado. Tente entrar.');ok=false}
    if(!validPhone(phone)){setErr('phone','Informe um celular válido, com DDD.');ok=false}
    if(!strongPass(pw)){setErr('password','A senha ainda não atende a todos os requisitos.');ok=false}
    if(!ok){failForm(f);return}
    const u={id:uid(),name,email,phone:maskPhone(phone),hash:await hashPw(email,pw),createdAt:Date.now()};
    D.users.push(u);save();startSession(u);
  },
  async vehicle(f){
    const g=S.gv,model=f.model.value.trim(),color=f.color.value.trim(),plate=maskPlate(f.plate.value);let ok=true;
    ['model','color','plate'].forEach(x=>setErr(x,''));
    if(model.length<2){setErr('model','Informe o modelo.');ok=false}
    if(color.length<3){setErr('color','Informe a cor.');ok=false}
    if(!PLATE_RE.test(plate)){setErr('plate','Placa Mercosul inválida. Ex.: ABC1D23.');ok=false}
    else if(D.vehicles.some(v=>v.plate===plate)){setErr('plate','Esta placa já está cadastrada.');ok=false}
    if(!ok){failForm(f);return}
    const v={id:uid(),userId:S.user.id,cat:g.cat,sub:g.sub,model,color:color[0].toUpperCase()+color.slice(1),plate};
    D.vehicles.push(v);save();S.draft.vehicleId=v.id;S.gv.model=S.gv.color=S.gv.plate='';S.showForm=false;render();toast('Veículo salvo na sua garagem');
  },
  async card(f){
    const num=digits(f.cnum.value),name=f.cname.value.trim(),exp=f.cexp.value,cvv=f.ccvv.value;let ok=true;
    ['cnum','cname','cexp','ccvv'].forEach(x=>setErr(x,''));
    if(!luhn(num)){setErr('cnum','Número de cartão inválido.');ok=false}
    if(name.split(' ').filter(Boolean).length<2){setErr('cname','Informe o nome como está no cartão.');ok=false}
    if(!expOk(exp)){setErr('cexp','Validade inválida ou vencida.');ok=false}
    const need=brand(num)==='Amex'?4:3;if(cvv.length!==need){setErr('ccvv','CVV com '+need+' dígitos.');ok=false}
    if(!ok){failForm(f);return}
    if($('#csave').checked){const last4=num.slice(-4),br=brand(num);if(!D.cards.some(c=>c.userId===S.user.id&&c.last4===last4&&c.brand===br))D.cards.push({id:uid(),userId:S.user.id,brand:br,last4,holder:name,exp})}
    f.reset();
    if(createBooking('cartao',true))go('confirm');
  },
  async admin(f){
    const v=f.apass.value;setErr('apass','');
    if(v===ADMIN_PASS){S.adminOk=true;try{sessionStorage.setItem('carwash.admin','1')}catch(e){}S._snap=localStorage.getItem(KEY);go('admin')}
    else setErr('apass','Senha incorreta.');
  },
  async forgot(f){
    const e=f.femail.value.trim().toLowerCase();setErr('femail','');
    if(!EMAIL_RE.test(e)){setErr('femail','Use um e-mail @gmail ou @outlook.');return}
    S.modal=null;render();toast('Se o e-mail estiver cadastrado, enviaremos as instruções.');
  }
};
function startSession(u){S.user=u;try{localStorage.setItem('carwash.session',u.id)}catch(e){}S.gv={cat:'Carro',sub:'Sedan',model:'',color:'',plate:''};S.showForm=false;S.draft={vehicleId:null,serviceId:null,unit:null,date:null,time:null};go('garage')}
