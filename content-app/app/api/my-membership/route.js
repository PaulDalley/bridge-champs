import admin from 'firebase-admin';
import { db } from '../../../lib/firestoreAdmin';

// Returns the viewer's effective tier for the Quick Tips gate:
//   'guest'   -> not logged in, or logged in with no active subscription
//   'basic'   -> active subscription, tier=basic
//   'premium' -> active subscription, tier=premium
//   'unknown' -> couldn't verify (client fails OPEN: no wall)
// Mirrors the subscription/tier logic in src/App.js (members collection).
export const dynamic = 'force-dynamic';

const RENEWAL_GRACE_MS = 3 * 24 * 60 * 60 * 1000; // 3-day renewal grace, same as the main app

function effectiveTier(data) {
  if (!data) return 'guest';
  const exp = data.subscriptionExpires;
  let expiresAt = 0;
  if (exp) {
    if (typeof exp.toMillis === 'function') expiresAt = exp.toMillis();
    else if (typeof exp.toDate === 'function') expiresAt = exp.toDate().getTime();
    else expiresAt = new Date(exp).getTime();
  }
  const hasValidExpiry = expiresAt + RENEWAL_GRACE_MS > Date.now();
  const explicitlyActive = data.subscriptionActive === true;
  const hasFutureExpiry = exp != null && hasValidExpiry;
  const active = (explicitlyActive && hasValidExpiry) || hasFutureExpiry;
  if (!active) return 'guest';
  const tier = typeof data.tier === 'string' ? data.tier.toLowerCase() : 'basic';
  return tier === 'premium' ? 'premium' : 'basic';
}

// Admins get full access with no subscription check, exactly like the CRA
// (src/store/actions/authActions.js): users/{uid}.OK === true, or the same
// UID allowlist. Keep the list in sync with authActions.js.
const ADMIN_UID_ALLOWLIST = new Set(['LGoDI1jEsidKRyN5aVvcTFA8Svb2']);

async function isAdmin(firestore, uid) {
  if (ADMIN_UID_ALLOWLIST.has(uid)) return true;
  try {
    const snap = await firestore.collection('users').doc(uid).get();
    return !!(snap.exists && snap.data().OK === true);
  } catch (e) {
    return false;
  }
}

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = body && body.token;
    if (!token) return Response.json({ tier: 'guest' });
    const firestore = db();
    const decoded = await admin.auth().verifyIdToken(token);
    const [memberSnap, adminFlag] = await Promise.all([
      firestore.collection('members').doc(decoded.uid).get(),
      isAdmin(firestore, decoded.uid),
    ]);
    if (adminFlag) return Response.json({ tier: 'premium' });
    return Response.json({ tier: effectiveTier(memberSnap.exists ? memberSnap.data() : null) });
  } catch (e) {
    return Response.json({ tier: 'unknown' });
  }
}
