# Parked: 7-day free trial for new subscribers

The 7-day Stripe trial is **implemented but disabled** so it won’t deploy or affect payments until you’re ready to test.

---

## To turn the trial back on

### 1. Cloud Functions (`ishbridge-41-cloud-functions/functions/index.js`)

- **Trial constant**  
  Change:
  ```js
  const TRIAL_PERIOD_DAYS = 0; // Set to 7 to enable ...
  ```
  to:
  ```js
  const TRIAL_PERIOD_DAYS = 7;
  ```

- **Checkout session (createStripeCheckoutSession)**  
  After the `if (effectiveDaysFree > 0)` block (the one that sets `custom_text.submit` with “You will pay $0 today…”), add this block **before** the “Validate priceId” comment:

  ```js
  } else if (TRIAL_PERIOD_DAYS > 0) {
    try {
      const trialUsed = await checkIfTrialUsed(uid);
      if (!trialUsed) {
        sessionParams.subscription_data.trial_period_days = TRIAL_PERIOD_DAYS;
        const billedOn = new Date();
        billedOn.setDate(billedOn.getDate() + TRIAL_PERIOD_DAYS);
        const billedOnStr = billedOn.toLocaleDateString("en-AU", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
        sessionParams.custom_text = sessionParams.custom_text || {};
        sessionParams.custom_text.submit = {
          message: `You will pay $0 today. Your first charge will be on ${billedOnStr} unless you cancel before then.`,
        };
      }
    } catch (trialError) {
      console.error("Error checking trial status:", trialError);
    }
  }
  ```

  The webhook already sets `trialUsed: true` on `members/{uid}` in `checkout.session.completed` (and in the Stripe subscription updated handler), so the trial stays one-time per account.

### 2. Membership page (`ishbridge-41/src/components/Auth/PremiumMembership.js`)

- Add the trial line back **above** the “PROMO CODE INPUT” comment, inside the same parent as the other header text:

  ```jsx
  {!showLogin && authReady && (uid ? !this.props.trialUsed : true) && (
    <p className="PremiumMembership-header_text_small" style={{ marginBottom: "1rem", fontWeight: "600", color: "#0F4C3A" }}>
      7-day free trial for new subscribers. Cancel anytime before the trial ends and you won&apos;t be charged.
    </p>
  )}
  ```

  `trialUsed` is already in `mapStateToProps`, so no other changes are needed there.

---

## After re-enabling

1. Deploy functions:  
   `cd ishbridge-41-cloud-functions && firebase deploy --only functions`
2. Deploy frontend:  
   `cd ishbridge-41 && npm run deploy`
3. Test with a new (or no-`trialUsed`) account: Checkout should show $0 today and first charge in 7 days. Subscribe again with the same account and confirm no trial is offered.
