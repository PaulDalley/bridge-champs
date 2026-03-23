import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { firebase } from "../../firebase/config";
import { MENU_GROUPS, getMenuGroupById, getMenuGroupByTopicId } from "../../data/systemCardSchema";
import { ABF_CARD_SECTIONS, TOPIC_ID_TO_PDF_FIELDS, getLabelForPdfField } from "../../data/systemCardAbfLayout";
import { getChoicesForGroup, resolveChoiceText, getPaulChoiceIdForTopic } from "../../data/systemCardMenu";
import { exportSystemCardPdf, isAcroFormExportEnabled, LEGACY_GROUP_ID_TO_PDF_FIELDS } from "../../utils/systemCardPdfExport";
import "./SystemCardEditor.css";

const COLLECTION = "userSystemCards";

/** Migrate v1 Firestore `selections` into v2 `abfValues` (PDF field names). */
function migrateSelectionsToAbfValues(selections) {
  const out = {};
  MENU_GROUPS.forEach((g) => {
    const sel = selections[g.id] || {};
    const choices = getChoicesForGroup(g.id);
    const text = resolveChoiceText(sel.selectedChoiceId, sel.customText, choices, sel.appendText);
    if (!text) return;
    const fields = LEGACY_GROUP_ID_TO_PDF_FIELDS[g.id];
    if (!fields) return;
    fields.forEach((f) => {
      out[f] = text;
    });
  });
  return out;
}

function buildOverlayEntriesFromAbf(abfValues) {
  const lines = [];
  Object.entries(abfValues).forEach(([field, text]) => {
    const t = String(text || "").trim();
    if (!t) return;
    lines.push({ field, label: getLabelForPdfField(field), text: t });
  });
  return lines;
}

