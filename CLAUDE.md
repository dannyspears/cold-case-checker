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

## Ohio set 2 (#42-#51)
- Generated by 	ools/gen-ohio2-a.ps1 and gen-ohio2-b.ps1 (Mihaljevic, Jarosz, Potts, Cassidy family, Rocky River Reservation, Hopper Road, Chelsea Johnson, Cody and Russell, Leslie Cross, Dana Frison). Photos: Ohio AG listings (Jarosz, Potts, Cassidys, Francis, Chelsea Johnson) and FBI pages (Mihaljevic, Rocky River). Cody and Russell, Leslie Cross, Dana Frison have silhouettes: the AG slugs Cross and Russell are different victims. Rachael Johnson (Akron 1991) was excluded because a man was convicted in 2023.

## Favicon and share banner
- 	ools/make-brand-assets.ps1 draws the favicon set (ssets/favicon.ico, .svg, 16/32/192/512 PNGs, pple-touch-icon.png) and the 1200x630 share banner ssets/og-banner.png with System.Drawing. 	ools/add-meta.ps1 writes the icon links, canonical URL, and Open Graph / Twitter tags (between <!-- brand:start --> and <!-- brand:end -->) into every top-level page; 	ools/run-gen.ps1 runs it after every generator. Share tags use absolute https://coldcasechecker.com/ URLs, so social sites can fetch the banner only once HTTPS works.

## Brianna Maitland (#52)
- 	ools/gen-maitland.ps1: a Vermont missing-person case, not a confirmed killing. State code VT in case-region.ps1 gives a Vermont records request.

