/* Carwash (protótipo) — código Pix Copia e Cola (BR Code) e QR Code. */
'use strict';
/* ============ Pix (BR Code estático — demonstração) ============ */
const tlv=(id,v)=>id+pad(String(v.length))+v;
function crc16(s){let c=0xFFFF;for(let i=0;i<s.length;i++){c^=s.charCodeAt(i)<<8;for(let j=0;j<8;j++)c=c&0x8000?((c<<1)^0x1021)&0xFFFF:(c<<1)&0xFFFF}return c.toString(16).toUpperCase().padStart(4,'0')}
function pixPayload(amount){
  const txid='CW'+Math.random().toString(36).slice(2,12).toUpperCase();
  const p=tlv('00','01')+tlv('01','12')+tlv('26',tlv('00','br.gov.bcb.pix')+tlv('01',PIX_KEY))+tlv('52','0000')+tlv('53','986')+tlv('54',amount.toFixed(2))+tlv('58','BR')+tlv('59','CARWASH')+tlv('60','SAO PAULO')+tlv('62',tlv('05',txid))+'6304';
  return p+crc16(p);
}
function qrSvg(text){
  const q=new QRCodeLib(0,0);q.addData(text);q.make();const n=q.getModuleCount();let d='';
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))d+='M'+(c+4)+' '+(r+4)+'h1v1h-1z';
  return '<svg viewBox="0 0 '+(n+8)+' '+(n+8)+'" role="img" aria-label="QR Code do Pix" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#fff"/><path d="'+d+'" fill="#0F172A"/></svg>';
}
