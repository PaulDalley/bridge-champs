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
