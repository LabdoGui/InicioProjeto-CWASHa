/* Carwash (protótipo) — aplica o modo claro/escuro salvo antes de a página aparecer (evita piscar). */
(function(){try{var t=localStorage.getItem('carwash.theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.setAttribute('data-theme',t)}catch(e){}})();
