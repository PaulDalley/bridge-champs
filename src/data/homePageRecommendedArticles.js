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
    label: "This week: High level doubles →",
    path: "/bidding/practice?difficulty=2&problem=bid2-29",
  },
  {
    label: "This week: Counting losers →",
    path: "/counting/practice?difficulty=1&problem=p1-20",
  },
  {
    label: "Last week: 4th suit forcing →",
    path: "/bidding/practice?difficulty=3&problem=bid3-16",
  },
  {
    label: "Last week: Opening leads →",
    path: "/defence/practice?difficulty=1&problem=df1-23",
  },
  {
    label: "Last week: Treadmill — Card Rush →",
    path: "/treadmill/practice/card-rush",
  },
  {
    label: "Recent article: Takeout doubles — complete guide →",
    path: "/bidding/advanced/yt6au7gwYwPahTxQ4kd5",
  },
];
