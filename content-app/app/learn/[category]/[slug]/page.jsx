import { notFound } from "next/navigation";
import { getArticle, listAllArticles, categoryLabel } from "../../../../lib/articles";
import { renderBody } from "../../../../lib/renderBody";
import { getTopic, getTopicForSlug, getCategory } from "../../../../lib/topicHubs";
import TopicHub from "../../../../components/TopicHub";
import { reelForArticle } from "../../../../lib/articleReels";
import ReelChip from "../../../../components/ReelChip";

export const revalidate = 3600; // ISR: refresh hourly; on-demand revalidate on publish
export const dynamicParams = true; // unknown slugs render on first request, then cache

const BASE = "https://bridgechampions.com";
const OG_IMAGE =
  "https://firebasestorage.googleapis.com/v0/b/bridgechampions.appspot.com/o/logo.png?alt=media&token=583808ab-2c3b-49a6-8936-82dffe55ec95";
const AUTHOR_SAMEAS = ["https://www.youtube.com/@BridgeChampions"];
const clean = (s) =>
  String(s || "").replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/gi, " ").replace(/\s+/g, " ").trim();
// Trim to ~max chars on a word boundary; ellipsis only when actually cut.
const smartTrim = (s, max) => {
  const t = String(s || "");
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const at = cut.lastIndexOf(" ");
  return (at > max * 0.6 ? cut.slice(0, at) : cut).replace(/[\s,;:.!-]+$/, "") + "…";
};
const lastSeg = (p) => String(p || "").split("/").filter(Boolean).pop();
// Flatten a topic hub's articles whether it uses groups or a flat list.
const hubArticleList = (topic) => (topic.groups ? topic.groups.flatMap((g) => g.articles || []) : topic.articles || []);
// Hub meta description: reuse the author's intro prose if present (his words,
// already on the page); otherwise a navigational summary built from his titles.
const hubDescription = (topic) => {
  const intro = clean(topic.intro);
  if (intro) return smartTrim(intro, 155);
  const titles = hubArticleList(topic).map((a) => a.title).filter(Boolean);
  return smartTrim(`${topic.name} guides and worked examples on Bridge Champions: ${titles.slice(0, 3).join(", ")}${titles.length > 3 ? " and more" : ""}.`, 155);
};

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
    const hubTitle = `${topic.name} — ${categoryLabel(params.category)} | Bridge Champions`;
    const description = hubDescription(topic);
    return {
      title: hubTitle,
      description,
      alternates: { canonical: url },
      openGraph: { type: "website", url, title: hubTitle, description, siteName: "Bridge Champions", images: [{ url: OG_IMAGE, width: 1200, height: 630 }] },
      twitter: { card: "summary_large_image", title: hubTitle, description, images: [OG_IMAGE] },
    };
  }
  const a = await getArticle(params.category, params.slug);
  if (!a) {
    return { title: "Article not found — Bridge Champions", robots: { index: false, follow: true } };
  }
  const url = `${BASE}/learn/${a.category}/${a.slug}`;
  const title = a.meta.metaTitle || `${a.meta.title} - Bridge Champions`;
  const description = smartTrim(clean(a.meta.teaser) || clean(a.bodyHtml), 155);
  const images = [{ url: OG_IMAGE, width: 1200, height: 630, alt: a.meta.title }];
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title, description, siteName: "Bridge Champions", images },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}

// If the article has a paired reel (lib/articleReels.js), insert the chip just
// above the body's "Read next:" footer — after the body when no footer exists.
function renderArticleWithReel(bodyHtml, slug) {
  const reel = reelForArticle(slug);
  if (!reel) return renderBody(bodyHtml);
  const html = String(bodyHtml || "");
  const i = html.lastIndexOf("<p><strong>Read next:");
  if (i === -1) {
    return (<>{renderBody(html)}<ReelChip reel={reel} /></>);
  }
  return (<>{renderBody(html.slice(0, i))}<ReelChip reel={reel} />{renderBody(html.slice(i))}</>);
}

export default async function ArticleOrTopicPage({ params }) {
  // Topic hub (e.g. /learn/bidding/conventions)
  const topic = getTopic(params.category, params.slug);
  if (topic) {
    const cat = getCategory(params.category);
    const slugToNew = await slugToNewMap();
    const url = `${BASE}/learn/${params.category}/${params.slug}`;
    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Learn", item: `${BASE}/learn` },
        { "@type": "ListItem", position: 2, name: cat.label, item: `${BASE}/learn/${params.category}` },
        { "@type": "ListItem", position: 3, name: topic.name, item: url },
      ],
    };
    const hubArts = hubArticleList(topic);
    const collectionLd = {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "@id": `${url}#collection`,
      name: topic.name,
      url,
      isPartOf: { "@type": "WebSite", name: "Bridge Champions", url: BASE },
      mainEntity: {
        "@type": "ItemList",
        itemListElement: hubArts.map((a, i) => ({ "@type": "ListItem", position: i + 1, name: a.title, url: `${BASE}${slugToNew[lastSeg(a.to)] || a.to}` })),
      },
    };
    return (
      <>
        <TopicHub cat={cat} topic={topic} slugToNew={slugToNew} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }} />
      </>
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
    description: clean(a.meta.teaser) || undefined,
    image: [OG_IMAGE],
    inLanguage: "en-AU",
    datePublished: a.createdAt || undefined,
    dateModified: a.updatedAt || undefined,
    author: { "@type": "Person", name: "Paul Dalley", url: `${BASE}/about`, sameAs: AUTHOR_SAMEAS },
    publisher: {
      "@type": "Organization",
      name: "Bridge Champions",
      url: BASE,
      logo: { "@type": "ImageObject", url: OG_IMAGE, width: 1200, height: 630 },
      sameAs: AUTHOR_SAMEAS,
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    // Declare the topic hub as this article's parent collection so the hub —
    // not the individual parts — is the page that owns the topic query.
    ...(topicCrumb
      ? {
          isPartOf: {
            "@type": "CollectionPage",
            "@id": `${BASE}${topicCrumb.hubPath}#collection`,
            name: topicCrumb.topicName,
            url: `${BASE}${topicCrumb.hubPath}`,
          },
        }
      : {}),
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
      <div className="bc-byline">
        By <a href="/about">Paul Dalley</a>
        {updatedLabel ? (
          <>
            {" · Updated "}
            <time dateTime={a.updatedAt}>{updatedLabel}</time>
          </>
        ) : null}
      </div>
      <article aria-label="Article content">{renderArticleWithReel(a.bodyHtml, params.slug)}</article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
    </main>
  );
}
