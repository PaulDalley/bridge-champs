# Testing Subscriptions and Promo Codes

## Quick Testing Options

### Option 1: Use Stripe Test Mode (Recommended)

1. **Switch to Test Mode:**
   - In `functions/index.js`, change `const stripeLive = true;` to `const stripeLive = false;`
   - Deploy the function: `firebase deploy --only functions:stripeCreateCheckoutSession`

2. **Use Stripe Test Cards:**
   - **Success:** `4242 4242 4242 4242`
   - **Decline:** `4000 0000 0000 0002`
   - **Requires 3D Secure:** `4000 0025 0000 3155`
   - Use any future expiry date (e.g., 12/34)
   - Use any 3-digit CVC

3. **Test Promo Codes:**
   - Create a test promo code in Firestore with `testMode: true` or `reusable: true`
   - This code won't be deleted after use, so you can test multiple times

### Option 2: Create Reusable Test Promo Codes

1. **In Firestore Console:**
   - Go to `userTokens` collection
   - Create a document with ID: `TESTHARBOURVIEW` (or any test code)
   - Set these fields:
     ```json
     {
       "daysFree": 30,
       "tier": "premium",
       "testMode": true,
       "reusable": true
     }
     ```

2. **This code will:**
   - Give 30 days free
   - Work for Premium tier
   - NOT be deleted after use (can test multiple times)

### Option 3: Reset Your Test Account

1. **In Firestore Console:**
   - Go to `members` collection
   - Find your test user's document (by uid)
   - Delete the document or set:
     - `subscriptionActive: false`
     - `subscriptionExpires: null` (or past date)
     - `trialUsed: false` (if you want to test trial again)

2. **Cancel Stripe Subscription:**
   - Go to Stripe Dashboard → Customers
   - Find your test customer
   - Cancel the subscription

## Testing Promo Code HARBOURVIEW

To make HARBOURVIEW reusable for testing:

1. **In Firestore Console:**
   - Go to `userTokens` collection
   - Find document `harbourview` (lowercase)
   - Add field: `testMode: true` or `reusable: true`

2. **Now you can:**
   - Use the code multiple times
   - Test the full subscription flow
   - The code won't be deleted after use

## Stripe Test Mode Setup

1. **Get Test API Keys:**
   - Stripe Dashboard → Developers → API keys
   - Copy the "Test" secret key (starts with `sk_test_`)
   - Update `functions.config().stripe_key.dev` with test key

2. **Create Test Price IDs:**
   - Stripe Dashboard → Products (Test mode)
   - Create test products/prices
   - Update `PRICING_TIERS` in `PremiumMembership.js` with test price IDs

3. **Test Webhook:**
   - Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://us-central1-bridgechampions.cloudfunctions.net/stripeWebhookHandler`
   - Use test webhook signing secret

## Quick Test Checklist

- [ ] Switch to test mode (`stripeLive = false`)
- [ ] Create reusable test promo code in Firestore
- [ ] Use test card `4242 4242 4242 4242`
- [ ] Test promo code application
- [ ] Verify subscription activates
- [ ] Reset test account for next test

