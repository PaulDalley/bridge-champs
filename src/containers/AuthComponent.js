import React from "react";
import { connect } from "react-redux";
import { Card, Col } from "react-materialize";
import {
  startEmailAndPasswordLogin,
  startFacebookLogin,
  startGoogleLogin,
  signupEmailAndPasswordLogin,
} from "../store/actions/authActions";

import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";

const AuthComponent = ({
  location,
  startGoogleLogin,
  startFacebookLogin,
  startEmailAndPasswordLogin,
  signupEmailAndPasswordLogin,
  history,
  signup,
  login,
  paypalSubscribe,
}) => {
  // console.log(history);
  let currentPath = location?.pathname;

  return (
    <div>
      <Col m={12} s={12}>
        {/*<Card style={{maxWidth: '50rem'}}>*/}
        <Card className="AuthComponent-container">
          {currentPath === "/login" && (
            <Login
              facebookLogin={startFacebookLogin}
              googleLogin={startGoogleLogin}
              emailLogin={startEmailAndPasswordLogin}
              history={history}
            />
          )}
          {currentPath === "/signup" && (
            <Signup
              facebookLogin={startFacebookLogin}
              googleLogin={startGoogleLogin}
              emailLogin={signupEmailAndPasswordLogin}
              history={history}
              notMember={true}
            />
          )}
          {signup && !login && (
            <Signup
              facebookLogin={startFacebookLogin}
              googleLogin={startGoogleLogin}
              emailLogin={signupEmailAndPasswordLogin}
              history={history}
              notMember={true}
              signup={signup}
              paypalSubscribe={paypalSubscribe}
            />
          )}
          {login && !signup && (
            <Login
              facebookLogin={startFacebookLogin}
              googleLogin={startGoogleLogin}
              emailLogin={startEmailAndPasswordLogin}
              history={history}
              notMember={true}
              login={login}
              paypalSubscribe={paypalSubscribe}
            />
          )}
        </Card>
      </Col>
    </div>
  );
};
const mapDispatchToProps = (dispatch) => ({
  startFacebookLogin: () => dispatch(startFacebookLogin()),
  startGoogleLogin: () => dispatch(startGoogleLogin()),
  startEmailAndPasswordLogin: (email, password) =>
    dispatch(startEmailAndPasswordLogin(email, password)),
  signupEmailAndPasswordLogin: (email, password) =>
    dispatch(signupEmailAndPasswordLogin(email, password)),
});

export default connect(undefined, mapDispatchToProps)(AuthComponent);
