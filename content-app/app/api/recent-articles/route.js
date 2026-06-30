import { listAllArticles, categoryLabel } from '../../../lib/articles';

// Member-only "Recently added" data for the homepage. Fetched client-side by
// HomeAuth so it is NEVER baked into the homepage's static build render — the
// Cloud Build environment has no Firestore creds (see firestoreAdmin.js), so
// anything read at build comes back empty and used to get frozen into the page
// for up to an hour after every deploy. This route runs at RUNTIME (the Cloud Run
// service account has creds) and memoizes for 10 minutes so repeat loads don't
// hammer Firestore (listAllArticles scans every article collection).
export const dynamic = 'force-dynamic';

let memo = { at: 0, data: [] };

export async function GET() {
  const now = Date.now();
  if (memo.data.length && now - memo.at < 600000) {
    return Response.json({ recent: memo.data });
  }
  let recent = [];
  try {
    const all = await listAllArticles();
    recent = all
      .filter((a) => a.updatedAt)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 8)
      .map((a) => ({
        title: a.title,
        href: `/learn/${a.category}/${a.slug}`,
        category: categoryLabel(a.category),
      }));
  } catch (_) {}
  if (recent.length) memo = { at: now, data: recent };
  return Response.json({ recent });
}
