# IMMEDIATE FIX - Do These Steps Now

## Your Test Account UID
`tR4ZJfyXLQV3ES4rJhAzjutQNzu1`

## Step 1: Get Your Stripe Subscription ID

1. Go to **Stripe Dashboard** → **Subscriptions** (https://dashboard.stripe.com/subscriptions)
2. Find your most recent subscription (should be from just now)
3. Click on it to open details
4. Copy the **Subscription ID** (starts with `sub_`, looks like `sub_1ABC123...`)

## Step 2: Activate Your Subscription

### Option A: Use Cloud Function (Recommended)

Open your terminal and run:

```bash
curl -X POST https://us-central1-bridgechampions.cloudfunctions.net/manualActivateSubscription \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "tR4ZJfyXLQV3ES4rJhAzjutQNzu1",
    "subscriptionId": "sub_YOUR_SUBSCRIPTION_ID_HERE",
    "days": 30,
    "tier": "premium"
  }'
```

Replace `sub_YOUR_SUBSCRIPTION_ID_HERE` with the actual subscription ID from Step 1.

### Option B: Manual Firestore Fix

1. Go to **Firebase Console** → **Firestore Database**
2. Navigate to `members` collection
3. Create or update document with ID: `tR4ZJfyXLQV3ES4rJhAzjutQNzu1`
4. Add/update these fields:
   - `subscriptionActive` (boolean): `true`
   - `subscriptionExpires` (timestamp): Set to **30 days from now**
   - `paymentMethod` (string): `stripe`
   - `subscriptionId` (string): Your Stripe subscription ID from Step 1
   - `tier` (string): `premium`

## Step 3: After Fixing

1. **Log out** of your test account
2. **Log back in**
3. You should now have access to subscriber content

## Step 4: Check Why Promo Code Didn't Work

The HARBOURVIEW promo code likely doesn't have `daysFree: 30` set in Firestore.

1. Go to **Firebase Console** → **Firestore Database**
2. Navigate to `userTokens` collection
3. Check if document `harbourview` (lowercase) exists
4. Verify it has:
   - `daysFree: 30` (as a NUMBER, not string "30")
   - `tier: "premium"` (optional)

**If it doesn't exist or is missing `daysFree: 30`:**
- Create/update the document
- Set `daysFree` to `30` (number type)
- This is why you were charged immediately instead of getting a free trial

## Step 5: Check Webhook Logs

To see why the webhook didn't create your member document:

1. Go to **Firebase Console** → **Functions** → **Logs**
2. Filter for: `stripeWebhookHandler`
3. Look for errors or "checkout.session.completed" events
4. Check if there are any errors processing your subscription

## Why This Happened

1. **No Access**: The webhook handler didn't create/update your member document in Firestore
2. **Got Charged**: The HARBOURVIEW promo code doesn't have `daysFree: 30` set, so no trial period was created

## Next Steps After Fixing

Once your subscription is activated:
- You should be able to access subscriber content
- For future tests, make sure the HARBOURVIEW token has `daysFree: 30` in Firestore
- Consider setting `testMode: true` or `reusable: true` on the token so it doesn't get deleted after use

