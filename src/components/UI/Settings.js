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
import { firebase } from "../../firebase/config";
import { sendSubscriptionEvent } from "../../utils/analytics";
import "./Settings.css";

class Settings extends Component {
  state = {
    cancelPending: false,
    cancelled: false,
    showBillingDetails: false,
    showContactForm: false,
    contactFormData: {
      phoneNumber: '',
      contactMethod: 'call', // 'call' or 'text'
      description: ''
    },
    formSubmitted: false,
    // Admin tool: create account + grant access
    adminCreateEmail: "",
    adminCreateTier: "premium",
    adminCreateDays: 365,
    adminCreateLoading: false,
    adminCreateResult: null,
    // Upgrade to Premium
    upgradeLoading: false,
    upgradeError: null,
    // Email all / subscribers
    emailAllSubject: "",
    emailAllBody: "",
    emailAllLoading: false,
    emailAllResult: null,
    // Email list export
    emailListLoading: false,
    emailListResult: null,
    subscriberListLoading: false,
    subscriberListResult: null,
    nonSubscriberListLoading: false,
    nonSubscriberListResult: null,
  };

  componentDidMount() {
    if (!this.props.uid) {
      this.props.history.push("/login");
    }
    // Ensure body can scroll
    $("body").css({ overflow: "auto" });

    // Restore last admin tool result so you don't lose the password reset link if you navigate away.
    try {
      const raw = localStorage.getItem("adminCreateUserLastResult");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          this.setState({ adminCreateResult: parsed });
        }
      }
    } catch (e) {
      // ignore
    }
  }

  componentWillUnmount() {
    // Restore body scroll when component unmounts
    $("body").css({ overflow: "auto" });
  }

  handleContactFormChange = (field, value) => {
    this.setState({
      contactFormData: {
        ...this.state.contactFormData,
        [field]: value
      }
    });
  };

  stripeUpgradeUrl = "https://us-central1-bridgechampions.cloudfunctions.net/stripeUpgradeSubscription";

  handleUpgradeToPremium = () => {
    const { uid, paymentMethod } = this.props;
    if (!uid) return;
    this.setState({ upgradeLoading: true, upgradeError: null });
    if (paymentMethod === "paypal") {
      const paypalUrl = "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PRUK4P42SGVDC";
      const successCallback = "https://us-central1-bridgechampions.cloudfunctions.net/ipnHandler";
      const returnUrl = `https://us-central1-bridgechampions.cloudfunctions.net/process?uid=${encodeURIComponent(uid)}&upgraded=1`;
      const url = `${paypalUrl}&notify_url=${encodeURIComponent(successCallback)}&custom=${encodeURIComponent(uid)}&return=${encodeURIComponent(returnUrl)}`;
      window.location.href = url;
      return;
    }
    $.post(this.stripeUpgradeUrl, { uid })
      .done((data) => {
        this.setState({ upgradeLoading: false, upgradeError: null });
        sendSubscriptionEvent("subscription_upgraded", { from_tier: "basic", to_tier: "premium", upgrade_source: "settings" });
        toastr.success(data.message || "Upgraded to Premium!");
        this.props.changeSubscriptionActiveStatus(true);
        window.location.reload();
      })
      .fail((jqXHR) => {
        const err = jqXHR.responseJSON?.error || jqXHR.responseText || "Upgrade failed.";
        this.setState({ upgradeLoading: false, upgradeError: err });
        toastr.error(err);
      });
  };

  handleContactFormSubmit = (e) => {
    e.preventDefault();
    const { phoneNumber, contactMethod, description } = this.state.contactFormData;
    
    // Here you would typically send this to your backend
    // For now, we'll just show a success message
    logger.log('Contact form submitted:', { phoneNumber, contactMethod, description });
    
    // You could send this to a cloud function or email service
    // Example: $.post('/api/contact-request', { phoneNumber, contactMethod, description, uid: this.props.uid });
    
    this.setState({ formSubmitted: true });
    toastr.success('Thank you! We will contact you soon.');
    
    // Reset form after 3 seconds
    setTimeout(() => {
      this.setState({
        showContactForm: false,
        formSubmitted: false,
        contactFormData: {
          phoneNumber: '',
          contactMethod: 'call',
          description: ''
        }
      });
    }, 3000);
  };

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
          toastr.success(data && data.message ? data.message : "Subscription cancelled successfully");
        }
      }).catch((err) => {
        logger.error("Error cancelling PayPal subscription:", err);
        this.setState({ cancelPending: false });
        const msg = err.responseJSON && err.responseJSON.error
          ? err.responseJSON.error
          : "There was an error cancelling your subscription. Please try again or contact support.";
        toastr.error(msg);
      });
    }

    // For Stripe subscriptions
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
        : "There was an error cancelling your subscription. Please try again or contact support.";
      toastr.error(msg);
    });
  };

  adminCreateUserAndGrantAccess = async (e) => {
    e.preventDefault();
    this.setState({ adminCreateLoading: true, adminCreateResult: null });
    try {
      const user = firebase.auth().currentUser;
      if (!user) {
        throw new Error("You must be logged in to use this admin tool.");
      }
      const idToken = await user.getIdToken();

      const resp = await fetch(
        "https://us-central1-bridgechampions.cloudfunctions.net/adminCreateUserAndGrantAccess",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            email: this.state.adminCreateEmail,
            tier: this.state.adminCreateTier,
            days: Number(this.state.adminCreateDays) || 365,
          }),
        }
      );

      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) {
        throw new Error(data.error || `Request failed (${resp.status})`);
      }

      this.setState({ adminCreateResult: data });
      try {
        localStorage.setItem("adminCreateUserLastResult", JSON.stringify(data));
      } catch (e) {
        // ignore
      }
      toastr.success("Account created / access granted");
    } catch (err) {
      logger.error("adminCreateUserAndGrantAccess failed:", err);
      toastr.error(err.message || "Failed to create account");
      this.setState({ adminCreateResult: { error: err.message || String(err) } });
      try {
        localStorage.setItem(
          "adminCreateUserLastResult",
          JSON.stringify({ error: err.message || String(err) })
        );
      } catch (e) {
        // ignore
      }
    } finally {
      this.setState({ adminCreateLoading: false });
    }
  };

  sendEmailToUsers = async (audience) => {
    const { emailAllSubject, emailAllBody } = this.state;
    if (!emailAllSubject.trim() || !emailAllBody.trim()) {
      toastr.warning("Please enter both subject and message.");
      return;
    }
    this.setState({ emailAllLoading: true, emailAllResult: null });
    try {
      const user = firebase.auth().currentUser;
      if (!user) throw new Error("Not logged in");
      const token = await user.getIdToken();
      const res = await fetch(
        "https://us-central1-bridgechampions.cloudfunctions.net/adminEmailAllOrSubscribers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            subject: emailAllSubject.trim(),
            body: emailAllBody.trim().replace(/\n/g, "<br/>"),
            audience,
          }),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || res.statusText);
      this.setState({
        emailAllResult: { sent: data.sent, recipientCount: data.recipientCount },
      });
      toastr.success(`Sent to ${data.sent} recipient(s).`);
    } catch (err) {
      toastr.error(err.message || "Failed to send");
      this.setState({ emailAllResult: { error: err.message || String(err) } });
    } finally {
      this.setState({ emailAllLoading: false });
    }
  };

  getEmailListSince2026 = async () => {
    this.setState({ emailListLoading: true, emailListResult: null });
    try {
      const user = firebase.auth().currentUser;
      if (!user) throw new Error("Not logged in");
      const token = await user.getIdToken();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      const res = await fetch(
        "https://us-central1-bridgechampions.cloudfunctions.net/adminGetUserEmailsSinceDate?since=2026-01-01",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
      const raw = await res.text();
      let data = {};
      try {
        if (raw) data = JSON.parse(raw);
      } catch (_) {}
      if (!res.ok) {
        const msg = (data && data.error) || res.statusText || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      this.setState({ emailListResult: data });
      const emailStr = (data.emails || []).join("\n");
      if (navigator.clipboard && emailStr) {
        await navigator.clipboard.writeText(emailStr);
        toastr.success(`${data.count} email(s) copied to clipboard`);
      } else {
        toastr.success(`${data.count} email(s) fetched`);
      }
    } catch (err) {
      const message = err.message || String(err);
      const isAbort = err.name === "AbortError";
      const isNetworkError = message === "Failed to fetch" || err.name === "TypeError";
      let displayError = message;
      if (isAbort) {
        displayError = "Request timed out (60s). The function may be cold-starting — try again.";
      } else if (isNetworkError) {
        displayError = "Network error — try again. If it persists, the function may be cold-starting, or ensure the Cloud Function is deployed (firebase deploy --only functions from the cloud-functions folder).";
      }
      this.setState({ emailListResult: { error: displayError } });
      toastr.error(displayError);
    } finally {
      this.setState({ emailListLoading: false });
    }
  };

  getSubscriberEmails = async () => {
    this.setState({ subscriberListLoading: true, subscriberListResult: null });
    try {
      const user = firebase.auth().currentUser;
      if (!user) throw new Error("Not logged in");
      const token = await user.getIdToken();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000);
      const res = await fetch(
        "https://us-central1-bridgechampions.cloudfunctions.net/adminGetSubscriberEmails",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
      const raw = await res.text();
      let data = {};
      try {
        if (raw) data = JSON.parse(raw);
      } catch (_) {}
      if (!res.ok) {
        const msg = (data && data.error) || res.statusText || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      this.setState({ subscriberListResult: data });
      const emailStr = (data.emails || []).join("\n");
      if (navigator.clipboard && emailStr) {
        await navigator.clipboard.writeText(emailStr);
        toastr.success(`${data.count} subscriber email(s) copied to clipboard`);
      } else {
        toastr.success(`${data.count} subscriber email(s) fetched`);
      }
    } catch (err) {
      const message = err.message || String(err);
      const isAbort = err.name === "AbortError";
      const isNetworkError = message === "Failed to fetch" || err.name === "TypeError";
      let displayError = message;
      if (isAbort) {
        displayError = "Request timed out (60s). The function may be cold-starting — try again.";
      } else if (isNetworkError) {
        displayError = "Network error — try again. If it persists, ensure adminGetSubscriberEmails is deployed.";
      }
      this.setState({ subscriberListResult: { error: displayError } });
      toastr.error(displayError);
    } finally {
      this.setState({ subscriberListLoading: false });
    }
  };

  getNonSubscriberEmailsSince2026 = async () => {
    this.setState({ nonSubscriberListLoading: true, nonSubscriberListResult: null });
    try {
      const user = firebase.auth().currentUser;
      if (!user) throw new Error("Not logged in");
      const token = await user.getIdToken();
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 90000);
      const res = await fetch(
        "https://us-central1-bridgechampions.cloudfunctions.net/adminGetNonSubscriberEmailsSinceDate?since=2026-01-01",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        }
      );
      clearTimeout(timeoutId);
      const raw = await res.text();
      let data = {};
      try {
        if (raw) data = JSON.parse(raw);
      } catch (_) {}
      if (!res.ok) {
        const msg = (data && data.error) || res.statusText || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      this.setState({ nonSubscriberListResult: data });
      const emailStr = (data.emails || []).join("\n");
      if (navigator.clipboard && emailStr) {
        await navigator.clipboard.writeText(emailStr);
        toastr.success(`${data.count} non-subscriber email(s) copied to clipboard`);
      } else {
        toastr.success(`${data.count} non-subscriber email(s) fetched`);
      }
    } catch (err) {
      const message = err.message || String(err);
      const isAbort = err.name === "AbortError";
      const isNetworkError = message === "Failed to fetch" || err.name === "TypeError";
      let displayError = message;
      if (isAbort) {
        displayError = "Request timed out. The function may be cold-starting — try again.";
      } else if (isNetworkError) {
        displayError = "Network error — try again.";
      }
      this.setState({ nonSubscriberListResult: { error: displayError } });
      toastr.error(displayError);
    } finally {
      this.setState({ nonSubscriberListLoading: false });
    }
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

                    {tier === "basic" && !this.state.cancelPending && !this.state.cancelled && (
                      <div className="Settings-upgrade-row" style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                        <button
                          className="Settings-upgrade-btn"
                          onClick={this.handleUpgradeToPremium}
                          disabled={this.state.upgradeLoading}
                          style={{
                            padding: "0.6rem 1.2rem",
                            fontSize: "1rem",
                            fontWeight: 600,
                            color: "#fff",
                            backgroundColor: "#0F4C3A",
                            border: "none",
                            borderRadius: "8px",
                            cursor: this.state.upgradeLoading ? "wait" : "pointer",
                          }}
                        >
                          {this.state.upgradeLoading ? "Processing…" : "Upgrade to Premium ($50/mo)"}
                        </button>
                        <p className="Settings-upgrade-note" style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "#666" }}>
                          Get access to exclusive videos and more.
                        </p>
                      </div>
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
                      <div className="Settings-billing-details">
                        <button
                          className="Settings-billing-toggle"
                          onClick={() => this.setState({ showBillingDetails: !this.state.showBillingDetails })}
                        >
                          <Icon>{this.state.showBillingDetails ? 'expand_less' : 'expand_more'}</Icon>
                          {this.state.showBillingDetails ? 'Hide' : 'Show'} Billing Details
                        </button>
                        
                        {this.state.showBillingDetails && (
                          <div className="Settings-billing-content">
                            <p className="Settings-billing-note">
                              Need to make changes to your subscription? Contact support for assistance.
                            </p>
                            <div className="Settings-cancel-link-container">
                              <Modal
                                header="We'd Love to Help"
                                trigger={
                                  <a
                                    href="#"
                                    className="Settings-cancel-link"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      // Ensure body can scroll when modal opens
                                      setTimeout(() => {
                                        $("body").css({ overflow: "auto" });
                                      }, 100);
                                    }}
                                  >
                                    Cancel Subscription
                                  </a>
                                }
                                options={{
                                  dismissible: false,
                                  onCloseEnd: () => {
                                    // Restore scroll when modal closes
                                    $("body").css({ overflow: "auto" });
                                  }
                                }}
                              >
                                <div className="Settings-retention-modal-content">
                                  <div className="Settings-retention-message">
                                    <Icon className="Settings-retention-icon">favorite</Icon>
                                    <h3>We Take Your Satisfaction Very Seriously</h3>
                                    <p>
                                      We're sorry to see you go! Is there something we can help you with? 
                                      We're here to make sure you're getting the most out of your subscription.
                                    </p>
                                    <p>
                                      Please reach out to us at{' '}
                                      <a 
                                        href="mailto:paul.dalley@hotmail.com" 
                                        className="Settings-contact-email"
                                      >
                                        paul.dalley@hotmail.com
                                      </a>
                                      {' '}and we'll do our best to address any concerns or issues you may have.
                                    </p>
                                    
                                    {!this.state.showContactForm && !this.state.formSubmitted && (
                                      <div className="Settings-retention-actions">
                                        <Button
                                          waves="light"
                                          className="Settings-call-btn"
                                          onClick={() => this.setState({ showContactForm: true })}
                                        >
                                          <Icon left>phone</Icon>
                                          Request Call or Text
                                        </Button>
                                        <Button
                                          waves="light"
                                          modal="close"
                                          className="Settings-call-btn"
                                        >
                                          Keep My Subscription
                                        </Button>
                                        <Button
                                          waves="light"
                                          modal="close"
                                          className="Settings-call-btn"
                                          onClick={() => this.props.history.push('/')}
                                        >
                                          <Icon left>home</Icon>
                                          Back to Home Page
                                        </Button>
                                      </div>
                                    )}

                                    {this.state.showContactForm && !this.state.formSubmitted && (
                                      <div className="Settings-contact-form-container">
                                        <form onSubmit={this.handleContactFormSubmit}>
                                          <div className="Settings-form-group">
                                            <label htmlFor="phoneNumber" className="Settings-form-label">
                                              Mobile Number
                                            </label>
                                            <input
                                              type="tel"
                                              id="phoneNumber"
                                              className="Settings-form-input"
                                              placeholder="+1 (555) 123-4567"
                                              value={this.state.contactFormData.phoneNumber}
                                              onChange={(e) => this.handleContactFormChange('phoneNumber', e.target.value)}
                                              required
                                            />
                                          </div>

                                          <div className="Settings-form-group">
                                            <label className="Settings-form-label">Preferred Contact Method</label>
                                            <div className="Settings-radio-group">
                                              <label className="Settings-radio-label">
                                                <input
                                                  type="radio"
                                                  name="contactMethod"
                                                  value="call"
                                                  checked={this.state.contactFormData.contactMethod === 'call'}
                                                  onChange={(e) => this.handleContactFormChange('contactMethod', e.target.value)}
                                                />
                                                <span>Call</span>
                                              </label>
                                              <label className="Settings-radio-label">
                                                <input
                                                  type="radio"
                                                  name="contactMethod"
                                                  value="text"
                                                  checked={this.state.contactFormData.contactMethod === 'text'}
                                                  onChange={(e) => this.handleContactFormChange('contactMethod', e.target.value)}
                                                />
                                                <span>Text</span>
                                              </label>
                                            </div>
                                          </div>

                                          <div className="Settings-form-group">
                                            <label htmlFor="description" className="Settings-form-label">
                                              Description of Issue
                                            </label>
                                            <textarea
                                              id="description"
                                              className="Settings-form-textarea"
                                              placeholder="Please describe your issue or concern..."
                                              rows="4"
                                              value={this.state.contactFormData.description}
                                              onChange={(e) => this.handleContactFormChange('description', e.target.value)}
                                              required
                                            />
                                          </div>

                                          <div className="Settings-form-actions">
                                            <Button
                                              type="submit"
                                              waves="light"
                                              className="Settings-submit-btn"
                                            >
                                              <Icon left>send</Icon>
                                              Submit Request
                                            </Button>
                                            <Button
                                              type="button"
                                              waves="light"
                                              flat
                                              onClick={() => this.setState({ showContactForm: false })}
                                            >
                                              Cancel
                                            </Button>
                                          </div>
                                        </form>
                                      </div>
                                    )}

                                    {this.state.formSubmitted && (
                                      <div className="Settings-form-success">
                                        <Icon className="Settings-success-icon">check_circle</Icon>
                                        <p>Thank you! We've received your request and will contact you soon.</p>
                                      </div>
                                    )}
                                  </div>
                                  <div className="Settings-proceed-cancel-container">
                                    <Modal
                                      header="Cancel Subscription"
                                      trigger={
                                        <a
                                          href="#"
                                          className="Settings-proceed-cancel-link"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            // Ensure body can scroll
                                            setTimeout(() => {
                                              $("body").css({ overflow: "auto" });
                                            }, 100);
                                          }}
                                        >
                                          Proceed with Cancellation
                                        </a>
                                      }
                                      options={{
                                        dismissible: false,
                                        onCloseEnd: () => {
                                          // Restore scroll when modal closes
                                          $("body").css({ overflow: "auto" });
                                        }
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
                                  </div>
                                </div>
                              </Modal>
                            </div>
                          </div>
                        )}
                      </div>
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

              {this.props.a === true && (
                <div className="Settings-section">
                  <h2 className="Settings-section-title">
                    <Icon left>admin_panel_settings</Icon>
                    Admin Tools
                  </h2>
                  <div className="Settings-admin-card">
                    <div className="Settings-admin-actions">
                      <button
                        type="button"
                        className="Settings-admin-copy-btn"
                        onClick={() => this.props.history.push("/admin/submissions")}
                      >
                        Open Question Inbox
                      </button>
                    </div>
                    <h3 className="Settings-admin-title">Create account + grant access</h3>
                    <p className="Settings-admin-subtitle">
                      Creates (or finds) a user by email, grants access for a period, and generates a password reset link you can send them.
                    </p>
                    <form onSubmit={this.adminCreateUserAndGrantAccess} className="Settings-admin-form">
                      <div className="Settings-form-group">
                        <label className="Settings-form-label">Email</label>
                        <input
                          className="Settings-form-input"
                          type="email"
                          required
                          value={this.state.adminCreateEmail}
                          onChange={(e) => this.setState({ adminCreateEmail: e.target.value })}
                          placeholder="name@example.com"
                        />
                      </div>

                      <div className="Settings-admin-row">
                        <div className="Settings-form-group">
                          <label className="Settings-form-label">Tier</label>
                          <div className="Settings-tier-toggle" role="group" aria-label="Tier">
                            <button
                              type="button"
                              className={`Settings-tier-option ${
                                this.state.adminCreateTier === "premium" ? "is-active" : ""
                              }`}
                              onClick={() => this.setState({ adminCreateTier: "premium" })}
                            >
                              Premium
                            </button>
                            <button
                              type="button"
                              className={`Settings-tier-option ${
                                this.state.adminCreateTier === "basic" ? "is-active" : ""
                              }`}
                              onClick={() => this.setState({ adminCreateTier: "basic" })}
                            >
                              Basic
                            </button>
                          </div>
                        </div>
                        <div className="Settings-form-group">
                          <label className="Settings-form-label">Days</label>
                          <input
                            className="Settings-form-input"
                            type="number"
                            min="1"
                            max="3650"
                            value={this.state.adminCreateDays}
                            onChange={(e) => this.setState({ adminCreateDays: e.target.value })}
                          />
                        </div>
                      </div>

                      <button className="Settings-submit-btn" type="submit" disabled={this.state.adminCreateLoading}>
                        {this.state.adminCreateLoading ? "Working…" : "Create + grant access"}
                      </button>
                    </form>

                    {this.state.adminCreateResult && (
                      <div className="Settings-admin-result">
                        {this.state.adminCreateResult.error ? (
                          <p className="Settings-admin-error">Error: {this.state.adminCreateResult.error}</p>
                        ) : (
                          <>
                            <p><strong>UID:</strong> {this.state.adminCreateResult.uid}</p>
                            <p><strong>Expires:</strong> {this.state.adminCreateResult.subscriptionExpires}</p>
                            <p className="Settings-admin-note">
                              This result is saved on this device so you can come back and copy the reset link.
                            </p>
                            <p><strong>Password reset link:</strong></p>
                            <textarea
                              readOnly
                              className="Settings-admin-textarea"
                              value={this.state.adminCreateResult.passwordResetLink || ""}
                            />
                            <div className="Settings-admin-actions">
                              <button
                                type="button"
                                className="Settings-admin-copy-btn"
                                onClick={async () => {
                                  try {
                                    const link = this.state.adminCreateResult.passwordResetLink || "";
                                    if (!link) throw new Error("No link to copy");
                                    await navigator.clipboard.writeText(link);
                                    toastr.success("Reset link copied");
                                  } catch (e) {
                                    toastr.error("Could not copy link (try selecting + copying manually)");
                                  }
                                }}
                              >
                                Copy reset link
                              </button>
                              <button
                                type="button"
                                className="Settings-admin-clear-btn"
                                onClick={() => {
                                  try {
                                    localStorage.removeItem("adminCreateUserLastResult");
                                  } catch (e) {
                                    // ignore
                                  }
                                  this.setState({ adminCreateResult: null });
                                }}
                              >
                                Clear
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}

                    <h3 className="Settings-admin-title" style={{ marginTop: "24px" }}>Email users</h3>
                    <p className="Settings-admin-subtitle">
                      Send one email to all users or to current subscribers only. Uses the same Gmail account as the Contact form and welcome emails (set in Firebase Functions config).
                    </p>
                    <div className="Settings-admin-form">
                      <div className="Settings-form-group">
                        <label className="Settings-form-label">Subject</label>
                        <input
                          className="Settings-form-input"
                          type="text"
                          value={this.state.emailAllSubject}
                          onChange={(e) => this.setState({ emailAllSubject: e.target.value })}
                          placeholder="e.g. New practice hands added"
                        />
                      </div>
                      <div className="Settings-form-group">
                        <label className="Settings-form-label">Message</label>
                        <textarea
                          className="Settings-admin-textarea"
                          rows={5}
                          value={this.state.emailAllBody}
                          onChange={(e) => this.setState({ emailAllBody: e.target.value })}
                          placeholder="Type your message. Line breaks become paragraphs in the email."
                        />
                      </div>
                      <div className="Settings-admin-actions" style={{ marginTop: "8px" }}>
                        <button
                          type="button"
                          className="Settings-submit-btn"
                          disabled={this.state.emailAllLoading}
                          onClick={() => this.sendEmailToUsers("subscribers")}
                        >
                          {this.state.emailAllLoading ? "Sending…" : "Email subscribers"}
                        </button>
                        <button
                          type="button"
                          className="Settings-admin-copy-btn"
                          disabled={this.state.emailAllLoading}
                          onClick={() => this.sendEmailToUsers("all")}
                          style={{ marginLeft: "8px" }}
                        >
                          Email all users
                        </button>
                      </div>
                    </div>
                    {this.state.emailAllResult && (
                      <div className="Settings-admin-result" style={{ marginTop: "12px" }}>
                        {this.state.emailAllResult.error ? (
                          <p className="Settings-admin-error">{this.state.emailAllResult.error}</p>
                        ) : (
                          <p>Sent to {this.state.emailAllResult.sent} recipient(s).</p>
                        )}
                      </div>
                    )}

                    <h3 className="Settings-admin-title" style={{ marginTop: "24px" }}>Export email list</h3>
                    <p className="Settings-admin-subtitle">
                      Get subscriber emails, non-subscribers since 2026, or all users since 2026. Copies to clipboard.
                    </p>
                    <div className="Settings-admin-actions" style={{ marginTop: "8px" }}>
                      <button
                        type="button"
                        className="Settings-submit-btn"
                        disabled={this.state.subscriberListLoading}
                        onClick={this.getSubscriberEmails}
                      >
                        {this.state.subscriberListLoading ? "Loading…" : "Get subscriber emails"}
                      </button>
                      <button
                        type="button"
                        className="Settings-admin-copy-btn"
                        disabled={this.state.nonSubscriberListLoading}
                        onClick={this.getNonSubscriberEmailsSince2026}
                        style={{ marginLeft: "8px" }}
                      >
                        {this.state.nonSubscriberListLoading ? "Loading…" : "Since 2026 (non-subscribers)"}
                      </button>
                      <button
                        type="button"
                        className="Settings-admin-copy-btn"
                        disabled={this.state.emailListLoading}
                        onClick={this.getEmailListSince2026}
                        style={{ marginLeft: "8px" }}
                      >
                        Get emails since 2026 (all)
                      </button>
                    </div>
                    {this.state.subscriberListResult && !this.state.subscriberListResult.error && (
                      <p className="Settings-admin-result" style={{ marginTop: "8px" }}>
                        {this.state.subscriberListResult.count} subscriber(s).
                      </p>
                    )}
                    {this.state.subscriberListResult && this.state.subscriberListResult.error && (
                      <p className="Settings-admin-error" style={{ marginTop: "8px" }}>
                        {this.state.subscriberListResult.error}
                      </p>
                    )}
                    {this.state.nonSubscriberListResult && !this.state.nonSubscriberListResult.error && (
                      <p className="Settings-admin-result" style={{ marginTop: "8px" }}>
                        {this.state.nonSubscriberListResult.count} non-subscriber(s) since 2026-01-01.
                      </p>
                    )}
                    {this.state.nonSubscriberListResult && this.state.nonSubscriberListResult.error && (
                      <p className="Settings-admin-error" style={{ marginTop: "8px" }}>
                        {this.state.nonSubscriberListResult.error}
                      </p>
                    )}
                    {this.state.emailListResult && !this.state.emailListResult.error && (
                      <p className="Settings-admin-result" style={{ marginTop: "8px" }}>
                        {this.state.emailListResult.count} user(s) since 2026-01-01 (all).
                      </p>
                    )}
                    {this.state.emailListResult && this.state.emailListResult.error && (
                      <p className="Settings-admin-error" style={{ marginTop: "8px" }}>
                        {this.state.emailListResult.error}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
  a: state.auth.a,
  subscriptionActive: state.auth.subscriptionActive,
  subscriptionExpires: state.auth.subscriptionExpires,
  paymentMethod: state.auth.paymentMethod,
  tier: state.auth.tier,
});

const mapDispatchToProps = {
  changeSubscriptionActiveStatus,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Settings));

