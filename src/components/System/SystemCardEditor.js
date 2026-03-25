import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
const VISUAL_CARD_IMAGE_URL = "/system-card/abf-card-blank-official-upright.jpg";
const VISUAL_HOTSPOTS = [
  // Split-card model: each section spans from center line to page edge for its side.
  { id: "hotspot-basics", sectionId: "sec_1", label: "ABF Nos., names and basic system", top: 5.0, left: 50.0, width: 49.0, height: 12.2 },
  { id: "hotspot-opening", sectionId: "sec_2", label: "1. Opening bids", top: 17.4, left: 50.0, width: 49.0, height: 39.0 },
  { id: "hotspot-prealerts", sectionId: "sec_3", label: "2. Pre-alerts", top: 56.6, left: 50.0, width: 49.0, height: 12.5 },
  { id: "hotspot-competitive", sectionId: "sec_4", label: "3. Competitive bids / overcalls", top: 69.3, left: 50.0, width: 49.0, height: 26.2 },
  { id: "hotspot-basic-responses", sectionId: "sec_5", label: "4. Basic responses", top: 0.8, left: 1.0, width: 49.0, height: 18.8 },
  { id: "hotspot-play", sectionId: "sec_6", label: "5. Play conventions", top: 19.8, left: 1.0, width: 49.0, height: 38.8 },
  { id: "hotspot-slam", sectionId: "sec_7", label: "6. Slam conventions", top: 58.9, left: 1.0, width: 49.0, height: 12.3 },
  { id: "hotspot-other-defence", sectionId: "sec_8", label: "7. Other conventions & defence", top: 71.5, left: 1.0, width: 49.0, height: 24.0 },
  { id: "hotspot-tickboxes", sectionId: "sec_9", label: "Tick-box style fields", top: 53.8, left: 28.5, width: 21.5, height: 7.2 },
];

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
  const [selectedVisualSectionId, setSelectedVisualSectionId] = useState("sec_1");
  const visualEditorRef = useRef(null);

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
  const localhostAcroExportEnabled = isAcroFormExportEnabled();
  const visualEditorEnabled = true;
  const sectionById = useMemo(() => {
    const map = {};
    ABF_CARD_SECTIONS.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, []);

  const selectedVisualSection = sectionById[selectedVisualSectionId] || sectionById.sec_1 || ABF_CARD_SECTIONS[0];
  const sectionFilledCounts = useMemo(() => {
    const out = {};
    ABF_CARD_SECTIONS.forEach((sec) => {
      out[sec.id] = sec.items.reduce((count, item) => {
        const value = String(abfValues[item.pdfField] || "").trim();
        return value ? count + 1 : count;
      }, 0);
    });
    return out;
  }, [abfValues]);
  const selectedSectionFilteredItems = useMemo(() => {
    const items = selectedVisualSection?.items || [];
    if (!filterLower) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(filterLower) ||
        it.pdfField.toLowerCase().includes(filterLower)
    );
  }, [selectedVisualSection, filterLower]);
  const selectedSectionTotalItems = selectedVisualSection?.items?.length || 0;

  const selectVisualSection = useCallback((sectionId) => {
    setSelectedVisualSectionId(sectionId);
    // Make the interaction obvious by jumping the user to the active editor panel.
    window.requestAnimationFrame(() => {
      visualEditorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

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
          {visualEditorEnabled ? (
            <>
              Click the section directly on the <strong>ABF card visual</strong>, then edit agreements below.
              Your entries still save and export to the same PDF fields.
            </>
          ) : (
            <>
              Same sections and questions as the <strong>ABF Standard System Card</strong>. Each box matches a field on the
              official fillable PDF.
            </>
          )}
          {localhostAcroExportEnabled ? (
            <>
              {" "}
              <strong>Localhost:</strong> export fills that form directly. On the live site, export still uses a summary
              overlay until you enable the fillable export.
            </>
          ) : (
            <> On this host, PDF export uses a summary overlay on the sample card.</>
          )}
        </p>
        {!visualEditorEnabled && (
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
        )}
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

      {visualEditorEnabled ? (
        <main className="sy-card-main sy-card-main--visual">
          <section className="sy-card-visual">
            <div className="sy-card-visual-frame">
              <img
                src={VISUAL_CARD_IMAGE_URL}
                alt="ABF system card visual with selectable sections"
                className="sy-card-visual-image"
              />
              <div className="sy-card-hotspots">
                {VISUAL_HOTSPOTS.map((hotspot) => {
                  const filled = sectionFilledCounts[hotspot.sectionId] || 0;
                  const total = sectionById[hotspot.sectionId]?.items?.length || 0;
                  return (
                    <button
                      key={hotspot.id}
                      type="button"
                      className={`sy-card-hotspot ${
                        selectedVisualSectionId === hotspot.sectionId ? "sy-card-hotspot--active" : ""
                      } ${filled > 0 ? "sy-card-hotspot--has-values" : ""}`}
                      style={{
                        top: `${hotspot.top}%`,
                        left: `${hotspot.left}%`,
                        width: `${hotspot.width}%`,
                        height: `${hotspot.height}%`,
                      }}
                      onClick={() => selectVisualSection(hotspot.sectionId)}
                      aria-label={hotspot.label}
                      title={`${hotspot.label} (${filled}/${total} filled)`}
                      aria-pressed={selectedVisualSectionId === hotspot.sectionId}
                    >
                      {filled > 0 && <span className="sy-card-hotspot-count">{filled}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="sy-card-visual-status" role="status" aria-live="polite">
              Editing: <strong>{selectedVisualSection?.title}</strong>{" "}
              ({selectedSectionFilteredItems.length}/{selectedSectionTotalItems} fields shown)
            </div>
            <div className="sy-card-visual-jump-list">
              {VISUAL_HOTSPOTS.map((hotspot) => (
                <button
                  key={`${hotspot.id}-jump`}
                  type="button"
                  className={`sy-card-visual-jump ${selectedVisualSectionId === hotspot.sectionId ? "sy-card-visual-jump--active" : ""}`}
                  onClick={() => selectVisualSection(hotspot.sectionId)}
                >
                  {hotspot.label} ({sectionFilledCounts[hotspot.sectionId] || 0})
                </button>
              ))}
            </div>
          </section>

          <section className="sy-card-section sy-card-section--visual-editor" ref={visualEditorRef}>
            <h2 className="sy-card-section-title sy-card-section-title--visual">{selectedVisualSection?.title}</h2>
            <p className="sy-card-visual-help">
              Edit agreements for this section. These values map directly to the same PDF fields as before.
            </p>
            <div className="sy-card-filter sy-card-filter--visual">
              <label htmlFor="sy-card-filter-input-visual" className="sy-card-filter-label">
                Search in this section
              </label>
              <input
                id="sy-card-filter-input-visual"
                type="search"
                className="sy-card-filter-input"
                placeholder="e.g. 1NT, negative double, Gerber…"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>

            <div className="sy-card-abf-fields">
              {selectedSectionFilteredItems.map((item) => (
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
              {selectedSectionFilteredItems.length === 0 && (
                <p className="sy-card-preview-empty">No fields match this search in the selected section.</p>
              )}
            </div>
          </section>
        </main>
      ) : (
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
      )}

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
