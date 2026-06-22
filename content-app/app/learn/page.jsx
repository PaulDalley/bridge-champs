import { CATEGORIES, categoryLabel, listAllArticles } from "../../lib/articles";

export const revalidate = 3600;

const BASE = "https://bridgechampions.com";

export const metadata = {
  title: "Learn Bridge by Topic | Bridge Champions",
  description:
    "Bridge lessons on bidding, declarer play, defence, and beginner fundamentals — clear, practical articles to improve your game.",
  alternates: { canonical: `${BASE}/learn` },
};

export default async function LearnRoot() {
  const arts = await listAllArticles();
  const counts = arts.reduce((m, a) => ((m[a.category] = (m[a.category] || 0) + 1), m), {});
  return (
    <main className="bc-main">
      <nav className="bc-breadcrumb" aria-label="Breadcrumb">
        <a href="/">Home</a> {" / "} <span aria-current="page">Learn</span>
      </nav>
      <h1 className="bc-hub-title">Learn Bridge by topic</h1>
      <ul className="bc-hub-grid">
        {CATEGORIES.map((c) => (
          <li key={c}>
            <a href={`/learn/${c}`}>
              {categoryLabel(c)}
              {counts[c] ? ` · ${counts[c]} lessons` : ""}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
