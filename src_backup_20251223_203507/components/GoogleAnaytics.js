import React from "react";
import { withRouter } from "react-router-dom";
// import { withRouter } from "../hoc/withRouter";

// import { GA_TRACKING_ID } from '../config';
const GA_TRACKING_ID = "UA-115190704-1";

class GoogleAnalytics extends React.Component {
  componentWillUpdate({ location, history }) {
    const gtag = window.gtag;
    // console.log("IN GOOGLE ANALYTICS COMPONENT");
    // console.log(gtag);

    if (location.pathname === this.props.location.pathname) {
      // don't log identical link clicks (nav links likely)
      return;
    }
    if (history.action === "PUSH" && typeof gtag === "function") {
      gtag("config", GA_TRACKING_ID, {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      });
    }
  }
  render() {
    return null;
  }
}

export default withRouter(GoogleAnalytics);
