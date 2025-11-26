import React, { Component } from "react";
import { TextInput, Row, Icon } from "react-materialize"; // Input component deprecated
import "./Signup.css";

class Signup extends Component {
  state = {
    email: "",
    password: "",
    passwordConfirm: "",
    err: "",
  };

  // componentDidMount() {
  //     console.log(this.props);
  // }

  onSubmit = (e) => {
    e.preventDefault();
    let { email, password, passwordConfirm } = this.state;
    if (password === passwordConfirm) {
      this.setState({ err: "" });
      this.props
        .emailLogin(email, password)
        .then((res) => {
          // console.log(res);
          if (this.props.signup) {
            this.props.paypalSubscribe(res.uid);
          } else this.props.history.push("/membership");
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
        } else this.props.history.push("/membership");
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
        } else this.props.history.push("/membership");
      })
      .catch((err) => {
        this.setState({ err: err.message });
      });
  };

  render() {
    // this.props.becomingPremiumMember
    // console.log(this.props.signup);

    const textStyles = {
      position: "relative",
      left: ".5rem",
      fontWeight: "bold",
      fontSize: "1.6rem",
      marginTop: "1rem",
    };
    const rowMargins = "2px";

    return (
      <div className="Signup-container">
        <form className="Signup-container" onSubmit={this.onSubmit}>
          {/*{this.props.signup && <Row style={textStyles}>*/}
          {/*Create a BridgeChampions account*/}
          {/*</Row> }*/}
          {/*{!this.props.signup && <Row style={textStyles}>*/}
          {/*Create a new BridgeChampions account*/}
          {/*</Row> }*/}
          <Row>
            <a
              onClick={this.googleLogin}
              style={{ width: "100%" }}
              className="Login-SocialButton btn btn-social btn-google"
            >
              {/*<span className="fa fa-google"></span> Sign up with Google&nbsp;&nbsp;&nbsp;&nbsp;*/}
              <span className="Login-SocialIcon fab fa-google"></span> Sign up
              with Google&nbsp;&nbsp;&nbsp;&nbsp;
            </a>
            <a
              onClick={this.facebookLogin}
              style={{ width: "100%" }}
              className="Login-SocialButton btn btn-medium btn-social btn-facebook"
            >
              {/*<span className="fa fa-facebook"></span> Sign up with Facebook </a>*/}
              <span className="Login-SocialIcon fab fa-facebook-f"></span> Sign
              up with Facebook
            </a>
          </Row>

          <br />
          <hr />
          <div className="Login-or">
            <span className="Login-or-text">
              &nbsp;&nbsp;&nbsp;or&nbsp;&nbsp;&nbsp;
            </span>
          </div>

          <Row style={{ marginBottom: rowMargins }}>
            <TextInput
              email={true}
              // type="email"
              s={12}
              m={8}
              label="Email address"
              name="email"
              onChange={this.handleChange}
              value={this.state.email}
              className="validate Login-input-field"
              icon={"email"}
            >
              {/* <Icon>email</Icon> */}
            </TextInput>
          </Row>
          <Row style={{ marginBottom: rowMargins }}>
            <TextInput
              password={true}
              // type="password"
              label="Password"
              s={12}
              m={8}
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
              className="Login-input-field"
              icon={"vpn_key"}
            >
              {/* <Icon>vpn_key</Icon> */}
            </TextInput>
          </Row>
          <Row style={{ marginBottom: rowMargins }}>
            <TextInput
              password={true}
              // type="password"
              label="Confirm password"
              s={12}
              m={8}
              name="passwordConfirm"
              onChange={this.handleChange}
              value={this.state.passwordConfirm}
              className="Login-input-field"
              icon={"vpn_key"}
            >
              {/* <Icon>vpn_key</Icon> */}
            </TextInput>
          </Row>
          <Row style={{ marginTop: "3px" }}>
            <span
              style={{ position: "relative", top: "-2rem", left: ".5rem" }}
              className="red-suit"
            >
              {this.state.err}
            </span>
          </Row>
          <Row
            style={{
              fontWeight: "bold",
              fontSize: "5rem",
              position: "relative",
              top: "-2.5rem",
              paddingBottom: 0,
              marginBottom: 0,
            }}
          >
            <button
              style={{
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
              Sign up
              <i className="material-icons right">send</i>
            </button>
          </Row>

          {/*<Row style={{fontWeight: 'bold', fontSize: '1.6rem', marginTop: '0rem', paddingTop: '0rem'}}>*/}
          {/*You may also use your existing services to register and log in to our site*/}
          {/*</Row>*/}
        </form>
      </div>
    );
  }
}
export default Signup;
