# Webhook Not Creating Member Documents - Debugging Guide

## Critical Issue
You've been charged 3 times but the webhook is NOT creating member documents in Firestore. This means:
- Payments are going through ✅
- Webhook is NOT firing OR failing silently ❌

## Step 1: Check Stripe Dashboard Webhooks

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Find your webhook endpoint: `https://us-central1-bridgechampions.cloudfunctions.net/stripeWebhookHandler`
3. Click on it to see recent events
4. **Check for `checkout.session.completed` events:**
   - Are they being sent? (Should see recent events)
   - What's the status? (Succeeded, Failed, or Pending)
   - Click on a failed event to see the error message

## Step 2: Check Firebase Function Logs

1. Go to **Firebase Console** → **Functions** → **Logs**
2. Filter for: `stripeWebhookHandler`
3. Look for these log messages:

### If you see "Verification of this event failed":
- **Problem**: Webhook signature verification is failing
- **Cause**: Wrong webhook secret or signature mismatch
- **Fix**: Check that the webhook secret in Stripe Dashboard matches `webhookSignature` in your code

### If you see "checkout.session.completed event received":
- **Good**: Webhook is receiving events
- **Check next**: Look for "Processing checkout session for uid:"
- **If you see "No uid in session metadata":**
  - **Problem**: The `uid` is not being passed in the checkout session metadata
  - **Fix**: Check that `sessionParams.metadata.uid` is being set in `stripeCreateCheckoutSession`

### If you see "✅ SUCCESS: Subscription activated":
- **Good**: Webhook is working and creating documents
- **If you still don't have access**: Check Firestore permissions or refresh your app

### If you see "❌ CRITICAL ERROR":
- **Problem**: Error creating/updating Firestore document
- **Check**: The error message will tell you what failed

## Step 3: Verify Webhook Configuration in Stripe

1. Go to **Stripe Dashboard** → **Developers** → **Webhooks**
2. Click on your webhook endpoint
3. **Check the signing secret:**
   - Copy the "Signing secret" (starts with `whsec_`)
   - Verify it matches the `webhookSignature` in your Cloud Functions code
   - The code uses: `whsec_vE97QJRXrSalnCjPBjYonMEeGp0QAh4X` (for live mode)

4. **Check which events are enabled:**
   - Must have: `checkout.session.completed` ✅
   - Should also have: `invoice.paid`, `invoice.payment_succeeded` (for recurring payments)

## Step 4: Test Webhook Manually

You can test if the webhook endpoint is reachable:

```bash
curl -X POST https://us-central1-bridgechampions.cloudfunctions.net/stripeWebhookHandler \
  -H "Content-Type: application/json" \
  -d '{"test": "ping"}'
```

This should return an error (since it's not a valid Stripe event), but it confirms the endpoint is reachable.

## Step 5: Check Recent Subscriptions in Stripe

1. Go to **Stripe Dashboard** → **Subscriptions**
2. Find your 3 recent subscriptions
3. For each one:
   - Click on it
   - Check the "Metadata" section
   - **Verify `uid` is present** - this is critical!
   - If `uid` is missing, that's why the webhook can't create the member document

## Most Likely Issues

### Issue 1: Webhook Not Configured in Stripe
- **Symptom**: No events in Stripe Dashboard webhook logs
- **Fix**: Add the webhook endpoint in Stripe Dashboard

### Issue 2: Wrong Webhook Secret
- **Symptom**: "Verification of this event failed" in logs
- **Fix**: Update `webhookSignature` in code to match Stripe Dashboard

### Issue 3: UID Not in Metadata
- **Symptom**: "No uid in session metadata" in logs
- **Fix**: Check that `sessionParams.metadata.uid` is being set correctly

### Issue 4: Webhook Not Receiving Events
- **Symptom**: No `checkout.session.completed` events in Stripe Dashboard
- **Fix**: Ensure the event is enabled in webhook settings

## Immediate Action

**Check the Firebase Function logs RIGHT NOW:**
1. Go to Firebase Console → Functions → Logs
2. Filter for `stripeWebhookHandler`
3. Look at the most recent logs from your 3 subscription attempts
4. Share what you see - this will tell us exactly what's failing

The enhanced logging I just added will show:
- ✅ If webhook is receiving events
- ✅ If signature verification is passing
- ✅ If uid is in metadata
- ✅ If Firestore document creation is succeeding
- ❌ Exact error messages if anything fails

