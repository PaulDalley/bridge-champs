// Changed daysFree to 0 from 7 and not adding more days to it...
import React, { Component } from "react";
import { connect } from "react-redux";
import "./PremiumMembership.css";
import {
  Col,
  Row,
  Card,
  Tabs,
  Tab,
  Preloader,
  Button,
  Icon,
} from "react-materialize";
import { Link } from "react-router-dom";
import AuthComponent from "../../containers/AuthComponent";
import $ from "jquery";
import paypalPayNow from "../../assets/images/paypal-paynow.png";
// import StripeButton from '../../components/UI/StripeButton';
import StripeCheckout from "../../components/UI/StripeCheckout";
import Coupons from "./Coupons";
import { changeSubscriptionActiveStatus } from "../../store/actions/authActions";

const PRICE_PER_MONTH = "15";

// const url = "https://us-central1-bridgechampions.cloudfunctions.net/activateBillingPlan";
// const url2 = "https://us-central1-bridgechampions.cloudfunctions.net/process";
const successCallback =
  "https://us-central1-bridgechampions.cloudfunctions.net/ipnHandler";

// PayPal Buttons:
// REGULAR LIVE NO TRIAL:
// MINE:
// const PAYPAL_REGULAR_BUTTON_NOTRIAL =
//   "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=BRFTEQT2QRXV8";

// const PAYPAL_SANDBOX_BUTTON_NOTRIAL =
//   "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=379VSUFUTY68J";

// DALLEYS:
const PAYPAY_REGULAR_BUTTON_NOTRIAL =
  "https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=PRUK4P42SGVDC";

// const PAYPAL_SANDBOX_BUTTON_NOTRIAL =
// "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=J6R4LNPYW93AQ";

class PremiumMembership extends Component {
  state = {
    authComplete: false,
    showLogin: false,
    alreadyLoggedIn: false,
    paypalRedirectLoading: false,
    token: undefined,
    daysFree: 0, // ##** 7
    percentOffFirstMonth: undefined,
    paypalButtonUrl: PAYPAY_REGULAR_BUTTON_NOTRIAL,
  };

  fetchPayPalUrl = (uid) => {
    if (!uid) return;
    const url =
      "https://us-central1-bridgechampions.cloudfunctions.net/getPayPalButton";
    // const PAYPAL_BUTTON_ADDRESS_REGULAR = TMS3V9BYRDQEL";
    // PAYPAL_BUTTON_ADDRESS_REGULAR_NOTRIAL = RNJSXE33CZTQC";

    return $.post(url, { uid }, (data, status) => {
      // console.log(data);
      const paypalButtonUrl = data.url;
      this.setState({ paypalButtonUrl });
    }).catch((err) => {
      console.log(err);
      this.fetchPayPalUrl();
    });
  };

  componentDidMount() {
    // ##** COMMENTED OUT FOR NOW
    // if (this.props.uid) this.fetchPayPalUrl(this.props.uid);
  }

  componentWillUpdate(nextProps) {
    // console.log(nextProps.subscriptionExpires);
    // if (nextProps.subscriptionExpires > new Date()) {
    //     this.props.history.push('/');
    // }
    // console.log(nextProps.subscriptionExpires);
    // console.log(nextProps.subscriptionExpires > new Date());

    // if (nextProps.subscriptionExpires > new Date()) { // nextProps.subscriptionActive) {
    // if (nextProps.subscriptionExpires > new Date(new Date().getTime() + (2 * 24 * 60 * 60 * 1000))) {
    let whenSubExpiresMinus2Days = undefined;
    if (nextProps.subscriptionExpires) {
      whenSubExpiresMinus2Days =
        new Date(nextProps.subscriptionExpires).getTime() -
        2 * 24 * 60 * 60 * 1000;
      // console.log(whenSubExpiresMinus2Days);
      if (new Date() < whenSubExpiresMinus2Days) {
        this.props.history.push("/");
      }
    }

    // ##** COMMENTED OUT FOR NOW
    // if (nextProps.uid !== this.props.uid) {
    //   this.fetchPayPalUrl(nextProps.uid);
    // }

    if (nextProps.uid && !this.state.alreadyLoggedIn) {
      this.setState({ alreadyLoggedIn: true });
    }
  }

