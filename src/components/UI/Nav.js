import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { firebase } from "../../firebase/config";
import { signOut } from "../../store/actions/authActions";
import "./Nav.css";

// Polished-minimal nav, matched to the Next.js content app's header
// (content-app/app/layout.jsx) so the whole site shares one nav. Normal flow
// (not fixed), like the content app. "Learn" is a full navigation so it hands
// off to the content app rather than rendering a CRA copy.
class Nav extends Component {
  logout = () => {
    // Clear post-checkout session data so it can't accidentally re-activate later.
    try {
      localStorage.removeItem("postCheckoutSessionId");
      localStorage.removeItem("lastStripeCheckoutSessionId");
      localStorage.removeItem("postCheckoutExpectedUid");
    } catch (e) {
      // ignore
    }
    firebase
      .auth()
      .signOut()
      .then(() => {
        this.props.history.push("/");
      });
  };

  goTo = (route) => {
    this.props.history.push(route);
  };

  // Plain left-click → SPA nav (no reload); modifier/middle clicks fall through
  // so "open in new tab" still works.
  navCardClick = (e, route) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    this.goTo(route);
  };

  render() {
    const { uid } = this.props;
    const pathname = this.props.location?.pathname || "";
    const trainerPaths = [
      "/practice",
      "/cardPlay",
      "/declarer",
      "/defence",
      "/bidding",
      "/counting",
      "/treadmill",
      "/beginner/practice",
    ];
    const articlePaths = [
      "/learn",
      "/beginner/articles",
      "/articles",
      "/article/",
      "/cardPlay/articles",
      "/cardPlay/basics",
      "/declarer/articles",
      "/declarer/basics",
      "/defence/articles",
      "/defence/basics",
      "/bidding/advanced",
      "/bidding/basics",
      "/counting/articles",
    ];
    const trainerActive = trainerPaths.some(
      (p) => pathname === p || pathname.startsWith(`${p}/`)
    );
    const articlesActive =
      pathname === "/beginner" ||
      articlePaths.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    const justPlayActive =
      pathname === "/just-play" || pathname.startsWith("/just-play/");

    return (
      <header className="bcnav">
        <div className="bcnav-inner">
          <a
            href="/"
            className="bcnav-logo"
            onClick={(e) => {
              e.preventDefault();
              this.goTo("/");
            }}
            aria-label="Home - Bridge Champions"
          >
            <span className="bcnav-suits" aria-hidden="true">
              <span className="bcnav-s-spade">&spades;</span>
              <span className="bcnav-s-red">&hearts;</span>
              <span className="bcnav-s-red">&diams;</span>
              <span className="bcnav-s-club">&clubs;</span>
            </span>
            Bridge Champions
          </a>

          <div className="bcnav-links" role="navigation" aria-label="Primary">
            {/* Full navigation: /learn is served by the content app. */}
            <a href="/learn" className={articlesActive ? "bcnav-active" : ""}>
              Learn
            </a>
            <a
              href="/practice"
              onClick={(e) => this.navCardClick(e, "/practice")}
              className={trainerActive ? "bcnav-active" : ""}
            >
              Practice
            </a>
            <a
              href="/just-play"
              onClick={(e) => this.navCardClick(e, "/just-play")}
              className={justPlayActive ? "bcnav-active" : ""}
            >
              Just Play
            </a>

            <span className="bcnav-divider" aria-hidden="true" />

            {uid ? (
              <>
                <a
                  href="/settings"
                  onClick={(e) => this.navCardClick(e, "/settings")}
                  className="bcnav-acct"
                >
                  <i className="fas fa-cog" aria-hidden="true" /> Settings
                </a>
                <button
                  type="button"
                  className="bcnav-acct bcnav-acct-btn"
                  onClick={() => this.logout()}
                >
                  <i className="fas fa-sign-out-alt" aria-hidden="true" /> Log out
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  onClick={(e) => {
                    // Avoid stale paywall redirects affecting a normal log in.
                    localStorage.removeItem("contentRedirectId");
                    localStorage.removeItem("contentRedirectType");
                    localStorage.removeItem("contentRedirectAt");
                    this.navCardClick(e, "/login");
                  }}
                  className="bcnav-acct"
                >
                  Log in
                </a>
                <a
                  href="/signup"
                  onClick={(e) => this.navCardClick(e, "/signup")}
                  className="bcnav-acct bcnav-acct-primary"
                >
                  Sign up
                </a>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }
}

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
  email: state.auth.email,
  displayName: state.auth.displayName,
  profilePic: state.auth.photoURL,
  subscriptionExpires: state.auth.subscriptionExpires,
  subscriptionActive: state.auth.subscriptionActive,
  totalQuizScore: state.auth.totalQuizScore,
});

export default withRouter(connect(mapStateToProps, { signOut })(Nav));
