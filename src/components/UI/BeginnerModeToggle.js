import React from "react";
import "./BeginnerModeToggle.css";

function BeginnerModeToggle({ visible, enabled, onToggle }) {
  if (!visible) return null;
  const selectYes = () => {
    if (!enabled) onToggle();
  };
  const selectNo = () => {
    if (enabled) onToggle();
  };

  return (
    <div className="BeginnerModeToggle-wrap">
      <div className="BeginnerModeToggle-title">Show beginner content?</div>
      <div className="BeginnerModeToggle-subtitle">
        Switch between two separate content libraries:
        beginner-focused lessons or standard Bridge Champions training.
      </div>
      <div className="BeginnerModeToggle-choice" role="group" aria-label="Show beginner content setting">
        <button
          type="button"
          className={`BeginnerModeToggle-option ${enabled ? "BeginnerModeToggle-option--active" : ""}`}
          onClick={selectYes}
          aria-pressed={enabled}
          title="Use beginner-only content library"
        >
          <span className="BeginnerModeToggle-optionLabel">Yes</span>
          {enabled && <span className="BeginnerModeToggle-tick">✓</span>}
        </button>
        <button
          type="button"
          className={`BeginnerModeToggle-option ${!enabled ? "BeginnerModeToggle-option--active" : ""}`}
          onClick={selectNo}
          aria-pressed={!enabled}
          title="Use standard content library"
        >
          <span className="BeginnerModeToggle-optionLabel">No</span>
          {!enabled && <span className="BeginnerModeToggle-tick">✓</span>}
        </button>
      </div>
      <div className="BeginnerModeToggle-modeHint">
        {enabled
          ? "Current mode: Beginner set (rules, foundations, starter-level content)."
          : "Current mode: Standard set (full Bridge Champions content)."}
      </div>
    </div>
  );
}

export default BeginnerModeToggle;
