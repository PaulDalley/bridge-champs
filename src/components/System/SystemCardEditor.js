import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { firebase } from "../../firebase/config";
import { MENU_GROUPS, getMenuGroupById, getMenuGroupByTopicId } from "../../data/systemCardSchema";
import {
  TOPIC_ID_TO_PDF_FIELDS,
  getLabelForPdfField,
  VISIBLE_CARD_SECTIONS,
  getVisibleFieldValue,
  setVisibleFieldValue,
} from "../../data/systemCardAbfLayout";
import { getChoicesForGroup, resolveChoiceText, getPaulChoiceIdForTopic } from "../../data/systemCardMenu";
import { getCuratedSuggestionsBySection, applySuggestionToValues } from "../../data/systemCardSuggestions";
import { parseQuickFillText, buildPatchFromDetections } from "../../utils/systemCardAssist/ruleEngine";
import cardFieldRects from "../../data/systemCardFieldRects.json";
import { exportSystemCardPdf, isAcroFormExportEnabled, LEGACY_GROUP_ID_TO_PDF_FIELDS } from "../../utils/systemCardPdfExport";
import "./SystemCardEditor.css";

const COLLECTION = "userSystemCards";
const VISUAL_CARD_IMAGE_BY_PAGE = {
  1: "/system-card/abf-card-blank-official-upright.jpg",
  2: "/system-card/abf-card-blank-official-page2-upright.jpg",
};
const VISUAL_HOTSPOTS = [
  // Split-card model: each section spans from center line to page edge for its side.
  { id: "hotspot-basics", sectionId: "sec_1", label: "ABF Nos., names and basic system", top: 5.0, left: 50.0, width: 49.0, height: 12.2 },
  { id: "hotspot-opening", sectionId: "sec_2", label: "1. Opening bids", top: 17.4, left: 50.0, width: 49.0, height: 39.0 },
  { id: "hotspot-prealerts", sectionId: "sec_3", label: "2. Pre-alerts", top: 56.6, left: 50.0, width: 49.0, height: 12.5 },
  { id: "hotspot-competitive", sectionId: "sec_4", label: "3. COMPETITIVE BIDS / OVERCALLS", top: 69.3, left: 50.0, width: 49.0, height: 26.2 },
  { id: "hotspot-basic-responses", sectionId: "sec_5", label: "4. BASIC RESPONSES", top: 0.8, left: 1.0, width: 49.0, height: 18.8 },
  { id: "hotspot-play", sectionId: "sec_6", label: "5. PLAY CONVENTIONS", top: 19.8, left: 1.0, width: 49.0, height: 38.8 },
  { id: "hotspot-slam", sectionId: "sec_7", label: "6. SLAM CONVENTIONS", top: 58.9, left: 1.0, width: 49.0, height: 12.3 },
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

function uniqueNonEmpty(arr) {
  return Array.from(new Set((arr || []).map((v) => String(v || "").trim()).filter(Boolean)));
}

function getCalibrateMode() {
  if (typeof window === "undefined") return false;
  const qs = new URLSearchParams(window.location.search);
  const enabled = qs.get("calibrate") === "1";
  const host = window.location.hostname;
  const localOnly = host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  return enabled && localOnly;
}

function clampPct(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Number(v) || 0));
}

function getRect(field, rectMap) {
  return rectMap[field.id] || field.cardRect;
}

function buildDefaultRectMap() {
  const out = {};
  VISIBLE_CARD_SECTIONS.forEach((section) => {
    section.fields.forEach((field) => {
      out[field.id] = field.cardRect;
    });
  });
  return out;
}

