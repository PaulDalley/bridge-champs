# Promo Code Setup Guide

## KLINGER (Ron Klinger mailing list — Premium, 30 days free)

Create a document in Firestore so readers can enter **`KLINGER`** (any casing; the app stores the lookup as lowercase).

### `userTokens` document

**Document ID:** `klinger` (lowercase — required)

**Fields:**

- `daysFree` (number): `30` — one calendar month free trial before the first Premium charge (via Stripe trial on checkout).
- `tier` (string): `premium` — code only applies when the member chooses **Premium** (Basic checkout will not match this token).
- `reusable` (boolean): `true` — **recommended** for a public list code so the document is not removed after a single use. Omit or set `false` if you want one-time use only (see your Cloud Function behaviour).
- `testMode` (boolean): optional; use while testing with Stripe test cards.

### Example

```
Collection: userTokens
Document ID: klinger

Fields:
- daysFree: 30
- tier: "premium"
- reusable: true
```

Marketing flyer: `public/email-templates/ron-klinger-reader-flyer.html`.

### One-command setup (optional)

If you have `serviceAccountKey.json` in the project root:

```bash
node scripts/ensure-klinger-token.js
```

---

## HARBOURVIEW Promo Code Configuration

For the HARBOURVIEW promo code to work correctly (giving 1 month free, no immediate charge), the token document in Firestore must have:

### Required Fields in `userTokens` collection:

**Document ID:** `harbourview` (lowercase)

**Fields:**
- `daysFree` (number): `30` (for 1 month free)
- `tier` (string): `premium` (optional, but recommended to restrict to premium tier)
- `testMode` (boolean): `true` (optional, set to `true` if you want to reuse it for testing)
- `reusable` (boolean): `true` (optional, set to `true` if you want to reuse it for testing)

### Example Firestore Document:

```
Collection: userTokens
Document ID: harbourview

Fields:
- daysFree: 30
- tier: "premium"
- testMode: true
- reusable: true
```

### How It Works:

1. When a user enters "HARBOURVIEW" (case-insensitive) as a promo code
2. The system checks the `userTokens` collection
3. If `daysFree` is set (e.g., 30), it creates a Stripe Checkout Session with `trial_period_days = 30`
4. The user is **NOT charged immediately** - they get 30 days free
5. After 30 days, Stripe will automatically charge them for the subscription

### Important Notes:

- If `daysFree` is set, the system will use a **trial period** (no immediate charge)
- If `percentOffFirstMonth` is set instead, the system will apply a **discount** (user is charged immediately, but at a reduced rate)
- You cannot use both `daysFree` and `percentOffFirstMonth` - `daysFree` takes priority

### To Verify the Promo Code is Set Up Correctly:

1. Go to Firebase Console → Firestore Database
2. Navigate to `userTokens` collection
3. Find the document with ID `harbourview`
4. Verify it has `daysFree: 30` (as a number, not a string)

### Testing:

- Set `testMode: true` or `reusable: true` to prevent the code from being deleted after use
- Use Stripe test cards (e.g., `4242 4242 4242 4242`) when testing
- Check Stripe Dashboard → Subscriptions to verify the trial period is set correctly

