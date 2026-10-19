/* Social follow links shown at the top of the home page (inside #social-follow).
   The owner sets the four profile links here. Leave a value "" to hide that icon; the bar hides itself if all are empty. */
var SOCIAL = {
  facebook:  "https://www.facebook.com/profile.php?id=61595203655403",   // e.g. "https://www.facebook.com/coldcasechecker"
  instagram: "https://www.instagram.com/coldcasechecker",   // e.g. "https://www.instagram.com/coldcasechecker"
  tiktok:    "https://www.tiktok.com/@cold.case.checker",   // e.g. "https://www.tiktok.com/@coldcasechecker"
  x:         "https://x.com/ColdCaseChecker"    // e.g. "https://x.com/coldcasechecker"
};

(function () {
  var box = document.getElementById('social-follow'); if (!box) return;
  var icons = {
    facebook: '<path d="M14 8h2.5V4.5H14c-2.5 0-4 1.6-4 4.1V11H7.5v3.5H10V20h3.6v-5.5h2.6l.4-3.5h-3V9c0-.6.4-1 1-1z"/>',
    instagram: '<rect x="4" y="4" width="16" height="16" rx="4.5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3.6" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="16.9" cy="7.1" r="1.2"/>',
    tiktok: '<path d="M14.5 4h3c.2 1.7 1.4 3 3 3.2v3c-1.2 0-2.2-.3-3-.8v5.8a5.2 5.2 0 1 1-5.2-5.2c.3 0 .6 0 .9.1v3.1a2.2 2.2 0 1 0 1.3 2V4z"/>',
    x: '<path d="M5 4h4l3.4 4.7L16.6 4H19l-5.4 6.4L19.8 20h-4l-3.7-5.2L7.5 20H5l5.9-6.9L5 4z"/>'
  };
  var names = { facebook: 'Facebook', instagram: 'Instagram', tiktok: 'TikTok', x: 'X' };
  var html = '';
  ['facebook', 'instagram', 'tiktok', 'x'].forEach(function (k) {
    var url = (SOCIAL[k] || '').trim(); if (!/^https:\/\//i.test(url)) return;
    html += '<a class="soc" href="' + url.replace(/"/g, '&quot;') + '" target="_blank" rel="noopener me" aria-label="Follow Cold Case Checker on ' + names[k] + '" title="' + names[k] + '">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">' + icons[k] + '</svg></a>';
  });
  if (!html) { box.hidden = true; return; }
  box.innerHTML = '<span class="soc-label">Follow us</span>' + html;
  box.hidden = false;
})();
