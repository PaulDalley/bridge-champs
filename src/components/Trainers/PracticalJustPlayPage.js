import React from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PlayTable from "../PlayTable/PlayTable";
import "../PlayTable/PlayTable.css";

/**
 * "Just Play" — its own top-level page (promoted out of Practical Learning).
 * Members-only: gated on the same auth state the rest of the premium pages use
 * (subscriptionActive / admin), with a localhost bypass for development and a
 * ?mockUnsub=1 override to preview the locked screen locally.
 */
function PracticalJustPlayPage({ subscriptionActive, isAdmin, authReady }) {
  const isLocalhost =
    typeof window !== "undefined" && /^(localhost|127\.0\.0\.1)/.test(window.location.hostname);
  const mockUnsub =
    typeof window !== "undefined" && new URLSearchParams(window.location.search).get("mockUnsub") === "1";
  const canView = (isLocalhost && !mockUnsub) || isAdmin || !!subscriptionActive;

  if (!authReady) {
    return (
      <div className="pt-justPlayPage">
        <Helmet>
          <title>Just Play — Bridge Champions</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <p className="pt-lockedWait">Checking access…</p>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="pt-justPlayPage pt-justPlayPage--locked">
        <Helmet>
          <title>Just Play — Members</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="pt-lockedCard">
          <h1 className="pt-lockedTitle">Just Play is for members</h1>
          <p className="pt-lockedText">
            Playing full deals against the BEN engine is part of membership. Join or log in to start playing.
          </p>
          <div className="pt-lockedActions">
            <Link to="/membership" className="pt-tbBtn pt-tbBtn--primary">
              View membership
            </Link>
            <Link to="/" className="pt-lockedBack">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-justPlayPage">
      <Helmet>
        <title>Just Play — Bridge Champions</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <PlayTable embedded />
    </div>
  );
}

export default connect(({ auth }) => ({
  subscriptionActive: !!auth.subscriptionActive,
  isAdmin: auth.a === true,
  authReady: !!auth.authReady,
}))(PracticalJustPlayPage);
