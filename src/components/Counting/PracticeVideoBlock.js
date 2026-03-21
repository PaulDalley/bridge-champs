import React, { useRef, useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * Inline practice video: embed when user can watch, locked "Upgrade to watch" otherwise.
 * Uses YouTube IFrame API to reset to start when video ends, avoiding end-screen ads/suggestions.
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
      const shortsMatch = u.pathname.match(/^\/shorts\/([a-zA-Z0-9_-]+)/);
      if (shortsMatch) return shortsMatch[1];
    }
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1).split("/")[0];
  } catch (_) {}
  return null;
}

function loadYouTubeAPI() {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT && window.YT.Player) return Promise.resolve();
  return new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prev) prev();
      resolve();
    };
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    } else {
      const check = () => (window.YT ? resolve() : setTimeout(check, 50));
      check();
    }
  });
}

function PracticeVideoBlock({ videoUrl, isPremium, label, className = "", isAdmin }) {
  const canWatch = isPremium || isAdmin;
  const videoId = getYouTubeVideoId(videoUrl);
  const embedRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!canWatch || !videoId || !embedRef.current) return;
    loadYouTubeAPI().then(() => {
      if (!embedRef.current) return;
      playerRef.current = new window.YT.Player(embedRef.current, {
        videoId,
        playerVars: { rel: 0, modestbranding: 1 },
        events: {
          onStateChange(ev) {
            if (ev.data === window.YT.PlayerState.ENDED) {
              const p = playerRef.current;
              if (p && p.seekTo && p.pauseVideo) {
                p.seekTo(0.1);
                p.pauseVideo();
              }
            }
          },
        },
      });
    });
    return () => {
      if (playerRef.current && playerRef.current.destroy) playerRef.current.destroy();
      playerRef.current = null;
    };
  }, [canWatch, videoId]);

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
          <div ref={embedRef} className="ct-practiceVideo-embedInner" />
        </div>
      </div>
    );
  }

  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  return (
    <div className={`ct-practiceVideo ct-practiceVideo--locked ${className}`.trim()}>
      {label && <div className="ct-practiceVideo-label">{label}</div>}
      <div className={`ct-practiceVideo-locked ${thumbnailUrl ? "ct-practiceVideo-locked--withThumb" : ""}`} style={thumbnailUrl ? { backgroundImage: `url(${thumbnailUrl})` } : undefined}>
        <div className="ct-practiceVideo-lockedOverlay">
          <span className="ct-practiceVideo-lockedIcon" aria-hidden="true">🔒</span>
          <p className="ct-practiceVideo-lockedText">Premium video</p>
          <p className="ct-practiceVideo-lockedSublabel">Start a 7-day free trial to watch</p>
          <Link
            to="/membership"
            className="ct-practiceVideo-upgradeBtn"
            onClick={() => {
              if (typeof sessionStorage !== "undefined") sessionStorage.setItem("subscription_upgrade_source", "video");
            }}
          >
            Start 7-day free trial
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PracticeVideoBlock;
