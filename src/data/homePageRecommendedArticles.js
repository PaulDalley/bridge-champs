/**
 * Homepage: "Recent and recommended articles" strip (JustAdded component).
 * Add or edit entries here — each item is one link on the front page.
 *
 * - path: site-relative URL (e.g. /bidding/advanced/yt6au7gwYwPahTxQ4kd5)
 * - label: link text shown on the homepage (include → at the end if you like)
 */

export const HOME_PAGE_RECOMMENDED_ARTICLES_TITLE =
  "This week, last week, and recent articles";

/** @type {{ label: string, path: string }[]} */
export const HOME_PAGE_RECOMMENDED_ARTICLES = [
  {
    label: "This week: Loser count in the bidding →",
    path: "/bidding/practice?difficulty=2&problem=bid2-34",
  },
  {
    label: "This week: Better rebid fundamentals →",
    path: "/bidding/practice?difficulty=2&problem=bid2-39",
  },
  {
    label: "Last week: High level doubles →",
    path: "/bidding/practice?difficulty=2&problem=bid2-29",
  },
  {
    label: "Last week: Counting losers →",
    path: "/counting/practice?difficulty=1&problem=p1-20",
  },
  {
    label: "Recent article: Takeout doubles — complete guide →",
    path: "/bidding/advanced/takeout-doubles-complete-guide",
  },
];
