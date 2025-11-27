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

// Pricing tiers
const PRICING_TIERS = {
  basic: {
    price: "25",
    name: "Basic Membership",
    paypalButton: "YNKJMUC64MT5Q"
  },
  premium: {
    price: "50",
    name: "Premium Membership",
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
  };

  componentDidMount() {
    // Don't auto-select a tier
  }

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
      
      if (this.state.token) url = url + `&invoice=${this.state.token}`;
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

    if (uid && subscriptionActive) {
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
                    <span>General topic articles</span>
                  </div>
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span>Fresh quizzes with member leaderboards</span>
                  </div>
                </div>

                <Button
                  className="PremiumMembership-tier-button"
                  onClick={() => uid ? this.selectTier('basic') : this.showLogin('basic')}
                  waves="light"
                  large
                >
                  Get Started
                </Button>
              </Card>
            </Col>

            {/* PREMIUM TIER */}
            <Col s={12} m={6}>
              <Card className="PremiumMembership-pricing-card PremiumMembership-pricing-card-featured">
                <div className="PremiumMembership-popular-badge">MOST POPULAR</div>
                <h4 className="PremiumMembership-tier-name">Premium Membership</h4>
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

                <Button
                  className="PremiumMembership-tier-button PremiumMembership-tier-button-featured"
                  onClick={() => uid ? this.selectTier('premium') : this.showLogin('premium')}
                  waves="light"
                  large
                >
                  Get Started
                </Button>
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