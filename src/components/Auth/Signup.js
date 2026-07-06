import React, { Component } from "react";
import { Link } from "react-router-dom";
import { firebase } from "../../firebase/config";
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

class Signup extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    showPassword: false,
    showConfirm: false,
    err: "",
    submitting: false,
  };

  onSubmit = (e) => {
    e.preventDefault();
    if (this.state.submitting) return;
    const { email, password, passwordConfirm, firstName, lastName } = this.state;
    const firstNameTrim = (firstName || "").trim();
    const lastNameTrim = (lastName || "").trim();
    if (!firstNameTrim || !lastNameTrim) {
      this.setState({ err: "Please enter your first and last name." });
      return;
    }
    if (password !== passwordConfirm) {
      this.setState({ err: "Your passwords do not match." });
      return;
    }
    this.setState({ err: "", submitting: true });
    this.props
      .emailLogin(email, password)
      .then((res) => {
        const user = res.user || res;
        const uid = user.uid;
        return firebase
          .firestore()
          .collection("membersData")
          .doc(uid)
          .set({ firstName: firstNameTrim, surname: lastNameTrim }, { merge: true })
          .then(() => {
            const displayName = `${firstNameTrim} ${lastNameTrim}`.trim();
            if (user && user.updateProfile && displayName) {
              return user.updateProfile({ displayName });
            }
          })
          .then(() => {
            if (this.props.setProfileName) {
              this.props.setProfileName(firstNameTrim, lastNameTrim);
            }
          })
          .then(() => {
            if (this.props.signup) {
              this.props.paypalSubscribe(uid);
            } else {
              this.props.history.push(this.props.redirectPathAfterAuth || "/membership");
            }
          });
      })
      .catch((err) => {
        this.setState({ err: err.message, submitting: false });
      });
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSocialAuthError = (err) => {
    const code = err && err.code;
    if (code === "auth/popup-closed-by-user" || code === "auth/cancelled-popup-request") {
      this.setState({ err: "", submitting: false });
      return;
    }
    if (code === "auth/account-exists-with-different-credential") {
      const forEmail = err.email ? ` for ${err.email}` : "";
      this.setState({
        err: `You already have an account${forEmail} using a different sign-in method. Please sign in the way you first signed up — email and password, Google, or Facebook.`,
        submitting: false,
      });
      return;
    }
    this.setState({ err: err.message, submitting: false });
  };

  afterSocialAuth = (res) => {
    const uid = (res.user || res).uid;
    if (this.props.signup) {
      this.props.paypalSubscribe(uid);
    } else {
      this.props.history.push(this.props.redirectPathAfterAuth || "/membership");
    }
  };

  facebookLogin = () => {
    if (this.state.submitting) return;
    this.setState({ err: "", submitting: true });
    this.props
      .facebookLogin()
      .then(this.afterSocialAuth)
      .catch(this.handleSocialAuthError);
  };

  googleLogin = () => {
    if (this.state.submitting) return;
    this.setState({ err: "", submitting: true });
    this.props
      .googleLogin()
      .then(this.afterSocialAuth)
      .catch(this.handleSocialAuthError);
  };

  render() {
    const { embedded, embeddedTitle, embeddedSubtitle } = this.props;
    const loginLink = this.props.redirectPathAfterAuth
      ? `/login?redirectTo=${encodeURIComponent(this.props.redirectPathAfterAuth)}`
      : "/login";

    const title = embedded ? embeddedTitle || "Create username to play" : "Create Account";
    const subtitle = embedded
      ? embeddedSubtitle || "Same details as our site sign up. You can keep practising below."
      : "Sign up to start your bridge journey";

    return (
      <div className={embedded ? "Signup-container Signup-container--embedded" : "Signup-container"}>
        <div className="Signup-card">
          <div className="Signup-hero">
            <div className="Signup-logo" aria-hidden="true">&spades;</div>
            {/* Embedded signups sit on a page that already has its own <h1>, so use
                <h2> there to avoid two <h1>s. Standalone auth pages keep <h1>. */}
            {embedded ? (
              <h2 className="Signup-title">{title}</h2>
            ) : (
              <h1 className="Signup-title">{title}</h1>
            )}
            <p className="Signup-subtitle">{subtitle}</p>
          </div>

          <div className="Signup-sheet">
            {this.state.err && <div className="Signup-error">{this.state.err}</div>}

            <div className="Signup-social">
              <button
                type="button"
                className="Signup-social-btn"
                onClick={this.googleLogin}
                disabled={this.state.submitting}
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="Signup-divider">
              <span>or sign up with email</span>
            </div>

            <form className="Signup-form" onSubmit={this.onSubmit}>
              <div className="Signup-input-row">
                <div className="Signup-input-group Signup-input-half">
                  <label htmlFor="signup-first-name">First name</label>
                  <input
                    id="signup-first-name"
                    className="Signup-input-field browser-default"
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    onChange={this.handleChange}
                    value={this.state.firstName}
                    required
                    placeholder="First name"
                  />
                </div>
                <div className="Signup-input-group Signup-input-half">
                  <label htmlFor="signup-last-name">Last name</label>
                  <input
                    id="signup-last-name"
                    className="Signup-input-field browser-default"
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    onChange={this.handleChange}
                    value={this.state.lastName}
                    required
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="Signup-input-group">
                <label htmlFor="signup-email">Email address</label>
                <input
                  id="signup-email"
                  className="Signup-input-field browser-default"
                  type="email"
                  name="email"
                  autoComplete="email"
                  onChange={this.handleChange}
                  value={this.state.email}
                  required
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="Signup-input-group Signup-input-group--password">
                <label htmlFor="signup-password">Password</label>
                <div className="Signup-password-wrap">
                  <input
                    id="signup-password"
                    className="Signup-input-field browser-default"
                    type={this.state.showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="new-password"
                    onChange={this.handleChange}
                    value={this.state.password}
                    required
                    placeholder="Create a secure password"
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
              </div>

              <div className="Signup-input-group Signup-input-group--password">
                <label htmlFor="signup-password-confirm">Confirm password</label>
                <div className="Signup-password-wrap">
                  <input
                    id="signup-password-confirm"
                    className="Signup-input-field browser-default"
                    type={this.state.showConfirm ? "text" : "password"}
                    name="passwordConfirm"
                    autoComplete="new-password"
                    onChange={this.handleChange}
                    value={this.state.passwordConfirm}
                    required
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    className="Signup-eye"
                    onClick={() => this.setState((s) => ({ showConfirm: !s.showConfirm }))}
                    aria-label={this.state.showConfirm ? "Hide password" : "Show password"}
                  >
                    {this.state.showConfirm ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="Signup-submit-button"
                disabled={this.state.submitting}
                aria-busy={this.state.submitting}
              >
                {this.state.submitting ? "Creating your account…" : "Create Account"}
              </button>
            </form>

            <div className="Signup-footer">
              <span>Already have an account? </span>
              {this.props.onSwitchToLogin ? (
                <a
                  href="#login"
                  className="Signup-footer-link"
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.onSwitchToLogin();
                  }}
                >
                  Sign in
                </a>
              ) : (
                <Link to={loginLink} className="Signup-footer-link">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
