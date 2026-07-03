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
  uid,
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

  // Signed-in users must never be shown the sign-in / sign-up form. We track
  // whether an auth attempt was made *from here* so we only bounce users who
  // ARRIVED already authenticated — a fresh login submitted on this page is left
  // to Login/Signup's own post-auth redirect. Fixes a logged-in user landing on
  // /login (e.g. via the "Account" link) and seeing "Welcome Back — Sign in".
  const attemptedRef = React.useRef(false);
  const mark = (fn) => (...args) => {
    attemptedRef.current = true;
    return fn && fn(...args);
  };
  const googleLogin = mark(startGoogleLogin);
  const facebookLogin = mark(startFacebookLogin);
  const emailLogin = mark(startEmailAndPasswordLogin);
  const signupLogin = mark(signupEmailAndPasswordLogin);
  const onStandaloneAuthPage = currentPath === "/login" || currentPath === "/signup";
  const bounceSignedIn = onStandaloneAuthPage && !!uid && !attemptedRef.current;
  React.useEffect(() => {
    if (bounceSignedIn) history.replace(effectiveRedirectPathAfterAuth || "/settings");
  }, [bounceSignedIn]);
  if (bounceSignedIn) return null;

  // Standalone /login and /signup render full-bleed (their own full-page
  // template) — no Materialize Col/Card chrome, so there's no card-in-a-card.
  // The embedded membership/treadmill cases below keep the card shell.
  if (currentPath === "/login") {
    return (
      <Login
        facebookLogin={facebookLogin}
        googleLogin={googleLogin}
        emailLogin={emailLogin}
        history={history}
        redirectPathAfterAuth={effectiveRedirectPathAfterAuth}
      />
    );
  }
  if (currentPath === "/signup") {
    return (
      <Signup
        facebookLogin={facebookLogin}
        googleLogin={googleLogin}
        emailLogin={signupLogin}
        setProfileName={setProfileName}
        history={history}
        notMember={true}
        redirectPathAfterAuth={effectiveRedirectPathAfterAuth}
      />
    );
  }

  return (
    <div>
      <Col m={12} s={12}>
        {/*<Card style={{maxWidth: '50rem'}}>*/}
        <Card className="AuthComponent-container">
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

const mapStateToProps = (state) => ({ uid: state.auth.uid });
export default connect(mapStateToProps, mapDispatchToProps)(AuthComponent);
