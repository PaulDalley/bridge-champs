import React from "react";
import { Preloader } from "react-materialize";
import $ from "jquery";
import { firebase } from "../../firebase/config";

const stripeCreateCheckoutSessionUrl =
  "https://us-central1-bridgechampions.cloudfunctions.net/stripeCreateCheckoutSession";

class StripeCheckout extends React.Component {
  state = {
    loading: false,
  };

  normalizeCode = (code) => String(code || "").toLowerCase().replace(/\s+/g, "").trim();

  capturePromoUsage = async ({ response, postData, enteredPromoCode, appliedPromoCode }) => {
    if (!this.props.uid) return;
    if (!enteredPromoCode) return;
    try {
      const sessionId = response?.sessionId || "";
      const docId = sessionId
        ? `stripe_${sessionId}`
        : `stripe_${this.props.uid}_${Date.now()}`;

      await firebase
        .firestore()
        .collection("promoCodeUsage")
        .doc(docId)
        .set(
          {
            uid: this.props.uid,
            email: this.props.email || "",
            promoCodeEntered: enteredPromoCode,
            promoCodeApplied: appliedPromoCode || enteredPromoCode,
            tierName: postData?.tierName || "",
            priceId: postData?.priceId || "",
            provider: "stripe",
            status: "checkout_session_created",
            stripeSessionId: sessionId,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
    } catch (e) {
      console.error("Failed to capture promo usage", e);
    }
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
    const enteredPromoCode = this.normalizeCode(
      typeof this.props.getEnteredPromoCode === "function" ? this.props.getEnteredPromoCode() : ""
    );
    const appliedPromoCode = this.normalizeCode(coupon);
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
          if (enteredPromoCode) {
            this.capturePromoUsage({
              response,
              postData,
              enteredPromoCode,
              appliedPromoCode,
            });
          }
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
          if (this.props.clearProcessing) this.props.clearProcessing();
        } else {
          console.error("Invalid response format:", response);
          alert("Invalid response from server. Please try again.");
          this.setState({ loading: false });
          if (this.props.clearProcessing) this.props.clearProcessing();
        }
      })
    .fail((jqXHR, textStatus, errorThrown) => {
        this.setState({ loading: false });
        if (this.props.clearProcessing) this.props.clearProcessing();
        console.error("Error creating checkout session:", {
          status: jqXHR.status,
          statusText: jqXHR.statusText,
          responseText: jqXHR.responseText,
          textStatus,
          errorThrown
        });
        
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
          const detailMsg = errorDetails ? `\n\n${errorDetails}` : "\n\nPlease check that all required fields are provided.";
          alert(`Invalid Request: ${errorMessage}${detailMsg}`);
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
          <>
            <span className="PremiumMembership-stripe-buttonTitle">Start 7-day free trial</span>
            <span className="PremiumMembership-stripe-buttonSub">Secure checkout with Stripe</span>
          </>
        )}
      </button>
    );
  }
}

export default StripeCheckout;
