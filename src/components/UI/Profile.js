import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import DisplayUserInfo from "./DisplayUserInfo";
import UpdateProfileProperty from "./UpdateProfileProperty";
import "./Profile.css";
import { Row, Col, Modal, Button, Icon, ProgressBar } from "react-materialize";
import $ from "jquery";
import { firebase } from "../../firebase/config";
import toastr from "toastr";
import logger from "../../utils/logger";
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

  componentDidUpdate(prevProps) {
    if (prevProps.username !== this.props.username) {
      this.setState({ username: this.props.username });
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

    if (this.props.paymentMethod === "paypal") {
      const paypalCancelUrl =
        "https://us-central1-bridgechampions.cloudfunctions.net/paypalCancelSubscription";
      return $.post(paypalCancelUrl, { uid: uid }, (data, status) => {
        if (status === "success") {
          this.setState({ cancelPending: false, cancelled: true });
          this.props.changeSubscriptionActiveStatus(false);
          toastr.success(data && data.message ? data.message : "Subscription cancelled successfully");
        }
      }).catch((err) => {
        logger.error("Error cancelling PayPal subscription:", err);
        this.setState({ cancelPending: false });
        const msg = err.responseJSON && err.responseJSON.error
          ? err.responseJSON.error
          : "There was an error cancelling your subscription, please try again or contact support.";
        toastr.error(msg);
      });
    }

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
      if (status === "success") {
        this.setState({ cancelPending: false, cancelled: true });
        if (data && data.cancelAtPeriodEnd) {
          toastr.success(data.message || "Your subscription will end at the end of your billing period. You keep full access until then.");
        } else {
          this.props.changeSubscriptionActiveStatus(false);
          toastr.success("Subscription cancelled successfully");
        }
      }
    }).catch((err) => {
      logger.error("Error cancelling subscription:", err);
      this.setState({ cancelPending: false });
      const msg = err.responseJSON && err.responseJSON.error
        ? err.responseJSON.error
        : "There was an error cancelling your subscription, please try again or contact support.";
      toastr.error(msg);
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
        logger.error("Error updating email:", err);
        toastr.error(err.message || "There was a problem updating your email. Please try again.");
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
      .then((res) => {
        logger.log("Username updated:", res);
        toastr.success("Username updated successfully");
      })
      .catch((err) => {
        logger.error("Error updating username:", err);
        toastr.error("There was a problem updating your username. Please try again.");
      });

    // console.log(newName);
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         // resolve("resolved");
    //         reject('rejected');
    //     }, 2000);
    // });
  };

  render() {
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

    // Show loading or login prompt if user data isn't ready
    if (!uid) {
      return (
        <div className="Profile-container">
          <Helmet>
            <title>Profile - Bridge Champions</title>
            <meta name="description" content="Your Bridge Champions profile and account settings" />
          </Helmet>
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem',
            background: 'white',
            borderRadius: '1.2rem',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            maxWidth: '60rem',
            margin: '0 auto'
          }}>
            <h2 style={{ fontSize: '2.4rem', marginBottom: '2rem', color: '#1a1d23' }}>
              Please Log In
            </h2>
            <p style={{ fontSize: '1.8rem', color: '#64748B', marginBottom: '2rem' }}>
              You need to be logged in to view your profile.
            </p>
            <Button
              waves="light"
              style={{ 
                backgroundColor: '#0F4C3A',
                fontSize: '1.6rem',
                padding: '1rem 2.4rem'
              }}
              onClick={() => window.location.href = '/login'}
            >
              Go to Login
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="Profile-container">
        <Helmet>
          <title>Profile - {displayName} | Bridge Champions</title>
          <meta name="description" content={`${displayName}'s Bridge Champions profile. Manage your account settings, subscription, and quiz scores.`} />
          <link rel="canonical" href="https://bridgechampions.com/profile" />
        </Helmet>
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
              <Modal
                header="Confirm your cancellation"
                trigger={
                  <Button waves="light" className="red">
                    Cancel Subscription
                    <Icon left>cancel</Icon>
                  </Button>
                }
                options={{
                  dismissible: false,
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>
                  Are you sure you want to cancel your subscription to BridgeChampions.com?
                </div>
                <Button
                  waves="light"
                  className="red"
                  modal="close"
                  onClick={(e) => this.cancelSubscriptionHandler(e)}
                >
                  Confirm Cancellation
                  <Icon left>cancel</Icon>
                </Button>
              </Modal>
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

        <div className="Profile-editSection">
          <div className="Profile-editInfoHeader">Edit Your Profile</div>
          <div>
            <UpdateProfileProperty
              type="text"
              name="Username"
              placeholder="Set your username"
              current={userName}
              changeHandler={this.updateUsername}
            />
          </div>
          
          <div style={{ marginTop: '3rem', paddingTop: '3rem', borderTop: '1px solid #E2E8F0' }}>
            <h3 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#1a1d23' }}>Account Information</h3>
            <div style={{ fontSize: '1.6rem', lineHeight: '1.8', color: '#64748B' }}>
              <p><strong style={{ color: '#1a1d23' }}>Email:</strong> {email || 'Not set'}</p>
              <p style={{ marginTop: '1rem' }}>
                <strong style={{ color: '#1a1d23' }}>User ID:</strong> 
                <span style={{ fontFamily: 'monospace', fontSize: '1.4rem', marginLeft: '1rem' }}>
                  {uid ? uid.substring(0, 8) + '...' : 'Not available'}
                </span>
              </p>
            </div>
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
