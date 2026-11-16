/* Carwash (protótipo) — painel administrativo: indicadores, pátio, clientes, cartões, veículos e lucros. */
'use strict';
/* ============ ADMIN ============ */
const stCls=s=>s==='Concluído'?'ok':s==='Em Lavagem'?'info':'warn';
function table(heads,rows,empty,cols){
  return '<div class="scroll"><table class="dt"><thead><tr>'+heads.map((h,i)=>'<th scope="col"'+(h[1]?' class="n"':'')+'>'+h[0]+'</th>').join('')+'</tr></thead><tbody>'+(rows.length?rows.join(''):'<tr><td class="empty" colspan="'+heads.length+'">'+empty+'</td></tr>')+'</tbody></table></div>';
}
function weekStart(d){const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());x.setDate(x.getDate()-((x.getDay()+6)%7));return x}
function adminStats(){
  const t=todayKey(),live=D.bookings.filter(b=>b.status!=='Cancelado'),today=live.filter(b=>b.date===t);
  const done=today.filter(b=>b.status==='Concluído');
  const kpi={rev:done.reduce((a,b)=>a+b.price,0),served:today.filter(b=>b.status!=='Aguardando').length,done:done.length,eff:today.length?Math.round(done.length/today.length*100):0};
  const cl={};live.forEach(b=>{const c=cl[b.userId]||(cl[b.userId]={n:0,total:0,last:''});c.n++;c.total+=b.price;if(b.date>c.last&&b.date<=t)c.last=b.date});
  const clients=Object.keys(cl).map(id=>({u:userById(id),...cl[id]})).filter(x=>x.u).sort((a,b)=>b.total-a.total||b.n-a.n).slice(0,5);
  const weeks=[];const w0=weekStart(new Date());
  for(let i=5;i>=0;i--){const s=new Date(w0);s.setDate(s.getDate()-7*i);const e=new Date(s);e.setDate(e.getDate()+6);const a=dkey(s),z=dkey(e);const bs=D.bookings.filter(b=>b.status==='Concluído'&&b.date>=a&&b.date<=z);weeks.push({a,z,n:bs.length,rev:bs.reduce((x,b)=>x+b.price,0)})}
  const types=SERVICES.map(s=>({s,n:live.filter(b=>b.serviceId===s.id).length})).sort((a,b)=>b.n-a.n);
  return {kpi,clients,weeks,types,today,total:live.length};
}
function adminHtml(){
  const A=adminStats(),now=new Date();
  const dm=D.users.some(u=>u.demo)||D.bookings.some(b=>b.demo);
  const maxRev=Math.max(1,...A.weeks.map(w=>w.rev)),maxT=Math.max(1,...A.types.map(t=>t.n));
  const yard=A.today.slice().sort((a,b)=>a.time.localeCompare(b.time)).map(b=>{const v=vehById(b.vehicleId),u=userById(b.userId),s=svcById(b.serviceId);
    return '<tr><td><b>'+b.time+'</b></td><td>'+esc(u?u.name:'—')+'</td><td>'+esc(v?v.model:'—')+' <span class="plate">'+esc(v?v.plate:'')+'</span></td><td>'+s.name+'</td><td>'+esc(b.unit)+'</td><td>'+payLabel(b)+' <span class="muted">· '+payState(b)+'</span></td><td><select class="stsel s-'+stCls(b.status)+'" id="st-'+b.id+'" data-status="'+b.id+'" aria-label="Status de '+esc(v?v.plate:'')+'">'+STATUSES.map(o=>'<option'+(o===b.status?' selected':'')+'>'+o+'</option>').join('')+'</select></td></tr>'}).join('');
  const clients=A.clients.map((c,i)=>'<tr><td>'+(i+1)+'</td><td><b>'+esc(c.u.name)+'</b><br><span class="muted small">'+esc(c.u.email)+'</span></td><td class="n">'+c.n+'</td><td class="n"><b>'+money(c.total)+'</b></td><td>'+(c.last?brDate(c.last):'—')+'</td></tr>');
  const cards=D.cards.map(c=>{const u=userById(c.userId);return '<tr><td>'+esc(u?u.name:'—')+'</td><td>'+esc(c.brand)+'</td><td>•••• '+esc(c.last4)+'</td><td>'+esc(c.holder)+'</td><td>'+esc(c.exp)+'</td></tr>'});
  const vrows=cat=>D.vehicles.filter(v=>v.cat===cat).map(v=>{const u=userById(v.userId);return '<tr><td><span class="plate">'+esc(v.plate)+'</span></td><td>'+esc(v.model)+'</td><td><span class="tag">'+esc(v.sub)+'</span></td><td>'+esc(v.color)+'</td><td>'+esc(u?u.name:'—')+'</td></tr>'});
  const cars=vrows('Carro'),motos=vrows('Moto');
  const weeks=A.weeks.map((w,i)=>{const prev=A.weeks[i-1];let v='—';if(prev&&prev.rev>0){const p=Math.round((w.rev-prev.rev)/prev.rev*100);v='<span class="'+(p>=0?'pos':'neg')+'">'+(p>=0?'▲ +':'▼ ')+p+'%</span>'}
    return '<tr><td>'+brDate(w.a).slice(0,5)+' – '+brDate(w.z).slice(0,5)+(i===5?' <span class="tag">atual</span>':'')+'</td><td class="n">'+w.n+'</td><td class="n"><b>'+money(w.rev)+'</b></td><td class="n">'+(w.n?money(w.rev/w.n):'—')+'</td><td class="n">'+v+'</td></tr>'});
  const types=A.types.map((t,i)=>'<tr><td>'+(i+1)+'</td><td><b>'+t.s.name+'</b></td><td class="n">'+t.n+'</td><td class="n">'+(A.total?Math.round(t.n/A.total*100):0)+'%</td><td><div class="mini"><div class="bar"><span style="width:'+Math.round(t.n/maxT*100)+'%"></span></div></div></td></tr>');
  const K=A.kpi;
  return '<div class="adm-head"><div><div class="eyebrow">Painel administrativo</div><h1 style="margin:0">Pátio de hoje · '+brDate(todayKey())+'</h1><span class="live" style="margin-top:6px"><i></i>Tempo real · atualizado às <span id="upd">'+pad(now.getHours())+':'+pad(now.getMinutes())+':'+pad(now.getSeconds())+'</span></span></div>'+
   '<div class="tools"><button class="btn ghost sm" data-act="'+(dm?'clearDemo':'seedDemo')+'">'+(dm?'Remover dados de demonstração':'Carregar dados de demonstração')+'</button><button class="btn ghost sm" data-act="exitAdmin">'+ic('out')+'Sair do painel</button></div></div>'+
  '<section class="kpis" aria-label="Indicadores de hoje">'+
   '<div class="kpi"><span>Faturamento Hoje</span><b>'+money(K.rev)+'</b><small>serviços concluídos hoje</small></div>'+
   '<div class="kpi"><span>Veículos Atendidos</span><b>'+K.served+'</b><small>em lavagem ou concluídos</small></div>'+
   '<div class="kpi"><span>Concluídos</span><b>'+K.done+'</b><small>de '+A.today.length+' agendados hoje</small></div>'+
   '<div class="kpi"><span>Eficiência</span><b>'+K.eff+'%</b><small>concluídos ÷ agendados</small></div></section>'+
  '<section class="panel" aria-labelledby="h-yard"><header><h2 id="h-yard">Pátio em tempo real</h2><span class="muted small">Altere o status operacional de cada veículo</span></header>'+
   table([['Horário'],['Cliente'],['Veículo'],['Serviço'],['Unidade'],['Pagamento'],['Status']],yard?[yard]:[],'Nenhum veículo agendado para hoje.')+'</section>'+
  '<div class="grid2">'+
   '<section class="panel"><header><h2>Maiores clientes</h2><span class="muted small">por valor em serviços</span></header>'+table([['#'],['Cliente'],['Lavagens',1],['Total',1],['Última visita']],clients,'Sem clientes com agendamentos ainda.')+'</section>'+
   '<section class="panel"><header><h2>Cartões cadastrados</h2><span class="tag">'+D.cards.length+'</span></header>'+table([['Cliente'],['Bandeira'],['Final'],['Titular'],['Validade']],cards,'Nenhum cartão cadastrado.')+'<div class="note">Apenas bandeira, final, titular e validade são guardados.</div></section>'+
   '<section class="panel"><header><h2>Veículos cadastrados · Carros</h2><span class="tag">'+cars.length+'</span></header>'+table([['Placa'],['Modelo'],['Tipo'],['Cor'],['Proprietário']],cars,'Nenhum carro cadastrado.')+'</section>'+
   '<section class="panel"><header><h2>Veículos cadastrados · Motos</h2><span class="tag">'+motos.length+'</span></header>'+table([['Placa'],['Modelo'],['Tipo'],['Cor'],['Proprietário']],motos,'Nenhuma moto cadastrada.')+'</section>'+
   '<section class="panel"><header><h2>Lucros semanais</h2><span class="muted small">últimas 6 semanas</span></header>'+table([['Semana'],['Lavagens',1],['Receita',1],['Ticket médio',1],['vs. anterior',1]],weeks,'')+'<div class="note">Receita bruta de serviços concluídos (sem custos operacionais).</div></section>'+
   '<section class="panel"><header><h2>Lavagens mais solicitadas</h2><span class="muted small">todos os agendamentos</span></header>'+table([['#'],['Tipo de lavagem'],['Pedidos',1],['Part.',1],['']],types,'')+'</section>'+
  '</div>';
}
screens.admin=()=>adminHtml();
