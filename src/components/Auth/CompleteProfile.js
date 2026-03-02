import React, { Component } from "react";
import { connect } from "react-redux";
import { firebase } from "../../firebase/config";
import { setProfileName } from "../../store/actions/authActions";
import "./CompleteProfile.css";

class CompleteProfile extends Component {
  state = {
    firstName: (this.props.firstName || "").trim(),
    surname: (this.props.surname || "").trim(),
    err: "",
    saving: false,
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, err: "" });
  };

  componentDidMount() {
    const { uid, firstName, surname, history } = this.props;
    const hasName = (firstName != null && firstName !== "") && (surname != null && surname !== "");
    if (uid && hasName) {
      history.replace("/");
    }
  }

  onSubmit = (e) => {
    e.preventDefault();
    const { firstName, surname } = this.state;
    const firstNameTrim = (firstName || "").trim();
    const surnameTrim = (surname || "").trim();
    if (!firstNameTrim || !surnameTrim) {
      this.setState({ err: "Please enter both first name and surname." });
      return;
    }
    const uid = this.props.uid;
    if (!uid) {
      this.setState({ err: "Not logged in." });
      return;
    }
    this.setState({ saving: true, err: "" });
    const user = firebase.auth().currentUser;
    firebase
      .firestore()
      .collection("membersData")
      .doc(uid)
      .set({ firstName: firstNameTrim, surname: surnameTrim }, { merge: true })
      .then(() => {
        const displayName = [firstNameTrim, surnameTrim].join(" ").trim();
        if (displayName && user && user.updateProfile) {
          return user.updateProfile({ displayName });
        }
      })
      .then(() => {
        this.props.dispatch(setProfileName(firstNameTrim, surnameTrim));
        this.setState({ saving: false });
        this.props.history.push("/");
      })
      .catch((err) => {
        this.setState({ err: err.message || "Something went wrong.", saving: false });
      });
  };

  render() {
    const { firstName, surname, err, saving } = this.state;

    return (
      <div className="CompleteProfile-container">
        <div className="CompleteProfile-card">
          <div className="CompleteProfile-header">
            <h1 className="CompleteProfile-title">Complete your profile</h1>
            <p className="CompleteProfile-subtitle">
              Please provide your name so we can personalise your experience.
            </p>
          </div>

          {err && <div className="CompleteProfile-error">{err}</div>}

          <form className="CompleteProfile-form" onSubmit={this.onSubmit}>
            <div className="CompleteProfile-input-row">
              <div className="CompleteProfile-input-group CompleteProfile-input-half">
                <label htmlFor="complete-firstName">First name</label>
                <input
                  id="complete-firstName"
                  className="CompleteProfile-input-field"
                  type="text"
                  name="firstName"
                  value={firstName}
                  onChange={this.handleChange}
                  required
                  placeholder="First name"
                  autoComplete="given-name"
                  disabled={saving}
                />
              </div>
              <div className="CompleteProfile-input-group CompleteProfile-input-half">
                <label htmlFor="complete-surname">Surname</label>
                <input
                  id="complete-surname"
                  className="CompleteProfile-input-field"
                  type="text"
                  name="surname"
                  value={surname}
                  onChange={this.handleChange}
                  required
                  placeholder="Surname"
                  autoComplete="family-name"
                  disabled={saving}
                />
              </div>
            </div>
            <button type="submit" className="CompleteProfile-submit-button" disabled={saving}>
              {saving ? "Saving…" : "Continue"}
            </button>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
  firstName: state.auth.firstName,
  surname: state.auth.surname,
});

export default connect(mapStateToProps)(CompleteProfile);
