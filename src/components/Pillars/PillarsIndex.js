import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import database from "../../firebase/config";
import "./PillarsIndex.css";

// Path prefix per summary collection (mirrors getListPathForArticleType in
// DisplayCategoryArticle.js). New collections can be added here.
const COLLECTIONS = [
  { summary: "cardPlay",         pathPrefix: "/declarer/articles",          label: "Declarer (Learn)" },
  { summary: "defence",          pathPrefix: "/defence/articles",           label: "Defence (Learn)" },
  { summary: "bidding",          pathPrefix: "/bidding/advanced",           label: "Bidding (legacy)" },
  { summary: "biddingAdvanced",  pathPrefix: "/bidding/advanced",           label: "Bidding Advanced" },
  { summary: "biddingBasics",    pathPrefix: "/bidding/basics",             label: "Bidding Basics" },
  { summary: "counting",         pathPrefix: "/counting/articles",          label: "Counting" },
  { summary: "beginnerCardPlay", pathPrefix: "/beginner/articles/declarer", label: "Beginner Declarer" },
  { summary: "beginnerDefence",  pathPrefix: "/beginner/articles/defence",  label: "Beginner Defence" },
  { summary: "beginnerBidding",  pathPrefix: "/beginner/articles/bidding",  label: "Beginner Bidding" },
];

function getBodyId(summaryData, summaryDocId) {
  const body = summaryData?.body;
  if (typeof body === "string" && body) return body;
  if (body && typeof body.id === "string") return body.id;
  return summaryDocId;
}

const PillarsIndex = () => {
  const a = useSelector((state) => state.auth.a);
  const uid = useSelector((state) => state.auth.uid);
  const isAdmin = a === true;
  const [loading, setLoading] = useState(true);
  const [pillars, setPillars] = useState([]);
  const [error, setError] = useState("");
  const [publishingId, setPublishingId] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const collected = [];
      for (const cfg of COLLECTIONS) {
        const snap = await database
          .collection(cfg.summary)
          .where("isHidden", "==", true)
          .get();
        snap.forEach((doc) => {
          const data = doc.data() || {};
          const bodyId = getBodyId(data, doc.id);
          collected.push({
            summaryId: doc.id,
            bodyId,
            title: data.title || "(untitled)",
            teaser: data.teaser || "",
            collectionSummary: cfg.summary,
            collectionLabel: cfg.label,
            pathPrefix: cfg.pathPrefix,
            url: `${cfg.pathPrefix}/${bodyId}`,
            editUrl: `/edit-article-v2/${cfg.summary}/${doc.id}`,
            createdAt: data.createdAt || null,
            updatedAt: data.updatedAt || null,
            isPillar: data.isPillar === true,
          });
        });
      }
      collected.sort((x, y) =>
        String(x.title).localeCompare(String(y.title))
      );
      setPillars(collected);
    } catch (err) {
      console.error("Failed to load pillars:", err);
      setError(err.message || "Failed to load pillars.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    refresh();
  }, [isAdmin, refresh]);

  const handlePublish = async (pillar) => {
    if (!isAdmin) return;
    const ok = window.confirm(
      `Publish "${pillar.title}"?\n\nThis flips isHidden to false. The article will become publicly visible at ${pillar.url} after the next deploy (CI re-runs the sitemap + prerender).`
    );
    if (!ok) return;
    setPublishingId(pillar.summaryId);
    try {
      await database
        .collection(pillar.collectionSummary)
        .doc(pillar.summaryId)
        .update({
          isHidden: false,
          publishedFromPillarsAt: new Date().toISOString(),
        });
      await refresh();
      window.alert(
        `Published. Push any commit (or wait for the next deploy) to regenerate the sitemap and prerender the new public URL.`
      );
    } catch (err) {
      console.error("Publish failed:", err);
      window.alert(`Publish failed: ${err.message || err}`);
    } finally {
      setPublishingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="PillarsIndex">
        <Helmet>
          <title>Pillars (admin only) — Bridge Champions</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <div className="PillarsIndex-card">
          <h1>Pillars</h1>
          <p>
            This is an admin-only drafting area. {uid ? "Your account is not an admin." : "Sign in to continue."}
          </p>
          <p>
            <Link to="/" className="PillarsIndex-link">Return home</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="PillarsIndex">
      <Helmet>
        <title>Pillars (drafts) — Bridge Champions</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <header className="PillarsIndex-header">
        <h1>Pillar drafts</h1>
        <p className="PillarsIndex-sub">
          Hidden long-form articles in progress. They are excluded from the sitemap, return 404 to non-admins, and are not crawled. Click a row to preview the live URL (as an admin you can read it) or jump to the editor. Hit “Publish” when a pillar is ready to go public — it flips <code>isHidden</code> to <code>false</code> and the next deploy will add it to the sitemap and prerender it.
        </p>
        <button
          type="button"
          className="PillarsIndex-refresh"
          onClick={refresh}
          disabled={loading}
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </header>

      {error && <div className="PillarsIndex-error">{error}</div>}

      {!loading && pillars.length === 0 && (
        <div className="PillarsIndex-empty">
          <p>No hidden drafts yet.</p>
          <p>
            Pillars get created by the publish scripts in <code>scripts/</code>. After a publish you’ll see the new draft listed here.
          </p>
        </div>
      )}

      {pillars.length > 0 && (
        <ul className="PillarsIndex-list">
          {pillars.map((p) => (
            <li key={`${p.collectionSummary}/${p.summaryId}`} className="PillarsIndex-item">
              <div className="PillarsIndex-itemHead">
                <h2 className="PillarsIndex-itemTitle">{p.title}</h2>
                <span className="PillarsIndex-itemBadge">
                  {p.isPillar ? "pillar" : "draft"} · {p.collectionLabel}
                </span>
              </div>
              {p.teaser && (
                <p className="PillarsIndex-itemTeaser">{p.teaser}</p>
              )}
              <div className="PillarsIndex-itemActions">
                <Link
                  to={p.url}
                  className="PillarsIndex-btn PillarsIndex-btn--primary"
                >
                  Read draft →
                </Link>
                <Link to={p.editUrl} className="PillarsIndex-btn">
                  Edit
                </Link>
                <button
                  type="button"
                  className="PillarsIndex-btn PillarsIndex-btn--publish"
                  onClick={() => handlePublish(p)}
                  disabled={publishingId === p.summaryId}
                >
                  {publishingId === p.summaryId ? "Publishing…" : "Publish (unhide)"}
                </button>
                <code className="PillarsIndex-url">{p.url}</code>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PillarsIndex;
