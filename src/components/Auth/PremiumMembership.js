import React, { Component } from "react";
import { connect } from "react-redux";
import "./PremiumMembership.css";
import {
  Col,
  Row,
  Card,
  Preloader,
  Button,
  Icon,
} from "react-materialize";
import { Link } from "react-router-dom";
import AuthComponent from "../../containers/AuthComponent";
import $ from "jquery";
import paypalPayNow from "../../assets/images/paypal-paynow.png";
import { changeSubscriptionActiveStatus } from "../../store/actions/authActions";
import { firebase } from "../../firebase/config";
import StripeCheckout from "../UI/StripeCheckout";


// Pricing tiers
const PRICING_TIERS = {
  basic: {
    price: "25",
    name: "Basic Membership",
    paypalButton: "YNKJMUC64MT5Q",
    stripePriceId: "price_1SXsQTE9mroRD7lKZAqvGZCD"
  },
  premium: {
    price: "50",
    name: "Premium",
    paypalButton: "PRUK4P42SGVDC",
    stripePriceId: "price_1SXVk6E9mroRD7lKIHxCKA7c"
  }
};

const successCallback =
  "https://us-central1-bridgechampions.cloudfunctions.net/ipnHandler";

class PremiumMembership extends Component {
  state = {
    authComplete: false,
    showLogin: false,
    authChoice: null, // null = show chooser, 'login' | 'signup' = show that form
    alreadyLoggedIn: false,
    paypalRedirectLoading: false,
    selectedTier: null,
    token: undefined,
    promoCode: "",
    promoError: "",
    promoSuccess: "",
    stripeProcessing: false,
  };

  componentDidMount() {
    // Let both logged-in and logged-out users see the subscription page (no redirect to /signup)
  }

  componentDidUpdate(prevProps) {
    // When user logs out while on this page, just re-render (show tier cards again)
    if (prevProps.uid && !this.props.uid) {
      this.setState({ showLogin: false, authChoice: null });
    }
  }


  handlePromoCodeChange = (e) => {
    const promoCode = e.target.value.toLowerCase();
    this.setState({ promoCode, promoError: "", promoSuccess: "" });
    
    // Validate promo code after user stops typing (debounce)
    if (this.promoTimeout) clearTimeout(this.promoTimeout);
    
    if (promoCode.length > 0) {
      this.promoTimeout = setTimeout(() => {
        this.validatePromoCode(promoCode);
      }, 500);
    }
  };

  validatePromoCode = (code) => {
    if (!code) {
      this.setState({ promoError: "", promoSuccess: "" });
      return;
    }

    // Use the backend validator so UI always matches what checkout will do.
    const url = "https://us-central1-bridgechampions.cloudfunctions.net/validateUserToken";
    $.post(url, { token: code })
      .then((data) => {
        const days = data?.daysFree || 0;
        const tier = data?.tier;

        const nextStep = " Choose a subscription below and complete checkout to apply it.";
        if (tier && tier !== this.state.selectedTier) {
          const tierName = tier === "premium" ? "Premium" : "Basic";
          this.setState({
            promoError: "",
            promoSuccess: `✓ Code valid for ${tierName} (${days} free day${days !== 1 ? "s" : ""}).${nextStep}`,
          });
        } else {
          let msg;
          if (days > 0 && code.toLowerCase() === "harbourview") {
            msg = `✓ Code valid! 1 month free with Standard or Premium.${nextStep}`;
          } else if (days > 0) {
            msg = `✓ Code valid! ${days} free day${days !== 1 ? "s" : ""} before billing.${nextStep}`;
          } else {
            msg = `✓ Code valid!${nextStep}`;
          }
          this.setState({
            promoSuccess: msg,
            promoError: "",
          });
        }
      })
      .catch((err) => {
        console.error("Error validating promo code:", err);
        this.setState({
          promoError: "Invalid promo code",
          promoSuccess: "",
        });
      });
  };

