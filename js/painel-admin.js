/* Carwash — painel administrativo (paginas/admin.html): calcula os indicadores e preenche as tabelas. */
'use strict';
/* ============ ADMIN ============ */
const stCls=s=>s==='Concluído'?'ok':s==='Em Lavagem'?'info':'warn';
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

/* Coloca as linhas no <tbody id="..."> da página (ou a mensagem de "vazio"). */
function linhas(id,rows,vazio){
  const tb=document.getElementById(id);if(!tb)return;
  const n=tb.closest('table').tHead.rows[0].cells.length;
  tb.innerHTML=rows.length?rows.join(''):'<tr><td class="empty" colspan="'+n+'">'+vazio+'</td></tr>';
}

telas.admin={
  atualizar(){
    const A=adminStats(),now=new Date(),K=A.kpi;
    const dm=D.users.some(u=>u.demo)||D.bookings.some(b=>b.demo);
    const maxT=Math.max(1,...A.types.map(t=>t.n));

    $('#hoje').textContent=brDate(todayKey());
    $('#upd').textContent=pad(now.getHours())+':'+pad(now.getMinutes())+':'+pad(now.getSeconds());
    const demo=$('#btn-demo');demo.dataset.act=dm?'clearDemo':'seedDemo';demo.textContent=dm?'Remover dados de demonstração':'Carregar dados de demonstração';

    $('#kpi-faturamento').textContent=money(K.rev);
    $('#kpi-atendidos').textContent=K.served;
    $('#kpi-concluidos').textContent=K.done;
    $('#kpi-agendados').textContent='de '+A.today.length+' agendados hoje';
    $('#kpi-eficiencia').textContent=K.eff+'%';

    linhas('tb-patio',A.today.slice().sort((a,b)=>a.time.localeCompare(b.time)).map(b=>{const v=vehById(b.vehicleId),u=userById(b.userId),s=svcById(b.serviceId);
      return '<tr><td><b>'+b.time+'</b></td><td>'+esc(u?u.name:'—')+'</td><td>'+esc(v?v.model:'—')+' <span class="plate">'+esc(v?v.plate:'')+'</span></td><td>'+s.name+'</td><td>'+esc(b.unit)+'</td><td>'+payLabel(b)+' <span class="muted">· '+payState(b)+'</span></td><td><select class="stsel s-'+stCls(b.status)+'" id="st-'+b.id+'" data-status="'+b.id+'" aria-label="Status de '+esc(v?v.plate:'')+'">'+STATUSES.map(o=>'<option'+(o===b.status?' selected':'')+'>'+o+'</option>').join('')+'</select></td></tr>'}),
      'Nenhum veículo agendado para hoje.');

    linhas('tb-clientes',A.clients.map((c,i)=>'<tr><td>'+(i+1)+'</td><td><b>'+esc(c.u.name)+'</b><br><span class="muted small">'+esc(c.u.email)+'</span></td><td class="n">'+c.n+'</td><td class="n"><b>'+money(c.total)+'</b></td><td>'+(c.last?brDate(c.last):'—')+'</td></tr>'),
      'Sem clientes com agendamentos ainda.');

    $('#qtd-cartoes').textContent=D.cards.length;
    linhas('tb-cartoes',D.cards.map(c=>{const u=userById(c.userId);return '<tr><td>'+esc(u?u.name:'—')+'</td><td>'+esc(c.brand)+'</td><td>•••• '+esc(c.last4)+'</td><td>'+esc(c.holder)+'</td><td>'+esc(c.exp)+'</td></tr>'}),
      'Nenhum cartão cadastrado.');

    const vrows=cat=>D.vehicles.filter(v=>v.cat===cat).map(v=>{const u=userById(v.userId);return '<tr><td><span class="plate">'+esc(v.plate)+'</span></td><td>'+esc(v.model)+'</td><td><span class="tag">'+esc(v.sub)+'</span></td><td>'+esc(v.color)+'</td><td>'+esc(u?u.name:'—')+'</td></tr>'});
    const cars=vrows('Carro'),motos=vrows('Moto');
    $('#qtd-carros').textContent=cars.length;linhas('tb-carros',cars,'Nenhum carro cadastrado.');
    $('#qtd-motos').textContent=motos.length;linhas('tb-motos',motos,'Nenhuma moto cadastrada.');

    linhas('tb-semanas',A.weeks.map((w,i)=>{const prev=A.weeks[i-1];let v='—';if(prev&&prev.rev>0){const p=Math.round((w.rev-prev.rev)/prev.rev*100);v='<span class="'+(p>=0?'pos':'neg')+'">'+(p>=0?'▲ +':'▼ ')+p+'%</span>'}
      return '<tr><td>'+brDate(w.a).slice(0,5)+' – '+brDate(w.z).slice(0,5)+(i===5?' <span class="tag">atual</span>':'')+'</td><td class="n">'+w.n+'</td><td class="n"><b>'+money(w.rev)+'</b></td><td class="n">'+(w.n?money(w.rev/w.n):'—')+'</td><td class="n">'+v+'</td></tr>'}),'');

    linhas('tb-tipos',A.types.map((t,i)=>'<tr><td>'+(i+1)+'</td><td><b>'+t.s.name+'</b></td><td class="n">'+t.n+'</td><td class="n">'+(A.total?Math.round(t.n/A.total*100):0)+'%</td><td><div class="mini"><div class="bar"><span style="width:'+Math.round(t.n/maxT*100)+'%"></span></div></div></td></tr>'),'');
  }
};
