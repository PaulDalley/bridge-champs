import { notFound } from "next/navigation";
import { listCategoryArticles, categoryLabel, CATEGORIES } from "../../../lib/articles";
import { getCategory } from "../../../lib/topicHubs";

export const dynamic = "force-dynamic";

const SITE = "https://bridgechampions.com";
const OG_IMAGE = "https://firebasestorage.googleapis.com/v0/b/bridgechampions.appspot.com/o/logo.png?alt=media&token=583808ab-2c3b-49a6-8936-82dffe55ec95";
const CATEGORY_SUIT = { declarer: "♠", defence: "♥", bidding: "♦", beginner: "♣" };
const smartTrim = (s, max) => { const t = String(s || ""); if (t.length <= max) return t; const cut = t.slice(0, max); const at = cut.lastIndexOf(" "); return (at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[\s,;:.!-]+$/, "") + "…"; };

export async function generateMetadata({ params }) {
  if (!CATEGORIES.includes(params.category)) {
    return { title: "Not found — Bridge Champions", robots: { index: false } };
  }
  const label = categoryLabel(params.category);
  const tc = getCategory(params.category);
  const names = tc && Array.isArray(tc.topics) ? tc.topics.map((t) => t.name) : [];
  const title = `${label} — Learn Bridge | Bridge Champions`;
  const description = smartTrim(`${label} lessons on Bridge Champions${names.length ? " — " + names.slice(0, 5).join(", ") : ""}.`, 155);
  const url = `${SITE}/learn/${params.category}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", url, title, description, siteName: "Bridge Champions", images: [{ url: OG_IMAGE, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
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
