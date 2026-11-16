/* Carwash (protótipo) — serviços, preços, unidades, horários, senhas, chave Pix e onde os dados ficam (localStorage). */
'use strict';
/* ============ dados ============ */
const SERVICES=[
  {id:'ducha',name:'Ducha Proteção',price:120,desc:'Lavagem externa com ducha de proteção'},
  {id:'simples',name:'Simples c/ Cera',price:170,desc:'Lavagem externa com aplicação de cera'},
  {id:'completa',name:'Completa c/ Cera',price:220,desc:'Lavagem externa e interna com cera'},
  {id:'higien',name:'Higienização Profunda',price:310,desc:'Limpeza profunda e higienização do veículo'}
];
const UNITS=[{id:'FMU Liberdade',city:'Liberdade · São Paulo/SP'},{id:'FMU Santo Amaro',city:'Santo Amaro · São Paulo/SP'}];
const SLOTS=Array.from({length:10},(_,i)=>pad(8+i)+':00');
const SUBS={Carro:['Sedan','Hatch','SUV'],Moto:['Custom','Esportiva']};
const COLORS=['Branco','Preto','Prata','Cinza','Vermelho','Azul','Verde','Amarelo','Marrom','Laranja'];
const STATUSES=['Aguardando','Em Lavagem','Concluído'];
const WA_NUMBER='5511987654321', WA_DISPLAY='(11) 98765-4321';
const ADMIN_PASS='Admin@2026';
const PIX_KEY='pix@carwash.example', PIX_MINUTES=15;
const KEY='carwash.v1';

const emptyDB=()=>({users:[],vehicles:[],bookings:[],cards:[]});
function loadDB(){try{const d=JSON.parse(localStorage.getItem(KEY));if(d&&d.users)return Object.assign(emptyDB(),d)}catch(e){}return emptyDB()}
let D=loadDB();
function save(){try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}}

const S={screen:'login',user:null,adminOk:false,modal:null,
  draft:{vehicleId:null,serviceId:null,unit:null,date:null,time:null},
  gv:{cat:'Carro',sub:'Sedan',model:'',color:'',plate:''},showForm:false,
  pix:null,last:null,vTab:'Carro'};
let timers=[];
