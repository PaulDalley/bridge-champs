import React from "react";
import { Button, Preloader } from "react-materialize";
import $ from "jquery";

const stripeCreateCheckoutSessionUrl =
  "https://us-central1-bridgechampions.cloudfunctions.net/stripeCreateCheckoutSession";

class StripeCheckout extends React.Component {
  state = {
    loading: false,
  };

  handleCheckout = async () => {
    this.setState({ loading: true });
    this.props.processing();

    try {
      const postData = {
        priceId: this.props.tierPriceId || "price_1SXVk6E9mroRD7lKIHxCKA7c", // Premium fallback
        email: this.props.email,
        uid: this.props.uid,
        tierName: this.props.tierName || "Premium",
      };

      const coupon = this.props.getToken();
      if (coupon && coupon !== "") {
        postData.coupon = coupon;
      }

      const response = await $.post(stripeCreateCheckoutSessionUrl, postData);
      
      if (response && response.url) {
        // Redirect to Stripe's hosted checkout page
        window.location.href = response.url;
      } else if (response && response.error) {
        // Server returned an error
        console.error("Checkout session error:", response.error);
        alert(`Error: ${response.error}. Please try again or contact support.`);
        this.setState({ loading: false });
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      this.setState({ loading: false });
      // Only redirect to error page if it's a critical error
      // Otherwise show alert and let user try again
      if (error.status === 0 || error.status >= 500) {
        alert("Unable to connect to payment server. Please check your internet connection and try again.");
      } else {
        alert(`Payment error: ${error.responseJSON?.error || error.message || 'Unknown error'}. Please try again.`);
      }
    }
  };

  render() {
    return (
      <button
        className="PremiumMembership-stripe-button"
        onClick={this.handleCheckout}
        disabled={this.state.loading}
      >
        {this.state.loading ? (
          <>
            <Preloader color="white" size="small" />
            <span style={{ marginLeft: '0.5rem' }}>Loading...</span>
          </>
        ) : (
          "Pay with Credit Card"
        )}
      </button>
    );
  }
}

export default StripeCheckout;
