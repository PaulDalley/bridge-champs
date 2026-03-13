import React from "react";
import { Link } from "react-router-dom";

/**
 * Inline practice video: embed when user can watch, locked "Upgrade to watch" otherwise.
 * Props: videoUrl, isPremium, label, className, isAdmin
 */
function getYouTubeVideoId(url) {
  if (!url || typeof url !== "string") return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const embedMatch = u.pathname.match(/^\/embed\/([a-zA-Z0-9_-]+)/);
      if (embedMatch) return embedMatch[1];
    }
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0];
  } catch (_) {}
  return null;
}

function PracticeVideoBlock({ videoUrl, isPremium, label, className = "", isAdmin }) {
  const canWatch = isPremium || isAdmin;
  const videoId = getYouTubeVideoId(videoUrl);

  if (!videoUrl) {
    if (isAdmin) {
      return (
        <div className={`ct-practiceVideo ct-practiceVideo--adminEmpty ${className}`.trim()}>
          <div className="ct-practiceVideo-sublabel">No video URL (admin only)</div>
        </div>
      );
    }
    return null;
  }

  if (canWatch && videoId) {
    return (
      <div className={`ct-practiceVideo ${className}`.trim()}>
        {label && <div className="ct-practiceVideo-label">{label}</div>}
        <div className="ct-practiceVideo-embed">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            title={label || "Practice video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`ct-practiceVideo ct-practiceVideo--locked ${className}`.trim()}>
      {label && <div className="ct-practiceVideo-label">{label}</div>}
      <div className="ct-practiceVideo-locked">
        <span className="ct-practiceVideo-lockedIcon" aria-hidden="true">🔒</span>
        <p className="ct-practiceVideo-lockedText">Premium video</p>
        <p className="ct-practiceVideo-lockedSublabel">Upgrade to watch</p>
        <Link
          to="/membership"
          className="ct-practiceVideo-upgradeBtn"
          onClick={() => {
            if (typeof sessionStorage !== "undefined") sessionStorage.setItem("subscription_upgrade_source", "video");
          }}
        >
          Upgrade to watch
        </Link>
      </div>
    </div>
  );
}

export default PracticeVideoBlock;
