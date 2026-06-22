import admin from "firebase-admin";

// Credentials, in order of preference:
//   1. FIREBASE_SERVICE_ACCOUNT  — full service-account JSON (string) in env
//   2. GOOGLE_APPLICATION_CREDENTIALS — path to a key file (Admin SDK default)
//   3. applicationDefault() — the Cloud Run runtime service account (prod)
// If none resolve (e.g. local build with no creds), Firestore reads throw and the
// callers below catch them, so `next build` still succeeds (pages become on-demand ISR).
const PROJECT_ID = "bridgechampions";

let app = null;

function getApp() {
  if (app) return app;
  if (admin.apps.length) {
    app = admin.app();
    return app;
  }
  try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const sa = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      app = admin.initializeApp({
        credential: admin.credential.cert(sa),
        projectId: PROJECT_ID,
      });
    } else {
      app = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: PROJECT_ID,
      });
    }
  } catch (_) {
    // Last resort so init never throws at import time; reads will simply fail
    // and callers fall back gracefully.
    app = admin.initializeApp({ projectId: PROJECT_ID });
  }
  return app;
}

export function db() {
  return getApp().firestore();
}
