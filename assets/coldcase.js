// Shared behavior: landing tiles + live news panel. No build step.
(function () {
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); };

  // Landing page: tiles, city tags, live search (typeahead), browse drop-down, all built from assets/cases.js
  var tiles = document.getElementById("case-tiles");
  if (tiles && window.CASES) {
    var cases = window.CASES.slice();
    var input = document.getElementById("case-search"), list = document.getElementById("case-suggest"),
        picker = document.getElementById("case-picker"), count = document.getElementById("case-count"), none = document.getElementById("no-match"),
        cityBox = null; // the city browser was removed; browsing is by state only
    var cityFilter = "", moreOpen = false;
    var slugify = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); };
    var hay = function (c) { return (c.name + " " + c.years + " " + c.place + " " + c.summary + " " + (c.tags || "") + " " + (c.cities || []).join(" ")).toLowerCase(); };
    var matches = function (q) {
      var words = q.toLowerCase().split(/\s+/).filter(Boolean);
      return cases.filter(function (c) {
        if (cityFilter && (c.cities || []).indexOf(cityFilter) === -1) return false;
        var h = hay(c); return words.every(function (w) { return h.indexOf(w) !== -1; });
      });
    };
    var chipsFor = function (c) {
      return (c.cities || []).map(function (city) {
        return '<button type="button" class="chip' + (city === cityFilter ? " on" : "") + '" data-city="' + esc(city) + '" aria-label="Show cases for ' + esc(city) + '">' + esc(city) + "</button>";
      }).join("");
    };
    var tile = function (c) {
      var live = c.status === "live";
      var title = live ? '<a class="stretch" href="' + c.page + '">' + esc(c.name) + "</a>" : esc(c.name);
      return '<div class="tile card' + (live ? "" : " queued") + '"' + (live ? "" : ' aria-disabled="true"') + ">" +
        (c.rank <= 9 ? '<span class="rank">#' + c.rank + "</span>" : "") +
        '<span class="pill ' + (live ? "live" : "") + '">' + (live ? "Full file published" : "File in progress") + "</span>" +
        "<h3>" + title + "</h3>" +
        '<span class="fine">' + esc(c.years) + " · " + esc(c.place) + "</span>" +
        "<p>" + esc(c.summary) + "</p>" +
        "</div>";
    };
    var renderCities = function () {
      if (!cityBox) return;
      var tally = {};
      cases.forEach(function (c) { (c.cities || []).forEach(function (x) { tally[x] = (tally[x] || 0) + 1; }); });
      var names = Object.keys(tally).sort(function (a, b) { return a.localeCompare(b); });
      cityBox.innerHTML = '<label class="finder-label" for="city-select">Browse by city</label>' +
        '<select id="city-select"><option value="">All cities (' + names.length + ')</option>' +
        names.map(function (n) { return '<option value="' + esc(n) + '"' + (n === cityFilter ? " selected" : "") + ">" + esc(n) + (tally[n] > 1 ? " (" + tally[n] + ")" : "") + "</option>"; }).join("") + "</select>";
    };
    var stateBox = document.getElementById("state-browse");
    if (stateBox && window.STATES) {
      var sc = {};
      cases.forEach(function (c) { var seen = {}; (c.cities || []).forEach(function (x) { var m = x.match(/, ([A-Z]{2})$/); if (m && !seen[m[1]]) { seen[m[1]] = 1; sc[m[1]] = (sc[m[1]] || 0) + 1; } }); });
      stateBox.innerHTML = '<label class="finder-label" for="state-select">Browse by state</label>' +
        '<select id="state-select"><option value="">Choose a state…</option>' +
        window.STATES.map(function (s) { return '<option value="state-' + s.slug + '.html">' + esc(s.name) + (sc[s.code] ? " (" + sc[s.code] + ")" : " (none yet)") + "</option>"; }).join("") + "</select>" +
        ' <a class="fine" href="states.html">See all states</a>';
      stateBox.addEventListener("change", function (e) { if (e.target.id === "state-select" && e.target.value) location.href = e.target.value; });
    }
    if (cityBox) cityBox.addEventListener("change", function (e) { if (e.target.id === "city-select") setCity(e.target.value); });    var render = function (q) {
      var r = (q || cityFilter) ? matches(q || "") : cases;
      // No search: show the top nine, and fold every other case behind a "More cases" toggle. A search shows all matches.
      var top = r.filter(function (c) { return c.rank <= 9; }), rest = r.filter(function (c) { return c.rank > 9; });
      if (q || !rest.length) { tiles.innerHTML = r.map(tile).join(""); }
      else {
        tiles.innerHTML = top.map(tile).join("") +
          '<details class="more-cases" id="more-cases"' + (moreOpen ? " open" : "") + '><summary>More cases (' + rest.length + ")</summary>" +
          '<p class="fine">These files are not ranked. They are listed in the order they were researched.</p>' +
          '<div class="grid">' + rest.map(tile).join("") + "</div></details>";
        var md = document.getElementById("more-cases");
        if (md) md.addEventListener("toggle", function () { moreOpen = md.open; });
      }
      var topTitle = document.getElementById("top-title"); if (topTitle) topTitle.hidden = !!q;
      if (none) none.hidden = r.length > 0;
      var bits = [];
      if (cityFilter) bits.push("in " + cityFilter);
      if (q) bits.push("matching “" + q + "”");
      if (count) count.textContent = bits.length ? r.length + " of " + cases.length + " cases " + bits.join(" ") : cases.length + " cases";
      renderCities();
    };
    var setCity = function (city) {
      cityFilter = city || "";
      try { history.replaceState(null, "", cityFilter ? "#city-" + slugify(cityFilter) : location.pathname + location.search); } catch (x) {}
      render(input ? input.value.trim() : "");
    };
    document.addEventListener("click", function (e) {
      var b = e.target.closest && e.target.closest("button.chip[data-city]");
      if (!b) return;
      setCity(b.getAttribute("data-city") === cityFilter ? "" : b.getAttribute("data-city"));
      var sec = document.getElementById("cases"); if (sec && b.getAttribute("data-city")) sec.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    // Browse drop-down
    if (picker) {
      cases.forEach(function (c) {
        var o = document.createElement("option");
        o.value = c.status === "live" ? c.page : ""; o.textContent = (c.rank <= 9 ? "#" + c.rank + " " : "") + c.name + (c.status === "live" ? "" : " (in progress)");
        if (c.status !== "live") o.disabled = true;
        picker.appendChild(o);
      });
      picker.addEventListener("change", function () { if (picker.value) location.href = picker.value; });
    }
    // Typeahead
    var active = -1, shown = [];
    var hl = function (text, q) {
      var out = esc(text); q.split(/\s+/).filter(Boolean).forEach(function (w) {
        out = out.replace(new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>");
      }); return out;
    };
    var closeList = function () { list.hidden = true; input.setAttribute("aria-expanded", "false"); active = -1; };
    var choose = function (c) { if (c.status === "live") location.href = c.page; else { input.value = c.name; render(c.name); closeList(); } };
    var paint = function () {
      var q = input.value.trim();
      render(q);
      if (!q) { closeList(); return; }
      shown = matches(q).slice(0, 8);
      list.innerHTML = shown.length ? shown.map(function (c, i) {
        return '<li role="option" id="sg' + i + '" data-i="' + i + '"><b>' + hl(c.name, q) + '</b><small>' + esc(c.years) + " · " + esc(c.place) + (c.status === "live" ? "" : " · in progress") + "</small></li>";
      }).join("") : '<li class="empty">No match. <a href="submit.html">Submit this case</a></li>';
      list.hidden = false; input.setAttribute("aria-expanded", "true"); active = -1;
    };
    var mark = function () {
      Array.prototype.forEach.call(list.querySelectorAll("li[role=option]"), function (li, i) { li.classList.toggle("on", i === active); if (i === active) input.setAttribute("aria-activedescendant", li.id); });
    };
    input.addEventListener("input", paint);
    input.addEventListener("focus", function () { if (input.value.trim()) paint(); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); if (!shown.length) return; active = (active + 1) % shown.length; mark(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); if (!shown.length) return; active = (active - 1 + shown.length) % shown.length; mark(); }
      else if (e.key === "Enter") { if (active >= 0) { e.preventDefault(); choose(shown[active]); } else if (shown.length === 1) { e.preventDefault(); choose(shown[0]); } }
      else if (e.key === "Escape") { closeList(); }
    });
    list.addEventListener("mousedown", function (e) { var li = e.target.closest("li[data-i]"); if (li) { e.preventDefault(); choose(shown[+li.getAttribute("data-i")]); } });
    document.addEventListener("click", function (e) { if (!e.target.closest(".combo")) closeList(); });
    // Open straight to a city when the page address ends in #city-<name>
    var fromHash = function () {
      var m = null;
      if (!m) return;
      var hit = null; cases.forEach(function (c) { (c.cities || []).forEach(function (x) { if (slugify(x) === m[1]) hit = x; }); });
      if (hit) { cityFilter = hit; }
    };
    fromHash();
    window.addEventListener("hashchange", function () { cityFilter = ""; fromHash(); render(input.value.trim()); });
    render("");
  }
  // "In the news" panel: reads assets/news-snapshot.js (written by tools/update-news.ps1).
  var panel = document.getElementById("live-news");
  if (panel) {
    var q = panel.getAttribute("data-query"), slug = document.body.getAttribute("data-case");
    var links = '<p class="fine">Search directly: ' +
      '<a href="https://news.google.com/search?q=' + encodeURIComponent(q) + '" target="_blank" rel="noopener">Google News</a> · ' +
      '<a href="https://www.bing.com/news/search?q=' + encodeURIComponent(q) + '" target="_blank" rel="noopener">Bing News</a></p>';
    var arts = (window.NEWS_SNAPSHOT && window.NEWS_SNAPSHOT[slug]) || [];
    if (!arts.length) { panel.innerHTML = '<p class="fine">No headlines saved yet.</p>' + links; }
    else {
      arts.sort(function (a, b) { return a.date < b.date ? 1 : -1; });
      panel.innerHTML = '<ul class="news" style="list-style:none;padding:0">' + arts.map(function (a) {
        return '<li><a href="' + esc(a.url) + '" target="_blank" rel="noopener">' + esc(a.title) + "</a><small>" + esc(a.source || "") + " · " + esc(a.date) + "</small></li>";
      }).join("") + "</ul>" +
      '<p class="fine">Headlines saved ' + esc(window.NEWS_SNAPSHOT_AT || "") + ' from Google News. Appearing here is not an endorsement or verification of any claim.</p>' + links;
    }
  }})();