  componentWillUpdate(nextProps) {
    let whenSubExpiresMinus2Days = undefined;
    if (nextProps.subscriptionExpires) {
      whenSubExpiresMinus2Days =
        new Date(nextProps.subscriptionExpires).getTime() -
        2 * 24 * 60 * 60 * 1000;
      if (nextProps.subscriptionActive && new Date() < whenSubExpiresMinus2Days) {
        this.props.history.push("/");
      }
    }

    if (nextProps.uid && !this.state.alreadyLoggedIn) {
      this.setState({ alreadyLoggedIn: true });
    }
  }

  showLogin = (tier) => {
    this.setState({ showLogin: true, authChoice: null, selectedTier: tier });
  };

  selectTier = (tier) => {
    this.setState({ selectedTier: tier });
  };

  paypalSubscribe = (uid, redirect = false) => {
    if (!redirect || !this.state.selectedTier) {
      this.setState({ showLogin: false });
      return;
    } else {
      this.setState({
        authComplete: true,
        showLogin: false,
        paypalRedirectLoading: true,
      });
      
      const tier = PRICING_TIERS[this.state.selectedTier];
      const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${tier.paypalButton}`;
      let url = `${paypalUrl}&notify_url=${successCallback}&custom=${uid}`;
      
      if (this.state.promoCode) url = url + `&invoice=${this.state.promoCode}`;
      window.location = url;
    }
  };

  signupClicked = (e) => {
    e.preventDefault();
    this.setState({ authComplete: true });
    this.paypalSubscribe(this.props.uid, true);
  };

  render() {
    const { selectedTier, showLogin, authComplete, paypalRedirectLoading } = this.state;
    const { uid, subscriptionActive, authReady } = this.props;

    // Show "already subscribed" message for any active subscriber
    if (uid && subscriptionActive && authReady) {
      const tierName = this.props.tier === "premium" ? "Premium" : "Basic";
      return (
        <div className="PremiumMembership-container">
          <Card className="PremiumMembership-pricing-card" style={{ maxWidth: "32rem", margin: "4rem auto", padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#2e7d32" }}><Icon>check_circle</Icon></div>
            <h4 style={{ marginBottom: "0.75rem" }}>You're already subscribed</h4>
            <p style={{ color: "#555", marginBottom: "1.5rem" }}>
              You have an active {tierName} subscription. There's no need to subscribe again — you have full access to all your content.
            </p>
            <Button waves="light" onClick={() => this.props.history.push("/")} style={{ backgroundColor: "#0F4C3A" }}>
              Go to homepage
            </Button>
          </Card>
        </div>
      );
    }

    const showTierSelection = uid && selectedTier && !authComplete;
    const showBothTiers = !authReady || (!uid && !showLogin) || (uid && !selectedTier && !authComplete);

    const subscribePath = this.props.location.pathname || "/subscribe";
    return (
      <div className="PremiumMembership-container">
        {showLogin && !uid && authReady && (
          <Row>
            <Card className="AuthComponent-container" style={{ maxWidth: "32rem", margin: "0 auto 2rem" }}>
              {this.state.authChoice == null ? (
                <>
                  <p style={{ marginBottom: "1.5rem", fontSize: "1.1rem" }}>
                    Log in or create an account to continue with your subscription.
                  </p>
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
                    <Button
                      onClick={() => this.setState({ authChoice: "login" })}
                      style={{ marginRight: "0.5rem" }}
                    >
                      Log in
                    </Button>
                    <Button
                      flat
                      onClick={() => this.setState({ authChoice: "signup" })}
                    >
                      Create new account
                    </Button>
                  </div>
                  <p style={{ marginTop: "1rem" }}>
                    <a href="#back" onClick={(e) => { e.preventDefault(); this.setState({ showLogin: false }); }}>
                      ← Back to subscription options
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: "0.5rem" }}>
                    <a href="#back" onClick={(e) => { e.preventDefault(); this.setState({ authChoice: null }); }}>
                      ← Back
                    </a>
                  </p>
                  <AuthComponent
                    signup={this.state.authChoice === "signup"}
                    login={this.state.authChoice === "login"}
                    location={this.props.location}
                    history={this.props.history}
                    redirectPathAfterAuth={subscribePath}
                    paypalSubscribe={() => this.setState({ showLogin: false, authChoice: null })}
                  />
                </>
              )}
            </Card>
          </Row>
        )}

        <div className="PremiumMembership-header">
          {!showLogin && (
            <span>
              Subscribe to{" "}
              <span className="PremiumMembership-title">Bridge Champions</span>
            </span>
          )}

          {!showLogin && !authReady && (
            <div className="PremiumMembership-header_text_small" style={{ color: "#666" }}>
              Checking sign-in…
            </div>
          )}
          {!showLogin && !uid && authReady && (
            <div className="PremiumMembership-header_text_small">
              Access to our paid content is for subscribers only. Creating an account or logging in does not subscribe you — you must complete payment. Already subscribed?&nbsp;
              <Link to="/login?redirect=content">Log in now</Link> to access premium content.
            </div>
          )}
        </div>

        {(this.state.alreadyLoggedIn || uid) && !showLogin && (
          <div className="PremiumMembership-header_text">
            Access to our content is for subscribers only. You must complete payment to subscribe — creating an account alone does not give access.
          </div>
        )}


        {/* PROMO CODE INPUT */}
        <Row>
          <Col s={12} m={8} l={6} offset="m2 l3" style={{ marginBottom: "2rem" }}>
            <div style={{ textAlign: "center", padding: "1.5rem", background: "#f8f9fa", borderRadius: "8px" }}>
              <label style={{ fontSize: "1.1rem", fontWeight: "500", marginBottom: "0.5rem", display: "block" }}>
                Have a promo code?
              </label>
              <input
                type="text"
                placeholder="Enter promo code"
                value={this.state.promoCode}
                onChange={this.handlePromoCodeChange}
                className="PremiumMembership-promo-input-large"
              />
              {this.state.promoError && (
                <div style={{ color: "#d32f2f", marginTop: "0.5rem", fontSize: "0.9rem" }}>
                  {this.state.promoError}
                </div>
              )}
              {this.state.promoSuccess && (
                <div style={{ color: "#2e7d32", marginTop: "0.5rem", fontSize: "1rem", fontWeight: "500" }}>
                  {this.state.promoSuccess}
                </div>
              )}
              {this.state.promoSuccess && (
                <div style={{ marginTop: "0.75rem", padding: "0.75rem", background: "#e8f5e9", borderRadius: "6px", fontSize: "0.95rem", fontWeight: "600" }}>
                  Next step: choose a plan below, then complete checkout — your code will be applied at payment.
                </div>
              )}
            </div>
          </Col>
        </Row>

        {/* TWO-TIER PRICING CARDS */}
        {showBothTiers && (
          <Row>
            {/* BASIC TIER */}
            <Col s={12} m={6}>
              <Card className="PremiumMembership-pricing-card">
                <h4 className="PremiumMembership-tier-name">Basic Membership</h4>
                <div className="PremiumMembership-price">
                  ${PRICING_TIERS.basic.price}
                  <span className="PremiumMembership-price-period">/month</span>
                </div>
                
                <div className="PremiumMembership-tier-benefits">
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span>Access to all articles on Declarer Play, Defence, and Bidding</span>
                  </div>
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                  <span>Interactive quizzes and practice hands</span></div>
                </div>

                <button
                  className="PremiumMembership-custom-button PremiumMembership-custom-button-basic"
                  onClick={() => uid ? this.selectTier('basic') : this.showLogin('basic')}
                >
                  Choose Basic
                </button>
              </Card>
            </Col>

            {/* PREMIUM TIER */}
            <Col s={12} m={6}>
              <Card className="PremiumMembership-pricing-card PremiumMembership-pricing-card-featured">
                <div className="PremiumMembership-popular-badge">MOST POPULAR</div>
                <h4 className="PremiumMembership-tier-name">Premium</h4>
                <div className="PremiumMembership-price">
                  ${PRICING_TIERS.premium.price}
                  <span className="PremiumMembership-price-period">/month</span>
                </div>
                
                <div className="PremiumMembership-tier-benefits">
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span><strong>Everything in Basic, plus:</strong></span>
                  </div>
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span>Access to exclusive instructional videos</span>
                  </div>
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span>Submit bridge questions to Paul</span>
                  </div>
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span>Receive video or email responses from expert players</span>
                  </div>
                </div>

                <button
                  className="PremiumMembership-custom-button PremiumMembership-custom-button-premium"
                  onClick={() => uid ? this.selectTier('premium') : this.showLogin('premium')}
                >
                  Choose Premium
                </button>
              </Card>
            </Col>
          </Row>
        )}

        {/* PAYMENT SECTION FOR LOGGED IN USERS */}
        {showTierSelection && (
          <Row>
            <Col s={12}>
              <Card className="PremiumMembership-payment-card">
                <div className="PremiumMembership-payment-header">
                  <h4>{PRICING_TIERS[selectedTier].name}</h4>
                  <div className="PremiumMembership-payment-price">
                    ${PRICING_TIERS[selectedTier].price} <span>per month</span>
                  </div>
                </div>
                
                <div className="PremiumMembership-payment-actions">
                  <button
                    className="PremiumMembership-change-tier-btn"
                    onClick={() => this.setState({ selectedTier: null })}
                  >
                    ← Change Tier
                  </button>
                </div>

                <div className="PremiumMembership-payment-options">
                  <div className="PremiumMembership-payment-divider">
                    <span>Choose Payment Method</span>
                  </div>
                  
                  <div className="PremiumMembership-payment-methods">
                    {/* PayPal Option */}
                    <div className="PremiumMembership-payment-method">
                      <div className="PremiumMembership-payment-method-header">
                        <i className="fab fa-paypal" style={{ fontSize: '2rem', color: '#0070ba', marginRight: '0.5rem' }}></i>
                        <span>PayPal</span>
                      </div>
                      <img
                        src={paypalPayNow}
                        className="PremiumMembership-paypal-button"
                        onClick={(e) => this.signupClicked(e)}
                        alt="Pay with PayPal"
                      />
                    </div>

                    {/* Stripe Option */}
                    <div className="PremiumMembership-payment-method">
                      <div className="PremiumMembership-payment-method-header">
                        <i className="fab fa-cc-stripe" style={{ fontSize: '2rem', color: '#635bff', marginRight: '0.5rem' }}></i>
                        <span>Credit Card</span>
                      </div>
                      <StripeCheckout
                        uid={this.props.uid}
                        email={this.props.email}
                        tierPriceId={PRICING_TIERS[selectedTier].stripePriceId}
                        tierName={PRICING_TIERS[selectedTier].name}
                        tierPrice={PRICING_TIERS[selectedTier].price}
                        getToken={() => this.state.promoCode}
                        processing={() => this.setState({ stripeProcessing: true })}
                        changeSubscriptionActiveStatus={this.props.changeSubscriptionActiveStatus}
                        history={this.props.history}
                      />
                    </div>
                  </div>

                  <div className="PremiumMembership-secure-badge">
                    <i className="fas fa-lock"></i> Secure Checkout
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {(paypalRedirectLoading || this.state.stripeProcessing) && (
          <Row className="PremiumMembership-loading">
            <div className="center-align">
              <Preloader flashing size="big" />
              <br />
              <p>{paypalRedirectLoading ? 'Transferring you to PayPal.com now....' : 'Processing your payment...'}</p>
            </div>
          </Row>
        )}
      </div>
    );
  }
}

export default connect(
  ({ auth }) => ({
    uid: auth.uid,
    authReady: !!auth.authReady,
    email: auth.email,
    subscriptionExpires: auth.subscriptionExpires,
    subscriptionActive: auth.subscriptionActive,
    trialUsed: auth.trialUsed,
  }),
  { changeSubscriptionActiveStatus }
)(PremiumMembership);