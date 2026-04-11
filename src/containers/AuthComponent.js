import React from "react";
import { connect } from "react-redux";
import { Card, Col } from "react-materialize";
import {
  startEmailAndPasswordLogin,
  startFacebookLogin,
  startGoogleLogin,
  signupEmailAndPasswordLogin,
  setProfileName,
} from "../store/actions/authActions";

import Login from "../components/Auth/Login";
import Signup from "../components/Auth/Signup";

const AuthComponent = ({
  location,
  startGoogleLogin,
  startFacebookLogin,
  startEmailAndPasswordLogin,
  signupEmailAndPasswordLogin,
  setProfileName,
  history,
  signup,
  login,
  paypalSubscribe,
  redirectPathAfterAuth,
  switchToLogin,
  switchToSignup,
}) => {
  // console.log(history);
  let currentPath = location?.pathname;
  const params = new URLSearchParams(location?.search || "");
  const redirectFromQuery = params.get("redirectTo");
  const effectiveRedirectPathAfterAuth = redirectPathAfterAuth || redirectFromQuery || undefined;

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
              redirectPathAfterAuth={effectiveRedirectPathAfterAuth}
            />
          )}
          {currentPath === "/signup" && (
            <Signup
              facebookLogin={startFacebookLogin}
              googleLogin={startGoogleLogin}
              emailLogin={signupEmailAndPasswordLogin}
              setProfileName={setProfileName}
              history={history}
              notMember={true}
              redirectPathAfterAuth={effectiveRedirectPathAfterAuth}
            />
          )}
          {signup && (
            <Signup
              facebookLogin={startFacebookLogin}
              googleLogin={startGoogleLogin}
              emailLogin={signupEmailAndPasswordLogin}
              setProfileName={setProfileName}
              history={history}
              notMember={true}
              signup={true}
              paypalSubscribe={paypalSubscribe}
              redirectPathAfterAuth={effectiveRedirectPathAfterAuth}
              onSwitchToLogin={switchToLogin}
            />
          )}
          {login && (
            <Login
              facebookLogin={startFacebookLogin}
              googleLogin={startGoogleLogin}
              emailLogin={startEmailAndPasswordLogin}
              history={history}
              notMember={true}
              login={true}
              paypalSubscribe={paypalSubscribe}
              redirectPathAfterAuth={effectiveRedirectPathAfterAuth}
              onSwitchToSignup={switchToSignup}
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
  setProfileName: (firstName, surname) => dispatch(setProfileName(firstName, surname)),
});

export default connect(undefined, mapDispatchToProps)(AuthComponent);
