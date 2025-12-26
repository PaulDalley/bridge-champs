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


// Pricing tiers
const PRICING_TIERS = {
  basic: {
    price: "25",
    name: "Basic Membership",
    paypalButton: "YNKJMUC64MT5Q"
  },
  premium: {
    price: "50",
    name: "Premium",
    paypalButton: "PRUK4P42SGVDC"
  }
};

const successCallback =
  "https://us-central1-bridgechampions.cloudfunctions.net/ipnHandler";

class PremiumMembership extends Component {
  state = {
    authComplete: false,
    showLogin: false,
    alreadyLoggedIn: false,
    paypalRedirectLoading: false,
    selectedTier: null,
    token: undefined,
    promoCode: "",
    promoError: "",
    promoSuccess: "",
  };

  componentDidMount() {
    // Don't auto-select a tier
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
    
    firebase.firestore().collection('userTokens').doc(code).get()
      .then(doc => {
        if (doc.exists) {
          const data = doc.data();
          const days = data.daysFree || 0;
          const tier = data.tier;
          
          if (tier && tier !== this.state.selectedTier) {
            const tierName = tier === 'premium' ? 'Premium' : 'Basic';
            this.setState({ 
              promoError: "",
              promoSuccess: `🎉 This code gives you 1 month FREE with ${tierName} membership! Select ${tierName} to use it.`
            });
          } else {
            this.setState({ 
              promoSuccess: `✓ Code valid! You'll get ${days} extra day${days !== 1 ? 's' : ''} free`,
              promoError: ""
            });
          }
        } else {
          this.setState({ 
            promoError: "Invalid promo code",
            promoSuccess: ""
          });
        }
      })
      .catch(err => {
        console.error('Error validating promo code:', err);
        this.setState({ promoError: "Error validating code" });
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
    this.setState({ showLogin: true, selectedTier: tier });
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
    const { uid, subscriptionActive } = this.props;

    // Only redirect if user already has Premium tier
    if (uid && subscriptionActive && this.props.tier === "premium") {
      this.props.history.push("/");
      return null;
    }

    const showTierSelection = uid && selectedTier && !authComplete;
    const showBothTiers = (!uid && !showLogin) || (uid && !selectedTier && !authComplete);

    return (
      <div className="PremiumMembership-container">
        {showLogin && !uid && (
          <Row>
            <AuthComponent
              signup={true}
              location={this.props.location}
              history={this.props.history}
              paypalSubscribe={() => this.setState({ showLogin: false })}
            />
          </Row>
        )}

        <div className="PremiumMembership-header">
          {!showLogin && (
            <span>
              Subscribe to{" "}
              <span className="PremiumMembership-title">Bridge Champions</span>
            </span>
          )}

          {!showLogin && !uid && (
            <div className="PremiumMembership-header_text_small">
              Access to our paid content is for subscribers only. Already a
              member?&nbsp;
              <Link to="/login">Log in now</Link> to access premium content.
            </div>
          )}
        </div>

        {(this.state.alreadyLoggedIn || uid) && !showLogin && (
          <div className="PremiumMembership-header_text">
            Access to our content is for subscribers only.
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
                style={{
                  padding: "0.8rem",
                  fontSize: "1rem",
                  border: "2px solid #ddd",
                  borderRadius: "4px",
                  width: "100%",
                  maxWidth: "300px",
                  textAlign: "center"
                }}
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
                <h4 className="center-align">
                  {PRICING_TIERS[selectedTier].name}
                </h4>
                <div className="center-align" style={{fontSize: '2rem', color: '#1976D2', marginBottom: '2rem'}}>
                  ${PRICING_TIERS[selectedTier].price} per month
                </div>
                
                <Button
                  className="PremiumMembership-change-tier"
                  flat
                  onClick={() => this.setState({ selectedTier: null })}
                >
                  Change Tier
                </Button>

                <Row>
                  <Col s={12} className="center-align" style={{marginTop: '2rem'}}>
                    <img
                      src={paypalPayNow}
                      className="PremiumMembership-paypal_signup_button"
                      onClick={(e) => this.signupClicked(e)}
                      alt="Pay with PayPal"
                      style={{cursor: 'pointer', maxWidth: '200px'}}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col s={12} className="center-align" style={{marginTop: '2rem'}}>
                    <div className="PremiumMembership-secure_checkout">
                      <i className="fas fa-lock"></i>&nbsp;&nbsp;Secure Checkout
                    </div>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        )}

        {paypalRedirectLoading && (
          <Row className="PremiumMembership-loading">
            <div className="center-align">
              <Preloader flashing size="big" />
              <br />
              <p>Transferring you to PayPal.com now....</p>
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
    email: auth.email,
    subscriptionExpires: auth.subscriptionExpires,
    subscriptionActive: auth.subscriptionActive,
    trialUsed: auth.trialUsed,
  }),
  { changeSubscriptionActiveStatus }
)(PremiumMembership);