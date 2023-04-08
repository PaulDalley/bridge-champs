import React, { Component } from "react";
import { connect } from "react-redux";
import DisplayUserInfo from "./DisplayUserInfo";
import UpdateProfileProperty from "./UpdateProfileProperty";
import "./Profile.css";
import { Row, Col, Modal, Button, Icon, ProgressBar } from "react-materialize";
import $ from "jquery";
import { firebase } from "../../firebase/config";
import toastr from "toastr";
import {
  changeSubscriptionActiveStatus,
  resetUserProfileBlank,
} from "../../store/actions/authActions";

// https://firebase.google.com/docs/auth/web/manage-users
class Profile extends Component {
  state = {
    username: "Anonymous",
    cancelPending: false,
  };

  componentWillUpdate(nextProps, nextState) {
    if (this.state.username !== nextProps.username) {
      this.setState({ username: nextProps.username });
    }
  }

  componentDidMount() {
    // console.log("--- HELLO FROM PROFILE ---");
    // console.log(this.props.auth);

    toastr.options = {
      closeButton: false,
      debug: false,
      newestOnTop: true,
      progressBar: false,
      positionClass: "toast-top-right",
      preventDuplicates: false,
      onclick: null,
      showDuration: "10000000000",
      hideDuration: "10000000",
      timeOut: "10000000",
      extendedTimeOut: "10000000",
      showEasing: "swing",
      hideEasing: "linear",
      showMethod: "fadeIn",
      hideMethod: "fadeOut",
    };
    // for (let i = 0; i < 10000; i++) {
    //     toastr["success"]("Have fun storming the castle!")
    // }

    // toastr.success("Email updated successfully")
    // toastr.error("Email updated successfully");
    // toastr.error("There was a problem updating your email. Please try again.");
  }

  cancelSubscriptionHandler = () => {
    this.setState({ cancelPending: true });
    // const url = "https://us-central1-bridgechampions.cloudfunctions.net/stripeCancelSubscriptionHandler";
    // const cancelUrl = "https://us-central1-bridgechampions.cloudfunctions.net/stripeCancelSubscription";

    const cancelUrl =
      "https://us-central1-bridgechampions.cloudfunctions.net/stripeCancelSubscription";

    const uid = this.props.uid;
    // console.log("Cancelling subscription for " + uid);

    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve("resolved");
    //         // reject('rejected');
    //     }, 2000);
    // })
    //     .then(res => {
    //         this.setState({cancelPending: false, cancelled: true });
    //         toastr.success("Subscription cancelled.");
    //     })
    //     .catch(err => {
    //         this.setState({cancelPending: false,});
    //         toastr.error("There was an error cancelling your subscription, please try again or contact support");
    //     });

    return $.post(cancelUrl, { uid: uid }, (data, status) => {
      // const approval_url = data.approval_url;
      // console.log(data);
      // console.log(status);
      if (status === "success") {
        this.setState({ cancelPending: false, cancelled: true });
        this.props.changeSubscriptionActiveStatus(false);
        toastr.success("Subscription cancelled successfully");
      }
    }).catch((err) => {
      console.log(err);
      this.setState({ cancelPending: false });
      toastr.error(
        "There was an error cancelling your subscription, please try again or contact support"
      );
    });
  };

  updateEmailAddress = (newEmail) => {
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         resolve("resolved");
    //         // reject('rejected');
    //     }, 2000);
    // });

    const user = firebase.auth().currentUser;
    return user
      .updateEmail(newEmail)
      .then(() => {
        toastr.success("Email updated successfully");
      })
      .catch((err) => {
        console.log(err);
        toastr.error(err.message);
        // toastr.error("There was a problem updating your email. Please try again.");
      });
  };

  updateUsername = (newName) => {
    const userRef = firebase
      .firestore()
      .collection("membersData")
      .doc(this.props.uid);

    return userRef
      .update({
        username: newName,
      })
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    // console.log(newName);
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         // resolve("resolved");
    //         reject('rejected');
    //     }, 2000);
    // });
  };

