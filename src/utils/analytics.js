/**
 * GA4 analytics helpers. Requires gtag (from GoogleAnaytics / index.html).
 *
 * In GA4, find these events under: Reports > Engagement > Events.
 * Event names are exactly as sent (e.g. subscription_upgraded, subscription_activated).
 */
const GA4_MEASUREMENT_ID = "G-VC7DZTPE7E";

function getGtag() {
  return typeof window !== "undefined" && typeof window.gtag === "function" ? window.gtag : null;
}

/**
 * Send a subscription-related event to GA4.
 * Events: "subscription_activated", "subscription_upgraded" (use underscore, not space).
 * @param {string} eventName - e.g. "subscription_activated", "subscription_upgraded"
 * @param {Object} params - e.g. { from_tier, to_tier, upgrade_source }
 */
export function sendSubscriptionEvent(eventName, params = {}) {
  const gtag = getGtag();
  if (gtag) gtag("event", eventName, { ...params, send_to: GA4_MEASUREMENT_ID });
}

/**
 * Send a practice/trainer event to GA4.
 * @param {string} eventName - e.g. "practice_view", "practice_problem_complete"
 * @param {Object} params - e.g. { trainer, category_key, puzzle_id, difficulty }
 */
export function sendPracticeEvent(eventName, params = {}) {
  const gtag = getGtag();
  if (gtag) gtag("event", eventName, { ...params, send_to: GA4_MEASUREMENT_ID });
}

/**
 * UTM / click IDs from the landing URL for attribution on CTA events (GA4).
 * @param {string} search - location.search, e.g. "?utm_source=google&gclid=..."
 */
export function getMarketingParamsFromSearch(search) {
  const params = new URLSearchParams(search || "");
  const keys = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "gclid",
    "gbraid",
    "wbraid",
  ];
  const out = {};
  keys.forEach((k) => {
    const v = params.get(k);
    if (v) out[k] = v;
  });
  return out;
}

/**
 * Primary CTA on /beginner landing (Google Ads funnel).
 * @param {Object} params - e.g. { placement: 'hero'|'bottom'|'sticky', destination, ...utm_* , gclid }
 */
export function sendBeginnerLandingCtaClick(params = {}) {
  const gtag = getGtag();
  if (gtag) gtag("event", "beginner_landing_cta_click", { ...params, send_to: GA4_MEASUREMENT_ID });
}
