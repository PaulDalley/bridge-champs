import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

// GA4 Measurement ID - must match the id in public/index.html
const GA4_MEASUREMENT_ID = "G-VC7DZTPE7E";

function setGA4User(gtag, uid, email, displayName, subscriptionActive, tier) {
  if (typeof gtag !== "function") return;
  if (uid) {
    gtag("config", GA4_MEASUREMENT_ID, { user_id: uid, send_page_view: false });
    gtag("set", "user_properties", {
      email: email || "(not set)",
      display_name: displayName || "(not set)",
      subscription_active: subscriptionActive === true ? "yes" : "no",
      tier: tier || "(not set)",
    });
  }
  // Do not set user_id for anonymous users (never use "" — GA4 would treat that as one shared id and collapse everyone)
}

function clearGA4UserOnLogout(gtag) {
  if (typeof gtag !== "function") return;
  gtag("config", GA4_MEASUREMENT_ID, { user_id: null, send_page_view: false });
  gtag("set", "user_properties", {
    email: "",
    display_name: "",
    subscription_active: "",
    tier: "",
  });
}

function sendPageView(gtag, location) {
  if (typeof gtag !== "function" || !location) return;
  gtag("event", "page_view", {
    page_title: document.title,
    page_location: window.location.href,
    page_path: (location.pathname || "") + (location.search || "") + (location.hash || ""),
  });
}

class GoogleAnalytics extends React.Component {
  componentDidMount() {
    const gtag = window.gtag;
    const { uid, email, displayName, subscriptionActive, tier } = this.props;
    setGA4User(gtag, uid, email, displayName, subscriptionActive, tier);
    // Do not send page_view here: index.html already sends one so every visitor is counted even if React is slow or gtag loads late
  }

  componentDidUpdate(prevProps) {
    const gtag = window.gtag;
    const { location, history, uid, email, displayName, subscriptionActive, tier } = this.props;

    // Update GA4 user when auth changes (login/logout or subscription update)
    if (
      prevProps.uid !== uid ||
      prevProps.email !== email ||
      prevProps.displayName !== displayName ||
      prevProps.subscriptionActive !== subscriptionActive ||
      prevProps.tier !== tier
    ) {
      if (uid) {
        setGA4User(gtag, uid, email, displayName, subscriptionActive, tier);
      } else if (prevProps.uid) {
        clearGA4UserOnLogout(gtag);
      }
    }

    // Page view on any URL change (navigation, back/forward, query/hash updates)
    const pathChanged = location.pathname !== prevProps.location.pathname;
    const searchChanged = (location.search || "") !== (prevProps.location.search || "");
    const hashChanged = (location.hash || "") !== (prevProps.location.hash || "");
    if (pathChanged || searchChanged || hashChanged) {
      sendPageView(gtag, location);
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  uid: state.auth?.uid ?? "",
  email: state.auth?.email ?? "",
  displayName: state.auth?.displayName ?? "",
  subscriptionActive: state.auth?.subscriptionActive ?? false,
  tier: state.auth?.tier ?? "",
});

export default connect(mapStateToProps)(withRouter(GoogleAnalytics));
