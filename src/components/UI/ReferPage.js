import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import toastr from "toastr";
import { firebase } from "../../firebase/config";
import "./ReferPage.css";

class ReferPage extends Component {
  state = {
    loading: false,
    referralCode: "",
  };

  componentDidMount() {
    this.handleAuthRoutingAndLoad();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.uid !== this.props.uid ||
      prevProps.authReady !== this.props.authReady
    ) {
      this.handleAuthRoutingAndLoad();
    }
  }

  handleAuthRoutingAndLoad = () => {
    const { uid, authReady, history } = this.props;
    if (!authReady) return;
    if (!uid) {
      const redirect = encodeURIComponent("/refer");
      history.push(`/login?redirect=${redirect}`);
      return;
    }
    if (!this.state.referralCode && !this.state.loading) {
      this.ensureReferralCode();
    }
  };

  buildReferralCode = (uid) => {
    const safeUid = String(uid || "")
      .replace(/[^a-zA-Z0-9]/g, "")
      .toUpperCase();
    const padded = safeUid.padEnd(10, "X");
    const head = padded.slice(0, 5);
    const tail = padded.slice(-5);
    return `REF-${head}-${tail}`;
  };

  getReferralLink = (code) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://bridgechampions.com";
    return `${origin}/membership?ref=${encodeURIComponent(code)}`;
  };

  ensureReferralCode = async () => {
    const { uid } = this.props;
    if (!uid) return;
    this.setState({ loading: true });
    const generatedCode = this.buildReferralCode(uid);
    try {
      const ref = firebase.firestore().collection("members").doc(uid);
      let existing = "";
      try {
        const snap = await ref.get();
        const memberData = snap.exists ? snap.data() || {} : {};
        existing = typeof memberData.referralCode === "string" ? memberData.referralCode.trim() : "";
      } catch (readErr) {
        console.warn("Referral code read failed; falling back to generated code", readErr);
      }

      const referralCode = existing || generatedCode;
      // Always show a link if we have a UID, even if Firestore read/write has a transient issue.
      this.setState({ referralCode, loading: false });

      if (!existing) {
        await ref.set(
          {
            referralCode,
            referralCodeCreatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (err) {
      console.error("Failed to prepare referral code", err);
      // Non-blocking fallback: still provide a deterministic referral link.
      this.setState({ referralCode: generatedCode, loading: false });
      toastr.warning("Referral link loaded, but we could not sync it right now. Please try again later.");
    }
  };

  copyText = async (value, successMessage) => {
    try {
      await navigator.clipboard.writeText(value);
      toastr.success(successMessage);
    } catch (err) {
      toastr.error("Could not copy automatically. Please copy manually.");
    }
  };

  render() {
    const { referralCode, loading } = this.state;
    const referralLink = referralCode ? this.getReferralLink(referralCode) : "";

    return (
      <div className="ReferPage">
        <Helmet>
          <title>Refer a Friend | Bridge Champions</title>
          <meta
            name="description"
            content="Share your Bridge Champions referral link and invite friends to join."
          />
          <meta name="robots" content="noindex,follow" />
        </Helmet>

        <div className="ReferPage-card">
          <p className="ReferPage-eyebrow">Refer a Friend</p>
          <h1 className="ReferPage-title">Share your referral link in seconds</h1>
          <p className="ReferPage-body">
            1. Click Copy Link
          </p>
          <p className="ReferPage-body">
            2. Send it to a friend or bridge partner.
          </p>
          <p className="ReferPage-body">
            3. Get a free month*
          </p>

          <div className="ReferPage-section">
            <p className="ReferPage-label">Your generated referral link</p>
            <div className="ReferPage-inline">
              <input
                className="ReferPage-input ReferPage-input--readonly"
                type="text"
                readOnly
                value={loading ? "Loading..." : referralLink}
              />
              <button
                type="button"
                className="ReferPage-btn"
                disabled={loading || !referralLink}
                onClick={() => this.copyText(referralLink, "Referral link copied")}
              >
                Copy link
              </button>
            </div>
          </div>

          <p className="ReferPage-footnote">
            * Free month only after the user stays past their trial period.
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
  authReady: state.auth.authReady,
});

export default withRouter(connect(mapStateToProps)(ReferPage));
