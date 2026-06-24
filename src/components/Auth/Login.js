import React, { Component } from "react";
import { Modal } from "react-materialize";
import { Link } from "react-router-dom";
import { firebase } from "../../firebase/config";
import "./Login.css";
import "./Signup.css";

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.3-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.5 0 10.4-2.1 14.1-5.5l-6.5-5.5C29.6 34.8 26.9 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.6 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.5 5.5C39.9 36.5 44 31 44 24c0-1.3-.1-2.3-.4-3.5z" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="#1877F2" d="M24 12c0-6.6-5.4-12-12-12S0 5.4 0 12c0 6 4.4 11 10.1 11.9v-8.4H7.1V12h3V9.4c0-3 1.8-4.6 4.5-4.6 1.3 0 2.7.2 2.7.2v2.9h-1.5c-1.5 0-2 .9-2 1.9V12h3.3l-.5 3.5h-2.8v8.4C19.6 23 24 18 24 12z" />
  </svg>
);

class Login extends Component {
  state = {
    email: "",
    password: "",
    showPassword: false,
    err: "",
    emailReset: "",
    forgottenPasswordModalOpen: false,
    resetPasswordMessage: "",
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
        this.props.history.push(`/${lastViewedContentType}/${lastViewedContentId}`);
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
        const credUser = res?.user ?? res;
        this._lastLoginUid = credUser?.uid;
        if (this.props.redirectPathAfterAuth) {
          this.props.history.push(this.props.redirectPathAfterAuth);
          return;
        }
        if (this.props.login) {
          if (this.props.paypalSubscribe) this.props.paypalSubscribe(credUser.uid);
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
        if (this.props.redirectPathAfterAuth) {
          this.props.history.push(this.props.redirectPathAfterAuth);
          return;
        }
        if (this.props.login) {
          if (this.props.paypalSubscribe) this.props.paypalSubscribe(res.user.uid);
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
        if (this.props.redirectPathAfterAuth) {
          this.props.history.push(this.props.redirectPathAfterAuth);
          return;
        }
        if (this.props.login) {
          if (this.props.paypalSubscribe) this.props.paypalSubscribe(res.user.uid);
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
    this.setState({
      forgottenPasswordModalOpen: true,
      emailReset: this.state.email || "",
      resetPasswordMessage: "",
    });
  };

  closeForgottenPasswordModal = () => {
    this.setState({ forgottenPasswordModalOpen: false, resetPasswordMessage: "" });
  };

  resetPassword = (e) => {
    e.preventDefault();
    const { emailReset } = this.state;
    if (!emailReset || !emailReset.trim()) {
      this.setState({ resetPasswordMessage: "Please enter your email address." });
      return;
    }
    this.setState({ resetPasswordMessage: "" });
    firebase
      .auth()
      .sendPasswordResetEmail(emailReset.trim())
      .then(() => {
        this.setState({
          resetPasswordMessage:
            "Check your email — we sent you a link to reset your password. If you don't see it within a few minutes, check your junk or spam folder.",
        });
        setTimeout(() => {
          this.closeForgottenPasswordModal();
          this.setState({ emailReset: "" });
        }, 2500);
      })
      .catch((err) => {
        const msg =
          err.code === "auth/user-not-found"
            ? "No account found with that email."
            : err.code === "auth/invalid-email"
              ? "Please enter a valid email address."
              : err.message || "Something went wrong. Please try again.";
        this.setState({ resetPasswordMessage: msg });
      });
  };

  render() {
    const { email, password, err, forgottenPasswordModalOpen, emailReset, resetPasswordMessage } = this.state;
    const { embedded, idPrefix = "" } = this.props;
    const signupLink = this.props.redirectPathAfterAuth
      ? `/signup?redirectTo=${encodeURIComponent(this.props.redirectPathAfterAuth)}`
      : "/signup";
    const emailId = `${idPrefix}email`;
    const passwordId = `${idPrefix}password`;

    const content = (
      <div className={embedded ? "Signup-container Signup-container--embedded" : "Signup-container"}>
        <div className="Signup-card">
          <div className="Signup-hero">
            <div className="Signup-logo" aria-hidden="true">&spades;</div>
            {embedded ? (
              <h2 className="Signup-title">Welcome Back</h2>
            ) : (
              <h1 className="Signup-title">Welcome Back</h1>
            )}
            <p className="Signup-subtitle">Sign in to continue to Bridge Champions</p>
          </div>

          <div className="Signup-sheet">
            {err && <div className="Signup-error">{err}</div>}

            <div className="Signup-social">
              <button type="button" className="Signup-social-btn" onClick={this.googleLogin}>
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
              <button type="button" className="Signup-social-btn" onClick={this.facebookLogin}>
                <FacebookIcon />
                <span>Continue with Facebook</span>
              </button>
            </div>

            <div className="Signup-divider">
              <span>or sign in with email</span>
            </div>

            <form onSubmit={this.onSubmit} className="Signup-form">
              <div className="Signup-input-group">
                <label htmlFor={emailId}>Email</label>
                <input
                  id={emailId}
                  className="Signup-input-field browser-default"
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleChange}
                  autoComplete="email"
                  required
                />
              </div>

              <div className="Signup-input-group Signup-input-group--password">
                <label htmlFor={passwordId}>Password</label>
                <div className="Signup-password-wrap">
                  <input
                    id={passwordId}
                    className="Signup-input-field browser-default"
                    type={this.state.showPassword ? "text" : "password"}
                    name="password"
                    value={password}
                    onChange={this.handleChange}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="Signup-eye"
                    onClick={() => this.setState((s) => ({ showPassword: !s.showPassword }))}
                    aria-label={this.state.showPassword ? "Hide password" : "Show password"}
                  >
                    {this.state.showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                <button type="button" className="Signup-forgot" onClick={this.openForgottenPasswordModal}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="Signup-submit-button">
                Sign In
              </button>
            </form>

            <div className="Signup-footer">
              <span>Don't have an account? </span>
              {this.props.onSwitchToSignup ? (
                <a
                  href="#signup"
                  className="Signup-footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.onSwitchToSignup();
                  }}
                >
                  Sign up
                </a>
              ) : (
                <Link to={signupLink} className="Signup-footer-link">
                  Sign up
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );

    const modal = forgottenPasswordModalOpen && (
      <Modal open={true}>
        <div className="BCModal-content">
          <button
            type="button"
            className="BCModal-close modal-close"
            aria-label="Close dialog"
            title="Close"
            onClick={this.closeForgottenPasswordModal}
          >
            <i className="material-icons">close</i>
          </button>
          <h4>Reset Password</h4>
          <p className="grey-text text-darken-2" style={{ marginBottom: "1rem" }}>
            Enter the email address for your account and we&apos;ll send you a link to reset your password.
          </p>
          <input
            type="email"
            placeholder="Enter your email"
            value={emailReset}
            onChange={(e) => this.setState({ emailReset: e.target.value, resetPasswordMessage: "" })}
          />
          {resetPasswordMessage && (
            <p
              className={
                resetPasswordMessage.startsWith("No account") || resetPasswordMessage.includes("valid")
                  ? "red-text"
                  : "green-text"
              }
              style={{ marginTop: "0.5rem" }}
            >
              {resetPasswordMessage}
            </p>
          )}
          <div style={{ marginTop: "1.25rem", display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button type="button" className="btn-flat" onClick={this.closeForgottenPasswordModal}>
              Cancel
            </button>
            <button type="button" className="btn" onClick={this.resetPassword}>
              Send Reset Email
            </button>
          </div>
        </div>
      </Modal>
    );

    return (
      <>
        {content}
        {modal}
      </>
    );
  }
}

export default Login;
