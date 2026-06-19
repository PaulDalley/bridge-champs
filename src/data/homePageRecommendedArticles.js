/**
 * Homepage: "Recent and recommended articles" strip (JustAdded component).
 * Add or edit entries here — each item is one link on the front page.
 *
 * - path: site-relative URL (e.g. /bidding/advanced/yt6au7gwYwPahTxQ4kd5)
 * - label: link text shown on the homepage (include → at the end if you like)
 */

export const HOME_PAGE_RECOMMENDED_ARTICLES_TITLE =
  "This week and last week";

/** @type {{ label: string, path: string }[]} */
export const HOME_PAGE_RECOMMENDED_ARTICLES = [
  {
    label: "This week: Over the Shoulder — declarer (5 new) →",
    path: "/declarer/practice?difficulty=2&problem=cp2-16",
  },
  {
    label: "This week: Over the Shoulder — bidding (5 new) →",
    path: "/bidding/practice?difficulty=2&problem=bid2-49",
  },
  {
    label: "Last week: System Over 1NT — transfer responses and conventions →",
    path: "/bidding/advanced/system-over-1nt-conventions",
  },
  {
    label: "Last week: Over the Shoulder — bidding (5 new) →",
    path: "/bidding/practice?difficulty=2&problem=bid2-44",
  },
  {
    label: "Last week: Over the Shoulder — declarer (5 new) →",
    path: "/declarer/practice?difficulty=2&problem=cp2-11",
  },
];
