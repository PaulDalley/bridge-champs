import { notFound } from "next/navigation";
import { getArticle, listAllArticles, categoryLabel } from "../../../../lib/articles";
import { renderBody } from "../../../../lib/renderBody";
import { getTopic, getTopicForSlug } from "../../../../lib/topicHubs";
import TopicHub from "../../../../components/TopicHub";

export const revalidate = 3600; // ISR: refresh hourly; on-demand revalidate on publish
export const dynamicParams = true; // unknown slugs render on first request, then cache

const BASE = "https://bridgechampions.com";
const clean = (s) =>
  String(s || "").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();

export async function generateStaticParams() {
  const arts = await listAllArticles();
  return arts.map((a) => ({ category: a.category, slug: a.slug }));
}

// slug -> new /learn URL, used to remap a topic hub's curated article links.
async function slugToNewMap() {
  const arts = await listAllArticles();
  const map = {};
  arts.forEach((a) => {
    map[a.slug] = `/learn/${a.category}/${a.slug}`;
  });
  return map;
}

export async function generateMetadata({ params }) {
  // A second segment that is a known topic = a topic hub, not an article.
  const topic = getTopic(params.category, params.slug);
  if (topic) {
    const url = `${BASE}/learn/${params.category}/${params.slug}`;
    return {
      title: `${topic.name} — ${categoryLabel(params.category)} | Bridge Champions`,
      alternates: { canonical: url },
    };
  }
  const a = await getArticle(params.category, params.slug);
  if (!a) {
    return { title: "Article not found — Bridge Champions", robots: { index: false, follow: true } };
  }
  const url = `${BASE}/learn/${a.category}/${a.slug}`;
  const title = a.meta.metaTitle || `${a.meta.title} - Bridge Champions`;
  const description = (clean(a.meta.teaser) || clean(a.bodyHtml)).slice(0, 158);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: a.meta.title, description, siteName: "Bridge Champions" },
    twitter: { card: "summary_large_image", title: a.meta.title, description },
  };
}

export default async function ArticleOrTopicPage({ params }) {
  // Topic hub (e.g. /learn/bidding/conventions)
  const topic = getTopic(params.category, params.slug);
  if (topic) {
    const slugToNew = await slugToNewMap();
    const url = `${BASE}/learn/${params.category}/${params.slug}`;
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${BASE}/` },
        { "@type": "ListItem", position: 2, name: "Learn", item: `${BASE}/learn` },
        { "@type": "ListItem", position: 3, name: categoryLabel(params.category), item: `${BASE}/learn/${params.category}` },
        { "@type": "ListItem", position: 4, name: topic.name, item: url },
      ],
    };
    return (
      <main className="bc-main">
        <nav className="bc-breadcrumb" aria-label="Breadcrumb">
          <a href="/learn">Learn</a> {" / "}
          <a href={`/learn/${params.category}`}>{categoryLabel(params.category)}</a> {" / "}
          <span aria-current="page">{topic.name}</span>
        </nav>
        <TopicHub topic={topic} slugToNew={slugToNew} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      </main>
    );
  }

  // Article
  const a = await getArticle(params.category, params.slug);
  if (!a) notFound();
  const url = `${BASE}/learn/${a.category}/${a.slug}`;
  const topicCrumb = getTopicForSlug(a.slug);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.meta.title,
    datePublished: a.createdAt || undefined,
    dateModified: a.updatedAt || undefined,
    author: { "@type": "Person", name: "Paul Dalley", url: `${BASE}/about` },
    publisher: { "@type": "Organization", name: "Bridge Champions", url: BASE },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  const crumbs = [
    { name: "Home", item: `${BASE}/` },
    { name: "Learn", item: `${BASE}/learn` },
    { name: categoryLabel(a.category), item: `${BASE}/learn/${a.category}` },
    ...(topicCrumb ? [{ name: topicCrumb.topicName, item: `${BASE}${topicCrumb.hubPath}` }] : []),
    { name: a.meta.title, item: url },
  ];
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.item })),
  };

  const updatedLabel = a.updatedAt
    ? new Date(a.updatedAt).toLocaleDateString("en-AU", { year: "numeric", month: "long", day: "numeric" })
    : null;

  return (
    <main className="bc-main">
      <nav className="bc-breadcrumb" aria-label="Breadcrumb">
        <a href="/learn">Learn</a> {" / "}
        <a href={`/learn/${a.category}`}>{categoryLabel(a.category)}</a> {" / "}
        {topicCrumb ? (
          <>
            <a href={topicCrumb.hubPath}>{topicCrumb.topicName}</a> {" / "}
          </>
        ) : null}
        <span aria-current="page">{a.meta.title}</span>
      </nav>
      <h1 className="bc-title">{a.meta.title}</h1>
      {updatedLabel ? (
        <div className="bc-byline">
          By <a href="/about">Paul Dalley</a> · Updated{" "}
          <time dateTime={a.updatedAt}>{updatedLabel}</time>
        </div>
      ) : null}
      <article aria-label="Article content">{renderBody(a.bodyHtml)}</article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </main>
  );
}