  showLogin = (e) => {
    e.preventDefault();
    this.setState({ showLogin: true });
  };

  doNothing = (uid) => {
    this.setState({ showLogin: false });
  };

  paypalSubscribe = (uid, redirect = false) => {
    if (!redirect) {
      this.setState({ showLogin: false });
      return;
    } else {
      this.setState({
        authComplete: true,
        showLogin: false,
        paypalRedirectLoading: true,
      });
      let url = `${this.state.paypalButtonUrl}&notify_url=${successCallback}&custom=${uid}`;
      // if (this.state.token) url = url+`&token=${this.state.token}`;
      if (this.state.token) url = url + `&invoice=${this.state.token}`;
      window.location = url;
    }
  };

  // ## PayPal API function - couldn't get it to work:
  // paypalSubscribeX = (uid) => {
  //     this.setState({authComplete: true});
  //     const data2 = {
  //         uid
  //     }
  //     return $.post(url, data2, (data, status) => {
  //         const approval_url = data.approval_url;
  //         window.location = String(approval_url);
  //     })
  //         .catch(err => {
  //             console.log(err)
  //             this.props.history.push('/error');
  //         });
  // };

  // passTokenUp = token => this.setState({ token });
  // passDaysFreeUp = daysFree => this.setState({ daysFree });
  passDataUp = (token, daysFree, percentOffFirstMonth, paypalButtonUrl) =>
    this.setState({
      token,
      daysFree: daysFree, //+ 7,
      percentOffFirstMonth,
      paypalButtonUrl,
    });

  getToken = () => this.state.token;

  // handleTokenInputChange = e => {
  //     // console.log(e.target.name);
  //     // console.log(e.target.value);
  //     this.setState({[e.target.name]: e.target.value});
  // }
  // submitToken = (e) => {
  //     e.preventDefault();
  //     const token = this.state.token;
  //     console.log(this.state.token);
  //     this.setState({tokenSubmitted: true});
  //     setTimeout(() => {
  //        this.setState({tokenValid: true});
  //        $('#token-input-textbox').attr("disabled", "disabled");
  //        $('.PremiumMembership-token-input').addClass('PremiumMembership-token-input-submitted');
  //
  //        // error:
  //         $('.PremiumMembership-token-input').addClass('PremiumMembership-token-input-invalid');
  //        this.setState({tokenMessage: "Your token was invalid", tokenError: true});
  //        // this.setState({tokenMessage: "5 days free access"});
  //     }, 2000);
  // }

  signupClicked = (e) => {
    e.preventDefault();
    this.setState({ authComplete: true });
    this.paypalSubscribe(this.props.uid, true);
  };
  signupClickedStripe = (e) => {
    e.preventDefault();
    // console.log("Stripe Signup Clicked");
  };
  stripeProcessing = () => {
    this.setState({
      authComplete: true,
      stripeRedirectLoading: true,
      showLogin: false,
    });
  };

  // database.collection('members').where("paid", "==", true)
  //     .get()
  //     .then(snapshot => {
  //         console.log(snapshot);
  //         // console.log(snap)
  //         if (snapshot.empty === false) { console.log("THERE IS SHITS HERE")}
  //     })
  //     .catch(err => console.log(err));

  // let uid;
  // database.collection('members').where('billingPlanId', '==', 'P-2F698012AS278780ATXVS6BI')
  //     .get()
  //     .then(snapshot => {
  //         console.log(snapshot);
  //         // snapshot.forEach(doc => console.log(doc.data()));
  //         if (snapshot.empty === false) {
  //             uid = snapshot.docs[0].id;
  //             const memberData = snapshot.docs[0].data();
  //             console.log(memberData);
  //
  //             console.log(uid);
  //
  //         }
  //         else {
  //             console.log("NO DATA");
  //         }
  //     })

  // };

