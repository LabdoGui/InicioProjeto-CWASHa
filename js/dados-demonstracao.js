/* Carwash (protótipo) — clientes e agendamentos de exemplo para apresentar o painel. */
'use strict';
/* ============ dados de demonstração ============ */
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
function seedDemo(){
  clearDemo();
  const rnd=mulberry(20261009),pick=a=>a[Math.floor(rnd()*a.length)],mk=o=>Object.assign({demo:true},o);
  const names=['Ana Lima','Bruno Carvalho','Camila Rocha','Diego Martins','Eduarda Nunes','Felipe Araújo','Gabriela Souza','Henrique Faria','Isabela Duarte','João Pedro Alves'];
  const slug=n=>n.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/\s+/g,'.');
  const users=names.map((n,i)=>mk({id:'du'+i,name:n,email:slug(n)+'.demo@'+(i%3===2?'outlook.com':'gmail.com'),phone:'(11) 9'+(8000+i*137)+'-'+(1000+i*311),hash:null}));
  const L='ABCDEFGHJKLMNOPRSTUVWXYZ',plate=()=>pick(L)+pick(L)+pick(L)+Math.floor(rnd()*10)+pick(L)+Math.floor(rnd()*10)+Math.floor(rnd()*10);
  const M={Sedan:['Corolla','Civic','Virtus','Cruze'],Hatch:['Onix','HB20','Polo','Argo'],SUV:['Creta','T-Cross','Compass','Tracker'],Custom:['Meteor 350','Shadow 600','Vulcan S'],Esportiva:['CBR 500R','Ninja 400','YZF-R3']};
  const cs=['Branco','Preto','Prata','Cinza','Vermelho','Azul','Verde'],vehicles=[];
  users.forEach((u,i)=>{const n=rnd()<.4?2:1;for(let k=0;k<n;k++){const moto=rnd()<.35,cat=moto?'Moto':'Carro',sub=pick(SUBS[cat]);vehicles.push(mk({id:'dv'+i+'_'+k,userId:u.id,cat,sub,model:pick(M[sub]),color:pick(cs),plate:plate()}))}});
  const used=new Set(D.vehicles.map(v=>v.plate));vehicles.forEach(v=>{while(used.has(v.plate))v.plate=plate();used.add(v.plate)});
  const w=[['ducha',.28],['simples',.32],['completa',.27],['higien',.13]],svc=()=>{let r=rnd(),a=0;for(const [id,p] of w){a+=p;if(r<a)return id}return 'ducha'};
  const bookings=[],cards=[],busy=new Set(),n0=new Date();
  const cardFor=u=>{if(!cards.some(c=>c.userId===u.id)){const br=pick(['Visa','Mastercard','Elo']);cards.push(mk({id:'dc'+u.id,userId:u.id,brand:br,last4:String(1000+Math.floor(rnd()*8999)),holder:u.name.toUpperCase(),exp:pad(1+Math.floor(rnd()*12))+'/'+(28+Math.floor(rnd()*4))}))}};
  let bi=0;
  const add=(date,time,unit,status,pay,v,sid)=>{const u=users.find(x=>x.id===v.userId),s=SERVICES.find(x=>x.id===sid);if(pay==='cartao')cardFor(u);bookings.push(mk({id:'db'+(bi++),code:'CW-D'+String(bi).padStart(4,'0'),userId:u.id,vehicleId:v.id,serviceId:sid,price:s.price,unit,date,time,status,pay,paid:pay!=='local'||status==='Concluído',createdAt:Date.now()-bi*1000}))};
  const free=(date,unit)=>{for(let t=0;t<30;t++){const h=pick(SLOTS),k=date+unit+h;if(!busy.has(k)&&!D.bookings.some(b=>b.date===date&&b.unit===unit&&b.time===h)){busy.add(k);return h}}return null};
  for(let off=-41;off<=-1;off++){const d=new Date(n0.getFullYear(),n0.getMonth(),n0.getDate()+off),date=dkey(d),wd=d.getDay();const n=wd===6?3+Math.floor(rnd()*3):wd===0?1+Math.floor(rnd()*2):1+Math.floor(rnd()*4);
    for(let i=0;i<n;i++){const unit=pick(UNITS).id,h=free(date,unit);if(!h)continue;add(date,h,unit,'Concluído',pick(['pix','pix','cartao','cartao','local']),pick(vehicles),svc())}}
  const T=dkey(n0),tm=dkey(new Date(n0.getFullYear(),n0.getMonth(),n0.getDate()+1));
  const today=[['08:00','FMU Liberdade','Concluído','pix'],['09:00','FMU Santo Amaro','Concluído','cartao'],['10:00','FMU Liberdade','Concluído','local'],['11:00','FMU Santo Amaro','Em Lavagem','pix'],['13:00','FMU Liberdade','Em Lavagem','cartao'],['14:00','FMU Santo Amaro','Aguardando','cartao'],['16:00','FMU Liberdade','Aguardando','local']];
  const used2=D.bookings.filter(b=>b.date===T);
  today.forEach((t,i)=>{if(used2.some(b=>b.unit===t[1]&&b.time===t[0]))return;busy.add(T+t[1]+t[0]);add(T,t[0],t[1],t[2],t[3],vehicles[(i*2)%vehicles.length],['simples','completa','ducha','higien','completa','simples','ducha'][i])});
  [['09:00','FMU Liberdade'],['11:00','FMU Liberdade'],['14:00','FMU Liberdade'],['10:00','FMU Santo Amaro']].forEach((t,i)=>{if(D.bookings.some(b=>b.date===tm&&b.unit===t[1]&&b.time===t[0]))return;busy.add(tm+t[1]+t[0]);add(tm,t[0],t[1],'Aguardando',pick(['pix','cartao','local']),vehicles[(i*3+1)%vehicles.length],svc())});
  D.users.push(...users);D.vehicles.push(...vehicles);D.bookings.push(...bookings);D.cards.push(...cards);save();S._snap=localStorage.getItem(KEY);
}
function clearDemo(){D.users=D.users.filter(x=>!x.demo);D.vehicles=D.vehicles.filter(x=>!x.demo);D.bookings=D.bookings.filter(x=>!x.demo);D.cards=D.cards.filter(x=>!x.demo);save()}
