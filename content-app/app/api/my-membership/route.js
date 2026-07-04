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

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = body && body.token;
    if (!token) return Response.json({ tier: 'guest' });
    const firestore = db();
    const decoded = await admin.auth().verifyIdToken(token);
    const snap = await firestore.collection('members').doc(decoded.uid).get();
    return Response.json({ tier: effectiveTier(snap.exists ? snap.data() : null) });
  } catch (e) {
    return Response.json({ tier: 'unknown' });
  }
}
