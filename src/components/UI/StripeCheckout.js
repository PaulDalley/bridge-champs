import React from "react";
import { Button, Preloader } from "react-materialize";
import $ from "jquery";
const logoUrl =
  "https://firebasestorage.googleapis.com/v0/b/bridgechampions.appspot.com/o/logo-white-smaller.png?alt=media&token=335dce2a-bb25-49ef-bcd6-87ba38212bb6";
const stripeProcessStartUrl =
  "https://us-central1-bridgechampions.cloudfunctions.net/stripeSubscribeTokenHandler";
// import {InjectedCheckoutForm, StripeProvider, Elements, CardForm, CardElement, injectStripe} from 'react-stripe-elements';

// const stripeKey = "pk_test_0oEg1KoEe7MkbdIe0LyU7oUD"; // TEST (OLD)
// const stripeKey = "pk_live_rbfFBjVRCEG6ciCZ1m8u9YSk"; // LIVE (OLD)

// TEST KEY:
const stripeKey =
  "pk_test_51MgyadERRei2smAFcWGwxCo8YJ1jZ9EXErEEoJfjMzRoSx2k9LISbBC0bhhjDbWV1DIzKsTcmMZ5IJNEO9wiwMIr00wW0rhO8I";

// LIVE KEY:
// const stripeKey = "pk_live_51MgyadERRei2smAFnwqBxWBtZFxQqhGxPncLQpkgdr1nvnsCmBz1UYwsd6vyXW6LKgIYHId2I6RuO1PHGjTxaPDh00GtIn1IDO";

class PaymentButton extends React.Component {
  state = {};

  handleChange = (event) => {
    this.props.onChange(event);
  };

  openCheckout = (event) => {
    // console.log("open modal");
    this.props.handler.open({
      name: this.props.name,
      panelLabel: this.props.panelLabel,
      // amount: this.props.amount,
      description: this.props.description,
      image: logoUrl,
      email: this.props.email,
      allowRememberMe: false,
    });
    event.preventDefault();
  };

  render() {
    // Important: uses "ref" below to attach the click handler to
    // the native DOM element. Some browsers, particularly Chrome iOS
    // will not allow the Checkout popup to trigger from the synthetic
    // click event React provides.
    return (
      <button
        name="customButton"
        className="PremiumMembership-paypal_signup_button
                               PremiumMembership-signup_button_cc"
        style={{
          border: "none",
          paddingTop: "1rem",
          paddingBottom: "1rem",
        }}
        waves="light"
        ref={(btn) => {
          if (btn != null) {
            // console.log(" IN HERE ");
            btn.onclick = this.openCheckout;
          }
        }}
        // onClick={(e) => this.openCheckout(e) }
      >
        Pay with Credit Card
      </button>
    );
  }
}

class StripeCheckout extends React.Component {
  state = {
    stripe: false,
  };

  componentDidMount() {
    // componentDidMount only runs in a browser environment.
    // In addition to loading asynchronously, this code is safe to server-side render.

    // You can inject a script tag manually like this,
    // or you can use the 'async' attribute on the Stripe.js v3 <script> tag.
    const stripeJs = document.createElement("script");
    stripeJs.src = "https://checkout.stripe.com/checkout.js";
    stripeJs.async = true;
    stripeJs.onload = () => {
      // The setTimeout lets us pretend that Stripe.js took a long time to load
      // Take it out of your production code!
      // console.log(window.StripeCheckout);
      // console.log(StripeCheckout);
      setTimeout(() => {
        this.setState({
          stripe: true,
          panelLabel: "Subscribe",
          amount: 1699,
          // amount: "Start Free Trial",
          // label: "Subscribe",
          description: "BridgeChampions Subscription.",
          name: "BridgeChampions.com",
          response: {},
          token: "",
          stripeCheckoutHandler: window.StripeCheckout.configure({
            key: stripeKey,
            token: this.handleToken,
          }),
          // stripeCheckoutHandler: StripeCheckout,
        });
      }, 500);
    };

    document.body && document.body.appendChild(stripeJs);
  }

  handleToken = (response) => {
    //const email = this.props.email;
    this.props.processing();
    // console.log(this.props.uid);
    const uid = this.props.uid;
    const email = response.email;
    const token = response.id;

    // console.log(response);
    this.setState({ response, token: response.id });

    // the token here is the stripe id token not the coupon
    const postData = {
      email,
      token,
      uid,
    };

    const coupon = this.props.getToken();
    if (coupon !== "") postData["coupon"] = coupon;
    // console.log(postData);

    $.post(stripeProcessStartUrl, postData, (resData, status) => {
      // console.log(resData);
      // console.log(status);
      // handle success case here:
      const lastViewedContentId = localStorage.getItem("contentRedirectId");
      const lastViewedContentType = localStorage.getItem("contentRedirectType");
      localStorage.removeItem("contentRedirectId");
      localStorage.removeItem("contentRedirectType");
      this.props.changeSubscriptionActiveStatus(true);
      if (lastViewedContentId !== null && lastViewedContentType !== null) {
        this.props.history.push(
          `${lastViewedContentType}/${lastViewedContentId}`
        );
      } else {
        this.props.history.push("/success");
      }
    }).catch((err) => {
      console.log(err);
      this.props.history.push("/error");
    });
  };

  handleChange = (event) => {
    event.preventDefault();
    this.setState({ [event.target.id]: event.target.value });
  };

  render() {
    return (
      <div>
        {this.state.stripe && (
          <PaymentButton
            handler={this.state.stripeCheckoutHandler}
            onToken={this.handleToken}
            amount={this.state.amount}
            panelLabel={this.state.panelLabel}
            description={this.state.description}
            name={this.state.name}
            email={this.props.email}
            uid={this.props.uid}
            publishableKey={stripeKey}
          />
        )}

        {!this.state.stripe && (
          <Button
            className="PremiumMembership-paypal_signup_button*/
                               PremiumMembership-signup_button_cc
                               PremiumMembership-signup_button_loading"
            waves="light"
          >
            <Preloader
              color="yellow"
              className="PremiumMembership-signup_button_preloader"
              size="small"
            />
          </Button>
        )}
      </div>
    );
  }
}

export default StripeCheckout;
