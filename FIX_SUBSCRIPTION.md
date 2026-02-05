# Fix Subscription for Test User

## Immediate Fix (Manual - Do This Now)

Your test user `tR4ZJfyXLQV3ES4rJhAzjutQNzu1` needs a member document created in Firestore.

### Option 1: Manual Firestore Fix (Fastest)

1. Go to Firebase Console → Firestore Database
2. Navigate to the `members` collection
3. Click "Add document"
4. Set the document ID to: `tR4ZJfyXLQV3ES4rJhAzjutQNzu1`
5. Add these fields:
   - `subscriptionActive` (boolean): `true`
   - `subscriptionExpires` (timestamp): Set to 30 days from now
   - `paymentMethod` (string): `stripe`
   - `subscriptionId` (string): Get this from Stripe Dashboard → Payments → Find your recent payment → Copy the subscription ID (starts with `sub_`)
   - `tier` (string): `premium` (or `basic` if that's what you subscribed to)

### Option 2: Use Cloud Function (After Deployment)

After deploying the `manualActivateSubscription` function, you can call it:

```bash
curl -X POST https://us-central1-bridgechampions.cloudfunctions.net/manualActivateSubscription \
  -H "Content-Type: application/json" \
  -d '{
    "uid": "tR4ZJfyXLQV3ES4rJhAzjutQNzu1",
    "subscriptionId": "sub_XXXXX",
    "days": 30,
    "tier": "premium"
  }'
```

Replace `sub_XXXXX` with the actual subscription ID from Stripe Dashboard.

## Webhook Bug Fix

I found and fixed a bug in the webhook handler:
- **Problem**: The webhook was using `event.type` instead of `reconstructedEvent.type`
- **Impact**: The webhook wasn't processing `checkout.session.completed` events correctly
- **Fix**: Changed to use `reconstructedEvent` which is the verified event from Stripe

This fix needs to be deployed. The webhook will now correctly create member documents for future subscriptions.

## Check Stripe Dashboard

1. Go to Stripe Dashboard → Payments
2. Find your recent payment
3. Check if it shows as "Succeeded"
4. Copy the Subscription ID (you'll need it for the manual fix above)

## After Fixing

1. Log out and log back in to your test account
2. The app should now recognize your subscription
3. You should be able to access subscriber content

