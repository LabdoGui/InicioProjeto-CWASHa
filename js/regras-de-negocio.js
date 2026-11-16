/* Carwash (protótipo) — horários livres/ocupados, criar agendamento e formas de pagamento. */
'use strict';
/* ============ regras de negócio ============ */
const myVehicles=()=>D.vehicles.filter(v=>v.userId===(S.user&&S.user.id));
const vehById=id=>D.vehicles.find(v=>v.id===id);
const svcById=id=>SERVICES.find(s=>s.id===id);
const userById=id=>D.users.find(u=>u.id===id);
const slotTaken=(unit,date,time)=>D.bookings.some(b=>b.unit===unit&&b.date===date&&b.time===time&&b.status!=='Cancelado');
function slotPast(date,time){return date===todayKey()&&parseInt(time)<=new Date().getHours()}
const slotFree=(unit,date,time)=>!slotTaken(unit,date,time)&&!slotPast(date,time);
function dateOptions(unit){
  const out=[],base=new Date();
  for(let i=0;i<7;i++){const d=new Date(base.getFullYear(),base.getMonth(),base.getDate()+i);const k=dkey(d);out.push({k,day:d.getDate(),wd:wkShort(k),free:SLOTS.filter(t=>slotFree(unit,k,t)).length})}
  return out;
}
function createBooking(pay,paid){
  const d=S.draft,v=vehById(d.vehicleId),sv=svcById(d.serviceId);
  if(!v||!sv||!d.unit||!d.date||!d.time){go('garage');return null}
  if(!slotFree(d.unit,d.date,d.time)){toast('Esse horário acabou de ser ocupado. Escolha outro.');d.time=null;go('time');return null}
  const b={id:uid(),code:'CW-'+Math.random().toString(36).slice(2,7).toUpperCase(),userId:S.user.id,vehicleId:v.id,serviceId:sv.id,price:sv.price,unit:d.unit,date:d.date,time:d.time,status:'Aguardando',pay,paid,createdAt:Date.now()};
  D.bookings.push(b);save();S.last=b;return b;
}
const payLabel=b=>b.pay==='pix'?'Pix':b.pay==='cartao'?'Cartão':'Pagar no local';
const payState=b=>b.pay==='local'?(b.status==='Concluído'?'recebido':'a receber no local'):'pago';
