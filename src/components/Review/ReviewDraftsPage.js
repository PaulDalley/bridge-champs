import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { REVIEW_DRAFT_ARTICLES } from "../../data/review/reviewDraftArticles";
import "./ReviewDraftsPage.css";

const STORAGE_KEY = "reviewDraftArticles.v3";

function loadLocalDrafts() {
  if (typeof window === "undefined") return REVIEW_DRAFT_ARTICLES;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return REVIEW_DRAFT_ARTICLES;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return REVIEW_DRAFT_ARTICLES;
    return parsed;
  } catch (_) {
    return REVIEW_DRAFT_ARTICLES;
  }
}

function ReviewDraftsPage() {
  const [drafts, setDrafts] = useState(() => loadLocalDrafts());
  const [activeId, setActiveId] = useState(drafts[0]?.id || null);
  const [copied, setCopied] = useState("");

  const activeDraft = useMemo(
    () => drafts.find((item) => item.id === activeId) || drafts[0] || null,
    [drafts, activeId]
  );

  const updateDraft = (id, field, value) => {
    setDrafts((prev) => {
      const next = prev.map((item) => (item.id === id ? { ...item, [field]: value } : item));
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (_) {
        // Ignore storage failures
      }
      return next;
    });
  };

  const resetToDefaults = () => {
    setDrafts(REVIEW_DRAFT_ARTICLES);
    setActiveId(REVIEW_DRAFT_ARTICLES[0]?.id || null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (_) {
      // ignore
    }
  };

  const copyCurrentDraft = async () => {
    if (!activeDraft) return;
    const payload = [
      `ID: ${activeDraft.id}`,
      `Title: ${activeDraft.title}`,
      `Primary keyword: ${activeDraft.keyword}`,
      `Meta description: ${activeDraft.metaDescription}`,
      `Article Type: ${activeDraft.articleType}`,
      `Subcategory: ${activeDraft.subcategory}`,
      `Teaser: ${activeDraft.teaser}`,
      "",
      activeDraft.body,
    ].join("\n");
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(activeDraft.id);
      window.setTimeout(() => setCopied(""), 1200);
    } catch (_) {
      // ignore clipboard failures
    }
  };

  return (
    <div className="ReviewDrafts-page">
      <Helmet>
        <title>Review Draft Articles (Local) | Bridge Champions</title>
        <meta name="robots" content="noindex,nofollow,noarchive" />
      </Helmet>

      <header className="ReviewDrafts-header">
        <h1 className="ReviewDrafts-title">Learn → Review drafts</h1>
        <p className="ReviewDrafts-subtitle">
          Local review workspace for beginner SEO article drafts. Edits auto-save in your browser.
        </p>
        <div className="ReviewDrafts-actions">
          <button type="button" className="ReviewDrafts-btn" onClick={copyCurrentDraft}>
            {copied === activeDraft?.id ? "Copied" : "Copy current draft"}
          </button>
          <button type="button" className="ReviewDrafts-btn ReviewDrafts-btn--danger" onClick={resetToDefaults}>
            Reset all to defaults
          </button>
        </div>
      </header>

      <div className="ReviewDrafts-layout">
        <aside className="ReviewDrafts-sidebar" aria-label="Draft list">
          {drafts.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`ReviewDrafts-draftPill ${activeDraft?.id === item.id ? "ReviewDrafts-draftPill--active" : ""}`}
              onClick={() => setActiveId(item.id)}
            >
              <span className="ReviewDrafts-draftId">{item.id}</span>
              <span className="ReviewDrafts-draftName">{item.title}</span>
            </button>
          ))}
        </aside>

        {activeDraft && (
          <section className="ReviewDrafts-editor" aria-label="Draft editor">
            <label className="ReviewDrafts-field">
              <span>Title</span>
              <input
                value={activeDraft.title}
                onChange={(e) => updateDraft(activeDraft.id, "title", e.target.value)}
              />
            </label>
            <div className="ReviewDrafts-fieldRow">
              <label className="ReviewDrafts-field">
                <span>Article type</span>
                <input
                  value={activeDraft.articleType}
                  onChange={(e) => updateDraft(activeDraft.id, "articleType", e.target.value)}
                />
              </label>
              <label className="ReviewDrafts-field">
                <span>Subcategory</span>
                <input
                  value={activeDraft.subcategory}
                  onChange={(e) => updateDraft(activeDraft.id, "subcategory", e.target.value)}
                />
              </label>
            </div>
            <label className="ReviewDrafts-field">
              <span>Primary keyword</span>
              <input
                value={activeDraft.keyword}
                onChange={(e) => updateDraft(activeDraft.id, "keyword", e.target.value)}
              />
            </label>
            <label className="ReviewDrafts-field">
              <span>Meta description</span>
              <textarea
                rows={3}
                value={activeDraft.metaDescription}
                onChange={(e) => updateDraft(activeDraft.id, "metaDescription", e.target.value)}
              />
            </label>
            <label className="ReviewDrafts-field">
              <span>Teaser</span>
              <textarea
                rows={3}
                value={activeDraft.teaser}
                onChange={(e) => updateDraft(activeDraft.id, "teaser", e.target.value)}
              />
            </label>
            <label className="ReviewDrafts-field">
              <span>Body</span>
              <textarea
                className="ReviewDrafts-bodyTextarea"
                rows={18}
                value={activeDraft.body}
                onChange={(e) => updateDraft(activeDraft.id, "body", e.target.value)}
              />
            </label>
          </section>
        )}
      </div>
    </div>
  );
}

export default ReviewDraftsPage;

