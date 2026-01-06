import React from "react";
import { Button, Preloader } from "react-materialize";
import $ from "jquery";

const stripeCreateCheckoutSessionUrl =
  "https://us-central1-bridgechampions.cloudfunctions.net/stripeCreateCheckoutSession";

class StripeCheckout extends React.Component {
  state = {
    loading: false,
  };

  handleCheckout = () => {
    this.setState({ loading: true });
    this.props.processing();

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

    console.log("Creating checkout session with data:", postData);

    $.post(stripeCreateCheckoutSessionUrl, postData)
      .done((response) => {
        console.log("Checkout session response:", response);
        if (response && response.url) {
          // Redirect to Stripe's hosted checkout page
          window.location.href = response.url;
        } else if (response && response.error) {
          // Server returned an error
          console.error("Checkout session error:", response.error);
          alert(`Error: ${response.error}. Please try again or contact support.`);
          this.setState({ loading: false });
        } else {
          console.error("Invalid response format:", response);
          alert("Invalid response from server. Please try again.");
          this.setState({ loading: false });
        }
      })
      .fail((jqXHR, textStatus, errorThrown) => {
        console.error("Error creating checkout session:", {
          status: jqXHR.status,
          statusText: jqXHR.statusText,
          responseText: jqXHR.responseText,
          textStatus,
          errorThrown
        });
        this.setState({ loading: false });
        
        let errorMessage = "Unknown error";
        let errorDetails = "";
        try {
          const errorResponse = JSON.parse(jqXHR.responseText);
          errorMessage = errorResponse.error || errorThrown || textStatus;
          errorDetails = errorResponse.details || errorResponse.code || "";
        } catch (e) {
          errorMessage = jqXHR.responseText || errorThrown || textStatus;
        }
        
        if (jqXHR.status === 0) {
          alert("Unable to connect to payment server. Please check your internet connection and try again.");
        } else if (jqXHR.status === 500) {
          alert(`Server error: ${errorMessage}${errorDetails ? ' (' + errorDetails + ')' : ''}. Please try again or contact support if the problem persists.`);
        } else {
          alert(`Payment error: ${errorMessage}. Please try again or contact support.`);
        }
      });
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
