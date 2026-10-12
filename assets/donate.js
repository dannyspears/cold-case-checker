// Donation buttons (home page and support page) and the slim donation bar at the top of every page.
// ─── OWNER SETUP: EDIT THESE THREE LINES ─────────────────────────────────
// Leave a value empty ("") and its button shows "Coming soon" instead of a link.
window.COLDCASE_DONATE = {
  venmo: "",    // your Venmo username, without the @     e.g. "Cold-Case-Checker"
  cashapp: "",  // your Cash App $Cashtag, without the $  e.g. "ColdCaseChecker"
  paypal: ""    // your PayPal.Me name                     e.g. "ColdCaseChecker"  (from paypal.me/ColdCaseChecker)
};
// ─────────────────────────────────────────────────────────────────────────

// These are each service's official web links. On a phone with the app installed,
// iOS and Android open them in the app; otherwise they open the website.
// The slim bar is added automatically as the first thing inside .wrap on any page that loads this script.
(function () {
  var c = window.COLDCASE_DONATE || {};
  function clean(v, strip) { return String(v || '').trim().replace(strip, ''); }
  var venmo = clean(c.venmo, /^@/), cash = clean(c.cashapp, /^\$/), paypal = clean(c.paypal, /^(https?:\/\/)?(www\.)?paypal\.me\//i);
  var services = [
    { key: 'venmo',   name: 'Venmo',    handle: venmo ? '@' + venmo : '',            url: venmo ? 'https://venmo.com/u/' + encodeURIComponent(venmo) : '' },
    { key: 'cashapp', name: 'Cash App', handle: cash ? '$' + cash : '',              url: cash ? 'https://cash.app/$' + encodeURIComponent(cash) : '' },
    { key: 'paypal',  name: 'PayPal',   handle: paypal ? 'paypal.me/' + paypal : '', url: paypal ? 'https://www.paypal.me/' + encodeURIComponent(paypal) : '' }
  ];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (ch) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[ch]; }); }

  // Big buttons (home page #support and donate.html)
  var box = document.getElementById('donate-buttons');
  if (box) {
    box.innerHTML = services.map(function (s) {
      if (!s.url) return '<span class="donate-btn donate-' + s.key + ' is-off" aria-disabled="true"><b>' + s.name + '</b><small>Coming soon</small></span>';
      return '<a class="donate-btn donate-' + s.key + '" href="' + esc(s.url) + '" target="_blank" rel="noopener"><b>' + s.name + '</b><small>' + esc(s.handle) + '</small></a>';
    }).join('');
  }

  // Slim bar at the top of every page
  var wrap = document.querySelector('.wrap');
  var bar = document.querySelector('.donate-bar');
  if (!bar && wrap) {
    bar = document.createElement('div');
    bar.className = 'donate-bar';
    bar.setAttribute('aria-label', 'Support Cold Case Checker');
    wrap.insertBefore(bar, wrap.firstChild);
  }
  if (bar) {
    var links = services.map(function (s) {
      if (!s.url) return '<span class="db-link is-off" title="Coming soon">' + s.name + '</span>';
      return '<a class="db-link db-' + s.key + '" href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="Donate with ' + s.name + ' (' + esc(s.handle) + ')">' + s.name + '</a>';
    }).join('<span class="db-sep" aria-hidden="true">·</span>');
    bar.innerHTML = '<span class="db-text">Cold Case Checker is free. Help keep it running:</span><span class="db-links">' + links +
      '<span class="db-sep" aria-hidden="true">·</span><a class="db-link db-why" href="donate.html">Why we ask</a></span>';
  }
})();
