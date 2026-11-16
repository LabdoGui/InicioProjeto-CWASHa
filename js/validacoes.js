/* Carwash (protótipo) — e-mail, senha forte, celular, placa Mercosul, cartão e senha embaralhada (SHA-256). */
'use strict';
/* ============ validações ============ */
const EMAIL_RE=/^[^\s@]+@(gmail\.com|outlook\.com|outlook\.com\.br)$/i;
const SPECIAL=/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/;
const PASS_RULES=[
  ['Mínimo 8 caracteres',p=>p.length>=8],
  ['1 letra maiúscula',p=>/[A-Z]/.test(p)],
  ['1 letra minúscula',p=>/[a-z]/.test(p)],
  ['1 número',p=>/\d/.test(p)],
  ['1 caractere especial (!@#$%)',p=>SPECIAL.test(p)]
];
const strongPass=p=>PASS_RULES.every(r=>r[1](p));
const PLATE_RE=/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
const maskPhone=v=>{const d=digits(v).slice(0,11);if(d.length<=2)return d?'('+d:'';if(d.length<=7)return '('+d.slice(0,2)+') '+d.slice(2);return '('+d.slice(0,2)+') '+d.slice(2,7)+'-'+d.slice(7)};
const validPhone=v=>/^[1-9]{2}9\d{8}$/.test(digits(v));
const maskCard=v=>digits(v).slice(0,19).replace(/(.{4})/g,'$1 ').trim();
const maskExp=v=>{const d=digits(v).slice(0,4);return d.length>2?d.slice(0,2)+'/'+d.slice(2):d};
const maskPlate=v=>String(v).toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,7);
function luhn(n){let s=0,alt=false;for(let i=n.length-1;i>=0;i--){let x=+n[i];if(alt){x*=2;if(x>9)x-=9}s+=x;alt=!alt}return n.length>=13&&s%10===0}
function brand(n){if(/^4/.test(n))return 'Visa';if(/^(5[1-5]|2(2[2-9]|[3-6]|7[01]|720))/.test(n))return 'Mastercard';if(/^3[47]/.test(n))return 'Amex';if(/^(4011|4312|4389|4514|4576|5041|5066|5067|509|6277|6362|6363|650|6516|6550)/.test(n))return 'Elo';return 'Cartão'}
function expOk(v){const m=/^(\d{2})\/(\d{2})$/.exec(v);if(!m)return false;const mm=+m[1],yy=2000+ +m[2];if(mm<1||mm>12)return false;const now=new Date();return yy>now.getFullYear()||(yy===now.getFullYear()&&mm>=now.getMonth()+1)}
async function hashPw(email,pw){try{const b=new TextEncoder().encode(email.toLowerCase()+'|carwash|'+pw);const h=await crypto.subtle.digest('SHA-256',b);return [...new Uint8Array(h)].map(x=>x.toString(16).padStart(2,'0')).join('')}catch(e){return 'x:'+btoa(unescape(encodeURIComponent(email+'|'+pw)))}}
