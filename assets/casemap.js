/* Case map: draws pins from a #casemap element's data-pins JSON on an OpenStreetMap base (Leaflet 1.9.4, loaded on demand).
   Each pin: {lat, lng, title, note, kind:"pin"|"area", radius (metres, area only)}. Coordinates are approximate and labelled as such. */
(function () {
  var el = document.getElementById('casemap'); if (!el) return;
  var pins; try { pins = JSON.parse(el.getAttribute('data-pins')); } catch (e) { return; }
  function css(h) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = h; document.head.appendChild(l); }
  function load(src, cb) { var s = document.createElement('script'); s.src = src; s.onload = cb; s.onerror = function () {}; document.head.appendChild(s); }
  function draw() {
    var L = window.L; if (!L) return;
    var holder = document.createElement('div'); holder.className = 'casemap-canvas'; holder.setAttribute('role', 'application'); holder.setAttribute('aria-label', el.getAttribute('data-label') || 'Map of the scenes');
    var fb = el.querySelector('.casemap-fallback'); if (fb) fb.hidden = true;
    el.insertBefore(holder, el.firstChild);
    var map = L.map(holder, { scrollWheelZoom: false });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors' }).addTo(map);
    var pts = [], red = '#a31621';
    pins.forEach(function (p, i) {
      var ll = [p.lat, p.lng]; pts.push(ll);
      var m = p.kind === 'area' ? L.circle(ll, { radius: p.radius || 2000, color: red, weight: 2, fillColor: red, fillOpacity: 0.15 }) : L.circleMarker(ll, { radius: 9, color: '#fff', weight: 2, fillColor: red, fillOpacity: 1 });
      m.addTo(map).bindPopup('<b>' + (i + 1) + '. ' + p.title + '</b><br>' + p.note);
      L.marker(ll, { interactive: false, icon: L.divIcon({ className: 'casemap-num', html: String(i + 1), iconSize: [18, 18] }) }).addTo(map);
    });
    function fit() { map.invalidateSize(); map.fitBounds(pts.length > 1 ? pts : [pts[0], pts[0]], { padding: [40, 40], maxZoom: 12 }); }
    fit();
    if (window.ResizeObserver) { var first = true; new ResizeObserver(function () { if (holder.clientWidth > 0) { map.invalidateSize(); if (first) { first = false; fit(); } } }).observe(holder); }
  }
  function start() { css('https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'); load('https://unpkg.com/leaflet@1.9.4/dist/leaflet.js', draw); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();