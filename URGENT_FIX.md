# URGENT: Fix Your Subscription

## Your Test Account UID
`tR4ZJfyXLQV3ES4rJhAzjutQNzu1`

## Immediate Steps

### 1. Get Your Stripe Subscription ID
1. Go to **Stripe Dashboard** → **Subscriptions**
2. Find your most recent subscription (should be from just now)
3. Copy the Subscription ID (starts with `sub_`)

### 2. Activate Your Subscription Manually

**Option A: Use the Cloud Function (Fastest)**

Run this command (replace `sub_XXXXX` with your actual subscription ID):

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

**Option B: Manual Firestore Fix**

1. Go to **Firebase Console** → **Firestore Database**
2. Navigate to `members` collection
3. Create/update document with ID: `tR4ZJfyXLQV3ES4rJhAzjutQNzu1`
4. Add these fields:
   - `subscriptionActive` (boolean): `true`
   - `subscriptionExpires` (timestamp): Set to 30 days from now
   - `paymentMethod` (string): `stripe`
   - `subscriptionId` (string): Your Stripe subscription ID
   - `tier` (string): `premium`

### 3. Check Why Promo Code Didn't Work

The HARBOURVIEW promo code likely doesn't have `daysFree: 30` in Firestore.

1. Go to **Firebase Console** → **Firestore Database**
2. Navigate to `userTokens` collection
3. Check document `harbourview` (lowercase)
4. Verify it has `daysFree: 30` (as a NUMBER, not string)

If it doesn't exist or is missing `daysFree: 30`, that's why you were charged immediately.

