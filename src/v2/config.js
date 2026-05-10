/**
 * V2 System Configuration
 * Feature flag and system settings
 */

// Feature flag - set to true to enable new system, false to use old system
export const USE_V2_SYSTEM = true;

// Article categories mapping
export const ARTICLE_CATEGORIES = {
  bidding: {
    name: 'Bidding',
    summaryCollection: 'bidding',
    bodyCollection: 'biddingBody',
  },
  cardPlay: {
    name: 'Declarer Play',
    summaryCollection: 'cardPlay',
    bodyCollection: 'cardPlayBody',
  },
  defence: {
    name: 'Defence',
    summaryCollection: 'defence',
    bodyCollection: 'defenceBody',
  },
  counting: {
    name: 'Counting',
    summaryCollection: 'counting',
    bodyCollection: 'countingBody',
  },
  beginnerCardPlay: {
    name: 'Beginner Declarer',
    summaryCollection: 'beginnerCardPlay',
    bodyCollection: 'beginnerCardPlayBody',
  },
  beginnerDefence: {
    name: 'Beginner Defence',
    summaryCollection: 'beginnerDefence',
    bodyCollection: 'beginnerDefenceBody',
  },
  beginnerBidding: {
    name: 'Beginner Bidding',
    summaryCollection: 'beginnerBidding',
    bodyCollection: 'beginnerBiddingBody',
  },
};




