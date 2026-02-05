# URGENT: All Webhook Events Are Failing

## The Problem
**ALL 11 webhook events have FAILED** - this is why you're not getting access after subscribing.

## Immediate Steps

### Step 1: Check the Failed Event Details
1. In Stripe Dashboard, click on **"Event deliveries"** tab
2. Click on one of the **failed** events (they should be red)
3. **Look at the error message** - this will tell us exactly what's wrong
4. Common errors:
   - "No signatures found" - webhook secret mismatch
   - "Invalid signature" - webhook secret doesn't match
   - "400 Bad Request" - webhook endpoint returning error
   - "500 Internal Server Error" - code error in webhook handler

### Step 2: Verify Webhook Secret
1. In Stripe Dashboard, click **"Show"** next to "Signing secret"
2. Copy the full secret (starts with `whsec_`)
3. Compare it with the code:
   - Code uses: **(redacted)** — do not store webhook secrets in the repo. Use Firebase Functions config/env instead.
   - **If they don't match, that's the problem!**

### Step 3: Check Which Events Are Enabled
1. Click **"Edit destination"** in Stripe Dashboard
2. Check which events are selected
3. **Must have**: `checkout.session.completed` ✅
4. If it's missing, add it and save

## Most Likely Issue: Webhook Secret Mismatch

The webhook secret in your code might not match the one in Stripe Dashboard.

**To fix:**
1. Get the signing secret from Stripe Dashboard (click "Show")
2. Update the code with the correct secret
3. Or update Stripe Dashboard to use the secret in your code

## Quick Fix Options

### Option A: Update Code to Match Stripe
1. Copy the signing secret from Stripe Dashboard
2. Update `webhookSignature` in `functions/index.js` line ~1450
3. Redeploy: `firebase deploy --only functions:stripeWebhookHandler`

### Option B: Update Stripe to Match Code
1. In Stripe Dashboard, click "Roll secret" or "Edit destination"
2. Update the signing secret to match your code
3. **Note**: This will invalidate the current secret

## What to Share
Please share:
1. **The error message** from one of the failed events
2. **The signing secret** from Stripe (first few characters: `whsec_...`)
3. **Which events are enabled** (click "Edit destination" to see)

This will tell us exactly what's wrong and how to fix it.

