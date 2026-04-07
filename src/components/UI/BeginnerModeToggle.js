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
      <div className="BeginnerModeToggle-title">New to bridge?</div>
      <div className="BeginnerModeToggle-choice" role="group" aria-label="Beginner track or full library">
        <button
          type="button"
          className={`BeginnerModeToggle-option ${enabled ? "BeginnerModeToggle-option--active" : ""}`}
          onClick={selectYes}
          aria-pressed={enabled}
          title="Yes — beginner track"
        >
          <span className="BeginnerModeToggle-optionLabel">Yes</span>
          {enabled && <span className="BeginnerModeToggle-tick">✓</span>}
        </button>
        <button
          type="button"
          className={`BeginnerModeToggle-option ${!enabled ? "BeginnerModeToggle-option--active" : ""}`}
          onClick={selectNo}
          aria-pressed={!enabled}
          title="No — full library"
        >
          <span className="BeginnerModeToggle-optionLabel">No</span>
          {!enabled && <span className="BeginnerModeToggle-tick">✓</span>}
        </button>
      </div>
      <div className="BeginnerModeToggle-modeHint">
        {enabled ? "Mode: Beginner — starter lessons." : "Mode: Standard — full library."}
      </div>
      <div className="BeginnerModeToggle-subtitle BeginnerModeToggle-subtitle--footer">
        Beginner lessons or the full library — switch anytime.
      </div>
    </div>
  );
}

export default BeginnerModeToggle;
