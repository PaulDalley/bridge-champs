import React, { Component } from "react";
import { Link } from "react-router-dom";
import { firebase } from "../../firebase/config";
import "./Signup.css";

class Signup extends Component {
  state = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
    err: "",
  };

  onSubmit = (e) => {
    e.preventDefault();
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
    this.setState({ err: "" });
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
        this.setState({ err: err.message });
      });
  };

  handleChange = (e) => {
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  facebookLogin = () => {
    this.props
      .facebookLogin()
      .then((res) => {
        if (this.props.signup) {
          this.props.paypalSubscribe(res.user.uid);
        } else this.props.history.push(this.props.redirectPathAfterAuth || "/membership");
      })
      .catch((err) => {
        this.setState({ err: err.message });
      });
  };

  googleLogin = () => {
    this.props
      .googleLogin()
      .then((res) => {
        if (this.props.signup) {
          this.props.paypalSubscribe(res.user.uid);
        } else this.props.history.push(this.props.redirectPathAfterAuth || "/membership");
      })
      .catch((err) => {
        this.setState({ err: err.message });
      });
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
          <div className="Signup-header">
            <h1 className="Signup-title">{title}</h1>
            <p className="Signup-subtitle">{subtitle}</p>
          </div>

          {this.state.err && <div className="Signup-error">{this.state.err}</div>}

          <form className="Signup-form" onSubmit={this.onSubmit}>
            <div className="Signup-input-row">
              <div className="Signup-input-group Signup-input-half">
                <label htmlFor="signup-first-name">First name</label>
                <input
                  id="signup-first-name"
                  className="Signup-input-field"
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
                  className="Signup-input-field"
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
                className="Signup-input-field"
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
              <input
                id="signup-password"
                className="Signup-input-field"
                type="password"
                name="password"
                autoComplete="new-password"
                onChange={this.handleChange}
                value={this.state.password}
                required
                placeholder="Create a secure password"
              />
            </div>

            <div className="Signup-input-group Signup-input-group--password">
              <label htmlFor="signup-password-confirm">Confirm password</label>
              <input
                id="signup-password-confirm"
                className="Signup-input-field"
                type="password"
                name="passwordConfirm"
                autoComplete="new-password"
                onChange={this.handleChange}
                value={this.state.passwordConfirm}
                required
                placeholder="Re-enter your password"
              />
            </div>

            <button type="submit" className="Signup-submit-button">
              Create Account
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
    );
  }
}

export default Signup;