## More Ohio AG photos
- 	ools/add-ag-photos2.ps1 adds AG listing photos by victim name: Bricca family (3), Dumler family (3), Ernestine Hurt, Kenneth Glenn, Jennifer Burgette, Alice Hochhausler. The AG database search (Cold-Case-Search-Results?searchtext=NAME&searchmode=anyword) found NO listing for Cora Durham, Permm Gilbert, Cheryl Fossyl, Lindsay Bogan, Nancy Abrams, John Francis, Leslie Cross, Dana Frison, Cody/Russell, Rhoda Nathan, or the Strangler victims Harrington, Dant, Messer, Winstel, Kerrick, Bowman. AG slugs with the same surname are often different people (Durham = Windom, Gilbert = Dominic, Cross = Geneice, Russell = Ronald): always check name, case number, and place before adding a photo.
## Case maps
- `assets/casemap.js` draws a real OpenStreetMap (Leaflet 1.9.4 from unpkg) into a `<div id="casemap" data-pins='[...]'>`; the old SVG sits inside as a fallback. Pins use `kind: "pin"` or `kind: "area"` (with a radius in metres). Only zodiac.html has one so far (sample, Oct 11 2026). Coordinates must be approximate and labelled; never pin a victim's home address.
## Social assets
- `tools/make-social-assets.ps1` draws `assets/logo-circle.png/.svg` (profile picture) and `assets/facebook-cover.png` (1640x924; content kept inside the box that both the desktop and mobile Facebook crops show).
## New batches
- #53-60 (`gen-set3-a/b.ps1`) and #61-65 (`gen-set4.ps1`): Ohio, southeastern Indiana (state 'IN' in case-region.ps1), Kentucky. All checked for arrests Oct 2026.
## Donations
- `assets/donate.js` adds a slim donation bar as the first thing inside `.wrap` on every page that loads it, and fills `#donate-buttons` on the home page (`#support`) and `donate.html` (why we ask). `tools/add-donate.ps1` adds the script tag to every page; `run-gen.ps1` runs it after every generator. Donations are not tax-deductible (stated on donate.html, index and terms.html#donations).
- The owner sets Venmo / Cash App / PayPal handles at the top of `assets/donate.js`. Never add or change donation handles or links unless the owner explicitly asks. Empty values show "Coming soon".
## Forms
- Formspree endpoints are set in `assets/tips.js` (tips), `assets/contact.js` (contact and photo removals) and `assets/submit.js` (case submissions), turned on Oct 12, 2026. Do not change them unless asked.
## Cincinnati 2026 set (#66-67)
- `tools/gen-cincy-2026.ps1`: Daniel "Chaz" Dudley (2007, AG case 1051, AG photo) and Cameron Franklin (2019, no AG listing; photo supplied by the owner Oct 13, 2026, assets/img/cameron-franklin.jpg, source unconfirmed). Re-running gen-cincy-2026.ps1 would drop it. Added Oct 12, 2026 at the owner's request for Cincinnati cases with Black victims; race is confirmed by the AG listing for Dudley only.
- Table builders (`Tbl`/`Grid` in case-lib.ps1, and add-coverage.ps1 rows) now wrap a single row so PowerShell cannot flatten it into one-cell rows. All existing pages were repaired Oct 12, 2026.
## Case drop-downs
- The home page "Browse all cases" list (assets/coldcase.js) and each state page's "Jump to a case" list (tools/build-states.ps1) drop a leading "The" and sort alphabetically in code, so new cases need no manual ordering. Keep `name` in cases.js as written (with "The").
## Cincinnati 2026 set B (#69-73)
- `tools/gen-cincy-2026b.ps1`: James Hurt (2010, AG 996), Julie Bagby (2006, AG 1073), Micah Wise (2009, AG 1016), Gary Croft (2008, AG 1029), Camrin Starr (2015, AG 3109). Found through the Ohio AG search (`.../Cold-Case/Cold-Case-Search-Results?searchtext=Cincinnati&searchmode=anyword&page=N`); each has an AG photo (teaser hotlink) and one FOX19 report. Added Oct 13, 2026. The AG keyword search returns mostly pre-2012 cases; newer ones need other searches.
- The Bagby Crime Stoppers card gives Oct 22 and 3233 Bowling Green Ct.; the listing and FOX19 say Oct 2 and 3235. The page notes the conflict.
- Generator dates: `case-lib.ps1` now stamps "Updated" with the run date (override with `updated`), `case-common.ps1` stamps the changelog with the run date, `add-coverage.ps1` entries accept `verified` and `rewards.js` entries accept `checked` to override the global dates for newly checked cases.
## Justin Moore (#74)
- `tools/gen-moore.ps1`: Justin "Biggie" Moore, 19, Bond Hill, Sept 18, 2007 (AG case 1052, slug `Moore-3`; card = four of hearts). Added Oct 14, 2026 at the owner's request. Sources: AG listing, the Crime Stoppers card, FOX19 Sept 18, 2019 (his mother Robin Moore's vigil; up to $2,500 reward in 2019, entered as `historic`). No 2007 coverage reachable.
- Changelog: a generator can set `$Changelog = @(@('Oct 14, 2026', 'note'), ...)` before `RegionCase` (`case-common.ps1` Tail); otherwise it writes the run date with "File published." Set it when regenerating a page that already went live so the original publish date is kept.
- Oct 14, 2026 deeper search: Bagby (Find a Grave memorial 52110463), Wise (FOX19 Oct 2021, mother Joy Marshall, jail cold-case cards), Starr (WKRC Oct 2018 $2,500 reward; death notice; Marcus Lampson 2015 arrest is a different case). Hurt and Croft: nothing new found.
## Evan McCray (#75)
- `tools/gen-mccray.ps1`: Evan Bradley "Butch" McCray, 29, shot as a front-seat passenger at 2218 Rice St., Mount Auburn, Oct 12, 2011; driver flagged down police at 2600 Jefferson Ave. (AG case 642, detailed police summary). Sources: AG listing, Legacy.com obituary (do not name relatives), CityBeat "On Rice Street" (2016). No 2011 news coverage found. The driver is a witness, never named.
## London Harris (#76)
- `tools/gen-harris.ps1`: London Donjoir Harris, 23, shot Apr 9, 2022 during a large fight outside Babe's Cafe (Glenmore & Applegate, Westwood/Cheviot border). Lead agency: Cheviot Police. No AG listing; photo supplied by the owner Oct 14, 2026 (assets/img/london-harris.jpg, source unconfirmed). Sources: FOX19, WCPO x3, WKRC x2 (incl. Apr 2023 "no new leads"), Echovita obituary, TMC Funding page. A search summary invented a "third-party/personnel investigation" line; it is not in the article.
- `case-region.ps1` now writes the note under victim cards based on the cards: a silhouette note only when a card shows `vph none`, otherwise "Each photo is credited under the picture." Override with `vNote`.
- McCray photo: provided by his family via the owner (Oct 14, 2026), cropped to `assets/img/evan-mccray.jpg`; caption says so.
- McCray nickname: "Bleed" per his family via the owner (Oct 14, 2026); the 2011 obituary printed "Butch." The page notes both.
## Case titles without "The" (Oct 14, 2026)
- Owner's rule: case titles named after people or families have no leading "The" ("Paula Phillips Case", "Bricca Family Murders"). Nickname or place-named cases keep it (Zodiac Killer, Cincinnati Strangler, Black Dahlia, Chicago Tylenol, Villisca, Axeman, Springfield Three, Texas Killing Fields, Cleveland Torso, Rocky River Reservation, Hopper Road); the Notorious B.I.G. headline keeps "The" as his stage name.
- `tools/strip-the.ps1` applies it to cases.js and every page (title, share titles, tag line, tip box, h1, references). `run-gen.ps1` runs it after every generator, before `build-states.ps1`, so new pages need nothing extra. Generators may still write "The X Case"; the strip script fixes it.
- State pages sort cases alphabetically ignoring a leading "The" (`SortKey` in build-states.ps1) and are rebuilt by run-gen after every new page.
