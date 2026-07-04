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

// Returns the logged-in user's Firebase ID token (from the same IndexedDB/localStorage
// session the CRA writes), or null if not logged in. The token is POSTed to
// /api/my-membership, which verifies it server-side and returns the tier. Read-only,
// never throws. Note: the token can be stale (~1h); a stale token verifies as
// 'unknown' server-side and the caller fails OPEN (no wall).
export async function getAuthToken() {
  try {
    if (typeof localStorage !== 'undefined') {
      const k = Object.keys(localStorage).find((x) => x.startsWith('firebase:authUser:'));
      if (k) {
        const u = JSON.parse(localStorage.getItem(k) || '{}');
        const t = u && u.stsTokenManager && u.stsTokenManager.accessToken;
        if (t) return t;
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
            const t = row && row.value && row.value.stsTokenManager && row.value.stsTokenManager.accessToken;
            done(t || null);
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
