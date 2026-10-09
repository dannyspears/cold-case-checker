// Contact box shown at the bottom of every page (fills <div id="site-contact">).
// ─── OWNER SETUP: EDIT THIS ONE LINE ─────────────────────────────────────
// Make a free form at formspree.io (or similar) and paste its https address here.
// Leave it empty ("") and the form shows "Opening soon" instead of sending.
window.COLDCASE_CONTACT = {
  endpoint: ""
};
// ─────────────────────────────────────────────────────────────────────────
(function () {
  var box = document.getElementById("site-contact");
  if (!box) return;
  var ep = String((window.COLDCASE_CONTACT || {}).endpoint || "").trim();
  var on = ep.indexOf("https://") === 0 && ep.indexOf(" ") < 0;
  box.className = "contact-box";
  box.innerHTML =
    "<h2>Contact us · photo removal requests</h2>" +
    "<p>Please contact us for any request to remove licensed photos. Tell us which page and photo, and who holds the rights. We will review it promptly. You can also use this form to report an error or correct a record.</p>" +
    '<form novalidate class="form">' +
    '<label for="ct-msg">Your message</label>' +
    '<textarea id="ct-msg" name="message" rows="4" required placeholder="Which page and photo, and why it should be removed or changed."></textarea>' +
    '<label for="ct-email">Your email (only so we can reply)</label>' +
    '<input id="ct-email" type="email" name="email" autocomplete="email">' +
    '<input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none" aria-hidden="true">' +
    '<input type="hidden" name="page" value="">' +
    '<input type="hidden" name="_subject" value="Cold Case Checker contact form">' +
    '<p style="margin-top:12px"><button class="btn" type="submit"' + (on ? "" : " disabled") + ">" + (on ? "Send message" : "Opening soon") + "</button></p>" +
    '<p class="fine ct-status" role="status" aria-live="polite"></p></form>';
  var f = box.querySelector("form"), st = box.querySelector(".ct-status");
  f.page.value = location.href;
  if (!on) { Array.prototype.forEach.call(f.elements, function (el) { if (el.type !== "hidden") el.disabled = true; }); return; }
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!f.message.value.trim()) { st.textContent = "Please write a message first."; return; }
    var btn = f.querySelector("button"); btn.disabled = true; st.textContent = "Sending...";
    fetch(ep, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(f) })
      .then(function (r) { if (r.ok) { f.reset(); f.page.value = location.href; st.textContent = "Thank you. Your message was sent."; } else st.textContent = "Sorry, that did not send. Please try again later."; btn.disabled = false; })
      .catch(function () { st.textContent = "Sorry, that did not send. Check your connection and try again."; btn.disabled = false; });
  });
})();
