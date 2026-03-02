import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { firebase } from "../../firebase/config";

const pathFromLocation = (location) => {
  if (!location) return "";
  const p = location.pathname || "";
  const s = location.search || "";
  const h = location.hash || "";
  return `${p}${s}${h}`;
};

class ActivityLogger extends Component {
  state = { lastLoggedPath: null, lastLoggedUid: null };

  componentDidMount() {
    this.logPageViewIfReady();
  }

  componentDidUpdate(prevProps) {
    const prevPath = pathFromLocation(prevProps.location);
    const nextPath = pathFromLocation(this.props.location);

    // User just became available (or switched accounts) in this tab.
    if (prevProps.uid !== this.props.uid && this.props.uid) {
      this.logEvent("login", { path: nextPath });
      this.setState({ lastLoggedUid: this.props.uid, lastLoggedPath: null });
    }

    if (prevPath !== nextPath) {
      this.logEvent("page_view", { path: nextPath });
    }
  }

  logPageViewIfReady = () => {
    const path = pathFromLocation(this.props.location);
    this.logEvent("page_view", { path });
  };

  logEvent = (eventType, extra = {}) => {
    const { uid, email } = this.props;
    if (!uid) return; // basic mode: only log activity for signed-in users

    const path = String(extra.path || "");
    // Cheap dedupe for rapid re-renders.
    if (eventType === "page_view" && this.state.lastLoggedUid === uid && this.state.lastLoggedPath === path) return;

    try {
      firebase
        .firestore()
        .collection("activityLogs")
        .add({
          eventType,
          uid,
          email: email || null,
          path,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          // Basic debugging context (optional but useful)
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent : null,
        })
        .catch(() => {});
    } catch (e) {
      // ignore
    }

    if (eventType === "page_view") {
      this.setState({ lastLoggedUid: uid, lastLoggedPath: path });
    }
  };

  render() {
    return null;
  }
}

const mapStateToProps = (state) => {
  const uid = state?.auth?.uid || null;
  const email = state?.auth?.email || state?.auth?.user?.email || null;
  return { uid, email };
};

export default connect(mapStateToProps)(withRouter(ActivityLogger));

