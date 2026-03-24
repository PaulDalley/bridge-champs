import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./Signup.css";

class Signup extends Component {
  state = {
    email: "",
    password: "",
    passwordConfirm: "",
    err: "",
  };

  onSubmit = (e) => {
    e.preventDefault();
    let { email, password, passwordConfirm } = this.state;
    if (password === passwordConfirm) {
      this.setState({ err: "" });
      this.props
        .emailLogin(email, password)
        .then((res) => {
          const user = res.user || res;
          const uid = user.uid;
          if (this.props.signup) {
            this.props.paypalSubscribe(uid);
          } else {
            this.props.history.push(this.props.redirectPathAfterAuth || "/membership");
          }
        })
        .catch((err) => {
          this.setState({ err: err.message });
        });
    } else {
      this.setState({ err: "Your passwords do not match." });
    }
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
          // do with:
          // res.profile.first_name
          // res.profile.last_name
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
          // console.log(res.user.uid);
          this.props.paypalSubscribe(res.user.uid);
        } else this.props.history.push(this.props.redirectPathAfterAuth || "/membership");
      })
      .catch((err) => {
        this.setState({ err: err.message });
      });
  };

  render() {
    const loginLink = this.props.redirectPathAfterAuth
      ? `/login?redirectTo=${encodeURIComponent(this.props.redirectPathAfterAuth)}`
      : "/login";

    return (
      <div className="Signup-container">
        <div className="Signup-card">
          <div className="Signup-header">
            <h1 className="Signup-title">Create Account</h1>
            <p className="Signup-subtitle">Sign up to start your bridge journey</p>
          </div>

          {this.state.err && <div className="Signup-error">{this.state.err}</div>}

          <form className="Signup-form" onSubmit={this.onSubmit}>
            <div className="Signup-input-group">
              <label htmlFor="signup-email">Email address</label>
              <input
                id="signup-email"
                className="Signup-input-field"
                type="email"
                name="email"
                onChange={this.handleChange}
                value={this.state.email}
                required
                placeholder="your.email@example.com"
              />
            </div>

            <div className="Signup-input-group">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                className="Signup-input-field"
                type="password"
                name="password"
                onChange={this.handleChange}
                value={this.state.password}
                required
                placeholder="Create a secure password"
              />
            </div>

            <div className="Signup-input-group">
              <label htmlFor="signup-password-confirm">Confirm password</label>
              <input
                id="signup-password-confirm"
                className="Signup-input-field"
                type="password"
                name="passwordConfirm"
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
              <Link to={loginLink} className="Signup-footer-link">Sign in</Link>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default Signup;
