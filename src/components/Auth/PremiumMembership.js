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
import { changeSubscriptionActiveStatus } from "../../store/actions/authActions";
import { firebase } from "../../firebase/config";
import StripeCheckout from "../UI/StripeCheckout";
import { sendSubscriptionEvent } from "../../utils/analytics";
import { membershipUsdApproxWhole } from "../../utils/membershipBillingDisplay";


// Pricing tiers (amounts are AUD charged in Stripe)
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
const processReturnBase =
  "https://us-central1-bridgechampions.cloudfunctions.net/process";
const DEFAULT_TRIAL_TOKEN = "weekfree";
const DEFAULT_TRIAL_DAYS = 7;

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
    effectiveStripePriceId: null, // Override from promo (e.g. ausyouth = A$20/mo)
    effectiveMonthlyPrice: null,
    promoDaysFree: 0, // From last successful validation (for copy: free days vs price promo)
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
    this.setState({
      promoCode,
      promoError: "",
      promoSuccess: "",
      effectiveStripePriceId: null,
      effectiveMonthlyPrice: null,
      promoDaysFree: 0,
    });
    
    // Validate promo code after user stops typing (debounce)
    if (this.promoTimeout) clearTimeout(this.promoTimeout);
    
    if (promoCode.length > 0) {
      this.promoTimeout = setTimeout(() => {
        this.validatePromoCode(promoCode);
      }, 500);
    }
  };

  validatePromoCodeNow = (rawCode) => {
    const promoCode = String(rawCode || "").toLowerCase().trim();
    if (this.promoTimeout) clearTimeout(this.promoTimeout);
    if (!promoCode) {
      this.validatePromoCode("");
      return;
    }
    this.validatePromoCode(promoCode);
  };

  handlePromoCodeKeyDown = (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    this.validatePromoCodeNow(this.state.promoCode);
  };

  handlePromoCodeBlur = () => {
    this.validatePromoCodeNow(this.state.promoCode);
  };

  normalizePromoCode = (code) => String(code || "").toLowerCase().replace(/\s+/g, "").trim();
  isPremiumOnlyFreeMonthPromo = (code) => {
    const normalized = this.normalizePromoCode(code);
    return normalized === "klinger" || normalized === "easts";
  };

  resolvePromoCodeAlias = (code) => {
    const normalized = this.normalizePromoCode(code);
    // Keep KLINGER/EASTS working immediately by mapping to the active BLUE token.
    // Once userTokens/klinger and userTokens/easts exist in Firestore, remove this alias.
    if (this.isPremiumOnlyFreeMonthPromo(normalized)) return "blue";
    // PETE26 and WELCOME2026 should behave exactly like BLUE.
    if (normalized === "pete26" || normalized === "welcome2026") return "blue";
    // Firestore document ids are normalized lowercase promo codes.
    // "harbourview" is no longer accepted.
    return normalized;
  };

  isOneMonthFreeAnyTierCode = (code) => {
    const normalized = this.normalizePromoCode(code);
    return normalized === "blue" || normalized === "pete26" || normalized === "welcome2026";
  };

  /** Trial-extension promos — standard monthly price unchanged (unlike ausyouth price override). */
  isExtendedTrialStandardPricePromo = (code) => {
    const normalized = this.normalizePromoCode(code);
    return normalized === "blue" || normalized === "pete26" || normalized === "welcome2026" || normalized === "goldy";
  };

  getAppliedPromoToken = () => {
    const normalized = this.normalizePromoCode(this.state.promoCode);
    // KLINGER/EASTS are Premium-only. Never send these through Basic checkout.
    if (this.isPremiumOnlyFreeMonthPromo(normalized) && this.state.selectedTier !== "premium") {
      return null;
    }
    const enteredCode = this.resolvePromoCodeAlias(this.state.promoCode);
    return enteredCode || DEFAULT_TRIAL_TOKEN;
  };

  /** Normalize API payload (Express was previously sending wrong body; keep defensive). */
  parseValidateTokenPayload = (data) => {
    let obj = data;
    if (typeof obj === "string") {
      try {
        obj = JSON.parse(obj);
      } catch (e) {
        return { monthlyPrice: null, stripePriceId: null, daysFree: 0, tier: undefined };
      }
    }
    if (!obj || typeof obj !== "object") {
      return { monthlyPrice: null, stripePriceId: null, daysFree: 0, tier: undefined };
    }
    const rawMp = obj.monthlyPrice;
    const monthlyPrice =
      rawMp === undefined || rawMp === null || rawMp === ""
        ? null
        : Number(rawMp);
    const coercedMp = Number.isFinite(monthlyPrice) ? monthlyPrice : null;
    const daysNum = Number(obj.daysFree);
    const daysFree = Number.isFinite(daysNum) && daysNum > 0 ? daysNum : 0;
    return {
      ...obj,
      monthlyPrice: coercedMp,
      stripePriceId: obj.stripePriceId || null,
      daysFree,
      tier: obj.tier,
    };
  };

  validatePromoCode = (code) => {
    if (!code) {
      this.setState({ promoError: "", promoSuccess: "", promoDaysFree: 0 });
      return;
    }

    // Use the backend validator so UI always matches what checkout will do.
    const url = "https://us-central1-bridgechampions.cloudfunctions.net/validateUserToken";
    const codeForValidation = this.resolvePromoCodeAlias(code);
    $.ajax({
      url,
      method: "POST",
      contentType: "application/json; charset=UTF-8",
      data: JSON.stringify({ token: codeForValidation }),
      dataType: "json",
    })
      .then((raw) => {
        const data = this.parseValidateTokenPayload(raw);
        const days = data.daysFree;
        const tier = this.isPremiumOnlyFreeMonthPromo(code) ? "premium" : data.tier;

        const nextStep = " Choose a subscription below and complete checkout to apply it.";
        const monthlyPrice = data.monthlyPrice;
        const stripePriceId = data.stripePriceId;

        if (tier && tier !== this.state.selectedTier) {
          const tierName = tier === "premium" ? "Premium" : "Basic";
          let detail = "";
          if (monthlyPrice != null) {
            const usdH = membershipUsdApproxWhole(monthlyPrice);
            const usdPart = usdH != null ? `, about US$${usdH}/month at typical FX` : "";
            detail = ` — billed at A$${monthlyPrice}/month after your ${DEFAULT_TRIAL_DAYS}-day free trial${usdPart} (your bank sets the rate)`;
          } else if (days > 0) {
            detail = ` (${days} free day${days !== 1 ? "s" : ""} before billing)`;
          }
          this.setState({
            promoError: "",
            promoSuccess: `✓ Code valid for ${tierName}.${detail}${nextStep}`,
            effectiveStripePriceId: stripePriceId || null,
            effectiveMonthlyPrice: monthlyPrice,
            promoDaysFree: days,
          });
        } else {
          let msg;
          if (days > 0 && this.isOneMonthFreeAnyTierCode(code)) {
            msg = `✓ Code valid! 1 month free with Standard or Premium.${nextStep}`;
          } else if (days > 0) {
            msg = `✓ Code valid! ${days} free day${days !== 1 ? "s" : ""} before billing.${nextStep}`;
          } else if (monthlyPrice != null) {
            const usdH = membershipUsdApproxWhole(monthlyPrice);
            const usdPart = usdH != null ? ` (about US$${usdH}/month at typical FX; your bank sets the rate)` : "";
            msg = `✓ Code valid! Your Premium rate will be A$${monthlyPrice}/month after the ${DEFAULT_TRIAL_DAYS}-day free trial${usdPart}.${nextStep}`;
          } else {
            msg = `✓ Code valid!${nextStep}`;
          }
          this.setState({
            promoSuccess: msg,
            promoError: "",
            effectiveStripePriceId: stripePriceId || null,
            effectiveMonthlyPrice: monthlyPrice,
            promoDaysFree: days,
          });
        }
      })
      .catch((err) => {
        console.error("Error validating promo code:", err);
        this.setState({
          promoError: "Invalid promo code",
          promoSuccess: "",
          effectiveStripePriceId: null,
          effectiveMonthlyPrice: null,
          promoDaysFree: 0,
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

  paypalSubscribe = async (uid, redirect = false) => {
    if (!redirect || !this.state.selectedTier) {
      this.setState({ showLogin: false });
      return;
    }
    this.setState({
      authComplete: true,
      showLogin: false,
      paypalRedirectLoading: true,
    });

    const tier = PRICING_TIERS[this.state.selectedTier];
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${tier.paypalButton}`;
    let returnUrl = `${processReturnBase}?uid=${encodeURIComponent(uid)}`;
    const appliedToken = this.getAppliedPromoToken();
    if (appliedToken) {
      returnUrl = returnUrl + "&promo=" + encodeURIComponent(appliedToken);
    }
    const url = `${paypalUrl}&notify_url=${encodeURIComponent(successCallback)}&custom=${encodeURIComponent(uid)}&return=${encodeURIComponent(returnUrl)}`;
    window.location = url;
  };

  signupClicked = (e) => {
    e.preventDefault();
    this.setState({ authComplete: true });
    this.paypalSubscribe(this.props.uid, true);
  };

  handleUpgradeClick = () => {
    const { paymentMethod, uid } = this.props;
    if (!uid) return;
    this.setState({ paypalRedirectLoading: true });
    if (paymentMethod === "paypal") {
      const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=${PRICING_TIERS.premium.paypalButton}`;
      const returnUrl = `${processReturnBase}?uid=${encodeURIComponent(uid)}&upgraded=1`;
      const url = `${paypalUrl}&notify_url=${encodeURIComponent(successCallback)}&custom=${encodeURIComponent(uid)}&return=${encodeURIComponent(returnUrl)}`;
      window.location.href = url;
      return;
    }
    const stripeUpgradeUrl = "https://us-central1-bridgechampions.cloudfunctions.net/stripeUpgradeSubscription";
    $.post(stripeUpgradeUrl, { uid })
      .done((data) => {
        this.setState({ paypalRedirectLoading: false });
        const source = typeof sessionStorage !== "undefined" ? sessionStorage.getItem("subscription_upgrade_source") : null;
        sendSubscriptionEvent("subscription_upgraded", {
          from_tier: "basic",
          to_tier: "premium",
          upgrade_source: source || "membership_page",
        });
        if (typeof sessionStorage !== "undefined") sessionStorage.removeItem("subscription_upgrade_source");
        this.props.changeSubscriptionActiveStatus(true);
        window.location.reload();
      })
      .fail(() => {
        this.setState({ paypalRedirectLoading: false });
        alert("Upgrade failed. Please try again or contact support.");
      });
  };

  render() {
    const { selectedTier, showLogin, authComplete, paypalRedirectLoading } = this.state;
    const { uid, subscriptionActive, authReady } = this.props;

    // Show "already subscribed" message for any active subscriber
    if (uid && subscriptionActive && authReady) {
      const tierName = this.props.tier === "premium" ? "Premium" : "Basic";
      const isBasic = this.props.tier === "basic";
      return (
        <div className="PremiumMembership-container">
          <Card className="PremiumMembership-pricing-card" style={{ maxWidth: "32rem", margin: "4rem auto", padding: "2rem", textAlign: "center" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "#2e7d32" }}><Icon>check_circle</Icon></div>
            <h4 style={{ marginBottom: "0.75rem" }}>You're already subscribed</h4>
            <p style={{ color: "#555", marginBottom: "1.5rem" }}>
              You have an active {tierName} subscription. {!isBasic && "There's no need to subscribe again — you have full access to all your content."}
              {isBasic && "Upgrade to Premium for exclusive videos and more."}
            </p>
            {isBasic && (
              <Button
                waves="light"
                onClick={this.handleUpgradeClick}
                disabled={this.state.paypalRedirectLoading}
                style={{ backgroundColor: "#0F4C3A", marginBottom: "1rem" }}
              >
                {this.state.paypalRedirectLoading ? "Redirecting…" : "Upgrade to Premium"}
              </Button>
            )}
            <Button waves="light" onClick={() => this.props.history.push("/")} style={{ backgroundColor: isBasic ? "#666" : "#0F4C3A" }}>
              Go to homepage
            </Button>
          </Card>
        </div>
      );
    }

    const showTierSelection = uid && selectedTier && !authComplete;
    const showBothTiers = !authReady || (!uid && !showLogin) || (uid && !selectedTier && !authComplete);

    const paymentAudForFx =
      showTierSelection && selectedTier
        ? selectedTier === "premium" && this.state.effectiveMonthlyPrice != null
          ? this.state.effectiveMonthlyPrice
          : PRICING_TIERS[selectedTier].price
        : null;
    const paymentUsdForFx =
      paymentAudForFx != null ? membershipUsdApproxWhole(paymentAudForFx) : null;

    const normalizedPromoCode = this.normalizePromoCode(this.state.promoCode);
    const isBluePromoActive =
      this.isOneMonthFreeAnyTierCode(normalizedPromoCode) &&
      this.state.promoSuccess &&
      this.state.promoDaysFree > 0;
    const isPremiumOnlyPromoActive =
      this.isPremiumOnlyFreeMonthPromo(normalizedPromoCode) &&
      this.state.promoSuccess &&
      this.state.promoDaysFree > 0;
    const isFreeFirstMonthOnBasicCard = isBluePromoActive;
    const isFreeFirstMonthOnPremiumCard = isBluePromoActive || isPremiumOnlyPromoActive;
    const selectedTierBasePrice =
      selectedTier && PRICING_TIERS[selectedTier]
        ? PRICING_TIERS[selectedTier].price
        : null;
    const isPremiumOnlyPromoAppliedOnPremium =
      this.isPremiumOnlyFreeMonthPromo(normalizedPromoCode) &&
      selectedTier === "premium" &&
      this.state.promoSuccess &&
      this.state.promoDaysFree > 0;
    const isBlueAppliedOnSelectedTier =
      this.isOneMonthFreeAnyTierCode(normalizedPromoCode) &&
      this.state.promoSuccess &&
      this.state.promoDaysFree > 0 &&
      !!selectedTier;
    const isFreeFirstMonthAppliedOnSelectedTier =
      isBlueAppliedOnSelectedTier || isPremiumOnlyPromoAppliedOnPremium;
    const subscribePath = this.props.location.pathname || "/subscribe";
    return (
      <div className="PremiumMembership-container">
        {showLogin && !uid && authReady && (
          <Row>
            <div className="PremiumMembership-authShell">
              {this.state.authChoice == null ? (
                <>
                  <p className="PremiumMembership-authPrompt">
                    Log in or create an account to continue with your subscription.
                  </p>
                  <div className="PremiumMembership-authCtaWrap">
                    <button
                      type="button"
                      className="PremiumMembership-authCta"
                      onClick={() => this.setState({ authChoice: "chooseAuthMethod" })}
                    >
                      Log in or Create Account
                    </button>
                  </div>
                  <p className="PremiumMembership-authCtaHint">Primary step: click the button above to continue.</p>
                  <p className="PremiumMembership-authBackLinkWrap">
                    <a
                      className="PremiumMembership-authBackLink"
                      href="#back"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ showLogin: false });
                      }}
                    >
                      ← Back to subscription options
                    </a>
                  </p>
                </>
              ) : this.state.authChoice === "chooseAuthMethod" ? (
                <>
                  <p className="PremiumMembership-authPrompt">
                    Choose how you want to continue:
                  </p>
                  <div className="PremiumMembership-authChoiceGrid">
                    <button
                      type="button"
                      className="PremiumMembership-authChoiceBtn"
                      onClick={() => this.setState({ authChoice: "login" })}
                    >
                      I have an existing login
                    </button>
                    <button
                      type="button"
                      className="PremiumMembership-authChoiceBtn PremiumMembership-authChoiceBtn--secondary"
                      onClick={() => this.setState({ authChoice: "signup" })}
                    >
                      I need to make a login
                    </button>
                  </div>
                  <p className="PremiumMembership-authBackLinkWrap">
                    <a
                      className="PremiumMembership-authBackLink"
                      href="#back"
                      onClick={(e) => {
                        e.preventDefault();
                        this.setState({ authChoice: null });
                      }}
                    >
                      ← Back
                    </a>
                  </p>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: "0.5rem" }}>
                    <a href="#back" onClick={(e) => { e.preventDefault(); this.setState({ authChoice: "chooseAuthMethod" }); }}>
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
                    switchToSignup={() => this.setState({ authChoice: "signup" })}
                    switchToLogin={() => this.setState({ authChoice: "login" })}
                  />
                </>
              )}
            </div>
          </Row>
        )}

        <div className="PremiumMembership-header">
          {!showLogin && (
            <span>
              Start your {DEFAULT_TRIAL_DAYS}-day free trial with{" "}
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
              Start with a {DEFAULT_TRIAL_DAYS}-day free trial. Creating an account or logging in does not start access by itself — complete checkout to activate your trial. Already subscribed?&nbsp;
              <Link to="/login?redirect=content">Log in now</Link> to access premium content.
            </div>
          )}
        </div>

        {(this.state.alreadyLoggedIn || uid) && !showLogin && (
          <div className="PremiumMembership-header_text">
            Start your {DEFAULT_TRIAL_DAYS}-day free trial, then continue monthly. You must complete checkout to activate access.
          </div>
        )}

        {/* PROMO CODE INPUT */}
        <Row>
          <Col s={12} m={8} l={6} offset="m2 l3" style={{ marginBottom: "2rem" }}>
            <div className="PremiumMembership-promoShell">
              <label className="PremiumMembership-promoLabel">
                Have a promo code? (Optional)
              </label>
              <input
                type="text"
                placeholder="Enter promo code"
                value={this.state.promoCode}
                onChange={this.handlePromoCodeChange}
                onKeyDown={this.handlePromoCodeKeyDown}
                onBlur={this.handlePromoCodeBlur}
                className="PremiumMembership-promo-input-large"
              />
              {this.state.promoError && (
                <div className="PremiumMembership-promoError">
                  {this.state.promoError}
                </div>
              )}
              {this.state.promoSuccess && (
                <div className="PremiumMembership-promoSuccess">
                  {this.state.promoSuccess}
                </div>
              )}
              {this.state.promoSuccess && (
                <div className="PremiumMembership-promoNextStep">
                  {this.state.effectiveMonthlyPrice != null
                    ? `Next step: choose Premium below, then complete checkout — your rate will be A$${this.state.effectiveMonthlyPrice}/month after the ${DEFAULT_TRIAL_DAYS}-day free trial (about US$${membershipUsdApproxWhole(this.state.effectiveMonthlyPrice)}/month at typical FX; your bank sets the rate).`
                    : this.state.promoDaysFree > 0
                      ? "Next step: choose a plan below, then complete checkout — your code adds the free time shown above before regular billing."
                      : "Next step: choose a plan below, then complete checkout — your code will be applied at checkout."}
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
                  {isFreeFirstMonthOnBasicCard ? (
                    <>
                      <span
                        style={{
                          textDecoration: "line-through",
                          opacity: 0.55,
                          marginRight: "0.35em",
                          fontSize: "0.85em",
                        }}
                      >
                        A${PRICING_TIERS.basic.price}
                      </span>
                      FREE
                    </>
                  ) : (
                    <>A${PRICING_TIERS.basic.price}</>
                  )}
                  <span className="PremiumMembership-price-period">
                    {isFreeFirstMonthOnBasicCard ? " first month" : "/month"}
                  </span>
                </div>
                <div className="PremiumMembership-priceFx">
                  {isFreeFirstMonthOnBasicCard ? (
                    <>Then ≈ US${membershipUsdApproxWhole(PRICING_TIERS.basic.price)}/month</>
                  ) : (
                    <>≈ US${membershipUsdApproxWhole(PRICING_TIERS.basic.price)}/month</>
                  )}
                </div>

                <div className="PremiumMembership-tier-benefits">
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span>Access to all Practical Learning problems</span>
                  </div>
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span>Access to all articles</span>
                  </div>
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span>Access to "The Treadmill"</span>
                  </div>
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span>Access to "Just Play" (in development)</span>
                  </div>
                </div>

                <button
                  className="PremiumMembership-custom-button PremiumMembership-custom-button-basic"
                  onClick={() => uid ? this.selectTier('basic') : this.showLogin('basic')}
                >
                  Start {DEFAULT_TRIAL_DAYS}-day free trial (Basic)
                </button>
              </Card>
            </Col>

            {/* PREMIUM TIER */}
            <Col s={12} m={6}>
              <Card className="PremiumMembership-pricing-card PremiumMembership-pricing-card-featured">
                <div className="PremiumMembership-popular-badge">RECOMMENDED BY PAUL</div>
                <h4 className="PremiumMembership-tier-name">Premium</h4>
                <div className="PremiumMembership-price">
                  {isFreeFirstMonthOnPremiumCard ? (
                    <>
                      <span
                        style={{
                          textDecoration: "line-through",
                          opacity: 0.55,
                          marginRight: "0.35em",
                          fontSize: "0.85em",
                        }}
                      >
                        A${PRICING_TIERS.premium.price}
                      </span>
                      FREE
                    </>
                  ) : this.state.effectiveMonthlyPrice != null ? (
                    <>
                      <span
                        style={{
                          textDecoration: "line-through",
                          opacity: 0.55,
                          marginRight: "0.35em",
                          fontSize: "0.85em",
                        }}
                      >
                        A${PRICING_TIERS.premium.price}
                      </span>
                      A${this.state.effectiveMonthlyPrice}
                    </>
                  ) : (
                    <>A${PRICING_TIERS.premium.price}</>
                  )}
                  <span className="PremiumMembership-price-period">
                    {isFreeFirstMonthOnPremiumCard ? " first month" : "/month"}
                  </span>
                </div>
                <div className="PremiumMembership-priceFx">
                  {isFreeFirstMonthOnPremiumCard ? (
                    <>Then ≈ US${membershipUsdApproxWhole(PRICING_TIERS.premium.price)}/month</>
                  ) : (
                    <>
                      ≈ US$
                      {membershipUsdApproxWhole(
                        this.state.effectiveMonthlyPrice != null
                          ? this.state.effectiveMonthlyPrice
                          : PRICING_TIERS.premium.price
                      )}
                      /month
                    </>
                  )}
                </div>

                <div className="PremiumMembership-tier-benefits">
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span><strong>Everything in Basic, plus:</strong></span>
                  </div>
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span>Videos to accompany all training problems</span>
                  </div>
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span>Videos to accompany several articles, with more coming</span>
                  </div>
                  <div className="PremiumMembership-benefit">
                    <Icon className="PremiumMembership-benefit-icon">check_circle</Icon>
                    <span>Priority response from Paul if you'd like to ask any bridge-related questions</span>
                  </div>
                </div>

                <button
                  className="PremiumMembership-custom-button PremiumMembership-custom-button-premium"
                  onClick={() => uid ? this.selectTier('premium') : this.showLogin('premium')}
                >
                  Start {DEFAULT_TRIAL_DAYS}-day free trial (Premium)
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
                    {isFreeFirstMonthAppliedOnSelectedTier ? (
                      <>
                        <span style={{ textDecoration: "line-through", opacity: 0.65, marginRight: "0.35em" }}>
                          A${selectedTierBasePrice}
                        </span>
                        <span>Free for the first month</span>
                        <span className="PremiumMembership-payment-priceFx"> Then A${selectedTierBasePrice}/month.</span>
                      </>
                    ) : (
                      <>
                        A$
                        {selectedTier === "premium" && this.state.effectiveMonthlyPrice != null
                          ? this.state.effectiveMonthlyPrice
                          : PRICING_TIERS[selectedTier].price}{" "}
                        <span>per month after {DEFAULT_TRIAL_DAYS} days free</span>
                        {paymentUsdForFx != null ? (
                          <span className="PremiumMembership-payment-priceFx">
                            {" "}
                            (about US${paymentUsdForFx}/month at typical FX; your bank sets the rate)
                          </span>
                        ) : null}
                      </>
                    )}
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

                {this.state.promoCode && this.state.promoSuccess && (
                  <div
                    style={{
                      marginBottom: "1rem",
                      padding: "0.75rem 1rem",
                      background: "#e8f5e9",
                      borderRadius: "6px",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    <strong>Promo:</strong>{" "}
                    {this.isPremiumOnlyFreeMonthPromo(this.state.promoCode) && selectedTier !== "premium" ? (
                      <>
                        {this.state.promoCode.toUpperCase()} is for <strong>Premium</strong> only. Tap{" "}
                        <strong>← Change Tier</strong> and choose Premium to use it.
                      </>
                    ) : isFreeFirstMonthAppliedOnSelectedTier ? (
                      <>
                        {this.state.promoCode.toUpperCase()} applied. Your first 30 days are free, then A$
                        {selectedTierBasePrice}/month unless canceled.
                      </>
                    ) : this.state.effectiveMonthlyPrice != null && selectedTier !== "premium" ? (
                      <>
                        {this.state.promoCode.toUpperCase()} is for <strong>Premium</strong> at A$
                        {this.state.effectiveMonthlyPrice}/month after your free trial (about US$
                        {membershipUsdApproxWhole(this.state.effectiveMonthlyPrice)} at typical FX) — tap{" "}
                        <strong>← Change Tier</strong> and choose Premium to use it.
                      </>
                    ) : selectedTier === "premium" && this.state.effectiveMonthlyPrice != null ? (
                      <>
                        {this.state.promoCode.toUpperCase()} — you&apos;ll be charged A$
                        {this.state.effectiveMonthlyPrice}/month after your {DEFAULT_TRIAL_DAYS}-day free trial (not the
                        standard A${PRICING_TIERS.premium.price}/month; about US$
                        {membershipUsdApproxWhole(this.state.effectiveMonthlyPrice)} at typical FX).
                      </>
                    ) : this.state.promoDaysFree > 0 ? (
                      <>
                        {this.state.promoCode.toUpperCase()} — adds {this.state.promoDaysFree} free day
                        {this.state.promoDaysFree !== 1 ? "s" : ""} before billing (on top of the usual trial where applicable).
                      </>
                    ) : this.isExtendedTrialStandardPricePromo(this.state.promoCode) ? (
                      <>
                        {this.state.promoCode.toUpperCase()} — extends your free period before paid billing starts.
                        Your ongoing rate stays the normal price for this tier (A${PRICING_TIERS[selectedTier].price}/month,
                        about US${membershipUsdApproxWhole(PRICING_TIERS[selectedTier].price)} at typical FX); this code does
                        not lower the monthly amount.
                      </>
                    ) : (
                      <>{this.state.promoCode.toUpperCase()} will be applied when you complete checkout.</>
                    )}
                  </div>
                )}
                {!this.state.promoCode && (
                  <div
                    style={{
                      marginBottom: "1rem",
                      padding: "0.75rem 1rem",
                      background: "#e8f5e9",
                      borderRadius: "6px",
                      fontSize: "var(--text-sm)",
                    }}
                  >
                    <strong>Free trial included:</strong> Your first {DEFAULT_TRIAL_DAYS} days are free.
                  </div>
                )}

                <div className="PremiumMembership-payment-options">
                  <div className="PremiumMembership-payment-divider">
                    <span>Secure card checkout</span>
                  </div>
                  
                  <div className="PremiumMembership-payment-methods">
                    <div className="PremiumMembership-payment-method">
                      <div className="PremiumMembership-payment-method-header">
                        <i className="fab fa-cc-stripe" style={{ fontSize: '2rem', color: '#635bff', marginRight: '0.5rem' }}></i>
                        <span>Official Stripe Checkout</span>
                      </div>
                      <p className="PremiumMembership-trialLead">
                        {isFreeFirstMonthAppliedOnSelectedTier ? (
                          <>
                            <strong>{this.state.promoCode.toUpperCase()} applied:</strong> first 30 days free, then A$
                            {selectedTierBasePrice}/month unless canceled.
                          </>
                        ) : (
                          <>
                            <strong>{DEFAULT_TRIAL_DAYS} days free today</strong>, then A$
                            {selectedTier === "premium" && this.state.effectiveMonthlyPrice != null
                              ? this.state.effectiveMonthlyPrice
                              : PRICING_TIERS[selectedTier].price}
                            /month unless canceled
                            {paymentUsdForFx != null
                              ? ` (about US$${paymentUsdForFx}/month at typical FX; your bank sets the rate)`
                              : ""}
                            .
                          </>
                        )}
                      </p>
                      <p className="PremiumMembership-trialSub">
                        Secure card payment powered by Stripe.
                      </p>
                      <StripeCheckout
                        uid={this.props.uid}
                        email={this.props.email}
                        tierPriceId={
                          selectedTier === "premium" && this.state.effectiveStripePriceId
                            ? this.state.effectiveStripePriceId
                            : PRICING_TIERS[selectedTier].stripePriceId
                        }
                        tierName={PRICING_TIERS[selectedTier].name}
                        tierPrice={String(
                          selectedTier === "premium" && this.state.effectiveMonthlyPrice != null
                            ? this.state.effectiveMonthlyPrice
                            : PRICING_TIERS[selectedTier].price
                        )}
                        getToken={this.getAppliedPromoToken}
                        getEnteredPromoCode={() => this.normalizePromoCode(this.state.promoCode)}
                        processing={() => this.setState({ stripeProcessing: true })}
                        clearProcessing={() => this.setState({ stripeProcessing: false })}
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
    tier: auth.tier ?? "basic",
    paymentMethod: auth.paymentMethod,
  }),
  { changeSubscriptionActiveStatus }
)(PremiumMembership);