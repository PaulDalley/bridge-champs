import { notFound } from "next/navigation";
import { listCategoryArticles, categoryLabel, CATEGORIES } from "../../../lib/articles";
import { getCategory } from "../../../lib/topicHubs";

export const dynamic = "force-dynamic";

const SITE = "https://bridgechampions.com";
const CATEGORY_SUIT = { declarer: "♠", defence: "♥", bidding: "♦", beginner: "♣" };

export async function generateMetadata({ params }) {
  if (!CATEGORIES.includes(params.category)) {
    return { title: "Not found — Bridge Champions", robots: { index: false } };
  }
  const label = categoryLabel(params.category);
  return {
    title: `${label} — Learn Bridge | Bridge Champions`,
    alternates: { canonical: `${SITE}/learn/${params.category}` },
  };
}

export default async function CategoryHub({ params }) {
  if (!CATEGORIES.includes(params.category)) notFound();
  const tc = getCategory(params.category); // declarer/defence/bidding carry topics; beginner doesn't
  const hasTopics = !!(tc && Array.isArray(tc.topics) && tc.topics.length);
  const arts = hasTopics ? [] : await listCategoryArticles(params.category);
  arts.sort((a, b) => String(a.title).localeCompare(String(b.title)));

  return (
    <div className="lh-page">
      <nav className="th-breadcrumb" aria-label="Breadcrumb">
        <a href="/learn">Learn</a>
        <span className="sep" aria-hidden="true">&rsaquo;</span>
        <span>{categoryLabel(params.category)}</span>
      </nav>
      <section className={`lh-category lh-category--${params.category}`}>
        <div className="lh-categoryHead">
          <span className="lh-categoryBadge" aria-hidden="true">{CATEGORY_SUIT[params.category] || "♠"}</span>
          <h1 className="lh-categoryTitle">{categoryLabel(params.category)}</h1>
          <span className="lh-categoryCount">
            {hasTopics ? `${tc.topics.length} topics` : `${arts.length} lessons`}
          </span>
        </div>
        <div className="lh-grid">
          {hasTopics
            ? tc.topics.map((t) => (
                <a className="lh-card" href={`/learn/${params.category}/${t.slug}`} key={t.slug}>
                  <span className="lh-cardSuit" aria-hidden="true">{CATEGORY_SUIT[params.category] || "♠"}</span>
                  <h3 className="lh-cardName">{t.name}</h3>
                </a>
              ))
            : arts.map((a) => (
                <a className="lh-card" href={`/learn/${a.category}/${a.slug}`} key={a.slug}>
                  <span className="lh-cardSuit" aria-hidden="true">{CATEGORY_SUIT[params.category] || "♣"}</span>
                  <h3 className="lh-cardName">{a.title || a.slug}</h3>
                </a>
              ))}
        </div>
      </section>
    </div>
  );
}
