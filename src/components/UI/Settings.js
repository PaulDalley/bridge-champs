import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button, Icon, Modal, Row, Col } from "react-materialize";
import { changeSubscriptionActiveStatus } from "../../store/actions/authActions";
import DisplayUserInfo from "./DisplayUserInfo";
import { makeDateString } from "../../helpers/helpers";
import logger from "../../utils/logger";
import toastr from "toastr";
import $ from "jquery";
import "./Settings.css";

class Settings extends Component {
  state = {
    cancelPending: false,
    cancelled: false,
  };

  componentDidMount() {
    if (!this.props.uid) {
      this.props.history.push("/login");
    }
  }

  cancelSubscriptionHandler = () => {
    this.setState({ cancelPending: true });
    const cancelUrl =
      "https://us-central1-bridgechampions.cloudfunctions.net/stripeCancelSubscription";

    const uid = this.props.uid;

    // For PayPal subscriptions, use the PayPal cancel endpoint
    if (this.props.paymentMethod === "paypal") {
      const paypalCancelUrl =
        "https://us-central1-bridgechampions.cloudfunctions.net/paypalCancelSubscription";
      
      return $.post(paypalCancelUrl, { uid: uid }, (data, status) => {
        if (status === "success") {
          this.setState({ cancelPending: false, cancelled: true });
          this.props.changeSubscriptionActiveStatus(false);
          toastr.success("Subscription cancelled successfully");
        }
      }).catch((err) => {
        logger.error("Error cancelling PayPal subscription:", err);
        this.setState({ cancelPending: false });
        toastr.error(
          "There was an error cancelling your subscription. Please try again or contact support."
        );
      });
    }

    // For Stripe subscriptions
    return $.post(cancelUrl, { uid: uid }, (data, status) => {
      if (status === "success") {
        this.setState({ cancelPending: false, cancelled: true });
        this.props.changeSubscriptionActiveStatus(false);
        toastr.success("Subscription cancelled successfully");
      }
    }).catch((err) => {
      logger.error("Error cancelling subscription:", err);
      this.setState({ cancelPending: false });
      toastr.error(
        "There was an error cancelling your subscription. Please try again or contact support."
      );
    });
  };

  render() {
    const {
      uid,
      subscriptionActive,
      subscriptionExpires,
      paymentMethod,
      tier,
    } = this.props;

    if (!uid) {
      return (
        <div className="Settings-container">
          <div className="Settings-login-prompt">
            <h3>Please log in to access settings</h3>
            <Button
              waves="light"
              onClick={() => this.props.history.push("/login")}
            >
              Go to Login
            </Button>
          </div>
        </div>
      );
    }

    return (
      <>
        <Helmet>
          <title>Account Settings - Bridge Champions</title>
          <meta
            name="description"
            content="Manage your Bridge Champions account settings, subscription, and preferences."
          />
        </Helmet>
        <div className="Settings-container">
          <div className="Settings-header">
            <h1 className="Settings-title">
              <Icon left>settings</Icon>
              Account Settings
            </h1>
          </div>

          <Row>
            <Col s={12} m={8} l={6} offset="m2 l3">
              <div className="Settings-section">
                <h2 className="Settings-section-title">
                  <Icon left>account_circle</Icon>
                  Account Information
                </h2>
                <DisplayUserInfo
                  uid={uid}
                  subscriptionActive={subscriptionActive}
                  subscriptionExpires={subscriptionExpires}
                />
              </div>

              <div className="Settings-section">
                <h2 className="Settings-section-title">
                  <Icon left>payment</Icon>
                  Subscription Management
                </h2>

                {subscriptionActive ? (
                  <div className="Settings-subscription-active">
                    <div className="Settings-subscription-status">
                      <Icon className="Settings-status-icon">check_circle</Icon>
                      <span className="Settings-status-text">
                        Your subscription is <strong>Active</strong>
                      </span>
                    </div>
                    {subscriptionExpires && (
                      <p className="Settings-subscription-details">
                        {tier && (
                          <span className="Settings-tier-badge">
                            {tier === "premium" ? "Premium" : "Basic"} Tier
                          </span>
                        )}
                        <br />
                        Billing period ends on{" "}
                        <strong>{makeDateString(subscriptionExpires)}</strong>
                      </p>
                    )}
                    {paymentMethod && (
                      <p className="Settings-payment-method">
                        Payment method: <strong>{paymentMethod.toUpperCase()}</strong>
                      </p>
                    )}

                    {this.state.cancelPending && (
                      <div className="Settings-loading">
                        <Icon className="Settings-spinner">sync</Icon>
                        Processing cancellation...
                      </div>
                    )}

                    {this.state.cancelled && (
                      <div className="Settings-cancelled">
                        <Icon>check_circle</Icon>
                        Your subscription has been cancelled. You will continue to have
                        access until the end of your current billing period.
                      </div>
                    )}

                    {!this.state.cancelPending && !this.state.cancelled && (
                      <Modal
                        header="Cancel Subscription"
                        trigger={
                          <Button
                            waves="light"
                            className="Settings-cancel-btn"
                            style={{ marginTop: "2rem" }}
                          >
                            <Icon left>cancel</Icon>
                            Cancel Subscription
                          </Button>
                        }
                        options={{
                          dismissible: false,
                        }}
                      >
                        <div className="Settings-cancel-modal-content">
                          <p>
                            Are you sure you want to cancel your subscription to Bridge
                            Champions?
                          </p>
                          <p>
                            <strong>
                              You will continue to have access until the end of your
                              current billing period ({subscriptionExpires ? makeDateString(subscriptionExpires) : "end of period"}).
                            </strong>
                          </p>
                          <p>After that, you will lose access to premium content.</p>
                          <div className="Settings-cancel-modal-actions">
                            <Button
                              waves="light"
                              modal="close"
                              className="Settings-cancel-confirm-btn"
                              onClick={this.cancelSubscriptionHandler}
                            >
                              <Icon left>cancel</Icon>
                              Yes, Cancel Subscription
                            </Button>
                            <Button
                              waves="light"
                              modal="close"
                              flat
                              style={{ marginLeft: "1rem" }}
                            >
                              Keep Subscription
                            </Button>
                          </div>
                        </div>
                      </Modal>
                    )}
                  </div>
                ) : (
                  <div className="Settings-subscription-inactive">
                    <div className="Settings-subscription-status">
                      <Icon className="Settings-status-icon-inactive">
                        info
                      </Icon>
                      <span className="Settings-status-text">
                        No active subscription
                      </span>
                    </div>
                    <p>
                      You don't have an active subscription. Subscribe to access premium
                      content.
                    </p>
                    <Button
                      waves="light"
                      className="Settings-upgrade-btn"
                      onClick={() => this.props.history.push("/membership")}
                    >
                      <Icon left>star</Icon>
                      View Subscription Plans
                    </Button>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
  subscriptionActive: state.auth.subscriptionActive,
  subscriptionExpires: state.auth.subscriptionExpires,
  paymentMethod: state.auth.paymentMethod,
  tier: state.auth.tier,
});

const mapDispatchToProps = {
  changeSubscriptionActiveStatus,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings));

