/* Carwash (protótipo) — funções pequenas: seletores, datas, dinheiro em R$, ids. */
'use strict';
/* ============ utilidades ============ */
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const dkey=d=>d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const parseKey=k=>{const [y,m,d]=k.split('-').map(Number);return new Date(y,m-1,d)};
const brDate=k=>{const [y,m,d]=k.split('-');return d+'/'+m+'/'+y};
const wkShort=k=>parseKey(k).toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','');
const todayKey=()=>dkey(new Date());
const BRL=new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'});
const money=n=>BRL.format(n);
const uid=()=>Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4);
const firstName=n=>String(n||'').trim().split(/\s+/)[0]||'';
const digits=s=>String(s||'').replace(/\D/g,'');
