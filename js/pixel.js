// Meta Pixel da Sua Vitrine (conta de anúncios act_2090716864869534).
// Carregado na home (<script src>) e em todas as outras páginas via import no main.js.
//
// Eventos:
//   PageView    → toda página
//   ViewContent → visita interessada: chegou no portfólio/preço ou ficou 30s no site
//                 (é o evento que o conjunto "Viu o preço" otimiza)
//   Contact     → clique em qualquer link de WhatsApp (é a conversão principal dos anúncios)
(function () {
  var PIXEL_ID = '1112554241637257';
  if (window.__suaVitrinePixel) return;
  window.__suaVitrinePixel = true;

  !function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0;
    t.src = v; s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  // Nicho do anúncio (?nicho=pratas). Guardado na sessão pra continuar valendo se o visitante navegar no site.
  var nicho = '';
  try {
    nicho = new URLSearchParams(location.search).get('nicho') || sessionStorage.getItem('sv_nicho') || '';
    if (nicho) sessionStorage.setItem('sv_nicho', nicho);
  } catch (e) {}
  var extra = nicho ? { nicho: nicho } : {};
  function comNicho(obj) { for (var k in extra) obj[k] = extra[k]; return obj; }

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView', comNicho({}));

  // Os links de WhatsApp recebem o href via JS depois do carregamento,
  // então a checagem é feita na hora do clique.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || !/wa\.me|api\.whatsapp\.com/.test(a.href)) return;
    var secao = a.closest('section, header, footer');
    fbq('track', 'Contact', comNicho({
      content_name: 'WhatsApp',
      content_category: secao && secao.id ? secao.id : (a.classList.contains('float') ? 'botao-flutuante' : 'pagina'),
      value: 497,
      currency: 'BRL'
    }));
  }, true);

  // ViewContent = visita interessada: dispara uma vez só, no que vier primeiro —
  // o visitante chegou no portfólio (ou no preço) ou ficou 30s com a página aberta na tela.
  var interessado = false;
  function visitaInteressada(motivo) {
    if (interessado) return;
    interessado = true;
    fbq('track', 'ViewContent', comNicho({ content_name: motivo, value: 497, currency: 'BRL' }));
  }

  function observarSecoes() {
    var alvos = [
      [document.getElementById('portfolio'), 'Viu o portfólio'],
      [document.querySelector('#preco .price') || document.getElementById('preco'), 'Viu o preço']
    ].filter(function (x) { return x[0]; });
    if (!alvos.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (x) {
        if (!x.isIntersecting) return;
        var achou = alvos.find(function (a) { return a[0] === x.target; });
        visitaInteressada(achou ? achou[1] : 'Rolou a página');
        io.disconnect();
      });
    }, { threshold: 0.15 });
    alvos.forEach(function (a) { io.observe(a[0]); });
  }

  // Conta só o tempo com a aba visível, pra não premiar aba esquecida aberta.
  var segundos = 0;
  var relogio = setInterval(function () {
    if (interessado) return clearInterval(relogio);
    if (document.visibilityState === 'visible' && ++segundos >= 30) {
      visitaInteressada('Ficou 30s no site');
      clearInterval(relogio);
    }
  }, 1000);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observarSecoes);
  else observarSecoes();
})();
