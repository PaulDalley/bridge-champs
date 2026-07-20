/**
 * List the @BridgeChampions channel's latest uploads (including UNLISTED) via the
 * YouTube Data API, so reel videoIds can be filled into content-app/lib/quickTips.js
 * without hand-pasting links.
 *
 * One-time setup:
 *   1. OAuth client (Desktop app) created in the bridgechampions GCP project.
 *   2. Put its client_id/client_secret in scripts/_youtube-oauth.json (gitignored):
 *        { "client_id": "...", "client_secret": "..." }
 *   3. `node scripts/_youtube-latest.js auth`  → opens the consent URL; sign in with
 *      the Google account that OWNS the YouTube channel and Allow. The refresh token
 *      is saved back into _youtube-oauth.json and reused forever after.
 *
 * Then any time:
 *   `node scripts/_youtube-latest.js`           → latest 25 uploads (id · privacy · title)
 *   `node scripts/_youtube-latest.js 50`        → latest 50
 */
const fs = require("fs");
const path = require("path");
const http = require("http");

const CFG_PATH = path.join(__dirname, "_youtube-oauth.json");
const REDIRECT_PORT = 8123;
const REDIRECT_URI = `http://127.0.0.1:${REDIRECT_PORT}`;
const SCOPE = "https://www.googleapis.com/auth/youtube.readonly";

function cfg() {
  if (!fs.existsSync(CFG_PATH)) {
    console.error(`Missing ${CFG_PATH} — create it with {"client_id":"...","client_secret":"..."}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(CFG_PATH, "utf8"));
}

async function tokenRequest(params) {
  const r = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(params).toString(),
  });
  const d = await r.json();
  if (d.error) throw new Error(`token endpoint: ${d.error} ${d.error_description || ""}`);
  return d;
}

async function auth() {
  const c = cfg();
  const url =
    "https://accounts.google.com/o/oauth2/v2/auth" +
    `?client_id=${encodeURIComponent(c.client_id)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    "&response_type=code" +
    `&scope=${encodeURIComponent(SCOPE)}` +
    "&access_type=offline&prompt=consent";
  console.log("\nOpen this URL in the browser signed into the channel-owner account:\n");
  console.log(url + "\n");
  console.log(`Waiting for the consent redirect on ${REDIRECT_URI} …`);
  const code = await new Promise((resolve, reject) => {
    const srv = http.createServer((req, res) => {
      const u = new URL(req.url, REDIRECT_URI);
      const codeParam = u.searchParams.get("code");
      const err = u.searchParams.get("error");
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end("<h2>Done — you can close this tab and go back to the terminal.</h2>");
      if (codeParam) { srv.close(); resolve(codeParam); }
      else if (err) { srv.close(); reject(new Error("consent error: " + err)); }
    });
    srv.listen(REDIRECT_PORT, "127.0.0.1");
  });
  const tok = await tokenRequest({
    code, client_id: c.client_id, client_secret: c.client_secret,
    redirect_uri: REDIRECT_URI, grant_type: "authorization_code",
  });
  if (!tok.refresh_token) throw new Error("no refresh_token returned (revoke prior grant and retry)");
  fs.writeFileSync(CFG_PATH, JSON.stringify({ ...c, refresh_token: tok.refresh_token }, null, 2));
  console.log("\n✓ Refresh token saved. `node scripts/_youtube-latest.js` now works any time.");
}

async function accessToken() {
  const c = cfg();
  if (!c.refresh_token) {
    console.error("No refresh_token yet — run: node scripts/_youtube-latest.js auth");
    process.exit(1);
  }
  const tok = await tokenRequest({
    client_id: c.client_id, client_secret: c.client_secret,
    refresh_token: c.refresh_token, grant_type: "refresh_token",
  });
  return tok.access_token;
}

async function api(pathAndQuery, at) {
  const r = await fetch(`https://www.googleapis.com/youtube/v3/${pathAndQuery}`, {
    headers: { Authorization: `Bearer ${at}` },
  });
  const d = await r.json();
  if (d.error) throw new Error(`${pathAndQuery}: ${d.error.code} ${d.error.message}`);
  return d;
}

async function list(maxResults) {
  const at = await accessToken();
  const ch = await api("channels?part=contentDetails,snippet&mine=true", at);
  const chan = ch.items && ch.items[0];
  if (!chan) throw new Error("no channel on this account — did you consent with the channel-owner account?");
  const uploads = chan.contentDetails.relatedPlaylists.uploads;
  console.log(`Channel: ${chan.snippet.title}  (uploads playlist ${uploads})\n`);
  const items = await api(`playlistItems?part=snippet,status&playlistId=${uploads}&maxResults=${maxResults}`, at);
  for (const it of items.items || []) {
    const id = it.snippet.resourceId.videoId;
    const when = (it.snippet.publishedAt || "").slice(0, 10);
    const priv = (it.status && it.status.privacyStatus) || "?";
    console.log(`${id}  ${when}  [${priv}]  ${it.snippet.title}`);
  }
}

const arg = process.argv[2];
(arg === "auth" ? auth() : list(/^\d+$/.test(arg) ? arg : 25)).catch((e) => {
  console.error("FAILED:", e.message);
  process.exit(1);
});
