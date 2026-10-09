// Trust elements on every case page: status badge, "how to read this page" key,
// "report to authorities" box, and the corrections policy. One place to edit them all.
// A case page only needs: <div id="key-box"></div> and <div id="trust-foot"></div>.
(function () {
  var slug = document.body.getAttribute("data-case");
  if (!slug) return;
  var CHECKED = "Oct 8, 2026";   // update when a page is re-checked

  // kind: open = red, partial = amber, historic = grey
  var STATUS = {
    "zodiac":              { kind: "open",     text: "Open · unsolved",            note: "The FBI, California DOJ, Vallejo, and the Napa and Solano County sheriffs keep the case open.", agency: "San Francisco Police, Vallejo Police, the Napa and Solano County Sheriffs, or the FBI" },
    "jonbenet-ramsey":     { kind: "open",     text: "Open · unsolved",            note: "Boulder police and the DA's office call it an active homicide investigation.", agency: "the Boulder Police Department" },
    "black-dahlia":        { kind: "open",     text: "Open · unsolved",            note: "The LAPD says the case remains open.", agency: "the Los Angeles Police Department" },
    "notorious-big":       { kind: "open",     text: "Open · unsolved",            note: "No one has been charged. The LAPD reopened the case in 2006.", agency: "the Los Angeles Police Department" },
    "tylenol-murders":     { kind: "open",     text: "Open · unsolved",            note: "Only an extortion conviction exists. Arlington Heights police lead the case.", agency: "the Arlington Heights Police Department" },
    "villisca":            { kind: "historic", text: "Unsolved · historic",        note: "No active investigation that we could confirm. The trials ended in 1917–18.", agency: "the Montgomery County Sheriff (Iowa)" },
    "axeman-new-orleans":  { kind: "historic", text: "Unsolved · historic",        note: "No active investigation that we could confirm.", agency: "the New Orleans Police Department" },
    "springfield-three":   { kind: "open",     text: "Open · missing persons",     note: "Listed by Springfield police as an active cold case. No remains found.", agency: "the Springfield Police Department (Missouri)" },
    "texas-killing-fields":{ kind: "partial",  text: "Partly solved · mostly open", note: "A few cases ended in convictions, including one in Sept 2026. Most remain open.", agency: "the League City Police Department or the Galveston County District Attorney" },
    "bricca-family":      { kind: "open",     text: "Open · unsolved",            note: "The Hamilton County Sheriff's Office lists the case as open. Evidence was retested in 2020.", agency: "the Hamilton County Sheriff's Office or the Ohio Attorney General's Unsolved Homicides page" },
    "frederick-walker":   { kind: "open",     text: "Open · unsolved",            note: "Listed as an Ohio Attorney General unsolved homicide. Springdale police re-submitted evidence for testing in 2022.", agency: "the Springdale Police Department or the Ohio Attorney General's Unsolved Homicide tip form" },
    "cincinnati-strangler":{ kind: "partial",  text: "Partly solved · six unattributed", note: "One conviction in 1967 (Barbara Bowman). The other six killings were never charged.", agency: "the Cincinnati Police Department" },
    "dumler-family":       { kind: "open",     text: "Open · unsolved",            note: "Cincinnati Police say they cannot point in one direction and need more information.", agency: "the Cincinnati Police Department" },
    "linda-pierson":       { kind: "open",     text: "Open · unsolved",            note: "Kentucky State Police Post 6 still seeks new information.", agency: "Kentucky State Police Post 6" },
    "stephenson-murders":  { kind: "open",     text: "Open · unsolved",            note: "The Boone County Sheriff's Office has a cold-case unit and a $50,000 family reward (2020).", agency: "the Boone County Sheriff's Office (Kentucky)" },
    "georg-ann-reiter":    { kind: "open",     text: "Cold · unsolved",            note: "Butler County detectives have reviewed the case since 2017.", agency: "the Butler County Sheriff's Office" },
    "ernestine-hurt":      { kind: "open",     text: "Cold · unsolved",            note: "Cincinnati Police have not commented publicly. Police emails reportedly say no evidence remains.", agency: "the Cincinnati Police Department" },
    "cora-durham":         { kind: "open",     text: "Open · unsolved",            note: "Warren County detectives took a fresh look in 2024.", agency: "the Warren County Sheriff's Office" },
    "amy-diesman":         { kind: "open",     text: "Open · unsolved",            note: "Pierce Township police say the killer likely knew her. A primary suspect's indictments were dismissed.", agency: "the Pierce Township Police Department" },
    "brittany-stykes":     { kind: "open",     text: "Open · unsolved",            note: "The sheriff says the case is active and a $50,000 reward stands. The family asked for a state review in 2026.", agency: "the Brown County Sheriff's Office" },
    "cheryl-fossyl":       { kind: "partial",  text: "Unsolved · civil verdict only", note: "A 2007 civil jury found two men responsible. No one has been criminally charged.", agency: "the Brown County Sheriff's Office" },
    "gene-gilbert":        { kind: "open",     text: "Open · unsolved",            note: "The sheriff says robbery was not the motive. Persons of interest are unnamed.", agency: "the Clermont County Sheriff's Office" },
    "heidi-bake":          { kind: "open",     text: "Open · unsolved",            note: "The sheriff's office asked for tips in 2016. No arrest found.", agency: "the Hamilton County Sheriff's Office" },
    "joe-patterson":       { kind: "open",     text: "Open · cold case",           note: "Police call the case cold and are looking at a hotel visit hours before the shooting.", agency: "the Fairfield Township Police Department" },
    "broderick-mcghee":    { kind: "open",     text: "Open · unsolved",            note: "Listed by the Ohio Attorney General. No arrest found.", agency: "the Hamilton Police Department" },
    "kenneth-glenn":       { kind: "open",     text: "Open · unsolved",            note: "A Cincinnati cold-case detective sought new information in 2020. No arrest found.", agency: "the Cincinnati Police Department" },
    "lindsay-bogan":       { kind: "open",     text: "Open · treated as homicide", note: "Police named persons of interest. No one is charged with her death.", agency: "the Middletown Division of Police" },
    "abrams-francis":      { kind: "open",     text: "Open · unsolved",            note: "A 2004 grand jury declined to indict. A detective reviewed the file in 2018.", agency: "the Middletown Division of Police" },
    "rhoda-nathan":        { kind: "partial",  text: "Unsolved · charge dismissed", note: "The 1996 conviction was vacated and the charge dismissed in Dec 2025. No one else is charged.", agency: "the Blue Ash Police Department" },
    "william-goebel":      { kind: "historic", text: "Historic · never resolved",  note: "Three men were convicted and all were pardoned. The shooter was never established.", agency: "the Kentucky Historical Society or the Franklin County court" },
    "betty-gail-brown":    { kind: "open",     text: "Open · unsolved",            note: "A man who confessed was tried and the jury hung. He died in 1980.", agency: "the Lexington Police Department" },
    "jason-ellis":         { kind: "open",     text: "Open · unsolved",            note: "The FBI offers up to $50,000. No arrest found.", agency: "the FBI Louisville office (1-800-CALL-FBI)" },
    "netherland-murders":  { kind: "open",     text: "Open · unsolved",            note: "Police had no suspect or motive. The only lead is a black Chevrolet Impala on video.", agency: "the Kentucky State Police" },
    "gerald-johnson":      { kind: "open",     text: "Open · cold case",           note: "Listed by the Boone County Sheriff. We found no other reporting.", agency: "the Boone County Sheriff's Office" },
    "lesley-sparrow":      { kind: "open",     text: "Open · cold case",           note: "Listed by the Boone County Sheriff. We found no other reporting.", agency: "the Boone County Sheriff's Office" },
    "lois-mccain":         { kind: "open",     text: "Open · unsolved",            note: "Listed on the Paducah police cold-case page. No arrest found.", agency: "the Paducah Police Department" },
    "judy-wright":         { kind: "open",     text: "Open · unsolved",            note: "Listed on the Paducah police cold-case page. The man she left with is unidentified.", agency: "the Paducah Police Department" },
    "happy-thomas":        { kind: "open",     text: "Open · unsolved",            note: "Listed on the Paducah police cold-case page. No suspect found.", agency: "the Paducah Police Department" },
    "tommy-ballard":       { kind: "open",     text: "Open · unsolved",            note: "The FBI offers up to $10,000. No one is charged in his death.", agency: "the FBI Louisville office (1-800-CALL-FBI)" },    "nancy-guthrie":       { kind: "open",     text: "Active · missing",           note: "Investigated as a kidnapping for ransom. She has not been found and no suspect is named.", agency: "the FBI Phoenix office (1-800-CALL-FBI) or the Pima County Sheriff" },
    "cleveland-torso":     { kind: "historic", text: "Unsolved · identification effort", note: "A 2024 effort is trying to identify the unnamed victims. The killer has never been identified.", agency: "the Cleveland Division of Police or the Cuyahoga County Medical Examiner" }  };
  var s = STATUS[slug] || { kind: "open", text: "Unsolved", note: "", agency: "the investigating agency" };

  // 1. Status badge, placed above the headline
  var lead = document.querySelector(".lead");
  if (lead) {
    var b = document.createElement("div");
    b.className = "status-badge " + s.kind;
    b.innerHTML = '<span class="sb-pill">Case status</span><strong>' + s.text + '</strong><span class="sb-note">' + s.note + ' Last verified ' + CHECKED + ' <a href="#coverage">(how we checked)</a>.</span>';
    lead.parentNode.insertBefore(b, lead);

    // 1b. Reward box, placed above the status badge so it is the first thing a visitor sees
    var showReward = function () {
      var R = (window.REWARDS || {})[slug]; if (!R) return;
      var box = document.createElement("div");
      box.className = "reward-box " + R.kind;
      var label = { active: "Reward offered", unconfirmed: "Reward reported", historic: "Old reward offer", none: "Reward" }[R.kind] || "Reward";
      var src = (R.links || []).map(function (l) { return '<a href="' + l[0] + '" target="_blank" rel="noopener">' + l[1] + "</a>"; }).join(" · ");
      box.innerHTML = '<span class="rw-label">' + label + '</span>' +
        '<strong class="rw-amt' + (R.amount ? "" : " none") + '">' + (R.amount || "None found") + '</strong>' +
        '<span class="rw-note">' + R.note + ' <span class="rw-meta">Checked ' + (window.REWARDS_CHECKED || "") + ". Always confirm with the agency before relying on a reward." + (src ? " Source: " + src + "." : "") + "</span></span>";
      b.parentNode.insertBefore(box, b);
    };
    if (window.REWARDS) showReward(); else { var rs = document.createElement("script"); rs.src = "assets/rewards.js"; rs.onload = showReward; document.head.appendChild(rs); }
    // State tag: links to the state page (city tags were removed)
    var slugify = function (x) { return String(x).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""); };
    var addCities = function () {
      var me = (window.CASES || []).filter(function (c) { return c.slug === slug; })[0];
      if (!me || !me.cities || !me.cities.length) return;
      var line = document.createElement("div");
      line.className = "city-line";
      var codes = [];
      me.cities.forEach(function (x) { var m = x.match(/, ([A-Z]{2})$/); if (m && codes.indexOf(m[1]) === -1) codes.push(m[1]); });
      var stateChips = (window.STATES || []).filter(function (s) { return codes.indexOf(s.code) !== -1; }).map(function (s) {
        return '<a class="chip" href="state-' + s.slug + '.html" title="See every case in ' + s.name + '">' + s.name + "</a>";
      }).join("");
      if (!stateChips) return;
      line.innerHTML = '<span class="sb-pill">State</span>' + stateChips;
      b.parentNode.insertBefore(line, b.nextSibling);
    };
    var loadStates = function (fn) { if (window.STATES) fn(); else { var s2 = document.createElement("script"); s2.src = "assets/states.js"; s2.onload = fn; s2.onerror = fn; document.head.appendChild(s2); } };
    var go = function () { loadStates(addCities); };    if (window.CASES) go();
    else { var sc = document.createElement("script"); sc.src = "assets/cases.js"; sc.onload = go; document.head.appendChild(sc); }
  }

  // 2. "How to read this page"
  var key = document.getElementById("key-box");
  if (key) {
    key.className = "key-box";
    key.innerHTML =
      '<details class="inner"><summary>How to read this page: labels, ratings, and estimates</summary>' +
      '<div class="key-grid">' +
      '<div><h3>Claim ratings</h3><ul>' +
      '<li><span class="pill live">Documented</span> Reported as fact by a record or reliable source.</li>' +
      '<li><span class="pill">Open</span> A test or comparison is under way or still possible.</li>' +
      '<li><span class="pill warn">Weak</span> Rests on one person, interpretation, or circumstance.</li>' +
      '<li><span class="pill red">Ruled out</span> Excluded or contradicted by evidence.</li></ul></div>' +
      '<div><h3>Elimination matrix</h3><ul>' +
      '<li><span class="y">✓</span> supports the theory</li><li><span class="x">✗</span> excluded or contradicted</li><li><span class="q">?</span> disputed or unverified</li><li>— nothing public (not the same as clear)</li></ul></div>' +
      '<div><h3>Source ratings</h3><ul>' +
      '<li><b>A</b> agency or court record</li><li><b>B</b> reputable news or a footnoted reference</li><li><b>C</b> secondary or promotional coverage</li><li><b>D</b> advocacy, books, podcasts, or unreleased evidence</li></ul></div>' +
      '<div><h3>Estimates</h3><p>Percentages on this page are our own editorial judgment, not statistics. They change when evidence changes, and they never name a person as guilty. People named here have not been convicted unless the page says so.</p></div>' +
      '</div></details>';
  }

  // 3. Report to authorities + corrections policy, above the contact box
  var foot = document.getElementById("trust-foot");
  if (foot) {
    foot.className = "trust-foot";
    foot.innerHTML =
      '<div class="authority"><h2>Report information to the authorities</h2>' +
      '<p>If you have information that could help solve this case, contact ' + s.agency + ', or report it to the FBI at <a href="https://tips.fbi.gov/" target="_blank" rel="noopener">tips.fbi.gov</a> (anonymous reports are accepted) or to a local Crime Stoppers line. If someone is in danger, call 911. The clue form near the top of this page goes to the site owner, not to the police.</p></div>' +
      '<div class="corrections" id="corrections"><h2>Corrections and removals</h2>' +
      '<p>We want this page to be right. If you find an error, a missing source, or a statement about a real person that is wrong, use the contact form below. We check each report against the cited sources, fix confirmed errors, and note changes in the change log. Families and people named on a page can ask us to add a reply, correct a detail, or remove a photo. <a href="terms.html#corrections">Read the full policy.</a></p></div>';
  }
})();
