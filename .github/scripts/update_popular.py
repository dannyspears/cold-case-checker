"""Nightly: recount all-time page views per case page from Cloudflare Web Analytics and rewrite assets/popular.js.

Runs in GitHub Actions (.github/workflows/update-popular.yml). Needs CF_API_TOKEN (a read-only "Account Analytics"
API token, stored as the repository secret CLOUDFLARE_API_TOKEN), CF_ACCOUNT_ID and CF_SITE_TAG.

Cloudflare samples long date ranges and keeps only a few months of data, so this asks one UTC day at a time and keeps
every day's counts in .github/data/daily-pageviews.json. The all-time total is the sum of that file, so it keeps
growing even after Cloudflare drops old days.
"""
import datetime as dt
import json
import os
import re
import sys
import urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA = os.path.join(ROOT, ".github", "data", "daily-pageviews.json")
CASES = os.path.join(ROOT, "assets", "cases.js")
OUT = os.path.join(ROOT, "assets", "popular.js")
START = dt.date(2026, 11, 6)  # Web Analytics was turned on this day
REFETCH_DAYS = 2              # always re-count the most recent days, which may still have been filling in
TOP_N = 5

QUERY = """query($a:String!,$f:AccountRumPageloadEventsAdaptiveGroupsFilter_InputObject){
  viewer{accounts(filter:{accountTag:$a}){
    rumPageloadEventsAdaptiveGroups(filter:$f,limit:5000,orderBy:[count_DESC]){count dimensions{requestPath}}
  }}}"""


def fetch_day(day, token, account, site):
    start = dt.datetime.combine(day, dt.time(0, 0), dt.timezone.utc)
    end = start + dt.timedelta(days=1)
    body = {"query": QUERY, "variables": {"a": account, "f": {"AND": [
        {"datetime_geq": start.isoformat().replace("+00:00", "Z")},
        {"datetime_lt": end.isoformat().replace("+00:00", "Z")},
        {"siteTag": site}, {"bot": 0}]}}}
    req = urllib.request.Request("https://api.cloudflare.com/client/v4/graphql", data=json.dumps(body).encode(),
                                 headers={"Authorization": "Bearer " + token, "Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        res = json.load(r)
    if res.get("errors"):
        raise SystemExit("Cloudflare error for %s: %s" % (day, "; ".join(e.get("message", "") for e in res["errors"])))
    groups = res["data"]["viewer"]["accounts"][0]["rumPageloadEventsAdaptiveGroups"]
    return {g["dimensions"]["requestPath"]: g["count"] for g in groups}


def live_cases():
    text = open(CASES, encoding="utf-8").read()
    pages = {}
    for entry in re.findall(r"\{[^{}]*?slug:\s*\"[^\"]+\"[^{}]*?\}", text, re.S):
        slug = re.search(r"slug:\s*\"([^\"]+)\"", entry).group(1)
        page = re.search(r"page:\s*\"([^\"]+)\"", entry)
        if page and re.search(r"status:\s*\"live\"", entry):
            pages[page.group(1)] = slug
    return pages


def main():
    token, account, site = (os.environ.get(k, "").strip() for k in ("CF_API_TOKEN", "CF_ACCOUNT_ID", "CF_SITE_TAG"))
    if not (token and account and site):
        sys.exit("Missing CF_API_TOKEN, CF_ACCOUNT_ID or CF_SITE_TAG. Add the CLOUDFLARE_API_TOKEN repository secret.")
    days = json.load(open(DATA, encoding="utf-8")) if os.path.exists(DATA) else {}
    today = dt.datetime.now(dt.timezone.utc).date()
    day = START
    while day <= today:
        key = day.isoformat()
        if key not in days or (today - day).days < REFETCH_DAYS:
            days[key] = fetch_day(day, token, account, site)
        day += dt.timedelta(days=1)
    os.makedirs(os.path.dirname(DATA), exist_ok=True)
    with open(DATA, "w", encoding="utf-8", newline="\n") as f:
        json.dump(days, f, indent=1, sort_keys=True)
        f.write("\n")

    pages = live_cases()
    totals = {}
    for counts in days.values():
        for path, n in counts.items():
            page = path.strip("/").split("?")[0]
            if page and not page.endswith(".html"):
                page += ".html"
            slug = pages.get(page)
            if slug:
                totals[slug] = totals.get(slug, 0) + n
    top = [s for s, _ in sorted(totals.items(), key=lambda kv: (-kv[1], kv[0]))[:TOP_N]]
    if len(top) < TOP_N:
        sys.exit("Fewer than %d case pages have views; leaving popular.js unchanged." % TOP_N)

    stamp = today.strftime("%b ") + str(today.day) + today.strftime(", %Y")
    js = ("// Most visited case pages, from Cloudflare Web Analytics (all-time page views, bots excluded).\n"
          "// Written every night by .github/scripts/update_popular.py; do not edit by hand.\n"
          "// Counts: " + ", ".join("%s %d" % (s, totals[s]) for s in top) + "\n"
          "window.POPULAR = { updated: \"%s\", period: \"all time (tracking began Nov 6, 2026)\", slugs: %s };\n"
          % (stamp, json.dumps(top)))
    with open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write(js)
    print("Top %d: %s" % (TOP_N, ", ".join("%s (%d)" % (s, totals[s]) for s in top)))


if __name__ == "__main__":
    main()
