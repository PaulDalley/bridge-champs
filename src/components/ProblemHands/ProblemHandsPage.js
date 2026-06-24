import React from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { PROBLEM_HANDS } from "./problemHandsData";
import "./ProblemHands.css";

function ProblemHandsPage({ uid, subscriptionActive, isAdmin, authReady }) {
  const isLocalhost =
    typeof window !== "undefined" &&
    /^(localhost|127\.0\.0\.1)/.test(window.location.hostname);
  const canView = isLocalhost || isAdmin || !!subscriptionActive;

  if (!authReady) {
    return (
      <div className="ph-listPage">
        <Helmet>
          <title>Problem Hands — Bridge Champions</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <p>Checking access…</p>
      </div>
    );
  }

  if (!canView) {
    const loggedIn = !!uid;
    return (
      <div className="ph-listPage ph-gate">
        <Helmet>
          <title>Problem Hands — Members</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1>Problem Hands is for members</h1>
        <Link
          to={`/membership?redirectTo=/just-play/problem-hands`}
          className="ph-btn ph-btn--primary"
        >
          {loggedIn ? "View membership" : "Sign up"}
        </Link>
      </div>
    );
  }

  return (
    <div className="ph-listPage">
      <Helmet>
        <title>Problem Hands — Bridge Champions</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="ph-backBar">
        <Link to="/just-play/practice" className="ph-back">
          ← Just Play
        </Link>
      </div>
      <h1>Problem Hands</h1>
      <p>Play a specific hand against the computer, then review the solution.</p>
      <div className="ph-list">
        {PROBLEM_HANDS.map((p, i) => (
          <Link
            key={p.id}
            to={`/just-play/problem-hands/${p.id}`}
            className="ph-listItem"
          >
            <span className="ph-listNum">{i + 1}</span>
            <span className="ph-listTitle">{p.title}</span>
            <span className="ph-listArrow">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  uid: state.auth?.uid,
  subscriptionActive: state.auth?.subscriptionActive === true,
  isAdmin: state.auth?.a === true,
  authReady: state.auth?.authReady === true,
});

export default connect(mapStateToProps)(ProblemHandsPage);