function SystemCardEditor({ uid }) {
  const [abfValues, setAbfValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [exporting, setExporting] = useState(false);
  const [exportMsg, setExportMsg] = useState("");
  const [filter, setFilter] = useState("");
  const [cardPage, setCardPage] = useState(1);
  const [entryMode, setEntryMode] = useState(null);
  const [selectedVisualSectionId, setSelectedVisualSectionId] = useState("sec_1");
  const [insightsOptIn, setInsightsOptIn] = useState(false);
  const [assistantText, setAssistantText] = useState("");
  const [assistantDetections, setAssistantDetections] = useState([]);
  const [assistantFollowUps, setAssistantFollowUps] = useState([]);
  const [assistantMsg, setAssistantMsg] = useState("");
  const [cardRects, setCardRects] = useState(() => ({
    ...buildDefaultRectMap(),
    ...(cardFieldRects || {}),
  }));
  const [calibrateFieldId, setCalibrateFieldId] = useState("abf_no_a");
  const [dragState, setDragState] = useState(null);
  const [resizeState, setResizeState] = useState(null);
  const visualEditorRef = useRef(null);
  const cardFrameRef = useRef(null);
  const calibrateMode = getCalibrateMode();

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
        setInsightsOptIn(Boolean(data.communityInsightsOptIn));

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
          communityInsightsOptIn: insightsOptIn,
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
  const visibleSectionById = useMemo(() => {
    const map = {};
    VISIBLE_CARD_SECTIONS.forEach((s) => {
      map[s.id] = s;
    });
    return map;
  }, []);
  const visibleSectionsForPage = useMemo(
    () => VISIBLE_CARD_SECTIONS.filter((s) => (s.page || 1) === cardPage),
    [cardPage]
  );
  const selectedVisibleSection = useMemo(
    () =>
      visibleSectionById[selectedVisualSectionId] ||
      visibleSectionsForPage[0] ||
      VISIBLE_CARD_SECTIONS[0],
    [selectedVisualSectionId, visibleSectionsForPage, visibleSectionById]
  );
  useEffect(() => {
    if (!visibleSectionsForPage.length) return;
    const existsOnPage = visibleSectionsForPage.some((s) => s.id === selectedVisualSectionId);
    if (!existsOnPage) setSelectedVisualSectionId(visibleSectionsForPage[0].id);
  }, [cardPage, selectedVisualSectionId, visibleSectionsForPage]);
  const sectionFilledCounts = useMemo(() => {
    const out = {};
    VISIBLE_CARD_SECTIONS.forEach((sec) => {
      out[sec.id] = sec.fields.reduce((count, field) => {
        const value = String(getVisibleFieldValue(field, abfValues) || "").trim();
        return value ? count + 1 : count;
      }, 0);
    });
    return out;
  }, [abfValues]);
  const selectedSectionFilteredItems = useMemo(() => {
    const items = selectedVisibleSection?.fields || [];
    if (!filterLower) return items;
    return items.filter(
      (it) =>
        it.label.toLowerCase().includes(filterLower) ||
        (it.pdfFields || []).some((f) => f.toLowerCase().includes(filterLower))
    );
  }, [selectedVisibleSection, filterLower]);
  const selectedSectionTotalItems = selectedVisibleSection?.fields?.length || 0;
  const selectedSectionSuggestions = useMemo(
    () => getCuratedSuggestionsBySection(selectedVisibleSection?.id || ""),
    [selectedVisibleSection]
  );
  const liveFieldOverlays = useMemo(() => {
    const overlays = [];
    VISIBLE_CARD_SECTIONS.forEach((sec) => {
      if ((sec.page || 1) !== cardPage) return;
      sec.fields.forEach((field) => {
        const value = String(
          (field.pdfFields || []).map((f) => abfValues[f]).find((v) => String(v || "").trim()) || ""
        ).trim();
        if (!value) return;
        const rect = getRect(field, cardRects);
        overlays.push({
          id: `${sec.id}-${field.id}`,
          fieldId: field.id,
          sectionId: sec.id,
          text: value,
          cardRect: rect,
        });
      });
    });
    return overlays;
  }, [abfValues, cardRects, cardPage]);

  const selectVisualSection = useCallback((sectionId) => {
    setSelectedVisualSectionId(sectionId);
    // Make the interaction obvious by jumping the user to the active editor panel.
    window.requestAnimationFrame(() => {
      visualEditorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, []);

  const runAssistant = useCallback(() => {
    const parsed = parseQuickFillText(assistantText);
    const withEnabled = parsed.detections.map((d) => ({ ...d, enabled: true }));
    setAssistantDetections(withEnabled);
    setAssistantFollowUps(parsed.followUps.map((q) => ({ ...q, answer: "" })));
    setAssistantMsg(
      withEnabled.length
        ? `Detected ${withEnabled.length} possible agreements. Review and apply.`
        : "No clear patterns found yet. Try adding more detail (e.g. 1NT range, weak twos, negative doubles)."
    );
  }, [assistantText]);

  const toggleDetection = useCallback((id) => {
    setAssistantDetections((prev) =>
      prev.map((d) => (d.id === id ? { ...d, enabled: !d.enabled } : d))
    );
  }, []);

  const setFollowUpAnswer = useCallback((id, value) => {
    setAssistantFollowUps((prev) =>
      prev.map((q) => (q.id === id ? { ...q, answer: value } : q))
    );
  }, []);

  const applyAssistantPatch = useCallback(() => {
    const followUpDetections = assistantFollowUps
      .filter((q) => q.answer)
      .map((q) => ({
        id: `followup-${q.id}`,
        enabled: true,
        text: q.formatAnswer(q.answer),
        targetFields: q.targetFields,
      }));
    const patch = buildPatchFromDetections([...assistantDetections, ...followUpDetections]);
    if (!Object.keys(patch).length) {
      setAssistantMsg("Nothing selected to apply.");
      return;
    }
    setAbfValues((prev) => ({ ...prev, ...patch }));
    setAssistantMsg(`Applied ${Object.keys(patch).length} field updates from assistant.`);
  }, [assistantDetections, assistantFollowUps]);

  const setFieldRect = useCallback((fieldId, patch) => {
    setCardRects((prev) => {
      const current = prev[fieldId] || {};
      const next = { ...current, ...patch };
      return { ...prev, [fieldId]: next };
    });
  }, []);

  const beginDrag = useCallback((e, fieldId) => {
    if (!calibrateMode) return;
    e.preventDefault();
    e.stopPropagation();
    setCalibrateFieldId(fieldId);
    const rect = cardRects[fieldId];
    if (!rect) return;
    const frame = cardFrameRef.current?.getBoundingClientRect();
    if (!frame) return;
    setDragState({
      fieldId,
      startX: e.clientX,
      startY: e.clientY,
      baseTop: rect.top,
      baseLeft: rect.left,
      frameW: frame.width,
      frameH: frame.height,
    });
  }, [calibrateMode, cardRects]);

  const beginResize = useCallback((e, fieldId) => {
    if (!calibrateMode) return;
    e.preventDefault();
    e.stopPropagation();
    setCalibrateFieldId(fieldId);
    const rect = cardRects[fieldId];
    if (!rect) return;
    const frame = cardFrameRef.current?.getBoundingClientRect();
    if (!frame) return;
    setResizeState({
      fieldId,
      startX: e.clientX,
      startY: e.clientY,
      baseW: rect.width,
      baseH: rect.height,
      frameW: frame.width,
      frameH: frame.height,
    });
  }, [calibrateMode, cardRects]);

  useEffect(() => {
    if (!dragState && !resizeState) return undefined;
    const onMove = (e) => {
      if (dragState) {
        const dxPct = ((e.clientX - dragState.startX) / dragState.frameW) * 100;
        const dyPct = ((e.clientY - dragState.startY) / dragState.frameH) * 100;
        setFieldRect(dragState.fieldId, {
          left: clampPct(dragState.baseLeft + dxPct),
          top: clampPct(dragState.baseTop + dyPct),
        });
      }
      if (resizeState) {
        const dwPct = ((e.clientX - resizeState.startX) / resizeState.frameW) * 100;
        const dhPct = ((e.clientY - resizeState.startY) / resizeState.frameH) * 100;
        setFieldRect(resizeState.fieldId, {
          width: clampPct(resizeState.baseW + dwPct, 1, 100),
          height: clampPct(resizeState.baseH + dhPct, 1, 100),
        });
      }
    };
    const onUp = () => {
      setDragState(null);
      setResizeState(null);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragState, resizeState, setFieldRect]);

  const rectJsonText = useMemo(() => JSON.stringify(cardRects, null, 2), [cardRects]);

  const copyRectJson = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(rectJsonText);
      setAssistantMsg("Copied rect JSON to clipboard.");
    } catch (e) {
      setAssistantMsg("Could not copy JSON. Select and copy manually.");
    }
  }, [rectJsonText]);

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
        <p className="sy-card-notice">
          <strong>This page is under construction.</strong> It is here so you can get a glimpse of the concept.
          The vision is an AI-assisted system card workspace where pairs can collaborate, compare styles, and
          see what strong partnerships are playing.
        </p>
        <p className="sy-card-subtitle">
          <>
            Click the section directly on the <strong>ABF card visual</strong>, then edit agreements below.
            Your entries still save and export to the same PDF fields.
          </>
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
        <div className="sy-card-shortcuts">
          <button type="button" className="sy-card-btn sy-card-btn--secondary" onClick={applyPaulBundle}>
            Fill Paul&apos;s recommendations (mapped topics only)
          </button>
          <button type="button" className="sy-card-btn sy-card-btn--secondary" onClick={clearCard}>
            Clear all
          </button>
          <button type="button" className="sy-card-btn sy-card-btn--primary" onClick={save} disabled={saving || !uid}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button type="button" className="sy-card-btn sy-card-btn--secondary" onClick={exportPdf} disabled={exporting}>
            {exporting ? "Exporting…" : "Export PDF"}
          </button>
          {saveMsg && <span className="sy-card-save-msg">{saveMsg}</span>}
          {exportMsg && <span className="sy-card-save-msg">{exportMsg}</span>}
          {!uid && (
            <span className="sy-card-save-msg">
              Preview mode is available to everyone. <Link to="/login">Log in</Link> to save to your account.
            </span>
          )}
        </div>
      </header>

      <main className="sy-card-main sy-card-main--visual">
        <section className="sy-card-visual">
          <div className="sy-card-visual-frame" ref={cardFrameRef}>
            <img
              src={VISUAL_CARD_IMAGE_BY_PAGE[cardPage]}
              alt={`ABF system card page ${cardPage}`}
              className="sy-card-visual-image"
            />
            <div className="sy-card-live-overlay" aria-hidden="true">
              {liveFieldOverlays.map((entry) => (
                <div
                  key={entry.id}
                  className={`sy-card-live-box ${
                    selectedVisualSectionId === entry.sectionId ? "sy-card-live-box--active" : ""
                  }`}
                  style={{
                    top: `${entry.cardRect.top}%`,
                    left: `${entry.cardRect.left}%`,
                    width: `${entry.cardRect.width}%`,
                    height: `${entry.cardRect.height}%`,
                    WebkitLineClamp: entry.cardRect.maxLines || 2,
                  }}
                >
                  {entry.text}
                </div>
              ))}
            </div>
            {calibrateMode && (
              <div className="sy-card-calibration-layer">
                {(selectedVisibleSection?.fields || []).map((field) => {
                  const rect = getRect(field, cardRects);
                  return (
                    <div
                      key={`cal-${field.id}`}
                      className={`sy-card-calibration-box ${calibrateFieldId === field.id ? "sy-card-calibration-box--active" : ""}`}
                      style={{
                        top: `${rect.top}%`,
                        left: `${rect.left}%`,
                        width: `${rect.width}%`,
                        height: `${rect.height}%`,
                      }}
                      onMouseDown={(e) => beginDrag(e, field.id)}
                    >
                      <span className="sy-card-calibration-label">{field.label}</span>
                      <button
                        type="button"
                        className="sy-card-calibration-handle"
                        onMouseDown={(e) => beginResize(e, field.id)}
                        aria-label={`Resize ${field.label}`}
                      />
                    </div>
                  );
                })}
              </div>
            )}
              {cardPage === 1 && (
              <div className="sy-card-hotspots">
                {VISUAL_HOTSPOTS.map((hotspot) => {
                  const filled = sectionFilledCounts[hotspot.sectionId] || 0;
                  const total = visibleSectionById[hotspot.sectionId]?.fields?.length || 0;
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
                      onClick={(e) => {
                        if (calibrateMode) {
                          e.preventDefault();
                          e.stopPropagation();
                          return;
                        }
                        selectVisualSection(hotspot.sectionId);
                      }}
                      aria-label={hotspot.label}
                      title={`${hotspot.label} (${filled}/${total} filled)`}
                      aria-pressed={selectedVisualSectionId === hotspot.sectionId}
                      disabled={calibrateMode}
                    >
                      {filled > 0 && <span className="sy-card-hotspot-count">{filled}</span>}
                    </button>
                  );
                })}
              </div>
              )}
            </div>
          <div className="sy-card-visual-status" role="status" aria-live="polite">
            Editing: <strong>{selectedVisibleSection?.title}</strong>{" "}
            ({selectedSectionFilteredItems.length}/{selectedSectionTotalItems} fields shown)
          </div>
          <div className="sy-card-visual-jump-list">
            <button
              type="button"
              className={`sy-card-visual-jump ${cardPage === 1 ? "sy-card-visual-jump--active" : ""}`}
              onClick={() => setCardPage(1)}
            >
              Page 1
            </button>
            <button
              type="button"
              className={`sy-card-visual-jump ${cardPage === 2 ? "sy-card-visual-jump--active" : ""}`}
              onClick={() => setCardPage(2)}
            >
              Page 2
            </button>
          </div>
          <div className="sy-card-visual-jump-list">
            {(cardPage === 1 ? VISUAL_HOTSPOTS.map((h) => h.sectionId) : visibleSectionsForPage.map((s) => s.id)).map((sectionId) => {
              const hotspot = VISUAL_HOTSPOTS.find((h) => h.sectionId === sectionId);
              const label = hotspot?.label || visibleSectionById[sectionId]?.title || sectionId;
              return (
              <button
                key={`${sectionId}-jump`}
                type="button"
                className={`sy-card-visual-jump ${selectedVisualSectionId === sectionId ? "sy-card-visual-jump--active" : ""}`}
                onClick={() => selectVisualSection(sectionId)}
              >
                {label} ({sectionFilledCounts[sectionId] || 0})
              </button>
            );
            })}
          </div>
          {calibrateMode && (
            <section className="sy-card-calibration-panel">
              <h3>Calibration mode (admin)</h3>
              <p>Drag boxes on card, resize with corner handle, then copy JSON into `systemCardFieldRects.json`.</p>
              <label className="sy-card-assistant-followup">
                <span>Field</span>
                <select
                  className="sy-card-select"
                  value={calibrateFieldId}
                  onChange={(e) => setCalibrateFieldId(e.target.value)}
                >
                  {visibleSectionsForPage.flatMap((sec) =>
                    sec.fields.map((f) => (
                      <option key={`opt-${f.id}`} value={f.id}>
                        {sec.title} — {f.label}
                      </option>
                    ))
                  )}
                </select>
              </label>
              <div className="sy-card-calibration-grid">
                {["top", "left", "width", "height"].map((k) => (
                  <label key={`num-${k}`} className="sy-card-calibration-num">
                    <span>{k}</span>
                    <input
                      type="number"
                      step="0.1"
                      value={Number((cardRects[calibrateFieldId]?.[k] ?? 0).toFixed(2))}
                      onChange={(e) =>
                        setFieldRect(calibrateFieldId, {
                          [k]: clampPct(
                            e.target.value,
                            k === "width" || k === "height" ? 1 : 0,
                            100
                          ),
                        })
                      }
                    />
                  </label>
                ))}
              </div>
              <div className="sy-card-assistant-actions">
                <button type="button" className="sy-card-btn sy-card-btn--secondary" onClick={copyRectJson}>
                  Copy rect JSON
                </button>
              </div>
              <textarea className="sy-card-calibration-json" rows={8} readOnly value={rectJsonText} />
            </section>
          )}
        </section>

        <section className="sy-card-section sy-card-section--visual-editor" ref={visualEditorRef}>
            <h2 className="sy-card-section-title sy-card-section-title--visual">{selectedVisibleSection?.title}</h2>
            <p className="sy-card-visual-help">
              Edit only the fields that are visibly used on the card.
            </p>
            {entryMode == null && (
              <section className="sy-card-entry-gateway">
                <button
                  type="button"
                  className="sy-card-entry-btn sy-card-entry-btn--manual"
                  onClick={() => setEntryMode("manual")}
                >
                  Enter manually
                </button>
                <button
                  type="button"
                  className="sy-card-entry-btn sy-card-entry-btn--ai"
                  onClick={() => setEntryMode("ai")}
                >
                  Tell me what you play
                </button>
              </section>
            )}
            {entryMode != null && (
              <div className="sy-card-entry-switch">
                <button
                  type="button"
                  className={`sy-card-visual-jump ${entryMode === "manual" ? "sy-card-visual-jump--active" : ""}`}
                  onClick={() => setEntryMode("manual")}
                >
                  Enter manually
                </button>
                <button
                  type="button"
                  className={`sy-card-visual-jump ${entryMode === "ai" ? "sy-card-visual-jump--active" : ""}`}
                  onClick={() => setEntryMode("ai")}
                >
                  Tell me what you play
                </button>
              </div>
            )}

            {entryMode === "manual" && (
              <>
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
                    <div key={item.id} className="sy-card-abf-field sy-card-abf-field--interactive">
                      <label className="sy-card-abf-field-main">
                        <span className="sy-card-abf-label">{item.label}</span>
                        <textarea
                          className="sy-card-abf-textarea"
                          rows={item.cardRect?.maxLines > 1 ? 2 : 1}
                          value={getVisibleFieldValue(item, abfValues)}
                          onChange={(e) =>
                            setAbfValues((prev) => setVisibleFieldValue(item, e.target.value, prev))
                          }
                          spellCheck
                          placeholder="Type details"
                        />
                      </label>
                    </div>
                  ))}
                  {selectedSectionFilteredItems.length === 0 && (
                    <p className="sy-card-preview-empty">No fields match this search in the selected section.</p>
                  )}
                </div>
              </>
            )}

            {entryMode === "ai" && (
              <>
            <section className="sy-card-assistant">
              <h3 className="sy-card-assistant-title">Quick-fill assistant</h3>
              <p className="sy-card-assistant-help">
                Describe your system in plain language and I&apos;ll propose mapped updates.
              </p>
              <textarea
                className="sy-card-assistant-input"
                rows={4}
                value={assistantText}
                onChange={(e) => setAssistantText(e.target.value)}
                placeholder="Example: 5-card majors, 15-17 NT, weak twos in majors, negative doubles thru 2S, Jacoby 2NT."
              />
              <div className="sy-card-assistant-actions">
                <button type="button" className="sy-card-btn sy-card-btn--secondary" onClick={runAssistant}>
                  Analyze text
                </button>
                <button type="button" className="sy-card-btn sy-card-btn--primary" onClick={applyAssistantPatch}>
                  Apply selected updates
                </button>
                {assistantMsg && <span className="sy-card-save-msg">{assistantMsg}</span>}
              </div>

              {assistantDetections.length > 0 && (
                <div className="sy-card-assistant-list">
                  {assistantDetections.map((d) => (
                    <label key={d.id} className="sy-card-assistant-item">
                      <input
                        type="checkbox"
                        checked={!!d.enabled}
                        onChange={() => toggleDetection(d.id)}
                      />
                      <span>
                        <strong>{d.title}:</strong> {d.text}
                      </span>
                    </label>
                  ))}
                </div>
              )}

              {assistantFollowUps.length > 0 && (
                <div className="sy-card-assistant-followups">
                  <h4>Follow-up questions</h4>
                  {assistantFollowUps.map((q) => (
                    <label key={q.id} className="sy-card-assistant-followup">
                      <span>{q.question}</span>
                      <select
                        value={q.answer}
                        onChange={(e) => setFollowUpAnswer(q.id, e.target.value)}
                        className="sy-card-select"
                      >
                        <option value="">Select…</option>
                        {q.options.map((opt) => (
                          <option key={`${q.id}-${opt}`} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </label>
                  ))}
                </div>
              )}
            </section>

            <section className="sy-card-suggestions">
              <h3 className="sy-card-assistant-title">Suggestions & research</h3>
              <p className="sy-card-assistant-help">
                Curated ideas for this section. Apply one as a starting template and tweak.
              </p>
              <div className="sy-card-suggestion-grid">
                {selectedSectionSuggestions.map((s) => (
                  <article key={s.id} className="sy-card-suggestion-card">
                    <p className="sy-card-suggestion-source">{s.source}</p>
                    <h4>{s.title}</h4>
                    <p>{s.summary}</p>
                    {uniqueNonEmpty(Array.isArray(s.notes) ? s.notes : [s.notes]).map((n) => (
                      <p key={`${s.id}-${n}`} className="sy-card-suggestion-note">
                        {n}
                      </p>
                    ))}
                    <div className="sy-card-suggestion-actions">
                      <button
                        type="button"
                        className="sy-card-btn sy-card-btn--secondary"
                        onClick={() => setAbfValues((prev) => applySuggestionToValues(s, prev))}
                      >
                        Apply suggestion
                      </button>
                      {!!s.detailUrl && (
                        <a href={s.detailUrl} className="sy-card-inline-link">
                          Learn more
                        </a>
                      )}
                    </div>
                  </article>
                ))}
                {selectedSectionSuggestions.length === 0 && (
                  <p className="sy-card-preview-empty">Section suggestions are being expanded.</p>
                )}
              </div>
            </section>

            <section className="sy-card-community">
              <h3 className="sy-card-assistant-title">What other pairs are playing</h3>
              <p className="sy-card-assistant-help">
                Community insights are being prepared. Opt in now to contribute anonymous patterns later.
              </p>
              <label className="sy-card-optin">
                <input
                  type="checkbox"
                  checked={insightsOptIn}
                  onChange={(e) => setInsightsOptIn(e.target.checked)}
                />
                <span>Opt in to anonymous aggregate system insights</span>
              </label>
              <div className="sy-card-community-placeholder">
                <p>Upcoming examples for this section:</p>
                <ul>
                  <li>Most-used treatment</li>
                  <li>Top alternatives by strength band</li>
                  <li>Common follow-up agreements</li>
                </ul>
              </div>
            </section>
              </>
            )}
          </section>
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