  render() {
    // console.log(this.props);

    const {
      paymentMethod,
      subscriptionActive,
      email,
      subscriptionExpires,
      totalQuizScore,
      displayName = "Anonymous",
      profilePic,
      username,
      userName = "",
      uid,
    } = this.props;

    // const userName = this.state.username || "";
    // const name = displayName || "Anonymous";

    return (
      <div className="Profile-container">
        <div className="Profile-displayInfo">
          <div className="Profile-displayInfoContainer">
            <DisplayUserInfo
              name={displayName}
              email={email}
              photo={profilePic}
              subscriptionExpires={subscriptionExpires}
              totalQuizScore={totalQuizScore}
              uid={uid}
              subscriptionActive={subscriptionActive}
              insertSpacing={true}
            />
          </div>

          <div className="Profile-cancelSubscription">
            {this.state.cancelPending && (
              <Button
                waves="light"
                className="CreateArticle-delete"
                style={{
                  fontSize: "1.45rem",
                  textTransform: "none",
                  minWidth: "24rem",
                }}
              >
                <ProgressBar />
              </Button>
            )}

            {subscriptionActive && paymentMethod === "paypal" && (
              <div
                style={{
                  position: "relative",
                  right: "2.5rem",
                }}
              >
                You are a PayPal Subscriber. Manage your subscription using{" "}
                <a href="www.paypal.com" target="_blank">
                  PayPal.com
                </a>
              </div>
            )}
            <div>
              <Modal
                header="Clear your account profile data"
                trigger={
                  <Button
                    waves="light"
                    className="CreateArticle-delete"
                    style={{
                      fontSize: "1.45rem",
                      textTransform: "none",
                      minWidth: "23rem",
                    }}
                  >
                    Clear Account Profile Data
                    <Icon left>cancel</Icon>
                  </Button>
                }
              >
                <br />
                <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  Are you sure you want reset your profile data to blank?
                </p>
                <br />
                <br />
                <Button
                  waves="light"
                  className="CreateArticle-delete"
                  onClick={(e) => this.props.resetUserProfileBlank(uid)}
                  style={{ textTransform: "none" }}
                >
                  Confirm
                  <Icon left>cancel</Icon>
                </Button>
              </Modal>
            </div>
            {!this.state.cancelPending &&
              !this.state.cancelled &&
              subscriptionActive &&
              paymentMethod === "stripe" && (
                <div>
                  <Modal
                    header="Confirm your cancellation"
                    trigger={
                      <Button
                        waves="light"
                        className="CreateArticle-delete"
                        style={{
                          fontSize: "1.45rem",
                          textTransform: "none",
                          minWidth: "23rem",
                        }}
                      >
                        Cancel Subscription
                        <Icon left>cancel</Icon>
                      </Button>
                    }
                  >
                    <br />
                    <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
                      Are you sure you want to cancel your subscription to
                      BridgeChampions?
                    </p>
                    <br />
                    <br />
                    <Button
                      waves="light"
                      className="CreateArticle-delete"
                      onClick={(e) => this.cancelSubscriptionHandler(e)}
                      style={{ textTransform: "none" }}
                    >
                      Confirm
                      <Icon left>cancel</Icon>
                    </Button>
                  </Modal>
                </div>
              )}
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div className="Profile-editInfoHeader">Edit your profile:</div>
          <div>
            <UpdateProfileProperty
              type="text"
              name="Username"
              placeholder="Set your username"
              current={userName}
              changeHandler={this.updateUsername}
            />
          </div>

          {/*<div>*/}
          {/*<UpdateProfileProperty*/}
          {/*type="email"*/}
          {/*name="Email"*/}
          {/*placeholder="Email"*/}
          {/*current={email}*/}
          {/*changeHandler={this.updateEmailAddress}*/}
          {/*/>*/}
          {/*</div>*/}
        </div>
      </div>
    );
  }
}

export default connect(
  ({ auth }) => ({
    uid: auth.uid,
    email: auth.email,
    displayName: auth.displayName,
    userName: auth.userName,
    profilePic: auth.photoURL,
    subscriptionExpires: auth.subscriptionExpires,
    stripeCustomerId: auth.stripeCustomerId,
    trialUsed: auth.trialUsed,
    paymentMethod: auth.paymentMethod,
    totalQuizScore: auth.totalQuizScore,
    username: auth.userName,
    subscriptionActive: auth.subscriptionActive,
    auth: auth,
    // quizScores: auth.quizScores,
    // totalQuizScore: auth.totalQuizScore,
    //
  }),
  { changeSubscriptionActiveStatus, resetUserProfileBlank }
)(Profile);
