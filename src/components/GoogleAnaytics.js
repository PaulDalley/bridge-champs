import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

// GA4 Measurement ID - must match the id in public/index.html
const GA4_MEASUREMENT_ID = "G-VC7DZTPE7E";

function setGA4User(gtag, uid, email, displayName, subscriptionActive, tier) {
  if (typeof gtag !== "function") return;
  if (uid) {
    gtag("config", GA4_MEASUREMENT_ID, { user_id: uid });
    gtag("set", "user_properties", {
      email: email || "(not set)",
      display_name: displayName || "(not set)",
      subscription_active: subscriptionActive === true ? "yes" : "no",
      tier: tier || "(not set)",
    });
  } else {
    gtag("config", GA4_MEASUREMENT_ID, { user_id: "" });
    gtag("set", "user_properties", {
      email: "",
      display_name: "",
      subscription_active: "",
      tier: "",
    });
  }
}

class GoogleAnalytics extends React.Component {
  componentDidMount() {
    const gtag = window.gtag;
    const { uid, email, displayName, subscriptionActive, tier } = this.props;
    setGA4User(gtag, uid, email, displayName, subscriptionActive, tier);
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
      setGA4User(gtag, uid, email, displayName, subscriptionActive, tier);
    }

    // Page view on route change
    if (location.pathname !== prevProps.location.pathname && history.action === "PUSH") {
      if (typeof gtag === "function") {
        gtag("config", GA4_MEASUREMENT_ID, {
          page_title: document.title,
          page_location: window.location.href,
          page_path: location.pathname + (location.search || "") + (location.hash || ""),
        });
      }
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
