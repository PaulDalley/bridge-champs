import { listAllArticles, CATEGORIES } from "../lib/articles";
import { CATEGORIES as TOPIC_CATS } from "../lib/topicHubs";

// Read Firestore at request time (the Cloud Run runtime SA has access); the
// build runs without creds, so a static sitemap would be empty.
export const dynamic = "force-dynamic";

const BASE = "https://bridgechampions.com";

// NOTE: in Phase 1 the Next app only owns /learn/**, so this sitemap covers the
// content surface. When home/about move to Next (Phase 3), merge or split sitemaps.
export default async function sitemap() {
  const arts = await listAllArticles();
  const hubs = [
    { url: `${BASE}/learn`, changeFrequency: "daily", priority: 0.9 },
    ...CATEGORIES.map((c) => ({
      url: `${BASE}/learn/${c}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
  const topicHubs = TOPIC_CATS.flatMap((c) =>
    (c.topics || []).map((t) => ({
      url: `${BASE}/learn/${c.key}/${t.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }))
  );
  const articles = arts.map((a) => ({
    url: `${BASE}/learn/${a.category}/${a.slug}`,
    lastModified: a.updatedAt || undefined,
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  return [...hubs, ...topicHubs, ...articles];
}
