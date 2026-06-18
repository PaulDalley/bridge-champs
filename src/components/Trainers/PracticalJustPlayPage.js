import React from "react";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import Signup from "../Auth/Signup";
import {
  startFacebookLogin,
  startGoogleLogin,
  signupEmailAndPasswordLogin,
  setProfileName,
} from "../../store/actions/authActions";
import PlayTable from "../PlayTable/PlayTable";
import "../PlayTable/PlayTable.css";

/**
 * "Just Play" — its own top-level page. Members-only: subscribers/admins get the
 * live table; everyone else sees a non-interactive preview of it plus, for guests,
 * a sign-up form right on the page (logged-in non-members get a subscribe prompt).
 * Gated on the same auth state as the other premium pages (localhost bypass for
 * dev; ?mockUnsub=1 previews the locked screen).
 */
function PracticalJustPlayPage({
  history,
  uid,
  subscriptionActive,
  isAdmin,
  authReady,
  facebookLogin,
  googleLogin,
  signupEmail,
  setProfileNameFn,
}) {
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
    const loggedIn = !!uid;
    return (
      <div className="pt-justPlayPage pt-gate">
        <Helmet>
          <title>Just Play — Members</title>
          <meta name="robots" content="noindex" />
        </Helmet>

        <div className="pt-gateHeader">
          <h1 className="pt-gateTitle">Just Play is for members</h1>
          <p className="pt-gateText">
            Bid and play full deals against the computer. {loggedIn ? "Subscribe to start." : "Sign up to start."}
          </p>
        </div>

        <div className="pt-gateBody">
          <div className="pt-gatePreview" aria-hidden="true">
            <span className="pt-gatePreviewBadge">Preview</span>
            <div className="pt-gatePreviewInner">
              <PlayTable preview />
            </div>
          </div>

          <div className="pt-gateSignup">
            {loggedIn ? (
              <div className="pt-gateSubscribe">
                <Link to="/membership?redirectTo=/just-play/practice" className="pt-tbBtn pt-tbBtn--primary">
                  View membership
                </Link>
              </div>
            ) : (
              <Signup
                embedded
                embeddedTitle="Create your account"
                embeddedSubtitle="Then choose a membership to start playing."
                facebookLogin={facebookLogin}
                googleLogin={googleLogin}
                emailLogin={signupEmail}
                setProfileName={setProfileNameFn}
                history={history}
                redirectPathAfterAuth="/membership?redirectTo=/just-play/practice"
              />
            )}
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
      <div className="pt-jpBar">
        <Link to="/weekly" className="pt-jpTournamentBtn">
          <i className="fas fa-trophy" aria-hidden="true" /> Play weekly tournament
        </Link>
      </div>
      <PlayTable embedded />
    </div>
  );
}

const mapStateToProps = (state) => ({
  uid: state.auth?.uid,
  subscriptionActive: state.auth?.subscriptionActive === true,
  isAdmin: state.auth?.a === true,
  authReady: state.auth?.authReady === true,
});

const mapDispatchToProps = (dispatch) => ({
  facebookLogin: () => dispatch(startFacebookLogin()),
  googleLogin: () => dispatch(startGoogleLogin()),
  signupEmail: (email, password) => dispatch(signupEmailAndPasswordLogin(email, password)),
  setProfileNameFn: (firstName, surname) => dispatch(setProfileName(firstName, surname)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PracticalJustPlayPage));