  render() {
    let topHeight =
      this.props.uid && !this.state.authComplete ? "58rem" : "20rem";
    if (this.props.trialUsed && topHeight === "58rem") {
      topHeight = "45rem";
    }

    // if(this.props.uid) {
    //     console.log("I HAVE UID IN MEMBERSHIP COMPONENT");
    //     console.log(this.props.uid);
    // }
    // console.log("IN PREMIUM MEMBERSHIP");
    // console.log(this.props);
    // console.log(this.props.uid);
    // console.log(!this.state.authComplete);
    // this.state.authComplete;
    if (this.props?.uid && this.props?.subscriptionActive) {
      this.props.history.push("/");
      return;
    }

    return (
      <div className="PremiumMembership-container">
        {this.state.showLogin && !this.props.uid && (
          <Row>
            <AuthComponent
              signup={true}
              location={this.props.location}
              history={this.props.history}
              paypalSubscribe={this.doNothing}
            />

            {/* <div className="PremiumMembership-login_area">
                        <Tabs className='z-depth-1'>
                            <Tab active title="Sign up">
                                <AuthComponent signup={true}
                                               location={this.props.location}
                                               history={this.props.history}
                                               paypalSubscribe={this.doNothing}
                                />
                            </Tab>
                            <Tab title="Log in" active>
                                <AuthComponent login={true}
                                               location={this.props.location}
                                               history={this.props.history}
                                               paypalSubscribe={this.doNothing}
                                />
                            </Tab>
                        </Tabs>
                    </div> */}
          </Row>
        )}

        <div className="PremiumMembership-header">
          {!this.state.showLogin && (
            <span>
              Subscribe to a{" "}
              <span className="PremiumMembership-title">BridgeChampions </span>
              Membership
            </span>
          )}
          {/*<Logo />*/}

          {!this.state.showLogin && !this.props.uid && (
            <div className="PremiumMembership-header_text_small">
              Access to our paid content is for subscribers only. Already a
              member?&nbsp;
              <Link to="/login">Log in now</Link> to access premium content.
            </div>
          )}

          {this.state.showLogin ||
            (this.props.uid && (
              <div className="PremiumMembership-signupText-after">
                ${PRICE_PER_MONTH} per month
              </div>
            ))}
        </div>

        {/*{this.state.showLogin &&*/}
        {/*<div className="PremiumMembership-header_text">*/}
        {/*You can create a free account and then set up a recurring membership subscription securely using*/}
        {/*PayPal.com or a credit card.*/}
        {/*</div>*/}
        {/*}*/}

        {(this.state.alreadyLoggedIn || this.props.uid) && (
          <div className="PremiumMembership-header_text">
            Access to our content is for subscribers only.
            <br />
            {/*<br/>*/}
            {/*You can use your BridgeChampions account to set up a recurring membership subscription securely*/}
            {/*using*/}
            {/*PayPal.com and your PayPal account, and can use their*/}
            {/*service to manage your subscription, or you can sign up with a credit card.*/}
          </div>
        )}

        <Row>
          <Col className="PremiumMembership-card_outer_container" s={12}>
            <Card className="PremiumMembership-details-card">
              {!this.state.showLogin && (
                <Row
                  className="PremiumMembership-logo-container"
                  style={{ height: topHeight }}
                >
                  {/*<div className="PremiumMembership-header_overlay_textcaption">*/}
                  {/*For expert knowledge*/}
                  {/*</div>*/}
                  {!this.state.showLogin && (
                    <div>
                      <div className="PremiumMembership-header_overlay"></div>
                      <div className="PremiumMembership-header_overlay_shadow"></div>
                      <div className="PremiumMembership-logosmall-B">B</div>
                      <div className="PremiumMembership-logosmall-C">C</div>
                    </div>
                  )}
                  {/*{ this.props.uid && !this.state.authComplete && <Button*/}
                  {/*className="PremiumMembership-signup_button"*/}
                  {/*onClick={(e) => this.signupClicked(e)}*/}
                  {/*waves='light'>Pay Now*/}
                  {/*</Button> }*/}

                  {/*{ this.props.uid && !this.state.authComplete &&*/}
                  {/*<Row className="PremiumMembership-token-input">*/}
                  {/*<div className="PremiumMembership-token-message"*/}
                  {/*style={{fontSize: '1.4rem'}}*/}
                  {/*>{this.state.tokenMessage}</div>*/}
                  {/*<input id="token-input-textbox"*/}
                  {/*className="PremiumMembership-token-input-box"*/}
                  {/*name="token"*/}
                  {/*type="text"*/}
                  {/*label="input token"*/}
                  {/*placeholder="Enter Coupon"*/}
                  {/*value={this.state.token}*/}
                  {/*onChange={this.handleTokenInputChange}*/}
                  {/*/>*/}
                  {/*{ !this.state.tokenSubmitted &&*/}
                  {/*<Button className="CreateArticle-submit PremiumMembership-token-button"*/}
                  {/*onClick={(e) => this.submitToken(e)}*/}
                  {/*style={{*/}
                  {/*fontSize: "1.3rem",*/}
                  {/*textTransform: 'none',*/}
                  {/*height: '4.8rem',*/}
                  {/*width: '13rem'*/}
                  {/*}}*/}
                  {/*waves='light'*/}
                  {/*>Apply*/}
                  {/*<Icon left>done_all</Icon>*/}
                  {/*</Button>}*/}
                  {/*{this.state.tokenSubmitted && !this.state.tokenValid &&*/}
                  {/*<Button*/}
                  {/*className="CreateArticle-submit PremiumMembership-token-button"*/}
                  {/*waves='light'*/}
                  {/*style={{*/}
                  {/*fontSize: "1.3rem",*/}
                  {/*textTransform: 'none',*/}
                  {/*height: '4.8rem',*/}
                  {/*width: '13rem'*/}
                  {/*}}>*/}
                  {/*<Preloader color="yellow"*/}
                  {/*className="PremiumMembership-signup_button_preloader"*/}
                  {/*size='small'/>*/}
                  {/*</Button>*/}
                  {/*}*/}
                  {/*{this.state.tokenSubmitted && this.state.tokenValid &&*/}
                  {/*<Button*/}
                  {/*className="CreateArticle-submit PremiumMembership-token-button"*/}
                  {/*waves='light'*/}
                  {/*style={{*/}
                  {/*fontSize: "6rem",*/}
                  {/*color: "#00E676",*/}
                  {/*backgroundColor: "black",*/}
                  {/*textTransform: 'none',*/}
                  {/*height: '4.8rem',*/}
                  {/*width: '13rem'*/}
                  {/*}}>*/}
                  {/*<i className="material-icons PremiumMembership-large-icon"*/}
                  {/*style={{fontSize: "4.2rem !important"}}*/}
                  {/*>check_circle</i>*/}
                  {/*</Button>*/}
                  {/*}*/}

                  {/*</Row>*/}
                  {/*}*/}

                  {/* ##** Removing this for now */}
                  {/* {this.props.uid &&
                    !this.state.authComplete &&
                    !this.props.trialUsed && (
                      <div className="PremiumMembership-trial_string">
                        {`Checkout to start your ${this.state.daysFree} day free trial`}
                        <div className="PremiumMembership-trial_string_subtext">
                          You will NOT be charged until your trial period
                          finishes and can cancel at any time prior with NO
                          charge.
                        </div>
                      </div>
                    )} */}

                  {this.props.uid &&
                    !this.state.authComplete &&
                    !this.props.trialUsed && (
                      <div className="PremiumMembership-trial_string">
                        {`Start your improving your Bridge Game today`}
                        <div className="PremiumMembership-trial_string_subtext"></div>
                      </div>
                    )}

                  {this.props.uid &&
                    !this.state.authComplete &&
                    this.props.trialUsed && (
                      <div className="PremiumMembership-trial_string">
                        {`Checkout to Resubscribe to BridgeChampions.com`}
                      </div>
                    )}

                  {this.state.paypalButtonUrl &&
                    this.props.uid &&
                    !this.state.authComplete && (
                      <Row>
                        <img
                          src={paypalPayNow}
                          className="PremiumMembership-paypal_signup_button"
                          onClick={(e) => this.signupClicked(e)}
                        />
                      </Row>
                    )}
                  {!this.state.paypalButtonUrl && this.props.uid && (
                    <Button
                      className="PremiumMembership-signup_button_cc
                                               PremiumMembership-signup_button_loading
                                               PremiumMembership-paypal_signup_button"
                      waves="light"
                      style={{ backgroundColor: "white", marginTop: "5rem" }}
                    >
                      <Preloader
                        color="yellow"
                        className="PremiumMembership-signup_button_preloader"
                        size="small"
                      />
                    </Button>
                  )}

                  {this.props.uid && !this.state.authComplete && (
                    <Row>
                      {/*<Button*/}
                      {/*className="PremiumMembership-paypal_signup_button*/}
                      {/*PremiumMembership-signup_button_cc"*/}
                      {/*onClick={(e) => this.signupClickedStripe(e)}*/}
                      {/*waves='light'>Pay with Credit Card*/}
                      {/*</Button>*/}
                      {/*<StripeButton email={this.props.email}/>*/}

                      <StripeCheckout
                        email={this.props.email}
                        uid={this.props.uid}
                        history={this.props.history}
                        processing={this.stripeProcessing}
                        getToken={this.getToken}
                        changeSubscriptionActiveStatus={
                          this.props.changeSubscriptionActiveStatus
                        }
                      />
                    </Row>
                  )}

                  {this.props.uid && !this.state.authComplete && (
                    <Row>
                      <div className="PremiumMembership-secure_checkout">
                        <i className="fas fa-lock"></i>&nbsp;&nbsp;Secure
                        Checkout
                      </div>
                    </Row>
                  )}

                  {!this.props.trialUsed &&
                    this.props.uid &&
                    !this.state.authComplete && (
                      <div
                        style={{
                          position: "relative",
                          top: "-16.5rem",
                          zIndex: "3000",
                        }}
                      >
                        <Coupons passDataUp={this.passDataUp} />
                      </div>
                    )}

                  {!this.state.showLogin &&
                    !this.props.uid &&
                    !this.state.authComplete && (
                      <Button
                        className="PremiumMembership-signup_button"
                        onClick={(e) => this.showLogin(e)}
                        waves="light"
                      >
                        Sign up
                        <Icon large button left>
                          assignment_ind
                        </Icon>
                      </Button>
                    )}

                  {!this.props.uid &&
                    (!this.state.showLogin || !this.state.authComplete) && (
                      <div className="PremiumMembership-signupText">
                        ${PRICE_PER_MONTH} per month
                      </div>
                    )}
                </Row>
              )}

              {this.state.stripeRedirectLoading && (
                <Row className="PremiumMembership-loading">
                  <div className="center-align">
                    <Preloader flashing size="big" />
                    <br />
                    <p
                      id="paypal_loading"
                      data-text="Processing your credit card payment...."
                    >
                      Processing your credit card payment....
                    </p>
                  </div>
                </Row>
              )}

              {this.state.paypalRedirectLoading && (
                <Row className="PremiumMembership-loading">
                  <div className="center-align">
                    <Preloader flashing size="big" />
                    <br />
                    <p
                      id="paypal_loading"
                      data-text="Transferring you to PayPal.com now...."
                    >
                      Transferring you to PayPal.com now....
                    </p>
                  </div>
                </Row>
              )}

              {/*<div className="PremiumMembership-details HomePage-details-card">*/}
              {/*<Row className="PremiumMembership-row">*/}
              {/*<Col><i className="PremiumMembership-tick material-icons">done_all</i></Col>*/}
              {/*<Col className="PremiumMembership-text-row"><span*/}
              {/*className="PremiumMembership-text-row"> Premium members only content.</span></Col>*/}
              {/*</Row>*/}

              {/*<Row className="PremiumMembership-row">*/}
              {/*<Col><i className="PremiumMembership-tick material-icons">done_all</i></Col>*/}
              {/*<Col className="PremiumMembership-text-row"><span*/}
              {/*className="PremiumMembership-text-row"> Daily quizzes with leaderboards.</span></Col>*/}
              {/*</Row>*/}
              {/*<Row className="PremiumMembership-row">*/}
              {/*<Col><i className="PremiumMembership-tick material-icons">done_all</i></Col>*/}
              {/*<Col className="PremiumMembership-text-row"><span*/}
              {/*className="PremiumMembership-text-row"> Quality bridge analysis that will improve your game.</span></Col>*/}
              {/*</Row>*/}
              {/*<Row className="PremiumMembership-row">*/}
              {/*<Col><i className="PremiumMembership-tick material-icons">done_all</i></Col>*/}
              {/*<Col className="PremiumMembership-text-row"><span*/}
              {/*className="PremiumMembership-text-row"> Full access to all site content and all current and upcoming site features including videos, live chat, "Bid with ish", and submit a question.</span></Col>*/}
              {/*</Row>*/}
              {/*<Row className="PremiumMembership-row">*/}
              {/*<Col><i className="PremiumMembership-tick material-icons">done_all</i></Col>*/}
              {/*<Col className="PremiumMembership-text-row"><span*/}
              {/*className="PremiumMembership-text-row"> Analysis of hands and bidding from the latest tournaments.</span></Col>*/}
              {/*</Row>*/}
              {/*<Row className="PremiumMembership-row">*/}
              {/*<Col><i className="PremiumMembership-tick material-icons">done_all</i></Col>*/}
              {/*<Col className="PremiumMembership-text-row"><span*/}
              {/*className="PremiumMembership-text-row"> Current insights from world class experts on the secrets of winning bridge.</span></Col>*/}
              {/*</Row>*/}
              {/*</div>*/}
              <div className="PremiumMembership-details">
                <Row className="PremiumMembership-row">
                  <Col>
                    <i className="PremiumMembership-tick material-icons">
                      done_all
                    </i>
                  </Col>
                  <Col className="PremiumMembership-text-row">
                    <span className="PremiumMembership-text-row">
                      {/*<i className="PremiumMembership-tick-basic material-icons">done_all</i>*/}
                      Premium members only content.
                    </span>
                  </Col>
                </Row>
                <Row className="PremiumMembership-row">
                  <Col>
                    <i className="PremiumMembership-tick material-icons">
                      done_all
                    </i>
                  </Col>
                  <Col className="PremiumMembership-text-row">
                    <span className="PremiumMembership-text-row">
                      {/*<i className="PremiumMembership-tick-basic material-icons">done_all</i>*/}
                      Fresh quizzes with member leaderboards.
                    </span>
                  </Col>
                </Row>
                <Row className="PremiumMembership-row">
                  <Col>
                    <i className="PremiumMembership-tick material-icons">
                      done_all
                    </i>
                  </Col>
                  <Col className="PremiumMembership-text-row">
                    <span className="PremiumMembership-text-row">
                      {/*<i className="PremiumMembership-tick-basic material-icons">done_all</i>*/}
                      Quality bridge analysis that will improve your game.
                    </span>
                  </Col>
                </Row>
                <Row className="PremiumMembership-row">
                  <Col>
                    <i className="PremiumMembership-tick material-icons">
                      done_all
                    </i>
                  </Col>
                  <Col className="PremiumMembership-text-row">
                    <span className="PremiumMembership-text-row">
                      {/*<i className="PremiumMembership-tick-basic material-icons">done_all</i>*/}
                      Full access to all site content and all site features.
                    </span>
                  </Col>
                </Row>
                <Row className="PremiumMembership-row">
                  <Col>
                    <i className="PremiumMembership-tick material-icons">
                      done_all
                    </i>
                  </Col>
                  <Col className="PremiumMembership-text-row">
                    <span className="PremiumMembership-text-row">
                      {/*<i className="PremiumMembership-tick-basic material-icons">done_all</i>*/}
                      Upcoming features including submit a question, "Bid with
                      Ish", videos and live members chat.
                    </span>
                  </Col>
                </Row>
                <Row className="PremiumMembership-row">
                  <Col>
                    <i className="PremiumMembership-tick material-icons">
                      done_all
                    </i>
                  </Col>
                  <Col className="PremiumMembership-text-row">
                    <span className="PremiumMembership-text-row">
                      {/*<i className="PremiumMembership-tick-basic material-icons">done_all</i>*/}
                      Analysis of hands and bidding from the latest tournaments.
                    </span>
                  </Col>
                </Row>
                <Row className="PremiumMembership-row">
                  <Col>
                    <i className="PremiumMembership-tick material-icons">
                      done_all
                    </i>
                  </Col>
                  <Col className="PremiumMembership-text-row">
                    <span className="PremiumMembership-text-row">
                      {/*<i className="PremiumMembership-tick-basic material-icons">done_all</i>*/}
                      Current insights from world class experts on the secrets
                      of winning bridge.
                    </span>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>
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
