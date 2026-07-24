// Detect a logged-in Firebase session from the CRA app (same origin).
//
// The CRA app uses Firebase v9 (firebase/compat), whose default auth
// persistence is IndexedDB (database "firebaseLocalStorageDb", object store
// "firebaseLocalStorage"), NOT localStorage as in v8. So checking localStorage
// alone misses every logged-in user. We check BOTH backends so it works no
// matter which one Firebase used. Read-only; never throws (resolves false on
// any error or if no session is found).
export async function detectMember() {
  // 1) localStorage — instant, used by v8 / forced LOCAL persistence.
  try {
    if (
      typeof localStorage !== 'undefined' &&
      Object.keys(localStorage).some((k) => k.startsWith('firebase:authUser:'))
    ) {
      return true;
    }
  } catch (_) {}

  // 2) IndexedDB — Firebase v9 default.
  try {
    if (typeof indexedDB === 'undefined') return false;
    return await new Promise((resolve) => {
      let settled = false;
      const done = (v) => {
        if (settled) return;
        settled = true;
        resolve(v);
      };
      // Never hang the UI if IndexedDB is slow/blocked.
      const timer = setTimeout(() => done(false), 1500);
      let req;
      try {
        req = indexedDB.open('firebaseLocalStorageDb');
      } catch (_) {
        clearTimeout(timer);
        return done(false);
      }
      req.onerror = () => {
        clearTimeout(timer);
        done(false);
      };
      req.onsuccess = () => {
        const db = req.result;
        try {
          if (!db.objectStoreNames.contains('firebaseLocalStorage')) {
            clearTimeout(timer);
            db.close();
            return done(false);
          }
          const store = db
            .transaction('firebaseLocalStorage', 'readonly')
            .objectStore('firebaseLocalStorage');
          const keysReq = store.getAllKeys();
          keysReq.onsuccess = () => {
            clearTimeout(timer);
            const keys = keysReq.result || [];
            db.close();
            done(keys.some((k) => String(k).startsWith('firebase:authUser:')));
          };
          keysReq.onerror = () => {
            clearTimeout(timer);
            db.close();
            done(false);
          };
        } catch (_) {
          clearTimeout(timer);
          try {
            db.close();
          } catch (e) {}
          done(false);
        }
      };
    });
  } catch (_) {
    return false;
  }
}

// Firebase web API key (public client key, same as the CRA's src/firebase/config.js).
// Needed to mint a fresh ID token from the stored refresh token.
const FIREBASE_API_KEY = 'AIzaSyCT-YNVbhvxt2UNttu36HZQvo3k2bgl3JY';

// ID tokens live ~1h. If the stored one is stale (which it almost always is for a
// returning visitor), exchange the stored refresh token for a fresh ID token via the
// securetoken endpoint — the same call the Firebase SDK makes. Without this, every
// returning visitor's token failed verifyIdToken and the tips gate failed OPEN,
// giving unlimited reels to anyone who had ever signed in (including lapsed members).
const EXPIRY_BUFFER_MS = 2 * 60 * 1000;

function tokenFromRecord(rec) {
  const m = rec && rec.stsTokenManager;
  if (!m || !m.accessToken) return null;
  return {
    accessToken: m.accessToken,
    refreshToken: m.refreshToken || null,
    expirationTime: Number(m.expirationTime) || 0,
    apiKey: rec.apiKey || FIREBASE_API_KEY,
  };
}

async function freshenToken(t) {
  if (!t) return null;
  if (t.expirationTime - EXPIRY_BUFFER_MS > Date.now()) return t.accessToken; // still fresh
  if (!t.refreshToken) return t.accessToken;
  try {
    const r = await fetch(`https://securetoken.googleapis.com/v1/token?key=${encodeURIComponent(t.apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `grant_type=refresh_token&refresh_token=${encodeURIComponent(t.refreshToken)}`,
    });
    if (r.ok) {
      const d = await r.json();
      if (d && d.id_token) return d.id_token;
    }
  } catch (_) {}
  // Refresh failed (offline / revoked): fall back to the stored token; the server
  // treats an unverifiable token as 'unknown' and the caller decides the limit.
  return t.accessToken;
}

// Returns a FRESH Firebase ID token for the logged-in user (from the same
// IndexedDB/localStorage session the CRA writes), or null if not logged in. The token
// is POSTed to /api/my-membership, which verifies it server-side and returns the tier.
// Read-only against the CRA's session store; never throws.
export async function getAuthToken() {
  try {
    if (typeof localStorage !== 'undefined') {
      const k = Object.keys(localStorage).find((x) => x.startsWith('firebase:authUser:'));
      if (k) {
        const t = tokenFromRecord(JSON.parse(localStorage.getItem(k) || '{}'));
        if (t) return await freshenToken(t);
      }
    }
  } catch (_) {}

  try {
    if (typeof indexedDB === 'undefined') return null;
    return await new Promise((resolve) => {
      let settled = false;
      const done = (v) => { if (!settled) { settled = true; resolve(v); } };
      const timer = setTimeout(() => done(null), 1500);
      let req;
      try {
        req = indexedDB.open('firebaseLocalStorageDb');
      } catch (_) {
        clearTimeout(timer);
        return done(null);
      }
      req.onerror = () => { clearTimeout(timer); done(null); };
      req.onsuccess = () => {
        const idb = req.result;
        try {
          if (!idb.objectStoreNames.contains('firebaseLocalStorage')) {
            clearTimeout(timer);
            idb.close();
            return done(null);
          }
          const store = idb
            .transaction('firebaseLocalStorage', 'readonly')
            .objectStore('firebaseLocalStorage');
          const allReq = store.getAll();
          allReq.onsuccess = () => {
            clearTimeout(timer);
            const rows = allReq.result || [];
            idb.close();
            const row = rows.find(
              (r) => r && typeof r.fbase_key === 'string' && r.fbase_key.startsWith('firebase:authUser:')
            );
            const t = tokenFromRecord(row && row.value);
            if (!t) return done(null);
            freshenToken(t).then((tok) => done(tok || null)).catch(() => done(t.accessToken));
          };
          allReq.onerror = () => { clearTimeout(timer); idb.close(); done(null); };
        } catch (_) {
          clearTimeout(timer);
          try { idb.close(); } catch (e) {}
          done(null);
        }
      };
    });
  } catch (_) {
    return null;
  }
}
