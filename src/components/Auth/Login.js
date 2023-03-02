import React, { Component } from "react";
import { TextInput, Row, Icon, Modal, Button } from "react-materialize"; // Input component was deprecated
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
    localStorage.removeItem("contentRedirectId");
    localStorage.removeItem("contentRedirectType");
    if (lastViewedContentId !== null && lastViewedContentType !== null) {
      this.props.history.push(
        `${lastViewedContentType}/${lastViewedContentId}`
      );
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
        // else this.props.history.push('/');
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
        // else this.props.history.push('/');
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
        // else this.props.history.push('/');
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
    // $('#Login-PasswordForgottenModal').modal('open');
  };
  resetPassword = (e) => {
    e.preventDefault();
    const { emailReset } = this.state;
    firebase
      .auth()
      .sendPasswordResetEmail(emailReset)
      .then(() => {
        console.log("email sent");
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
    // console.log(this.props);
    let containerClass = "";
    if (this.props.history.location.pathname === "/login") {
      containerClass = "Login-container";
    }
    const textStyles = {
      position: "relative",
      left: ".5rem",
      fontWeight: "bold",
      fontSize: "1.6rem",
      marginTop: "1rem",
    };
    return (
      <form onSubmit={this.onSubmit} className={containerClass}>
        {/*<Row style={textStyles}>*/}
        {/*Log in to your BridgeChampions Account*/}
        {/*</Row>*/}
        <br />
        <br />

        <Row>
          {/*<a onClick={this.props.googleLogin}*/}
          <a
            onClick={this.googleLogin}
            style={{ width: "100%" }}
            className="Login-SocialButton btn btn-social btn-google"
          >
            {/*<span className="fa fa-google"></span> Sign in with Google&nbsp;&nbsp;&nbsp;&nbsp;*/}
            <span className="Login-SocialIcon fab fa-google"></span> Sign in
            with Google&nbsp;&nbsp;&nbsp;&nbsp;
          </a>
          <a
            onClick={this.facebookLogin}
            style={{ width: "100%" }}
            className="btn btn-medium btn-social btn-facebook Login-SocialButton"
          >
            {/*<span className="fa fa-facebook"></span> Sign in with Facebook</a>*/}
            <span className="Login-SocialIcon fab fa-facebook-f"></span> Sign in
            with Facebook
          </a>
        </Row>

        <br />
        <br />
        <hr />
        <div className="Login-or">
          <span className="Login-or-text">
            &nbsp;&nbsp;&nbsp;or&nbsp;&nbsp;&nbsp;
          </span>
        </div>
        <Row>
          <TextInput
            email={true}
            type="email"
            s={12}
            m={8}
            label="Email address"
            name="email"
            onChange={this.handleChange}
            value={this.state.email}
            className="Login-input-field"
          >
            <Icon>email</Icon>
          </TextInput>
        </Row>
        <Row>
          <TextInput
            password={true} // type="password"
            label="Password"
            s={12}
            m={8}
            name="password"
            onChange={this.handleChange}
            value={this.state.password}
            className="Login-input-field"
          >
            <Icon>vpn_key</Icon>
          </TextInput>
        </Row>
        <Row>
          <span
            style={{ position: "relative", top: "-2rem", left: ".5rem" }}
            className="red-suit"
          >
            {" "}
            {this.state.err}{" "}
          </span>
        </Row>
        <Row
          style={{
            position: "relative",
            top: "-2.5rem",
            paddingBottom: 0,
            marginBottom: 0,
          }}
        >
          <button
            style={{
              fontWeight: "bold",
              fontSize: "5rem",
              width: "100%",
              position: "relative",
              top: "-1rem",
              marginTop: 0,
              paddingTop: 0,
              fontSize: "1.2rem",
              paddingBottom: 0,
              marginBottom: 0,
            }}
            className="Nav-auth_buttons btn waves-effect waves-light"
            type="submit"
            name="action"
          >
            Log in
            <i className="material-icons right">send</i>
          </button>
        </Row>
        <Row>
          <div>
            <Modal
              id="Login-PasswordForgottenModal"
              header="Forgotten password?"
              bottomSheet
              trigger={
                <div className="Login-info_text Login-forgot_password">
                  <a onClick={(e) => this.openForgottenPasswordModal(e)}>
                    Forgotten your password?
                  </a>
                </div>
              }
            >
              <Row>
                <TextInput
                  email={true}
                  s={8}
                  name="emailReset"
                  placeholder="Enter your login email address"
                  value={this.state.emailReset}
                  onChange={this.handleChange}
                ></TextInput>
              </Row>
              <Row>
                <Button
                  className="CreateArticle-submit"
                  onClick={(e) => this.resetPassword(e)}
                  waves="light"
                >
                  Reset Password
                  <Icon left>done_all</Icon>
                </Button>
              </Row>
            </Modal>
          </div>
          <br />
          <hr />
          <br />
          <div className="Login-info_text">
            Don't have an account? <Link to="/membership">Sign up</Link>
          </div>
        </Row>

        {/*<Row style={{fontWeight: 'bold', fontSize: '1.6rem', marginTop: '0rem', paddingTop: '0rem'}}>*/}
        {/*Log in with your other services:*/}
        {/*</Row>*/}
      </form>
    );
  }
}
export default Login;
