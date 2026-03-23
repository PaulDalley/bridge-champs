# AUSYOUTH Promo Code Setup (Youth Squad — $20/month Premium)

The code **ausyouth** gives Premium membership at **$20/month** instead of $50 (60% off) for the Youth Squad program.

## 1. Create $20/month price in Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → **Products**
2. Find your **Premium** product (or create one)
3. Click **Add another price**
4. Set:
   - **Amount:** $20.00 AUD
   - **Billing period:** Monthly
   - **Currency:** AUD
5. Save and **copy the Price ID** (starts with `price_`)

## 2. Add Firestore document (`userTokens/ausyouth`)

### Option A — script (recommended)

From `bridge-champs/ishbridge-41` (with `serviceAccountKey.json` in that folder, same as email export):

```bash
node scripts/ensure-ausyouth-token.js price_YOUR_20_DOLLAR_PRICE_ID
```

That creates/updates `userTokens/ausyouth` with `tier`, `stripePriceId`, `monthlyPrice: 20`, `reusable: true`.

### Option B — Firebase Console (manual)

1. **Firestore** → **userTokens** → **Add document**
2. **Document ID:** `ausyouth`
3. Fields:

   | Field         | Type    | Value                    |
   |---------------|---------|--------------------------|
   | tier          | string  | `premium`                |
   | stripePriceId | string  | your `price_...` from Stripe |
   | monthlyPrice  | number  | `20`                     |
   | reusable      | boolean | `true`                   |

## 3. Deploy cloud functions

Deploy after any change to checkout or promo validation:

```bash
cd bridge-champs/ishbridge-41-cloud-functions
firebase deploy --only functions:stripeCreateCheckoutSession,functions:validateUserToken
```

### Stripe “Expired API key” (500 at checkout)

That error means the **live secret key** used by Cloud Functions (`STRIPE_KEY_LIVE` or `functions.config().stripe_key.live`) was **revoked or rolled** in Stripe but not updated in Firebase.

1. Stripe Dashboard → **Developers** → **API keys** → create / reveal the current **Secret key** (live).
2. Set it for your functions runtime, e.g.  
   `firebase functions:config:set stripe_key.live="sk_live_..."`  
   or set env `STRIPE_KEY_LIVE` in your deployment (per your project’s setup).
3. Redeploy the Stripe-related functions.

Until the key is fixed, checkout will fail even if the promo and UI are correct.

## 4. Deploy hosting (membership page)

After changing `PremiumMembership.js`, rebuild and deploy hosting so **bridgechampions.com** (or your Firebase site) serves the new bundle:

```bash
cd bridge-champs/ishbridge-41
npm run build   # or your project’s build command
firebase deploy --only hosting
```

## Flow

- User enters **ausyouth** on the membership page
- `validateUserToken` returns JSON with `stripePriceId` and `monthlyPrice` → UI shows **$20/month** and copy explains the **discounted rate** (not “free days”)
- At checkout, the cloud function uses the token’s `stripePriceId` (overrides the default $50 price)
- User is charged $20/month after the 7-day trial

## Notes

- **Stripe only** — PayPal uses fixed hosted buttons; a separate $20 PayPal button would be needed for PayPal support.
- **reusable: true** — The code can be used multiple times (all youth players).
