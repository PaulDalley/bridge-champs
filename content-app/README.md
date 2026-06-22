# bridgechampions content app (Next.js)

Phase-1 SEO content layer for **bridgechampions.com**: server-renders `/learn/**`
(articles + category hubs) from Firestore with the Admin SDK, so crawlers get real HTML
with **no client-side database fetch**. Fixes the "indexed-but-empty-skeleton" problem at
the source (see `../docs/seo-rebuild-plan.md`).

The existing CRA SPA keeps serving everything outside `/learn/**` (home, trainers,
Just-Play, auth, checkout). One domain; Firebase Hosting routes by path.

## URLs
- `/learn/<category>/<slug>` — article (categories: `bidding`, `declarer`, `defence`, `beginner`)
- `/learn/<category>` — category hub
- `/sitemap.xml`, `/robots.txt`
- `POST /api/revalidate?secret=…&path=/learn/…` — on-demand ISR (call from the admin editor on publish)

## Local dev
```bash
cd content-app
npm install
# creds for Firestore reads (else pages build but render empty until creds exist):
cp .env.example .env       # set GOOGLE_APPLICATION_CREDENTIALS or FIREBASE_SERVICE_ACCOUNT
npm run dev                # http://localhost:3001/learn/bidding/reverses
```
`next build` succeeds without creds (Firestore reads fail-soft → pages become on-demand ISR).

## Rendering status
The article body is currently rendered as raw HTML (`dangerouslySetInnerHTML`). **Next task:**
port the CRA body renderer (`src/helpers` `parseDocumentIntoJSX` + interweave `<Markup>` +
`MakeBoard`) so `<MakeBoard .../>` tags become real board SVGs. Everything else (metadata,
canonical, JSON-LD, breadcrumbs, sitemap, ISR) is wired.

## Deploy (Firebase Hosting + Cloud Run)
A `Dockerfile` (standalone output, listens on `$PORT`/8080) is included. The image builds
WITHOUT Firestore creds — pages render on-demand via ISR using the Cloud Run runtime service
account, so no key ships in the image.

1. **Build + deploy the Cloud Run service** (from `content-app/`):
   ```bash
   gcloud run deploy bc-content \
     --source . --region us-central1 --project bridgechampions \
     --allow-unauthenticated --port 8080 \
     --set-env-vars REVALIDATE_SECRET=<random-secret>
   ```
   Grant the service's runtime service account the **Cloud Datastore/Firestore User** role
   (read) so `applicationDefault()` can read article collections.

2. **Wire Firebase Hosting + 301s.** `node ../scripts/gen-firebase-cutover.js` writes
   `firebase-cutover-snippet.json` (3 rewrites + 102 `301`s). Merge into `../firebase.json`:
   - prepend the rewrites to `hosting.rewrites` **before** the `"**" -> "/_shell.html"` rule
   - append the redirects to `hosting.redirects`
   Then `firebase deploy --only hosting`. **Do this only once `bc-content` is live** (the 301s
   point at `/learn/*`). The old article URLs are outside `/learn`, so Firebase 301s them
   before either app sees them.

3. **Revalidate webhook.** In the CRA admin editor, on publish/edit POST to
   `https://bridgechampions.com/api/revalidate?secret=<secret>&path=/learn/<category>/<slug>`
   so edits go live in seconds.

4. **GSC.** Resubmit the sitemap and run **Validate Fix** on the duplicate / soft-404 /
   "crawled-currently-not-indexed" groups.

Regenerate the URL map + cutover snippet whenever articles change:
`node ../scripts/gen-redirect-map.js && node ../scripts/gen-firebase-cutover.js`.

## Notes
- The Firebase backend, Cloud Functions, Stripe/PayPal, BEN engine, and Firestore are
  untouched — only content rendering changes.
- Keep the collection→category map in `lib/articles.js` in sync with
  `../scripts/gen-redirect-map.js`.
