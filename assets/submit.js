// Case submissions.
// OWNER SETUP: paste a form endpoint between the quotes (for example a Formspree or Getform URL).
// While it is empty, the form cannot send anything and offers the entry as text to copy instead.
window.SUBMIT_ENDPOINT = "";

(function () {
  var form = document.getElementById("submit-form");
  if (!form) return;
  var out = document.getElementById("submit-result");
  var say = function (html) { out.innerHTML = html; out.hidden = false; out.scrollIntoView({ block: "nearest" }); };
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    if (fd.get("website")) return; // honeypot: real people leave this empty
    var data = {}; fd.forEach(function (v, k) { if (k !== "website") data[k] = String(v).trim(); });
    var text = Object.keys(data).map(function (k) { return k + ": " + data[k]; }).join("\n");
    if (!window.SUBMIT_ENDPOINT) {
      say('<b>Submissions are not connected yet.</b> Nothing was sent. You can copy your entry below and send it to the site owner once a contact method is published.' +
        '<textarea readonly rows="8" style="width:100%;margin-top:8px;font:13px var(--mono)">' + text.replace(/</g, "&lt;") + "</textarea>");
      return;
    }
    fetch(window.SUBMIT_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
      .then(function (r) { if (!r.ok) throw new Error(r.status); form.reset(); say("<b>Thank you.</b> Your submission was received. We review every case before anything is published, and we may contact you for sources."); })
      .catch(function () { say('<b>Sorry, that did not send.</b> Please try again later. Your entry:<textarea readonly rows="8" style="width:100%;margin-top:8px;font:13px var(--mono)">' + text.replace(/</g, "&lt;") + "</textarea>"); });
  });
})();
