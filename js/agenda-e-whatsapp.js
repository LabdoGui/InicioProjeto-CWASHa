/* Carwash (protótipo) — mensagem do WhatsApp, links do Google/Outlook e arquivo .ics. */
'use strict';
/* ============ agenda / whatsapp ============ */
function bookingText(b){
  const v=vehById(b.vehicleId),u=userById(b.userId),s=svcById(b.serviceId);
  return 'Olá! Agendei uma lavagem no Carwash.\n\nCódigo: '+b.code+'\nCliente: '+(u?u.name:'')+'\nVeículo: '+(v?v.model+' '+v.color+' · '+v.plate:'')+'\nServiço: '+s.name+' ('+money(b.price)+')\nUnidade: '+b.unit+'\nData: '+brDate(b.date)+' às '+b.time+'\nPagamento: '+payLabel(b)+' ('+payState(b)+')';
}
const stamp=(date,time,addH)=>{const [y,m,d]=date.split('-');return y+m+d+'T'+pad(parseInt(time)+(addH||0))+'0000'};
const isoLocal=(date,time,addH)=>date+'T'+pad(parseInt(time)+(addH||0))+':00:00';
function calLinks(b){
  const s=svcById(b.serviceId),v=vehById(b.vehicleId);
  const title='Carwash — '+s.name,loc=b.unit+', São Paulo/SP',det='Código '+b.code+' · '+(v?v.model+' · '+v.plate:'');
  const google='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(title)+'&dates='+stamp(b.date,b.time)+'/'+stamp(b.date,b.time,1)+'&details='+encodeURIComponent(det)+'&location='+encodeURIComponent(loc)+'&ctz=America%2FSao_Paulo';
  const outlook='https://outlook.live.com/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent&subject='+encodeURIComponent(title)+'&startdt='+encodeURIComponent(isoLocal(b.date,b.time))+'&enddt='+encodeURIComponent(isoLocal(b.date,b.time,1))+'&location='+encodeURIComponent(loc)+'&body='+encodeURIComponent(det);
  return {google,outlook,title,loc,det};
}
function downloadIcs(b){
  const c=calLinks(b),e=t=>String(t).replace(/([,;\\])/g,'\\$1').replace(/\n/g,'\\n');
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Carwash//PT-BR','CALSCALE:GREGORIAN','BEGIN:VEVENT','UID:'+b.code+'@carwash','DTSTAMP:'+new Date().toISOString().replace(/[-:]|\.\d+/g,''),'DTSTART:'+stamp(b.date,b.time),'DTEND:'+stamp(b.date,b.time,1),'SUMMARY:'+e(c.title),'LOCATION:'+e(c.loc),'DESCRIPTION:'+e(c.det),'END:VEVENT','END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download='carwash-'+b.code+'.ics';document.body.appendChild(a);a.click();a.remove();
}
