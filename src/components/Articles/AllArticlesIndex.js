import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet-async";
import { getArticles } from "../../store/actions/categoryArticlesActions";

// A flat, crawlable index of every published article — one strong, shallow
// internal-link path from the footer (every page) to all content. Helps Google
// discover/crawl the full library (esp. "Discovered – currently not indexed").
const SECTIONS = [
  { type: "beginnerBidding", label: "Beginner — Bidding", path: "/beginner/articles/bidding" },
  { type: "beginnerCardPlay", label: "Beginner — Declarer Play", path: "/beginner/articles/declarer" },
  { type: "beginnerDefence", label: "Beginner — Defence", path: "/beginner/articles/defence" },
  { type: "biddingBasics", label: "Bidding — Fundamentals", path: "/bidding/basics" },
  { type: "bidding", label: "Bidding — Advanced", path: "/bidding/advanced" },
  { type: "cardPlay", label: "Declarer Play", path: "/declarer/articles" },
  { type: "defence", label: "Defence", path: "/defence/articles" },
];

const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : 0);
function sortArticles(arr) {
  return [...arr].sort((a, b) => {
    if (num(a.difficulty) !== num(b.difficulty)) return num(a.difficulty) - num(b.difficulty);
    if (num(a.articleNumber) !== num(b.articleNumber)) return num(a.articleNumber) - num(b.articleNumber);
    return String(a.title || "").localeCompare(String(b.title || ""));
  });
}

const CANONICAL = "https://bridgechampions.com/all-articles";

const AllArticlesIndex = () => {
  const dispatch = useDispatch();
  const all = useSelector((s) => s.categoryArticles || {});

  useEffect(() => {
    SECTIONS.forEach((sec) => {
      const cur = all[sec.type];
      if (cur === undefined || (Array.isArray(cur) && cur.length === 0)) dispatch(getArticles(sec.type));
    });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  const sections = SECTIONS.map((sec) => {
    const list = (all[sec.type] || []).filter(
      (a) =>
        a &&
        a.isHidden !== true &&
        !(typeof a.redirectTo === "string" && a.redirectTo.startsWith("/")) &&
        String(a.title || "").trim()
    );
    return { ...sec, articles: sortArticles(list) };
  });
  const total = sections.reduce((n, s) => n + s.articles.length, 0);

  return (
    <main className="container" style={{ maxWidth: "60rem", margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>
      <Helmet>
        <title>All Bridge Lessons &amp; Articles | Bridge Champions</title>
        <meta
          name="description"
          content="Browse every Bridge Champions lesson — bidding, declarer play, and defence, for beginners and advanced players. A full index of our bridge articles."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={CANONICAL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={CANONICAL} />
        <meta property="og:title" content="All Bridge Lessons &amp; Articles | Bridge Champions" />
        <meta
          property="og:description"
          content="A full index of Bridge Champions lessons across bidding, declarer play, and defence."
        />
      </Helmet>

      <nav className="CategoryArticles-breadcrumbs" aria-label="Breadcrumb" style={{ marginBottom: "0.75rem" }}>
        <a href="/">Home</a>
        <span aria-hidden="true"> / </span>
        <span>All lessons</span>
      </nav>

      <h1 style={{ fontSize: "var(--text-3xl, 2rem)", fontWeight: 800, marginBottom: "0.5rem" }}>All bridge lessons</h1>
      <p style={{ color: "#475569", lineHeight: 1.6, marginBottom: "2rem" }}>
        Every article on Bridge Champions, organised by topic{total ? ` — ${total} lessons` : ""} covering bidding,
        declarer play, and defence for beginners and advanced players.
      </p>

      {sections.map((sec) =>
        sec.articles.length > 0 ? (
          <section key={sec.type} style={{ marginBottom: "2rem" }}>
            <h2 style={{ fontSize: "var(--text-xl, 1.35rem)", fontWeight: 700, marginBottom: "0.6rem" }}>
              <a href={sec.path} style={{ color: "#0F4C3A" }}>
                {sec.label}
              </a>
            </h2>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", lineHeight: 1.9 }}>
              {sec.articles.map((a) => (
                <li key={a.id}>
                  <a href={`${sec.path}/${a.slug || a.body || a.id}`} style={{ color: "#1d4ed8" }}>
                    {a.title}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null
      )}
    </main>
  );
};

export default AllArticlesIndex;
