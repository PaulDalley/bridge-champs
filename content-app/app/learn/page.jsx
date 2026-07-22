import { listAllArticles, categoryLabel } from "../../lib/articles";
import { CATEGORIES } from "../../lib/topicHubs";
import LearnSearch from "../../components/LearnSearch";
import ReelsRail from "../../components/ReelsRail";

export const dynamic = "force-dynamic";

const SITE = "https://bridgechampions.com";
const OG_IMAGE = "https://firebasestorage.googleapis.com/v0/b/bridgechampions.appspot.com/o/logo.png?alt=media&token=583808ab-2c3b-49a6-8936-82dffe55ec95";
const CATEGORY_SUIT = { declarer: "♠", defence: "♥", bidding: "♦" };
const lastSeg = (p) => String(p || "").split("/").filter(Boolean).pop();

export const metadata = {
  title: "Learn Bridge by Topic | Bridge Champions",
  description: "Declarer play, defence, and bidding — by topic.",
  alternates: { canonical: `${SITE}/learn` },
  openGraph: {
    type: "website",
    url: `${SITE}/learn`,
    title: "Learn Bridge by Topic | Bridge Champions",
    description: "Declarer play, defence, and bidding — by topic.",
    siteName: "Bridge Champions",
    images: [{ url: OG_IMAGE, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Learn Bridge by Topic | Bridge Champions", description: "Declarer play, defence, and bidding — by topic.", images: [OG_IMAGE] },
};

export default async function LearnRoot() {
  const arts = await listAllArticles();
  const slugToNew = {};
  arts.forEach((a) => {
    slugToNew[a.slug] = `/learn/${a.category}/${a.slug}`;
  });

  // Flat search index of every allocated article, mapped to its new URL.
  const seen = new Set();
  const index = [];
  CATEGORIES.forEach((c) =>
    c.topics.forEach((t) =>
      (t.articles || []).forEach((a) => {
        const href = slugToNew[lastSeg(a.to)] || a.to;
        if (!seen.has(href)) {
          seen.add(href);
          index.push({ title: a.title, href, catLabel: c.label, topicName: t.name });
        }
      })
    )
  );

  const learnSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Learn Bridge by Topic",
    url: `${SITE}/learn`,
    isPartOf: { "@type": "WebSite", name: "Bridge Champions", url: SITE },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: CATEGORIES.flatMap((c) =>
        c.topics.map((t) => ({ key: c.key, slug: t.slug, name: `${t.name} — ${c.label}` }))
      ).map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE}/learn/${it.key}/${it.slug}`,
        name: it.name,
      })),
    },
  };

  return (
    <div className="lh-page">
      <div className="lh-hero">
        <h1 className="lh-heroTitle">Learn</h1>
        <div className="lh-heroSuits">
          <span className="th-suits" aria-hidden="true">
            <span className="s">&spades;</span><span className="h">&hearts;</span><span className="d">&diams;</span><span className="c">&clubs;</span>
          </span>
        </div>
        <p className="lh-heroSub">Declarer play, defence, and bidding — by topic.</p>
        <LearnSearch index={index} />
      </div>

      <section className="lh-toolPromo" aria-label="System Card Editor">
        <a className="lh-toolPromo-link" href="/system">
          <span className="lh-toolPromo-badge">New</span>
          <span className="lh-toolPromo-title">System Card Editor</span>
          <span className="lh-toolPromo-arrow" aria-hidden="true">&rarr;</span>
        </a>
        <p className="lh-toolPromo-note">
          Being tested &mdash; it may have issues. Please email{" "}
          <a href="mailto:paul.dalley@hotmail.com">paul.dalley@hotmail.com</a> if you hit any.
        </p>
      </section>

      {CATEGORIES.map((c) => (
        <section className={`lh-category lh-category--${c.key}`} key={c.key}>
          <div className="lh-categoryHead">
            <span className="lh-categoryBadge" aria-hidden="true">{CATEGORY_SUIT[c.key] || "♠"}</span>
            <h2 className="lh-categoryTitle">{c.label}</h2>
            <span className="lh-categoryCount">{c.topics.length} topics</span>
          </div>
          <div className="lh-grid">
            {c.topics.map((t) => {
              const total = (t.articles || []).length;
              return (
                <a className="lh-card" href={`/learn/${c.key}/${t.slug}`} key={t.slug}>
                  <span className="lh-cardSuit" aria-hidden="true">{CATEGORY_SUIT[c.key] || "♠"}</span>
                  <h3 className="lh-cardName">{t.name}</h3>
                  {total === 0 ? <span className="lh-cardSoon">Articles coming soon</span> : null}
                </a>
              );
            })}
          </div>
        </section>
      ))}

      <ReelsRail />

      <section className="lh-allArticles" aria-label="All articles">
        <h2 className="lh-allTitle">All articles</h2>
        {["bidding", "declarer", "defence", "beginner"].map((cat) => {
          const inCat = arts
            .filter((a) => a.category === cat)
            .sort((x, y) => String(x.title).localeCompare(String(y.title)));
          if (!inCat.length) return null;
          return (
            <div className="lh-allGroup" key={cat}>
              <h3 className="lh-allGroupTitle">{categoryLabel(cat)}</h3>
              <ul className="lh-allList">
                {inCat.map((a) => (
                  <li key={`${a.category}/${a.slug}`}>
                    <a href={`/learn/${a.category}/${a.slug}`}>{a.title}</a>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learnSchema) }} />
    </div>
  );
}
