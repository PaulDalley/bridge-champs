# Debug: Webhook & Promo Code Issues

## Issues to Fix

1. **Webhook didn't create member document** - Your subscription payment succeeded but the member document wasn't created
2. **Promo code didn't work** - You were charged immediately instead of getting a 30-day free trial

## Debugging Steps

### 1. Check Webhook Logs

1. Go to **Firebase Console** → **Functions** → **Logs**
2. Filter for: `stripeWebhookHandler`
3. Look for:
   - `"checkout.session.completed event received"` - confirms webhook fired
   - `"Processing checkout session for uid:"` - confirms it found your UID
   - `"Subscription activated for uid:"` - confirms it created the member document
   - Any errors or "Verification of this event failed" messages

### 2. Check Stripe Dashboard

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Find your webhook endpoint: `https://us-central1-bridgechampions.cloudfunctions.net/stripeWebhookHandler`
3. Check recent events:
   - Look for `checkout.session.completed` events
   - Check if they show as "Succeeded" or "Failed"
   - Click on failed events to see error messages

### 3. Check Promo Code Configuration

The HARBOURVIEW promo code needs to have `daysFree: 30` in Firestore:

1. Go to **Firebase Console** → **Firestore Database**
2. Navigate to `userTokens` collection
3. Check document `harbourview` (lowercase, case-sensitive)
4. Verify it has:
   - `daysFree: 30` (as a NUMBER, not string "30")
   - `tier: "premium"` (optional)
   - `testMode: true` or `reusable: true` (optional, for testing)

**If it doesn't exist or is missing `daysFree: 30`:**
- That's why you were charged immediately
- Create/update the document with `daysFree: 30` (number type)

### 4. Check Cloud Function Logs for Promo Code

1. Go to **Firebase Console** → **Functions** → **Logs**
2. Filter for: `stripeCreateCheckoutSession`
3. Look for:
   - `"Promo code token data:"` - shows what data was found
   - `"Promo code has daysFree: 30, total trial days: 30"` - confirms trial period was set
   - `"Setting trial_period_days to 30 - user will NOT be charged immediately"` - confirms no charge
   - If you don't see these, the promo code wasn't found or doesn't have `daysFree`

## Common Issues

### Webhook Not Firing
- Webhook URL might not be configured in Stripe Dashboard
- Webhook signature verification might be failing
- Check Stripe Dashboard → Webhooks for delivery status

### Webhook Firing But Failing
- Check logs for "Verification of this event failed"
- This means the webhook signature doesn't match
- The `webhookSignature` in the code might be wrong

### Promo Code Not Working
- Token doesn't exist in Firestore `userTokens` collection
- Token exists but doesn't have `daysFree: 30`
- Token has `daysFree` as a string instead of number
- Document ID is wrong (should be `harbourview` lowercase)

## Next Test

When you test again:
1. Make sure HARBOURVIEW token has `daysFree: 30` in Firestore
2. Check browser console (F12) for any errors
3. Check Cloud Function logs during the checkout process
4. Check Stripe Dashboard webhook events after payment
5. Check if member document gets created automatically