// Collapsible sections: every <section id> after the first (#glance) folds shut.
(function () {
  var secs = Array.prototype.slice.call(document.querySelectorAll("body[data-case] section[id]")).filter(function (s) { return s.id !== "glance" && s.querySelector(".sec-head"); });
  if (!secs.length) return;
  secs.forEach(function (s) {
    var head = s.querySelector(".sec-head"), body = document.createElement("div");
    body.className = "fold-body";
    while (head.nextSibling) body.appendChild(head.nextSibling);
    s.appendChild(body);
    s.classList.add("foldable");
    var h = head.querySelector("h2");
    h.setAttribute("role", "button"); h.setAttribute("tabindex", "0"); h.setAttribute("aria-expanded", "false");
    var toggle = function (open) {
      s.classList.toggle("open", open === undefined ? !s.classList.contains("open") : open);
      h.setAttribute("aria-expanded", s.classList.contains("open"));
    };
    s._toggle = toggle;
    h.addEventListener("click", function () { toggle(); });
    h.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });
  });
  var openFromHash = function () {
    var t = location.hash && document.getElementById(location.hash.slice(1));
    if (t && t._toggle) { t._toggle(true); t.scrollIntoView(); }
  };
  document.querySelectorAll(".toc a").forEach(function (a) {
    a.addEventListener("click", function () { var t = document.querySelector(a.getAttribute("href")); if (t && t._toggle) t._toggle(true); });
  });
  var all = document.querySelector("[data-fold-all]"), expanded = false;
  if (all) all.addEventListener("click", function () {
    expanded = !expanded; secs.forEach(function (s) { s._toggle(expanded); }); all.textContent = expanded ? "Collapse all" : "Expand all";
  });
  window.addEventListener("hashchange", openFromHash); openFromHash();
})();
// State pages (state-<name>.html): switch state, filter by city, jump to a case.
(function () {
  var code = document.body.getAttribute("data-state-page");
  var sp = document.getElementById("sp-state");
  if (sp) sp.addEventListener("change", function () { if (sp.value) location.href = sp.value; });
  if (!code) return;
  var slugify = function (s) { return String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); };
  var cards = document.getElementById("sp-cards"), citySel = document.getElementById("sp-city"), caseSel = document.getElementById("sp-case"), count = document.getElementById("sp-count");
  if (!cards) return;
  var total = cards.querySelectorAll(".tile").length;
  var apply = function (city) {
    var shown = 0;
    Array.prototype.forEach.call(cards.querySelectorAll(".tile"), function (t) {
      var ok = !city || (t.getAttribute("data-cities") || "").split("|").indexOf(city) !== -1;
      t.hidden = !ok; if (ok) shown++;
    });
    Array.prototype.forEach.call(cards.querySelectorAll("button.chip"), function (b) { b.classList.toggle("on", !!city && b.getAttribute("data-city") === city); });
    if (citySel) citySel.value = city || "";
    if (count) count.textContent = city ? shown + " of " + total + " cases in " + city : total + " case" + (total === 1 ? "" : "s");
    try { history.replaceState(null, "", city ? "#city-" + slugify(city) : location.pathname); } catch (x) {}
  };
  if (citySel) citySel.addEventListener("change", function () { apply(citySel.value); });
  if (caseSel) caseSel.addEventListener("change", function () { if (caseSel.value) location.href = caseSel.value; });
  cards.addEventListener("click", function (e) {
    var b = e.target.closest && e.target.closest("button.chip[data-city]"); if (!b) return;
    var city = b.getAttribute("data-city"), m = city.match(/, ([A-Z]{2})$/), here = (citySel && Array.prototype.some.call(citySel.options, function (o) { return o.value === city; }));
    if (here) { apply(citySel.value === city ? "" : city); return; }
    if (m && window.STATES) { var st = window.STATES.filter(function (s) { return s.code === m[1]; })[0]; if (st) location.href = "state-" + st.slug + ".html#city-" + slugify(city); }
  });
  var h = location.hash.match(/^#city-(.+)$/);
  if (h && citySel) { Array.prototype.forEach.call(citySel.options, function (o) { if (o.value && slugify(o.value) === h[1]) apply(o.value); }); }
})();