/**
 * Membership amounts on the site are billed in AUD (Stripe / PayPal product setup).
 * US-dollar figures in UI copy are a rough guide only; the card issuer applies FX at settlement.
 */
export const MEMBERSHIP_USD_PER_AUD_GUIDE = 0.65;

export function membershipUsdApproxWhole(audAmount) {
  const n = Number(audAmount);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.round(n * MEMBERSHIP_USD_PER_AUD_GUIDE);
}
