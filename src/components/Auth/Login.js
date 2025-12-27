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
    const lastViewedContentId = localStorage.getItem("contentRedirectId");
    const lastViewedContentType = localStorage.getItem("contentRedirectType");
    // Always clear these to prevent redirect loops
    localStorage.removeItem("contentRedirectId");
    localStorage.removeItem("contentRedirectType");
    
    if (lastViewedContentId !== null && lastViewedContentType !== null) {
      // Add a small delay to ensure auth state is fully loaded
      setTimeout(() => {
        this.props.history.push(
          `${lastViewedContentType}/${lastViewedContentId}`
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
        if (this.props.login) this.props.paypalSubscribe(res.uid);
        else this.loginRedirectToContent();
      })
      .catch((err) => {
        this.setState({ err: err.message });
      });
  };

  facebookLogin = () => {
    this.props
      .facebookLogin()
      .then((res) => {
        if (this.props.login) this.props.paypalSubscribe(res.user.uid);
        else this.loginRedirectToContent();
      })
      .catch((err) => {
        this.setState({ err: err.message });
      });
  };

  googleLogin = () => {
    this.props
      .googleLogin()
      .then((res) => {
        if (this.props.login) this.props.paypalSubscribe(res.user.uid);
        else this.loginRedirectToContent();
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

          <div className="Login-social-buttons">
            <button type="button" onClick={this.googleLogin} className="Login-SocialButton btn-google">
              <i className="Login-SocialIcon fab fa-google"></i>
              Sign in with Google
            </button>
            
            <button type="button" onClick={this.facebookLogin} className="Login-SocialButton btn-facebook">
              <i className="Login-SocialIcon fab fa-facebook-f"></i>
              Sign in with Facebook
            </button>
          </div>

          <div className="Login-divider">
            <span className="Login-divider-text">or</span>
          </div>

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
            <Link to="/membership" className="Login-footer-link">Sign up</Link>
          </div>
        </div>

        {forgottenPasswordModalOpen && (
          <Modal open={true}>
            <h4>Reset Password</h4>
            <input
              type="email"
              placeholder="Enter your email"
              value={emailReset}
              onChange={(e) => this.setState({ emailReset: e.target.value })}
            />
            <button onClick={this.resetPassword}>Send Reset Email</button>
          </Modal>
        )}
      </div>
    );
  }
}
export default Login;
