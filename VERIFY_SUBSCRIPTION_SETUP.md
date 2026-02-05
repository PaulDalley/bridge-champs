# Subscription & Promo Code Verification Checklist

## ✅ Code Review - All Checks Passed

I've reviewed the code and everything looks correct:

1. ✅ Promo code input box styling - larger and more visible
2. ✅ Trial period logic - properly prioritizes `daysFree` over discounts
3. ✅ Webhook handler - fixed to use `reconstructedEvent` instead of `event`
4. ✅ Logging added - will help debug if issues occur

## 🔍 What You Need to Verify in Firestore

### Step 1: Check HARBOURVIEW Token Configuration

1. Go to **Firebase Console** → **Firestore Database**
2. Navigate to **`userTokens`** collection
3. Find document with ID: **`harbourview`** (lowercase, case-sensitive)
4. Verify it has these fields:

```
✅ daysFree: 30 (must be a NUMBER, not a string)
✅ tier: "premium" (optional, but recommended)
✅ testMode: true (optional, for testing)
✅ reusable: true (optional, for testing)
```

**If the document doesn't exist or is missing `daysFree: 30`:**
- Create/update the document
- Set `daysFree` to `30` (as a number, not string "30")
- This is critical - without this, the trial period won't work

## 🧪 Testing Steps

### Step 2: Test the Subscription Flow

1. **Clear your browser cache** or use incognito mode
2. Go to `/membership` page
3. **Check the promo code input box** - it should be larger and easier to see now
4. Select **Premium** tier
5. Enter promo code: **`HARBOURVIEW`** (case-insensitive)
6. You should see: "✓ Code valid! You'll get 30 extra days free"
7. Click **"Pay with Credit Card"**
8. **Check Stripe Checkout page:**
   - Look for text like "Start your 30-day free trial" or "Free for 30 days"
   - The amount should show as **$0.00** or **"Free trial"**
   - You should **NOT** see an immediate charge
9. Complete the checkout with a test card: `4242 4242 4242 4242`
10. After checkout, check:
    - You should be redirected to success page
    - Your account should show as subscribed
    - You should be able to access subscriber content

### Step 3: Check Cloud Function Logs

If something goes wrong, check the logs:

1. Go to **Firebase Console** → **Functions** → **Logs**
2. Filter for: `stripeCreateCheckoutSession`
3. Look for these log messages:
   - `"Promo code token data:"` - should show the token data
   - `"Promo code has daysFree: 30, total trial days: 30"` - confirms trial period
   - `"Setting trial_period_days to 30 - user will NOT be charged immediately"` - confirms no charge
   - `"Session params (before Stripe call):"` - check if `trial_period_days: 30` is in the JSON

### Step 4: Check Stripe Dashboard

1. Go to **Stripe Dashboard** → **Subscriptions**
2. Find your test subscription
3. Verify:
   - **Trial end date** is set to 30 days from now
   - **Status** shows as "trialing" (not "active")
   - **Next payment** is scheduled for 30 days from now

## 🐛 Troubleshooting

### If you're still charged immediately:

1. **Check Firestore token:**
   - Verify `daysFree: 30` exists (as a number, not string)
   - Check the document ID is exactly `harbourview` (lowercase)

2. **Check Cloud Function logs:**
   - Look for the log messages mentioned above
   - If you see "Promo code token data:" but no `daysFree`, the token is misconfigured

3. **Check Stripe Checkout:**
   - If Stripe shows a charge, the trial period wasn't set
   - This means either:
     - The token doesn't have `daysFree: 30`
     - The code didn't find the token
     - There's an error in the Cloud Function

### If the promo code input is still small:

- Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
- Clear browser cache
- The new styling should be deployed with the frontend code

## 📝 Quick Test Command

You can also test the Cloud Function directly (after ensuring the token exists):

```bash
curl -X POST https://us-central1-bridgechampions.cloudfunctions.net/stripeCreateCheckoutSession \
  -H "Content-Type: application/json" \
  -d '{
    "priceId": "price_1SXVk6E9mroRD7lKIHxCKA7c",
    "email": "your-test-email@example.com",
    "uid": "your-test-uid",
    "tierName": "Premium",
    "coupon": "harbourview"
  }'
```

Then check the response - it should include a `url` that redirects to Stripe Checkout with a trial period.

