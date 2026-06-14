import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getCategory, getTopic, TRAINER_PATH } from "../../data/topicHubs";
import { getReadSet, markRead, toggleRead } from "../../utils/readArticles";
import "./TopicHubs.css";

const SITE = "https://bridgechampions.com";

function Suits() {
  return (
    <span className="th-suits" aria-hidden="true">
      <span className="s">&spades;</span><span className="h">&hearts;</span><span className="d">&diams;</span><span className="c">&clubs;</span>
    </span>
  );
}

function TopicHub({ match }) {
  const category = match && match.params ? match.params.category : undefined;
  const topic = match && match.params ? match.params.topic : undefined;
  const cat = getCategory(category);
  const t = getTopic(category, topic);
  const [readSet, setReadSet] = useState(() => getReadSet());

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
  }, [category, topic]);

  if (!cat || !t) return <Redirect to="/learn" />;

  const articles = t.articles || [];
  const readCount = articles.filter((a) => readSet.has(a.to)).length;
  const pct = articles.length ? Math.round((readCount / articles.length) * 100) : 0;
  const siblings = cat.topics.filter((x) => x.slug !== t.slug);
  const canonical = `${SITE}/learn/${cat.key}/${t.slug}`;
  const isDev = process.env.NODE_ENV !== "production";

  // Assert this page as the hub for the topic: a CollectionPage that lists its
  // articles, plus a breadcrumb trail. Names come from the topic + article
  // titles only — no authored prose.
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${t.name} — ${cat.label}`,
    url: canonical,
    isPartOf: { "@type": "WebSite", name: "Bridge Champions", url: SITE },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: articles.map((a, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE}${a.to}`,
        name: a.title,
      })),
    },
  };
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Learn", item: `${SITE}/learn` },
      { "@type": "ListItem", position: 2, name: cat.label, item: `${SITE}/learn` },
      { "@type": "ListItem", position: 3, name: t.name, item: canonical },
    ],
  };

  return (
    <div className={`th-page th-page--${cat.key}`}>
      <Helmet>
        <title>{`${t.name} — ${cat.label} | Bridge Champions`}</title>
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={`${t.name} — ${cat.label} | Bridge Champions`} />
        <script type="application/ld+json">{JSON.stringify(collectionSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      <nav className="th-breadcrumb" aria-label="Breadcrumb">
        <Link to="/learn">Learn</Link>
        <span className="sep" aria-hidden="true">&rsaquo;</span>
        <Link to="/learn">{cat.label}</Link>
        <span className="sep" aria-hidden="true">&rsaquo;</span>
        <span>{t.name}</span>
      </nav>

      <div className="th-headRow">
        <div>
          <h1 className="th-title">{t.name}</h1>
          <div className="th-titleSuits"><Suits /></div>
        </div>
        {articles.length > 0 && (
          <div className="th-progressWrap">
            <div className="th-progressLabel">{readCount} of {articles.length} read</div>
            <div className="th-progressBar"><div className="th-progressFill" style={{ width: `${pct}%` }} /></div>
          </div>
        )}
      </div>

      {t.intro ? (
        <p className="th-intro">{t.intro}</p>
      ) : (
        isDev && (
          <p className="th-intro th-intro--empty">
            Intro goes here — your words (set <code>intro</code> on this topic in topicHubs.js).
          </p>
        )
      )}

      {articles.length > 0 && (
        <a className="th-cta" href={TRAINER_PATH[cat.key] || "/"}>
          <div>
            <div className="th-ctaText">Practise {t.name.toLowerCase()} in the trainer</div>
            <div className="th-ctaSub">Interactive practice hands</div>
          </div>
          <span className="th-ctaArrow" aria-hidden="true">&rarr;</span>
        </a>
      )}

      {articles.length > 0 ? (
        <>
          <div className="th-sectionLabel">Work through it</div>
          <ol className="th-path">
            {articles.map((a, i) => {
              const read = readSet.has(a.to);
              const last = i === articles.length - 1;
              return (
                <li className="th-step" key={a.to + i}>
                  <div className="th-rail">
                    <button
                      type="button"
                      className={`th-node ${read ? "th-node--read" : ""}`}
                      aria-label={read ? `Mark "${a.title}" unread` : `Mark "${a.title}" read`}
                      aria-pressed={read}
                      onClick={() => toggleRead(a.to)}
                    >
                      {read ? "✓" : i + 1}
                    </button>
                    {!last && <span className="th-railLine" />}
                  </div>
                  <Link className="th-articleCard" to={a.to} onClick={() => markRead(a.to)}>
                    <span className="th-articleTitle">{a.title}</span>
                    <span className={`th-level th-level--${a.level}`}>{a.level}</span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <p className="th-empty">Articles coming soon.</p>
      )}

      {siblings.length > 0 && (
        <div className="th-siblings">
          <div className="th-siblingsLabel">More {cat.label.toLowerCase()} topics</div>
          <div className="th-chips">
            {siblings.map((s) => (
              <Link key={s.slug} className="th-chip" to={`/learn/${cat.key}/${s.slug}`}>
                {s.name} &rarr;
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TopicHub;
