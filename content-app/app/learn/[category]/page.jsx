import { notFound } from "next/navigation";
import { listCategoryArticles, categoryLabel, CATEGORIES } from "../../../lib/articles";
import { getCategory } from "../../../lib/topicHubs";

// Render live from Firestore (build runs without creds, so a static snapshot
// would list no articles).
export const dynamic = "force-dynamic";

const BASE = "https://bridgechampions.com";

export async function generateMetadata({ params }) {
  if (!CATEGORIES.includes(params.category)) {
    return { title: "Not found — Bridge Champions", robots: { index: false } };
  }
  const label = categoryLabel(params.category);
  const url = `${BASE}/learn/${params.category}`;
  return {
    title: `${label} — Learn Bridge | Bridge Champions`,
    alternates: { canonical: url },
  };
}

export default async function CategoryHub({ params }) {
  if (!CATEGORIES.includes(params.category)) notFound();
  const cat = getCategory(params.category); // declarer/defence/bidding have topics; beginner does not
  const hasTopics = !!(cat && Array.isArray(cat.topics) && cat.topics.length);
  const arts = hasTopics ? [] : await listCategoryArticles(params.category);
  arts.sort((a, b) => String(a.title).localeCompare(String(b.title)));

  return (
    <main className="bc-main">
      <nav className="bc-breadcrumb" aria-label="Breadcrumb">
        <a href="/learn">Learn</a> {" / "}
        <span aria-current="page">{categoryLabel(params.category)}</span>
      </nav>
      <h1 className="bc-hub-title">{categoryLabel(params.category)}</h1>
      {hasTopics ? (
        <ul className="bc-hub-grid">
          {cat.topics.map((t) => (
            <li key={t.slug}>
              <a href={`/learn/${params.category}/${t.slug}`}>
                {t.name}
                {Array.isArray(t.articles) && t.articles.length ? ` · ${t.articles.length} lessons` : ""}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="bc-cat-list">
          {arts.map((a) => (
            <li key={a.slug}>
              <a href={`/learn/${a.category}/${a.slug}`}>{a.title || a.slug}</a>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
