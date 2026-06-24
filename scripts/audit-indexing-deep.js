/**
 * DEEP indexing audit — fetch every sitemap article as Googlebot and check the
 * full set of signals Google uses to decide whether to index + how to canonicalise.
 * Read-only HTTP, no credentials. One fetch per article.
 *
 *   node scripts/audit-indexing-deep.js
 *
 * Reports, per category, every article that trips it:
 *   - non-200 status / redirect (Location)
 *   - robots noindex
 *   - canonical missing / wrong domain (must be https://bridgechampions.com) / cross-URL
 *   - missing <title> or generic shell title
 *   - missing meta description
 *   - missing Article / BreadcrumbList JSON-LD
 *   - thin rendered body (< 600 chars of text -> soft-404 risk)
 *   - DUPLICATE titles across different articles
 */
const https = require("https");
const APEX = "https://bridgechampions.com";
const GOOGLEBOT =
  "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

function get(url) {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      { headers: { "User-Agent": GOOGLEBOT }, timeout: 20000 },
      (res) => {
        let body = "";
        res.on("data", (c) => (body += c));
        res.on("end", () =>
          resolve({ status: res.statusCode, headers: res.headers, body })
        );
      }
    );
    req.on("error", () => resolve({ status: 0, headers: {}, body: "" }));
    req.on("timeout", () => {
      req.destroy();
      resolve({ status: 0, headers: {}, body: "" });
    });
  });
}

const ARTICLE_RE = [
  // Post-cutover scheme: /learn/<category>/<slug> (articles + topic hubs).
  /^\/learn\/(bidding|declarer|defence|beginner)\/[A-Za-z0-9_-]+$/,
  /^\/declarer\/articles\/[A-Za-z0-9_-]+$/,
  /^\/defence\/articles\/[A-Za-z0-9_-]+$/,
  /^\/bidding\/advanced\/[A-Za-z0-9_-]+$/,
  /^\/bidding\/basics\/[A-Za-z0-9_-]+$/,
  /^\/counting\/articles\/[A-Za-z0-9_-]+$/,
  /^\/beginner\/articles\/(declarer|defence|bidding)\/[A-Za-z0-9_-]+$/,
];
const isArticle = (p) => ARTICLE_RE.some((re) => re.test(p));

const titleOf = (h) => {
  const m = h.match(/<title>([^<]*)<\/title>/i);
  return m ? m[1].trim() : "";
};
const GENERIC = /bridge champions\s*[—-]\s*bridge lessons/i;
const canonOf = (h) => {
  const m = h.match(
    /<link[^>]+rel=["']canonical["'][^>]*href=["']([^"']+)["']/i
  );
  return m ? m[1] : "";
};
const hasNoindex = (h) =>
  /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(h);
const metaDescOf = (h) => {
  const m = h.match(
    /<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i
  );
  return m ? m[1].trim() : "";
};
const ldTypes = (h) => {
  const types = [];
  const re = /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m;
  while ((m = re.exec(h))) {
    const block = m[1];
    const tm = block.match(/"@type"\s*:\s*"([^"]+)"/g) || [];
    tm.forEach((t) => types.push(t.replace(/.*"@type"\s*:\s*"/, "").replace(/"$/, "")));
  }
  return types;
};
const bodyTextLen = (h) => {
  const body = (h.match(/<body[\s\S]*<\/body>/i) || [""])[0];
  return body
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim().length;
};

async function main() {
  const sm = await get(`${APEX}/sitemap.xml`);
  const paths = [
    ...new Set(
      [...(sm.body || "").matchAll(/<loc>([^<]+)<\/loc>/g)]
        .map((m) => {
          try {
            return new URL(m[1]).pathname.replace(/\/$/, "") || "/";
          } catch (_) {
            return null;
          }
        })
        .filter(Boolean)
    ),
  ].filter(isArticle);

  console.log(`Deep-auditing ${paths.length} article URLs as Googlebot…\n`);
  const issues = {
    status: [],
    noindex: [],
    canonMissing: [],
    canonDomain: [],
    canonCross: [],
    titleBad: [],
    metaDesc: [],
    ldArticle: [],
    ldBreadcrumb: [],
    thin: [],
  };
  const titles = {};
  let i = 0,
    CONC = 8;
  async function worker() {
    while (i < paths.length) {
      const p = paths[i++];
      const res = await get(`${APEX}${p}`);
      if (res.status !== 200) {
        issues.status.push(`${p} -> ${res.status}${res.headers.location ? " " + res.headers.location : ""}`);
        process.stdout.write("x");
        continue;
      }
      const h = res.body || "";
      const title = titleOf(h);
      const canon = canonOf(h);
      const types = ldTypes(h);
      if (!title || GENERIC.test(title)) issues.titleBad.push(`${p}  "${title}"`);
      else (titles[title] = titles[title] || []).push(p);
      if (hasNoindex(h)) issues.noindex.push(p);
      if (!canon) issues.canonMissing.push(p);
      else {
        let cu;
        try {
          cu = new URL(canon);
        } catch (_) {
          cu = null;
        }
        if (!cu || cu.origin !== APEX) issues.canonDomain.push(`${p}  canon=${canon}`);
        else if (cu.pathname.replace(/\/$/, "") !== p)
          issues.canonCross.push(`${p}  canon=${cu.pathname}`);
      }
      if (!metaDescOf(h)) issues.metaDesc.push(p);
      if (!types.includes("Article") && !types.includes("NewsArticle") && !types.includes("BlogPosting"))
        issues.ldArticle.push(p);
      if (!types.includes("BreadcrumbList")) issues.ldBreadcrumb.push(p);
      if (bodyTextLen(h) < 600) issues.thin.push(`${p}  (${bodyTextLen(h)} chars)`);
      process.stdout.write(".");
    }
  }
  await Promise.all(Array.from({ length: CONC }, worker));
  console.log("\n");

  const dupes = Object.entries(titles).filter(([, ps]) => ps.length > 1);
  const label = {
    status: "NON-200 / redirect (BLOCKS indexing)",
    noindex: "robots NOINDEX (BLOCKS indexing)",
    canonMissing: "canonical MISSING",
    canonDomain: "canonical wrong DOMAIN (not apex https)",
    canonCross: "canonical points to a DIFFERENT url",
    titleBad: "generic / missing TITLE",
    metaDesc: "missing meta description (minor)",
    ldArticle: "no Article structured data (minor)",
    ldBreadcrumb: "no BreadcrumbList structured data (minor)",
    thin: "THIN rendered body <600 chars (soft-404 risk)",
  };
  let blockers = 0;
  for (const k of Object.keys(issues)) {
    const arr = issues[k];
    if (!arr.length) {
      console.log(`OK   ${label[k]} — none`);
      continue;
    }
    if (["status", "noindex", "canonMissing", "canonDomain", "canonCross", "titleBad", "thin"].includes(k))
      blockers += arr.length;
    console.log(`\n### ${label[k]} — ${arr.length}`);
    arr.slice(0, 60).forEach((x) => console.log("   " + x));
  }
  console.log(
    dupes.length
      ? `\n### DUPLICATE titles — ${dupes.length}`
      : "\nOK   DUPLICATE titles — none"
  );
  dupes.forEach(([t, ps]) => console.log(`   "${t}"  -> ${ps.join(" , ")}`));

  console.log(
    `\n=== ${blockers === 0 ? "NO hard indexing blockers found." : blockers + " hard blocker(s) — see above."} (${paths.length} articles) ===`
  );
  process.exit(0);
}
main();
