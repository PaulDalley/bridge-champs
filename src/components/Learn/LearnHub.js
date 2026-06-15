import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CATEGORIES } from "../../data/topicHubs";
import { getReadSet } from "../../utils/readArticles";
import "./TopicHubs.css";

const SITE = "https://bridgechampions.com";
const LEARN_DESC = "Declarer play, defence, and bidding — by topic.";
const OG_IMAGE = `${SITE}/og/default.png`;

// Flatten every allocated article for the search box (dedupe by URL).
const ALL_ARTICLES = (() => {
  const map = new Map();
  CATEGORIES.forEach((c) =>
    c.topics.forEach((t) =>
      (t.articles || []).forEach((a) => {
        if (!map.has(a.to)) map.set(a.to, { ...a, topicName: t.name, catLabel: c.label });
      })
    )
  );
  return [...map.values()];
})();

function Suits() {
  return (
    <span className="th-suits" aria-hidden="true">
      <span className="s">&spades;</span><span className="h">&hearts;</span><span className="d">&diams;</span><span className="c">&clubs;</span>
    </span>
  );
}

const CATEGORY_SUIT = { declarer: "♠", defence: "♥", bidding: "♦" };

function LearnHub() {
  const [readSet, setReadSet] = useState(() => getReadSet());
  const [q, setQ] = useState("");

  useEffect(() => {
    const sync = () => setReadSet(getReadSet());
    window.addEventListener("bc-read-articles-changed", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("bc-read-articles-changed", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return ALL_ARTICLES.filter((a) => a.title.toLowerCase().includes(s)).slice(0, 12);
  }, [q]);

  // ItemList of every topic hub, so search engines see the site's topic map.
  const learnItems = [];
  CATEGORIES.forEach((c) =>
    c.topics.forEach((tp) =>
      learnItems.push({ key: c.key, slug: tp.slug, name: `${tp.name} — ${c.label}` })
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
      itemListElement: learnItems.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE}/learn/${it.key}/${it.slug}`,
        name: it.name,
      })),
    },
  };

  return (
    <div className="lh-page">
      <Helmet>
        <title>Learn Bridge by Topic | Bridge Champions</title>
        <meta name="description" content={LEARN_DESC} />
        <link rel="canonical" href={`${SITE}/learn`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE}/learn`} />
        <meta property="og:title" content="Learn Bridge by Topic | Bridge Champions" />
        <meta property="og:description" content={LEARN_DESC} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Learn Bridge by Topic | Bridge Champions" />
        <meta name="twitter:description" content={LEARN_DESC} />
        <meta name="twitter:image" content={OG_IMAGE} />
        <script type="application/ld+json">{JSON.stringify(learnSchema)}</script>
      </Helmet>

      <div className="lh-hero">
        <h1 className="lh-heroTitle">Learn</h1>
        <div className="lh-heroSuits"><Suits /></div>
        <p className="lh-heroSub">Declarer play, defence, and bidding — by topic.</p>

        <div className="lh-search">
          <div className="lh-searchBox">
            <span className="lh-searchIcon" aria-hidden="true"><i className="fas fa-search" /></span>
            <input
              className="lh-searchInput browser-default"
              type="search"
              placeholder="Search articles…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Search articles"
            />
          </div>
          {q.trim() && (
            <ul className="lh-searchResults">
              {results.length ? (
                results.map((a) => (
                  <li key={a.to}>
                    <Link to={a.to}>
                      <span>{a.title}</span>
                      <span className="lh-srTopic">{a.catLabel} &middot; {a.topicName}</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="lh-searchEmpty">No matches.</li>
              )}
            </ul>
          )}
        </div>
      </div>

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
              const read = (t.articles || []).filter((a) => readSet.has(a.to)).length;
              const pct = total ? Math.round((read / total) * 100) : 0;
              return (
                <Link className="lh-card" to={`/learn/${c.key}/${t.slug}`} key={t.slug}>
                  <span className="lh-cardSuit" aria-hidden="true">{CATEGORY_SUIT[c.key] || "♠"}</span>
                  <h3 className="lh-cardName">{t.name}</h3>
                  {total === 0 ? (
                    <span className="lh-cardSoon">Articles coming soon</span>
                  ) : read > 0 ? (
                    <div className="lh-cardMeta">
                      <span>{read} read</span>
                      <span className="lh-cardBar"><span className="lh-cardBarFill" style={{ width: `${pct}%` }} /></span>
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export default LearnHub;
