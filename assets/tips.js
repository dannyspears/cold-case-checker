// Clue / tip form shown near the top of every case page (fills <div id="tip-box">).
// ─── OWNER SETUP: EDIT THIS ONE LINE ─────────────────────────────────────
// Make a free form at formspree.io (or similar) and paste its https address here.
// Leave it empty ("") and the form shows "Opening soon" instead of sending.
// Use a different form from the contact form so tips are not mixed with other mail.
window.COLDCASE_TIPS = {
  endpoint: ""
};
// ─────────────────────────────────────────────────────────────────────────
(function () {
  var box = document.getElementById("tip-box");
  if (!box) return;
  var ep = String((window.COLDCASE_TIPS || {}).endpoint || "").trim();
  var on = ep.indexOf("https://") === 0 && ep.indexOf(" ") < 0;
  var slug = document.body.getAttribute("data-case") || "";
  var name = box.getAttribute("data-case-name") || "this case";
  var loaded = Date.now();
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  box.className = "tip-box";
  box.innerHTML =
    '<details class="tip-fold">' +
    '<summary><span class="tip-q">Know something about this case?</span> <span class="tip-cta">Submit a clue or anonymous tip</span></summary>' +
    '<div class="tip-body">' +
    '<div class="notice"><b>This is not a police tip line.</b> Cold Case Checker is an independent site and is not law enforcement. If someone is in danger, call 911. For information that could help solve the case, you can also report it directly to the investigating agency or to the FBI at <a href="https://tips.fbi.gov/" target="_blank" rel="noopener">tips.fbi.gov</a>, which accepts anonymous reports. Clues sent here are reviewed by the site owner, may be added to this page if sourced, and may be passed to the investigating agency.</div>' +
    '<form class="form tip-form" novalidate>' +
    '<label for="tip-type">What kind of clue is it?</label>' +
    '<select id="tip-type" name="clue_type"><option>New information about what happened</option><option>A memory or something I witnessed</option><option>A document, photo, or record</option><option>A correction to this page</option><option>A connection to another case</option><option>Something else</option></select>' +
    '<label for="tip-text">Tell us what you know *</label>' +
    '<p class="hint">Stick to what you saw, heard, or can document. Give dates, places, and names of agencies where you can.</p>' +
    '<textarea id="tip-text" name="details" rows="6" maxlength="4000" required></textarea>' +
    '<label for="tip-basis">How do you know this?</label>' +
    '<select id="tip-basis" name="basis"><option value="">Prefer not to say</option><option>I saw or heard it myself</option><option>A family member or friend told me</option><option>I read it in a published source</option><option>I found it in records or documents</option><option>It is my opinion or theory</option></select>' +
    '<label for="tip-src">Links or sources (optional)</label>' +
    '<textarea id="tip-src" name="sources" rows="3" maxlength="2000" placeholder="News articles, court records, agency pages. One per line."></textarea>' +
    '<label for="tip-email">Your email (optional, only if you want us to follow up)</label>' +
    '<input id="tip-email" name="contact_email" type="email" maxlength="140" autocomplete="email">' +
    '<p class="hint">We do not ask for your name. The form service we use may record technical details such as your IP address. For stronger anonymity, use the FBI or a Crime Stoppers line instead.</p>' +
    '<div class="tip-trap" aria-hidden="true"><label>Leave this empty <input name="website" tabindex="-1" autocomplete="off"></label></div>' +
    '<input type="hidden" name="case" value="' + esc(slug) + '"><input type="hidden" name="page" value="">' +
    '<input type="hidden" name="_subject" value="Cold Case Checker clue: ' + esc(name) + '">' +
    '<label class="tip-ack"><input type="checkbox" name="ack" id="tip-ack" required> I understand this is not a report to police, that my submission may be shared with the investigating agency, and that false or malicious claims about real people are not allowed.</label>' +
    '<p class="tip-act"><button class="btn" type="submit"' + (on ? '' : ' disabled') + '>' + (on ? 'Send clue' : 'Opening soon') + '</button></p>' +
    '<p class="fine tip-status" role="status" aria-live="polite"></p>' +
    '<p class="fine">Please do not name private individuals as suspects unless an agency or a reliable news outlet already has. Submissions that accuse real people without a source are discarded.</p>' +
    '</form></div></details>';

  var f = box.querySelector("form"), st = box.querySelector(".tip-status");
  f.page.value = location.href;
  if (!on) { Array.prototype.forEach.call(f.elements, function (el) { if (el.type !== "hidden") el.disabled = true; }); return; }
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (f.website.value) return;                              // bot trap
    if (Date.now() - loaded < 4000) { st.textContent = "Please take a moment to review your clue, then send again."; return; }
    if (!f.details.value.trim()) { st.textContent = "Please describe what you know first."; return; }
    if (!f.ack.checked) { st.textContent = "Please tick the box to confirm you understand."; return; }
    var last = 0; try { last = +localStorage.getItem("cc_tip_last") || 0; } catch (x) {}
    if (Date.now() - last < 60000) { st.textContent = "Please wait a minute before sending another clue."; return; }
    var btn = f.querySelector("button"); btn.disabled = true; st.textContent = "Sending...";
    fetch(ep, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(f) })
      .then(function (r) {
        if (r.ok) { try { localStorage.setItem("cc_tip_last", String(Date.now())); } catch (x) {} f.reset(); f.page.value = location.href; st.textContent = "Thank you. Your clue was sent. We review every submission, and we cannot reply to everyone."; }
        else st.textContent = "Sorry, that did not send. Please try again later, or contact the investigating agency directly.";
        btn.disabled = false;
      })
      .catch(function () { st.textContent = "Sorry, that did not send. Check your connection and try again."; btn.disabled = false; });
  });
})();
