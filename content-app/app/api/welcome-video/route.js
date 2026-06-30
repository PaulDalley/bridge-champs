import { db } from '../../../lib/firestoreAdmin';

// Welcome-video URL for the guest hero, fetched client-side (WelcomeVideo) so it's
// not baked empty into the static build render — same build-no-creds issue as the
// recent-articles list. Runtime only; memoized 10 min.
export const dynamic = 'force-dynamic';

function youTubeEmbed(url) {
  if (!url) return '';
  let id = '';
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      id = u.pathname.slice(1).split('/')[0];
    } else if (u.hostname.includes('youtube.com')) {
      id = u.searchParams.get('v') || '';
      if (!id) {
        const m = u.pathname.match(/^\/(embed|shorts)\/([\w-]+)/);
        if (m) id = m[2];
      }
    }
  } catch (_) {}
  return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : '';
}

let memo = { at: 0, embed: '' };

export async function GET() {
  const now = Date.now();
  if (memo.at && now - memo.at < 600000) {
    return Response.json({ embed: memo.embed });
  }
  let embed = '';
  let ok = false;
  try {
    const snap = await db().collection('siteSettings').doc('welcomeVideo').get();
    ok = true;
    if (snap.exists) embed = youTubeEmbed((snap.data() || {}).url || '');
  } catch (_) {}
  if (ok) memo = { at: now, embed }; // cache a real read (incl. legit "no video"), not a transient failure
  return Response.json({ embed });
}
