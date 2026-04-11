import React from "react";
import "./BeginnerScratchBanner.css";

/**
 * Shown on /beginner/practice/* and beginner article hubs.
 */
function BeginnerScratchBanner() {
  return (
    <div className="beginner-scratch-banner" role="status">
      <strong className="beginner-scratch-banner-label">New:</strong>
      <span className="beginner-scratch-banner-text">
        {" "}
        We&apos;re adding practice hands and lessons often — typically weekly, and videos are being added shortly. Check back as we post more.
      </span>
    </div>
  );
}

export default BeginnerScratchBanner;
