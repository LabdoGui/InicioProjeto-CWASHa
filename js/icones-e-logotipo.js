/* Carwash (protótipo) — ícones SVG e o logotipo. */
'use strict';
/* ============ ícones ============ */
const IC={
  car:'<path d="M3 13l1.8-5A2 2 0 0 1 6.7 6.7h10.6a2 2 0 0 1 1.9 1.3L21 13"/><rect x="3" y="13" width="18" height="5" rx="1.5"/><circle cx="7.5" cy="18" r="1.7"/><circle cx="16.5" cy="18" r="1.7"/>',
  moto:'<circle cx="5.5" cy="16" r="3"/><circle cx="18.5" cy="16" r="3"/><path d="M5.5 16l3-6h5l3 6"/><path d="M13.5 10l-1.5-3h-2.5M15.5 7H18"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  check:'<path d="M20 6L9 17l-5-5"/>',
  back:'<path d="M15 18l-6-6 6-6"/>',
  eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  eyeoff:'<path d="M3 3l18 18M10.6 6.1A9.8 9.8 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-3.2 4.2M6.6 6.7C3.7 8.5 2 12 2 12s3.5 7 10 7c1.7 0 3.2-.4 4.5-1"/>',
  copy:'<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/>',
  pin:'<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  card:'<rect x="2.5" y="5" width="19" height="14" rx="2.5"/><path d="M2.5 10h19M6 15h4"/>',
  pix:'<path d="M12 3l9 9-9 9-9-9z"/><path d="M8.5 12l3.5-3.5 3.5 3.5-3.5 3.5z"/>',
  cash:'<rect x="2.5" y="6" width="19" height="12" rx="2"/><circle cx="12" cy="12" r="2.6"/><path d="M6 9v.01M18 15v.01"/>',
  wa:'<path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4.1A8 8 0 1 1 20 11.5z"/><path d="M9 8.5c0 3.5 3 6.5 6.5 6.5l1-1.6-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2z"/>',
  cal:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M6.5 7l1 13h9l1-13"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  out:'<path d="M9 4H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h4M15 8l4 4-4 4M19 12H9"/>',
  spark:'<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/>',
  drop:'<path d="M12 3c4 5 7 8.2 7 12a7 7 0 0 1-14 0c0-3.8 3-7 7-12z"/>'
};
const ic=(n,cls)=>'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"'+(cls?' class="'+cls+'"':'')+'>'+IC[n]+'</svg>';
const LOGO='<svg class="logo" viewBox="0 0 48 48" aria-hidden="true"><rect width="48" height="48" rx="14" style="fill:var(--primary)"/><path d="M24 9.5c5.6 7 10 11.6 10 17a10 10 0 0 1-20 0c0-5.4 4.4-10 10-17z" fill="#fff"/><path d="M19.2 27.5a5 5 0 0 0 4 4.8" fill="none" stroke="#2563EB" stroke-width="2.4" stroke-linecap="round"/><path d="M36.5 8.5l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z" fill="#fff"/></svg>';
