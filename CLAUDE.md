# Cold Case Checker

Static site: landing page (`index.html`) plus one file per case (`zodiac.html` is the template). No build step.
Preview: `.claude/launch.json` config `thaw` runs `serve.ps1` on http://localhost:5617 (no Node or Python needed).

## Files
- `assets/cases.js`: the one list of cases. Tiles on the landing page are generated from it. Set `status: "live"` and `page` when a case file is published.
- `assets/coldcase.css`, `assets/coldcase.js`: shared styles and behavior (tiles, news panel, collapsible sections).
- `assets/news-snapshot.js`: written by `tools/update-news.ps1` (Google News headlines per case). Add each new case's slug and search phrase to that script, then run it.
- `logo/cold-case-checker-logo.svg`: stacked logo (COLD CASE over CHECKER).

## Case file section order (copy zodiac.html)
glance (always open) · happened · victims · evidence · suspects · latest (most recent named suspect not ruled out: who, claimed evidence with ratings, evidence against, what would settle it, our % estimate) · matrix · hypothesis · missing links · gaps · tech · comps · falselead · map · quality · records · family · resources · sources · changelog.
Every `<section id>` after `#glance` needs a `.sec-head`; the JS folds it automatically.

## Rules
- Every claim needs a source in `#sources`. Mark anything unverified as unverified; never guess.
- Name no individual in the hypothesis. List suspects only as publicly named, with evidence for and against, and say none are charged unless true.
- Write non-ASCII text with UTF-8. In Windows PowerShell 5.1, use `[IO.File]::ReadAllText/WriteAllText` with a UTF-8 encoding; `Get-Content`/`Set-Content` corrupt characters like "·" and "←".
- Footer on every page: `<div id="site-contact"></div>` above the `<footer>`, a `<script src="assets/contact.js">` before `</body>`, and the link to `terms.html`. The owner sets the form address on one line at the top of `assets/contact.js`; never edit it unless asked.

## Photos
- Use only public-domain or open-licensed images. Check Wikimedia Commons through the API (`action=query&generator=images&prop=imageinfo&iiprop=extmetadata`). Hotlink `upload.wikimedia.org`, put the license and a Commons link in the `figcaption`, and add a line for people with no free photo. No crime-scene or body photos.- Victims and suspects are cards (`<div class="grid victims">`), each with its photo (or the silhouette `.vph.none`) at the top, then the Died/Survived or standing tag, name, and description. Suspect cards use "Why named" and "Against". Do not put photo rows above the cards. A photo supplied by the owner gets a caption saying the source is unconfirmed.

## Generating a new case file
- `tools/case-lib.ps1` builds a case page (same sections, cards, folds, contact box, footer). Copy `tools/gen-notorious-big`-style scripts such as `tools/gen-big.ps1`, fill in the content, and run `powershell -File tools\run-gen.ps1 gen-<name>.ps1`. The runner re-saves the scripts with a UTF-8 BOM (Windows PowerShell 5.1 needs it) and registers the case in `assets/cases.js` and `tools/update-news.ps1`.
- Then run `tools\update-news.ps1` to refresh headlines.
- `_publish/` is a throwaway staging copy for the Artifact preview. Do not edit it by hand; delete it before shipping the site.
## Cities are data only (no city UI)
- Every case entry in `assets/cases.js` has a `cities` array (`"City, ST"`) listing the cities where victims lived, were attacked, or were found. Use only cities a source confirms. They are used only to assign a case to its state and as search terms. The city drop-downs and city chips were removed on the owner's request: browsing is by state only. Add `cities` when you add a case.
## Public documents and online discussion
- `tools/add-documents.ps1` (the "Public documents" section, the document table per case, and evidence-row corrections) and `tools/add-discussion.ps1` (the "Online discussion (unverified)" section with live search links) are re-runnable: run each with `tools\run-gen.ps1 <script>`. Only list a document if it is public or we confirmed it exists, and label access honestly (online, fan-hosted copy, quoted in news, request needed, withheld). We cannot read non-public records, Reddit, or login-only platforms. Do not copy posts, usernames, or accusations from social media into a case page.
- The first twelve case files are now maintained as HTML. Do not re-run their `gen-*.ps1` scripts, because that would drop the documents and discussion sections and the later evidence edits. Use the generator only for new cases, then run the two add scripts.
## State pages
- `tools/build-states.ps1` writes `states.html` and `state-<name>.html` for all 50 states and D.C. from `assets/cases.js` and `assets/states.js`. A case belongs to a state when one of its `cities` ends in `, XX`. Pages for states with no cases are `noindex` and offer "Submit a case". `tools\run-gen.ps1` re-runs it after any generator, so run `tools\run-gen.ps1 build-states.ps1` after hand-editing `cases.js`.
- The landing page has an alphabetized "Browse by state" drop-down with counts; each state page has State and Case drop-downs. Case pages link to their state pages from the "State" chips under the status badge.
- Cincinnati / Northern Kentucky files (#13-#20) use `tools/case-common.ps1` (shared local-comparable cases). Their generators: `gen-strangler`, `gen-dumler`, `gen-pierson`, `gen-stephenson`, `gen-reiter`, `gen-hurt`, `gen-durham`, `gen-markham`.
## Verification (read before publishing anything)
- Follow 	ools/DAILY-REVIEW.md. Run the status sweep on every case before publishing. A case that has been charged, pleaded, convicted, or solved is removed from the unsolved list.
- Every case page has a "Coverage timeline and verification" section (	ools/add-coverage.ps1). Add each new dated report there. Only list reports you actually read.
- Do not rely on a single article for a case's status. Prefer two independent local sources and the state or agency page.
- Do not name living private individuals (for example a survivor or a former fiance who was never named a suspect).

## Numbering
- Only the original top 10 cases show a rank number (#1 to #10) on tiles, the browse list and case pages. Cases 11 and up show no number. Keep ank in cases.js for ordering only.

## Ohio Attorney General photos
- 	ools/add-ag-photos.ps1 hotlinks the victim photo from the Ohio AG unsolved-homicide listing into 7 Ohio case pages. The AG site states no reuse license; the owner chose to embed them anyway (Oct 8, 2026) and each carries a credit, a source link, and a removal line. Re-run it after regenerating those pages. Check the alt name before adding more: the AG's Hurt and Durham entries are different victims than ours. These external images do not show in the Artifact preview (its CSP blocks them).

## Rewards
- ssets/rewards.js holds one entry per case (kind: active, unconfirmed, historic, none). ssets/trust.js shows it as a box above the status badge on every case page. Add an entry for every new case; never state an amount we did not read in a source, and say 
one when we found none. Re-check rewards in the daily review and update REWARDS_CHECKED.

## Nancy Guthrie (#41)
- 	ools/gen-guthrie.ps1. An active missing-person case (kidnapping for ransom), added at the owner's request on Oct 9, 2026, so the page says it is not cold. It uses an Arizona records request (state = 'AZ' in case-region.ps1; 'KY' for Kentucky files). The FBI photo is hotlinked with a credit. Re-check the case often; it is moving.

## Scope
- The site covers unsolved murders and missing persons (changed Oct 2026). Keep that wording in titles, descriptions, the submit form, and 	ools/build-states.ps1. Missing-person files (Springfield Three, Nancy Guthrie) say clearly when a death is not confirmed.
