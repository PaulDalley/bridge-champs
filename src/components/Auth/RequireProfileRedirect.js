import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

/**
 * When user is logged in but membersData has no firstName/surname,
 * redirect to /complete-profile. Uses withRouter (React Router v4).
 */
class RequireProfileRedirect extends Component {
  checkRedirect = () => {
    const { uid, firstName, surname, history, location } = this.props;
    const pathname = (location && location.pathname) || "";
    if (!uid) return;
    const hasName = (firstName != null && firstName !== "") || (surname != null && surname !== "");
    if (hasName) return;
    if (pathname === "/complete-profile" || pathname === "/login" || pathname === "/signup") return;
    history.replace("/complete-profile");
  };

  componentDidMount() {
    this.checkRedirect();
  }

  componentDidUpdate() {
    this.checkRedirect();
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
  firstName: state.auth.firstName,
  surname: state.auth.surname,
});

export default withRouter(connect(mapStateToProps)(RequireProfileRedirect));
