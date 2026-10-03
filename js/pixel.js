// Meta Pixel da Sua Vitrine (conta de anúncios act_2090716864869534).
// Carregado na home (<script src>) e em todas as outras páginas via import no main.js.
//
// Eventos:
//   PageView    → toda página
//   ViewContent → visitante chegou na seção de preço (#preco)
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

  fbq('init', PIXEL_ID);
  fbq('track', 'PageView');

  // Os links de WhatsApp recebem o href via JS depois do carregamento,
  // então a checagem é feita na hora do clique.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a || !/wa\.me|api\.whatsapp\.com/.test(a.href)) return;
    var secao = a.closest('section, header, footer');
    fbq('track', 'Contact', {
      content_name: 'WhatsApp',
      content_category: secao && secao.id ? secao.id : (a.classList.contains('float') ? 'botao-flutuante' : 'pagina'),
      value: 497,
      currency: 'BRL'
    });
  }, true);

  function observarPreco() {
    var preco = document.querySelector('#preco .price') || document.getElementById('preco');
    if (!preco || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (es) {
      if (es.some(function (x) { return x.isIntersecting; })) {
        fbq('track', 'ViewContent', { content_name: 'Preço R$ 497', value: 497, currency: 'BRL' });
        io.disconnect();
      }
    }, { threshold: 0.3 });
    io.observe(preco);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', observarPreco);
  else observarPreco();
})();
