import { notFound } from "next/navigation";
import { listCategoryArticles, categoryLabel, CATEGORIES } from "../../../lib/articles";

export const revalidate = 3600;
export const dynamicParams = true;

const BASE = "https://bridgechampions.com";

export async function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

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
  const arts = await listCategoryArticles(params.category);
  arts.sort((a, b) => String(a.title).localeCompare(String(b.title)));
  return (
    <main className="bc-main">
      <nav className="bc-breadcrumb" aria-label="Breadcrumb">
        <a href="/learn">Learn</a> {" / "}
        <span aria-current="page">{categoryLabel(params.category)}</span>
      </nav>
      <h1 className="bc-hub-title">{categoryLabel(params.category)}</h1>
      <ul className="bc-cat-list">
        {arts.map((a) => (
          <li key={`${a.category}/${a.slug}`}>
            <a href={`/learn/${a.category}/${a.slug}`}>{a.title || a.slug}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