function SystemCardEditor({ uid }) {
  const [abfValues, setAbfValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState("");
  const [filter, setFilter] = useState("");

  const load = useCallback(() => {
    if (!uid) {
      setLoading(false);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const addGroupId = params.get("add");
    const topicIdParam = params.get("topic");

    firebase
      .firestore()
      .collection(COLLECTION)
      .doc(uid)
      .get()
      .then((snap) => {
        const data = snap.exists ? snap.data() : {};
        let initial =
          data.abfValues && typeof data.abfValues === "object" ? { ...data.abfValues } : {};

        if (Object.keys(initial).length === 0 && data.selections && Object.keys(data.selections).length > 0) {
          initial = migrateSelectionsToAbfValues(data.selections);
        }

        const applyPaulTextToFields = (topicId, base) => {
          const group = getMenuGroupByTopicId(topicId);
          const fields = TOPIC_ID_TO_PDF_FIELDS[topicId];
          if (!group || !fields?.length) return base;
          const choices = getChoicesForGroup(group.id);
          const paulId = getPaulChoiceIdForTopic(topicId);
          const text = resolveChoiceText(paulId, "", choices, "");
          if (!text) return base;
          const next = { ...base };
          fields.forEach((f) => {
            next[f] = text;
          });
          return next;
        };

        if (topicIdParam && TOPIC_ID_TO_PDF_FIELDS[topicIdParam]) {
          initial = applyPaulTextToFields(topicIdParam, initial);
        } else if (addGroupId) {
          const group = getMenuGroupById(addGroupId);
          if (group?.topicId && TOPIC_ID_TO_PDF_FIELDS[group.topicId]) {
            initial = applyPaulTextToFields(group.topicId, initial);
          }
        }

        setAbfValues(initial);
      })
      .catch((err) => {
        console.error("System card load error:", err);
      })
      .finally(() => setLoading(false));
  }, [uid]);

  useEffect(() => {
    load();
  }, [load]);

  const updateField = (pdfField, value) => {
    setAbfValues((prev) => ({ ...prev, [pdfField]: value }));
  };

  const save = () => {
    if (!uid) return;
    setSaving(true);
    setSaveMsg("");
    firebase
      .firestore()
      .collection(COLLECTION)
      .doc(uid)
      .set(
        {
          cardVersion: 2,
          abfValues,
          selections: {},
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      )
      .then(() => {
        setSaveMsg("Saved.");
        setTimeout(() => setSaveMsg(""), 2000);
      })
      .catch((err) => {
        setSaveMsg("Error: " + (err.message || "Could not save"));
      })
      .finally(() => setSaving(false));
  };

  const applyPaulBundle = () => {
    const next = { ...abfValues };
    MENU_GROUPS.forEach((g) => {
      if (!g.topicId) return;
      const fields = TOPIC_ID_TO_PDF_FIELDS[g.topicId];
      if (!fields?.length) return;
      const choices = getChoicesForGroup(g.id);
      const paulId = getPaulChoiceIdForTopic(g.topicId);
      const text = resolveChoiceText(paulId, "", choices, "");
      if (!text) return;
      fields.forEach((f) => {
        next[f] = text;
      });
    });
    setAbfValues(next);
  };

  const clearCard = () => {
    setAbfValues({});
  };

  const filterLower = filter.trim().toLowerCase();
  const filteredSections = useMemo(() => {
    if (!filterLower) return ABF_CARD_SECTIONS;
    return ABF_CARD_SECTIONS.map((sec) => ({
      ...sec,
      items: sec.items.filter(
        (it) =>
          it.label.toLowerCase().includes(filterLower) ||
          it.pdfField.toLowerCase().includes(filterLower)
      ),
    })).filter((sec) => sec.items.length > 0);
  }, [filterLower]);

  const previewEntries = useMemo(() => buildOverlayEntriesFromAbf(abfValues), [abfValues]);
  const filledCount = previewEntries.length;

  const exportPdf = async () => {
    if (filledCount === 0) {
      setExportMsg("Fill at least one field before exporting.");
      return;
    }
    setExporting(true);
    setExportMsg("");
    try {
      await exportSystemCardPdf(
        previewEntries.map((e) => [e.label, e.text]),
        "my-system-card.pdf",
        { abfValues }
      );
      setExportMsg("PDF downloaded.");
      setTimeout(() => setExportMsg(""), 2500);
    } catch (err) {
      setExportMsg(err.message || "Could not export PDF");
    } finally {
      setExporting(false);
    }
  };

  if (!uid) {
    return (
      <div className="sy-card-page">
        <Helmet>
          <title>My system card — Bridge Champions</title>
        </Helmet>
        <header className="sy-card-hero">
          <h1 className="sy-card-title">My system card</h1>
          <p className="sy-card-login-msg">
            <Link to="/login">Log in</Link> to personalise your system card and save it.
          </p>
        </header>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="sy-card-page">
        <p className="sy-card-loading">Loading…</p>
      </div>
    );
  }

  return (
    <div className="sy-card-page sy-card-page--abf">
      <Helmet>
        <title>My system card — Bridge Champions</title>
        <meta
          name="description"
          content="Fill in your agreements using the same sections as the ABF Standard System Card."
        />
      </Helmet>

      <header className="sy-card-hero">
        <h1 className="sy-card-title">My system card</h1>
        <p className="sy-card-subtitle">
          Same sections and questions as the <strong>ABF Standard System Card</strong>. Each box matches a field on the
          official fillable PDF.
          {isAcroFormExportEnabled() ? (
            <>
              {" "}
              <strong>Localhost:</strong> export fills that form directly. On the live site, export still uses a summary
              overlay until you enable the fillable export.
            </>
          ) : (
            <> On this host, PDF export uses a summary overlay on the sample card.</>
          )}
        </p>
        <div className="sy-card-filter">
          <label htmlFor="sy-card-filter-input" className="sy-card-filter-label">
            Search questions
          </label>
          <input
            id="sy-card-filter-input"
            type="search"
            className="sy-card-filter-input"
            placeholder="e.g. 1NT, negative double, Gerber…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <div className="sy-card-shortcuts">
          <button type="button" className="sy-card-btn sy-card-btn--secondary" onClick={applyPaulBundle}>
            Fill Paul&apos;s recommendations (mapped topics only)
          </button>
          <button type="button" className="sy-card-btn sy-card-btn--secondary" onClick={clearCard}>
            Clear all
          </button>
          <button type="button" className="sy-card-btn sy-card-btn--primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button type="button" className="sy-card-btn sy-card-btn--secondary" onClick={exportPdf} disabled={exporting}>
            {exporting ? "Exporting…" : "Export PDF"}
          </button>
          {saveMsg && <span className="sy-card-save-msg">{saveMsg}</span>}
          {exportMsg && <span className="sy-card-save-msg">{exportMsg}</span>}
        </div>
      </header>

      <main className="sy-card-main sy-card-main--abf">
        {filteredSections.map((sec, idx) => (
          <details key={sec.id} className="sy-card-section sy-card-abf-section" open={idx < 2}>
            <summary className="sy-card-section-title sy-card-abf-summary">{sec.title}</summary>
            <div className="sy-card-abf-fields">
              {sec.items.map((item) => (
                <label key={item.pdfField} className="sy-card-abf-field">
                  <span className="sy-card-abf-label">{item.label}</span>
                  <span className="sy-card-abf-meta">{item.pdfField}</span>
                  <textarea
                    className="sy-card-abf-textarea"
                    rows={item.multiline === false ? 1 : 2}
                    value={abfValues[item.pdfField] || ""}
                    onChange={(e) => updateField(item.pdfField, e.target.value)}
                    spellCheck
                  />
                </label>
              ))}
            </div>
          </details>
        ))}
      </main>

      <aside className="sy-card-preview">
        <h2 className="sy-card-preview-title">Preview ({filledCount} filled)</h2>
        <PreviewPane entries={previewEntries} />
      </aside>
    </div>
  );
}

function PreviewPane({ entries }) {
  if (entries.length === 0) {
    return <p className="sy-card-preview-empty">Fill fields above to see a summary list.</p>;
  }

  const max = 60;
  const shown = entries.slice(0, max);

  return (
    <>
      <ul className="sy-card-preview-list">
        {shown.map((e) => (
          <li key={e.field}>
            <strong>{e.label}:</strong> {e.text}
          </li>
        ))}
      </ul>
      {entries.length > max && (
        <p className="sy-card-preview-more">…and {entries.length - max} more (see full card in PDF).</p>
      )}
    </>
  );
}

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
});

export default connect(mapStateToProps)(SystemCardEditor);
