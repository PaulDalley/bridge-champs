import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./BeginnerGuestSignupNudge.css";

const STORAGE_KEY = "beginnerPracticeSignupNudgeDismissed_v1";

/**
 * Soft prompt for guests on /beginner/practice/* to create a free account (non-blocking, dismissible).
 */
function BeginnerGuestSignupNudge({ uid, authReady, redirectPath }) {
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });

  const dismiss = useCallback(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setDismissed(true);
  }, []);

  if (!authReady) return null;
  if (uid) return null;
  if (dismissed) return null;

  const safeRedirect = (redirectPath || "/beginner/practice/declarer").trim() || "/beginner/practice/declarer";
  const signupTo = {
    pathname: "/signup",
    search: `?redirectTo=${encodeURIComponent(safeRedirect)}`,
  };

  return (
    <div className="BeginnerGuestSignupNudge" role="region" aria-label="Optional free account">
      <div className="BeginnerGuestSignupNudge-inner">
        <p className="BeginnerGuestSignupNudge-copy">
          <span className="BeginnerGuestSignupNudge-eyebrow">Optional</span> Free account (about 30 seconds): save
          your place on these hands, hear when new beginner lessons go live, and stay in touch.
        </p>
        <div className="BeginnerGuestSignupNudge-actions">
          <Link to={signupTo} className="BeginnerGuestSignupNudge-cta btn btn-small waves-effect waves-light">
            Create free account
          </Link>
          <button type="button" className="BeginnerGuestSignupNudge-dismiss" onClick={dismiss}>
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  uid: state.auth?.uid,
  authReady: state.auth?.authReady === true,
});

export default connect(mapStateToProps)(BeginnerGuestSignupNudge);
