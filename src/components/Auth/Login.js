import React, { Component } from "react";
import { TextInput, Row, Icon, Modal, Button } from "react-materialize";
import { Link } from "react-router-dom";
import { firebase } from "../../firebase/config";
import $ from "jquery";
import "./Login.css";

class Login extends Component {
  state = {
    email: "",
    password: "",
    err: "",
    emailReset: "",
  };

  loginRedirectToContent = () => {
    const params = new URLSearchParams(window.location.search || "");
    const redirectMode = params.get("redirect"); // e.g. "content"

    // Post-checkout redirect: if Stripe sent the user back to /success while logged out,
    // we stash the Checkout Session ID and return here after login.
    const postCheckoutSessionId = localStorage.getItem("postCheckoutSessionId");
    if (postCheckoutSessionId) {
      // Only redirect to /success if this login matches the user who initiated checkout.
      const expectedUid = localStorage.getItem("postCheckoutExpectedUid");
      // If we don't know expectedUid, fall back to old behavior (best effort).
      if (expectedUid && this._lastLoginUid && expectedUid !== this._lastLoginUid) {
        // Wrong account; clear and continue normal redirect.
        localStorage.removeItem("postCheckoutSessionId");
        localStorage.removeItem("postCheckoutExpectedUid");
      } else {
        localStorage.removeItem("postCheckoutSessionId");
        // keep expected uid for /success, it will be cleared after successful activation
        setTimeout(() => {
          this.props.history.push(`/success?session_id=${encodeURIComponent(postCheckoutSessionId)}`);
        }, 500);
        return;
      }
    }

    const lastViewedContentId = localStorage.getItem("contentRedirectId");
    const lastViewedContentType = localStorage.getItem("contentRedirectType");
    const lastViewedAtRaw = localStorage.getItem("contentRedirectAt");
    // Always clear these to prevent redirect loops
    localStorage.removeItem("contentRedirectId");
    localStorage.removeItem("contentRedirectType");
    localStorage.removeItem("contentRedirectAt");
    
    // Only redirect back to locked content if the user explicitly came from the paywall flow.
    // Otherwise, normal logins should land on the homepage.
    const lastViewedAt = Number(lastViewedAtRaw || 0);
    const isRecent = lastViewedAt > 0 && Date.now() - lastViewedAt < 60 * 60 * 1000; // 1 hour
    const shouldRedirectToContent = redirectMode === "content" && isRecent;

    if (shouldRedirectToContent && lastViewedContentId !== null && lastViewedContentType !== null) {
      // Add a small delay to ensure auth state is fully loaded
      setTimeout(() => {
        this.props.history.push(
          `/${lastViewedContentType}/${lastViewedContentId}`
        );
      }, 500);
    } else {
      this.props.history.push("/");
    }
  };

  onSubmit = (e) => {
    e.preventDefault();
    let { email, password } = this.state;
    this.props
      .emailLogin(email, password)
      .then((res) => {
        // Used by loginRedirectToContent to avoid redirecting to /success for the wrong account.
        this._lastLoginUid = res?.uid;
        if (this.props.login) {
          if (this.props.redirectPathAfterAuth) this.props.history.push(this.props.redirectPathAfterAuth);
          else this.props.paypalSubscribe(res.uid);
        } else this.loginRedirectToContent();
      })
      .catch((err) => {
        this.setState({ err: err.message });
      });
  };

  facebookLogin = () => {
    this.props
      .facebookLogin()
      .then((res) => {
        this._lastLoginUid = res?.user?.uid;
        if (this.props.login) {
          if (this.props.redirectPathAfterAuth) this.props.history.push(this.props.redirectPathAfterAuth);
          else this.props.paypalSubscribe(res.user.uid);
        } else this.loginRedirectToContent();
      })
      .catch((err) => {
        this.setState({ err: err.message });
      });
  };

  googleLogin = () => {
    this.props
      .googleLogin()
      .then((res) => {
        this._lastLoginUid = res?.user?.uid;
        if (this.props.login) {
          if (this.props.redirectPathAfterAuth) this.props.history.push(this.props.redirectPathAfterAuth);
          else this.props.paypalSubscribe(res.user.uid);
        } else this.loginRedirectToContent();
      })
      .catch((err) => {
        this.setState({ err: err.message });
      });
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  openForgottenPasswordModal = (e) => {
    e.preventDefault();
  };
  
  resetPassword = (e) => {
    e.preventDefault();
    const { emailReset } = this.state;
    firebase
      .auth()
      .sendPasswordResetEmail(emailReset)
      .then(() => {
        let modal = $(".modal");
        let modalOverlay = $(".modal-overlay");
        modal.removeClass("open");
        modal.removeAttr("style");
        modalOverlay.remove();
        $("body").css({ overflow: "auto" });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  render() {
    const { email, password, err, forgottenPasswordModalOpen, emailReset } = this.state;

    return (
      <div className="Login-container">
        <div className="Login-card">
          <div className="Login-header">
            <h1 className="Login-title">Welcome Back</h1>
            <p className="Login-subtitle">Sign in to continue to Bridge Champions</p>
          </div>

          {err && <div className="Login-error">{err}</div>}

          <form onSubmit={this.onSubmit} className="Login-form">
            <div className="Login-input-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                className="Login-input-field"
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
                required
              />
            </div>

            <div className="Login-input-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                className="Login-input-field"
                type="password"
                name="password"
                value={password}
                onChange={this.handleChange}
                required
              />
              <div 
                className="Login-forgot_password" 
                onClick={this.openForgottenPasswordModal}
              >
                Forgot password?
              </div>
            </div>

            <button type="submit" className="Login-submit-button">
              Sign In
            </button>
          </form>

          <div className="Login-footer">
            <span style={{fontSize: '1.3rem', color: '#666'}}>Don't have an account? </span>
            <Link to="/signup" className="Login-footer-link">Sign up</Link>
          </div>
        </div>

        {forgottenPasswordModalOpen && (
          <Modal open={true}>
            <div className="BCModal-content">
              <button className="BCModal-close modal-close" aria-label="Close dialog" title="Close">
                <i className="material-icons">close</i>
              </button>
              <h4>Reset Password</h4>
              <input
                type="email"
                placeholder="Enter your email"
                value={emailReset}
                onChange={(e) => this.setState({ emailReset: e.target.value })}
              />
              <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
                <button className="btn-flat modal-close">Cancel</button>
                <button className="btn" onClick={this.resetPassword}>Send Reset Email</button>
              </div>
            </div>
          </Modal>
        )}
      </div>
    );
  }
}
export default Login;
