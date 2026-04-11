import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { firebase } from "../../firebase/config";
import { MENU_GROUPS, getMenuGroupById, getMenuGroupByTopicId } from "../../data/systemCardSchema";
import {
  TOPIC_ID_TO_PDF_FIELDS,
  VISIBLE_CARD_SECTIONS,
  getVisibleFieldValue,
  setVisibleFieldValue,
} from "../../data/systemCardAbfLayout";
import { getChoicesForGroup, resolveChoiceText, getPaulChoiceIdForTopic } from "../../data/systemCardMenu";
import cardFieldRects from "../../data/systemCardFieldRects.json";
import { LEGACY_GROUP_ID_TO_PDF_FIELDS } from "../../utils/systemCardPdfExport";
import "./SystemCardEditor.css";

const COLLECTION = "userSystemCards";
const VISUAL_CARD_IMAGE_BY_PAGE = {
  1: "/system-card/abf-card-blank-official-upright.jpg",
  2: "/system-card/abf-card-blank-official-page2-upright.jpg",
};
/** Page 2: two large regions — responses (left) and other methods / conventions (right). */
const VISUAL_HOTSPOTS_PAGE2 = [
  { id: "hotspot-p2-responses", sectionId: "p2_responses", label: "PAGE 2: RESPONSES", top: 1.5, left: 1.5, width: 47.5, height: 97 },
  { id: "hotspot-p2-defence", sectionId: "p2_defence", label: "PAGE 2: OTHER METHODS", top: 1.5, left: 51.0, width: 47.5, height: 97 },
];

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

