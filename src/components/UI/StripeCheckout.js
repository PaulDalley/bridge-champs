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

    $.ajax({
      url: stripeCreateCheckoutSessionUrl,
      method: "POST",
      contentType: "application/json",
      dataType: "json",
      data: JSON.stringify(postData),
    })
    .done((response) => {
        console.log("Checkout session response:", response);
        if (response && response.url) {
          // Persist the Checkout Session ID locally so the /success page can verify/activate
          // even if the session_id query param is lost/truncated.
          try {
            if (response.sessionId) {
              localStorage.setItem("postCheckoutSessionId", response.sessionId);
              localStorage.setItem("lastStripeCheckoutSessionId", response.sessionId);
              // Track which user initiated checkout so we don't try to activate it for a different login.
              if (this.props.uid) {
                localStorage.setItem("postCheckoutExpectedUid", this.props.uid);
              }
            }
          } catch (e) {
            // ignore
          }
          // Redirect to Stripe's hosted checkout page
          window.location.href = response.url;
        } else if (response && response.error) {
          // Server returned an error
          console.error("Checkout session error:", response);
          const errorMsg = response.error || 'Unknown error';
          const errorDetails = response.details ? ` (${response.details})` : '';
          alert(`Error: ${errorMsg}${errorDetails}\n\nPlease check:\n1. Price IDs exist in Stripe Dashboard\n2. Stripe API key is correct\n3. Contact support if issue persists.`);
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
        let fullError = "";
        
        try {
          const errorResponse = JSON.parse(jqXHR.responseText);
          errorMessage = errorResponse.error || errorThrown || textStatus;
          errorDetails = errorResponse.details || errorResponse.code || "";
          fullError = JSON.stringify(errorResponse, null, 2);
        } catch (e) {
          errorMessage = jqXHR.responseText || errorThrown || textStatus;
          fullError = jqXHR.responseText || errorThrown;
        }
        
        // Show detailed error in console and alert
        console.error("Full error details:", fullError);
        
        if (jqXHR.status === 0) {
          alert("Unable to connect to payment server. Please check your internet connection and try again.");
        } else if (jqXHR.status === 500) {
          const alertMsg = `Server Error (500): ${errorMessage}${errorDetails ? '\nDetails: ' + errorDetails : ''}\n\nCheck browser console (F12) for full error details.\n\nCommon issues:\n- Price ID doesn't exist in Stripe\n- Stripe API key incorrect\n- Invalid session parameters`;
          alert(alertMsg);
        } else if (jqXHR.status === 400) {
          alert(`Invalid Request: ${errorMessage}\n\nPlease check that all required fields are provided.`);
        } else {
          alert(`Payment Error (${jqXHR.status}): ${errorMessage}\n\nPlease try again or contact support.`);
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