function getAllowedFieldWhitelist() {
  return new Set(
    VISIBLE_CARD_SECTIONS.flatMap((section) =>
      section.fields.flatMap((field) => (Array.isArray(field.pdfFields) ? field.pdfFields : []))
    )
  );
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

function SystemCardDevBanner() {
  return (
    <div className="sy-card-notice sy-card-dev-banner" role="status" aria-live="polite">
      <p className="sy-card-dev-banner-lead">
        <strong>Under development</strong>
      </p>
      <p className="sy-card-dev-banner-text">
        This page is still being built. What you see here is only a glimpse of the planned system card editor — it is not fully working yet, and things may change.
      </p>
    </div>
  );
}

function SystemCardEditor({ uid }) {
  const [abfValues, setAbfValues] = useState({});
  const [loading, setLoading] = useState(true);
  const [cardPage, setCardPage] = useState(1);
  const [selectedVisualSectionId, setSelectedVisualSectionId] = useState("sec_1");
  const [assistantMsg, setAssistantMsg] = useState("");
  const [guidedSectionClicked, setGuidedSectionClicked] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const suggestionsMenuRef = useRef(null);
  const [cardRects, setCardRects] = useState(() => ({
    ...buildDefaultRectMap(),
    ...(cardFieldRects || {}),
  }));
  const [calibrateFieldId, setCalibrateFieldId] = useState("abf_no_a");
  const [dragState, setDragState] = useState(null);
  const [resizeState, setResizeState] = useState(null);
  const [saveStatus, setSaveStatus] = useState("idle");
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
        const value = String(getVisibleFieldValue(abfValues, field) || "").trim();
        return value ? count + 1 : count;
      }, 0);
    });
    return out;
  }, [abfValues]);
  const allowedFieldWhitelist = useMemo(() => getAllowedFieldWhitelist(), []);

  const abfValuesForSave = useMemo(() => {
    const out = {};
    Object.keys(abfValues).forEach((key) => {
      if (!allowedFieldWhitelist.has(key)) return;
      out[key] = String(abfValues[key] ?? "").slice(0, 120);
    });
    return out;
  }, [abfValues, allowedFieldWhitelist]);

  const saveCardToAccount = useCallback(async () => {
    if (!uid) return;
    setSaveStatus("saving");
    try {
      await firebase
        .firestore()
        .collection(COLLECTION)
        .doc(uid)
        .set(
          {
            abfValues: abfValuesForSave,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      setSaveStatus("saved");
      window.setTimeout(() => setSaveStatus("idle"), 3500);
    } catch (err) {
      console.error("System card save error:", err);
      setSaveStatus("error");
      window.setTimeout(() => setSaveStatus("idle"), 5000);
    }
  }, [uid, abfValuesForSave]);
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
  // While editing a section, hide preview boxes only for that section (textareas replace them).
  // Other sections' previews stay visible so the card does not "blank out" when you click in.
  const displayedLiveFieldOverlays = useMemo(() => {
    if (!guidedSectionClicked) return liveFieldOverlays;
    return liveFieldOverlays.filter((entry) => entry.sectionId !== selectedVisualSectionId);
  }, [guidedSectionClicked, liveFieldOverlays, selectedVisualSectionId]);
  const selectedSectionCardEditors = useMemo(() => {
    if (!guidedSectionClicked || !selectedVisibleSection) return [];
    return (selectedVisibleSection.fields || [])
      .map((field) => {
        const rect = getRect(field, cardRects);
        if (!rect) return null;
        return { field, rect };
      })
      .filter(Boolean);
  }, [guidedSectionClicked, selectedVisibleSection, cardRects]);

  const selectVisualSection = useCallback((sectionId) => {
    setSelectedVisualSectionId(sectionId);
    setGuidedSectionClicked(true);
  }, []);

  const applySafePatch = useCallback((patchIn) => {
    const patch = { ...(patchIn || {}) };
    Object.keys(patch).forEach((field) => {
      if (!allowedFieldWhitelist.has(field)) {
        delete patch[field];
      }
      if (patch[field]) {
        patch[field] = String(patch[field]).slice(0, 120);
      }
    });
    return patch;
  }, [allowedFieldWhitelist]);

  const applyQuickPatch = useCallback(
    (rawPatch, message) => {
      const safePatch = applySafePatch(rawPatch);
      setAbfValues((prev) => ({ ...prev, ...safePatch }));
      if (message) setAssistantMsg(message);
    },
    [applySafePatch]
  );

  const sectionQuickActions = useMemo(() => {
    if (!selectedVisibleSection) return [];
    if (selectedVisibleSection.id === "sec_2") {
      return [
        {
          id: "qa-better-minor",
          label: "Better minor (3+ clubs, 3+ diamonds)",
          patch: { Open1C: "3+ and 10+ points", Open1D: "3+ and 10+ points" },
        },
        {
          id: "qa-short-club",
          label: "Short club (2+ clubs, 4+ diamonds)",
          patch: { Open1C: "2+ and 10+ points", Open1D: "4+ and 10+ points" },
        },
        {
          id: "qa-4-transfers",
          label: "4 transfers over 1NT",
          patch: {
            Resp1NT2CStyle: "Stayman",
            Resp1NT2D: "Transfer to ♥",
            Resp1NT2H: "Transfer to ♠",
            Resp1NT2S: "Transfer to ♣",
            Resp1NT2NT: "Transfer to ♦",
          },
        },
        {
          id: "qa-natural-weak2",
          label: "Natural weak 2s",
          patch: {
            Open2H: "6+ less than opening hand (natural weak 2)",
            Open2S: "6+ less than opening hand (natural weak 2)",
          },
        },
      ];
    }
    return [
      {
        id: "qa-standard",
        label: "Apply standard notes for this section",
        patch: Object.fromEntries(
          (selectedVisibleSection.fields || []).flatMap((field) =>
            (field.pdfFields || []).slice(0, 1).map((pdfField) => [pdfField, "Standard"])
          )
        ),
      },
      {
        id: "qa-clear",
        label: "Clear this section",
        patch: Object.fromEntries(
          (selectedVisibleSection.fields || []).flatMap((field) =>
            (field.pdfFields || []).slice(0, 1).map((pdfField) => [pdfField, ""])
          )
        ),
      },
    ];
  }, [selectedVisibleSection]);

  const clearSectionPatch = useMemo(
    () =>
      Object.fromEntries(
        (selectedVisibleSection?.fields || []).flatMap((field) =>
          (field.pdfFields || []).slice(0, 1).map((pdfField) => [pdfField, ""])
        )
      ),
    [selectedVisibleSection]
  );

  const suggestionActions = useMemo(
    () => sectionQuickActions.filter((a) => a.id !== "qa-clear"),
    [sectionQuickActions]
  );

  useEffect(() => {
    if (!assistantMsg) return undefined;
    const t = window.setTimeout(() => setAssistantMsg(""), 4000);
    return () => window.clearTimeout(t);
  }, [assistantMsg]);

  useEffect(() => {
    if (!suggestionsOpen) return undefined;
    const onDocMouseDown = (e) => {
      if (suggestionsMenuRef.current && !suggestionsMenuRef.current.contains(e.target)) {
        setSuggestionsOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === "Escape") setSuggestionsOpen(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [suggestionsOpen]);

  useEffect(() => {
    setSuggestionsOpen(false);
  }, [selectedVisualSectionId]);

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
      setAssistantMsg("Copied.");
    } catch (e) {
      setAssistantMsg("Copy failed.");
    }
  }, [rectJsonText]);

  if (loading) {
    return (
      <div className="sy-card-page sy-card-page--abf">
        <SystemCardDevBanner />
        <p className="sy-card-loading">Loading…</p>
      </div>
    );
  }

  return (
    <div
      className={`sy-card-page sy-card-page--abf${
        guidedSectionClicked && !calibrateMode ? " sy-card-page--with-float-bar" : ""
      }`}
    >
      <Helmet>
        <title>My system card — Bridge Champions</title>
        <meta
          name="description"
          content="Fill in your agreements using the same sections as the ABF Standard System Card."
        />
      </Helmet>

      <SystemCardDevBanner />

      <header className="sy-card-hero">
        <div className="sy-card-hero-top">
          <h1 className="sy-card-title">My system card</h1>
          {uid ? (
            <div className="sy-card-save-row">
              <button
                type="button"
                className="sy-card-btn sy-card-btn--primary sy-card-save-btn"
                disabled={saveStatus === "saving"}
                onClick={() => saveCardToAccount()}
              >
                {saveStatus === "saving" ? "Saving…" : "Save card"}
              </button>
              {saveStatus === "saved" && (
                <span className="sy-card-save-feedback" role="status">
                  Saved to your account
                </span>
              )}
              {saveStatus === "error" && (
                <span className="sy-card-save-feedback sy-card-save-feedback--error" role="alert">
                  Could not save. Try again.
                </span>
              )}
            </div>
          ) : (
            <p className="sy-card-login-msg">
              <Link to="/login?redirectTo=/system">Sign in</Link> to save your card to your account.
            </p>
          )}
        </div>
        <div className="sy-card-page-switch" role="tablist" aria-label="ABF system card page">
          <button
            type="button"
            role="tab"
            aria-selected={cardPage === 1}
            className={`sy-card-page-switch-btn${cardPage === 1 ? " sy-card-page-switch-btn--active" : ""}`}
            onClick={() => setCardPage(1)}
          >
            Page 1
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={cardPage === 2}
            className={`sy-card-page-switch-btn${cardPage === 2 ? " sy-card-page-switch-btn--active" : ""}`}
            onClick={() => setCardPage(2)}
          >
            Page 2
          </button>
        </div>
      </header>

      <main className="sy-card-main sy-card-main--visual">
        <section className="sy-card-visual">
          <div
            className={`sy-card-visual-frame${calibrateMode ? " sy-card-visual-frame--calibrate" : ""}`}
            ref={cardFrameRef}
          >
            <img
              src={VISUAL_CARD_IMAGE_BY_PAGE[cardPage]}
              alt={`ABF system card page ${cardPage}`}
              className="sy-card-visual-image"
            />
            <div className="sy-card-live-overlay" aria-hidden="true">
              {displayedLiveFieldOverlays.map((entry) => (
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
            {selectedSectionCardEditors.length > 0 && !calibrateMode && (
              <form
                className="sy-card-edit-layer"
                autoComplete="off"
                onSubmit={(e) => e.preventDefault()}
              >
                {selectedSectionCardEditors.map(({ field, rect }) => (
                  <textarea
                    key={`edit-${field.id}`}
                    className="sy-card-card-input"
                    id={`sy-card-input-${field.id}`}
                    name={`sy-card-field-${field.id}`}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck
                    data-lpignore="true"
                    data-1p-ignore
                    data-form-type="other"
                    style={{
                      top: `${rect.top}%`,
                      left: `${rect.left}%`,
                      width: `${rect.width}%`,
                      height: `${rect.height}%`,
                    }}
                    value={getVisibleFieldValue(abfValues, field)}
                    onChange={(e) =>
                      setAbfValues((prev) => setVisibleFieldValue(prev, field, e.target.value))
                    }
                    placeholder={field.label}
                    title={`Edit ${field.label}`}
                    rows={field.cardRect?.maxLines > 1 ? 2 : 1}
                  />
                ))}
              </form>
            )}
            {calibrateMode && (
              <div className="sy-card-calibration-layer">
                {visibleSectionsForPage.flatMap((sec) =>
                  (sec.fields || []).map((field) => {
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
                  })
                )}
              </div>
            )}
              {!calibrateMode && (
              <div className="sy-card-hotspots">
                {(cardPage === 1 ? VISUAL_HOTSPOTS : VISUAL_HOTSPOTS_PAGE2).map((hotspot) => {
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
      </main>

      {guidedSectionClicked && !calibrateMode && (
        <div className="sy-card-float-bar" role="region" aria-label="Actions for the section you selected on the card">
          <div className="sy-card-float-bar-inner">
            <div className="sy-card-float-bar-text">
              <span className="sy-card-float-bar-lead">You’re editing</span>
              <span className="sy-card-float-bar-title" title={selectedVisibleSection?.title || ""}>
                {selectedVisibleSection?.title || "Section"}
              </span>
              <span className="sy-card-float-bar-hint">Use Clear or Options — then type on the card above.</span>
            </div>
            <div className="sy-card-float-bar-actions" role="toolbar" aria-label="Section actions">
              <button
                type="button"
                className="sy-card-float-btn sy-card-float-btn--primary"
                onClick={() => applyQuickPatch(clearSectionPatch, "Cleared.")}
              >
                Clear section
              </button>
              {suggestionActions.length > 0 && (
                <div className="sy-card-float-menu" ref={suggestionsMenuRef}>
                  <button
                    type="button"
                    className="sy-card-float-btn sy-card-float-btn--primary"
                    aria-haspopup="menu"
                    aria-expanded={suggestionsOpen}
                    aria-controls={suggestionsOpen ? "sy-card-options-menu" : undefined}
                    id="sy-card-options-trigger"
                    onClick={() => setSuggestionsOpen((o) => !o)}
                  >
                    Options
                  </button>
                  {suggestionsOpen && (
                    <ul
                      id="sy-card-options-menu"
                      className="sy-card-float-popover"
                      role="menu"
                      aria-labelledby="sy-card-options-trigger"
                    >
                      {suggestionActions.map((action) => (
                        <li key={action.id} role="none">
                          <button
                            type="button"
                            role="menuitem"
                            className="sy-card-float-popover-item"
                            title={action.label}
                            onClick={() => {
                              applyQuickPatch(action.patch, "Updated.");
                              setSuggestionsOpen(false);
                            }}
                          >
                            {action.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          </div>
          {assistantMsg ? (
            <p className="sy-card-float-status" aria-live="polite">
              {assistantMsg}
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
});

export default connect(mapStateToProps)(SystemCardEditor);
