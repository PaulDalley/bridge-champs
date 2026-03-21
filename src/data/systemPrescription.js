/**
 * Bridge Champions — System reference (repo-first).
 * Edit this file to add topics, prescriptions, optional bullets, videos, and read-more links.
 *
 * detailUrl: optional link on the whole tile (when not using prescriptionLines).
 * detailLinkLabel: optional label for that link (default "Read more →").
 * prescriptionLines: optional array of { text, notes?, detailUrl?, linkLabel?, videoUrl?, videoLabel? }.
 * notes: optional string | string[] below plain prescription (when not using prescriptionLines).
 */

export const SYSTEM_GROUPS = [
  { id: "opening", title: "Opening structure", anchorId: "opening", introVideoUrl: "" },
  { id: "responses", title: "Responses & raises", anchorId: "responses", introVideoUrl: "" },
  { id: "over1nt", title: "After their 1NT", anchorId: "over-1nt", introVideoUrl: "" },
  { id: "competition", title: "Competitive auctions", anchorId: "competition", introVideoUrl: "" },
];

export const SYSTEM_TOPICS = [
  /* Opening — only 2-level openings for now */
  {
    id: "open-2level",
    groupId: "opening",
    title: "2-level openings",
    prescription: "",
    prescriptionLines: [
      {
        text: "2♣ — Game force",
        notes: ["System notes coming soon"],
        detailUrl: "/article/KuGcYGJmIm6Ei02VOGVo",
        linkLabel: "Article: 2♣ opening →",
        videoUrl: "https://youtube.com/shorts/giQbM_MspsI",
        videoLabel: "Show video",
      },
      {
        text: "2♦ — 18–19 balanced",
        notes: ["Strongly recommend this!", "System notes coming soon"],
        videoUrl: "https://youtube.com/shorts/kJ9IA9adKgQ",
        videoLabel: "Show video",
      },
      {
        text: "2♥ or 2♠ — Natural 6-card suit.",
        notes: ["System notes coming soon"],
        videoUrl: "https://youtube.com/shorts/NfoiiFDNNfU",
        videoLabel: "Show video",
      },
    ],
    extraBullets: [],
    videoUrl: "",
    videoLabel: "Show video",
    detailUrl: "",
  },
  /* Responses — titles kept; copy TBD */
  {
    id: "jacoby",
    groupId: "responses",
    title: "Jacoby 2NT",
    prescription:
      "A simple structure that lets either player show shortage, and also define the strength of their hand quite clearly.",
    notes: [],
    extraBullets: [],
    videoUrl: "",
    videoLabel: "Show video",
    detailUrl: "/bidding/worthwhile-conventions/jacoby-2nt",
    detailLinkLabel: "System notes →",
  },
  {
    id: "resp-1m-suit",
    groupId: "responses",
    title: "New suit after 1M",
    prescription: "Coming soon",
    extraBullets: [],
    videoUrl: "",
    videoLabel: "Show video",
    detailUrl: "",
  },
  {
    id: "resp-1nt",
    groupId: "responses",
    title: "Responding to 1NT",
    prescription: "",
    prescriptionLines: [
      { text: "2♣ — Simple Stayman" },
      { text: "2♦ / 2♥ / 2♠ / 2NT — Four transfers" },
      { text: "3♣ — Puppet Stayman" },
      { text: "3♦ — 5/5 in both minors" },
      { text: "3♥ — Singleton heart, 3 spades" },
      { text: "3♠ — Singleton spade, 3 hearts" },
    ],
    notes: ["System notes coming soon."],
    extraBullets: [],
    videoUrl: "",
    videoLabel: "Show video",
    detailUrl: "",
  },
  /* After their 1NT */
  {
    id: "vs-1nt-defense",
    groupId: "over1nt",
    title: "Defence vs their 1NT",
    prescription: "Coming soon",
    extraBullets: [],
    videoUrl: "",
    videoLabel: "Show video",
    detailUrl: "",
  },
  /* Competition */
  {
    id: "overcalls",
    groupId: "competition",
    title: "Overcalls",
    prescription: "Coming soon",
    extraBullets: [],
    videoUrl: "",
    videoLabel: "Show video",
    detailUrl: "",
  },
  {
    id: "neg-double",
    groupId: "competition",
    title: "Negative double",
    prescription: "Coming soon",
    extraBullets: [],
    videoUrl: "",
    videoLabel: "Show video",
    detailUrl: "",
  },
];

export function getTopicsByGroupId(groupId) {
  return SYSTEM_TOPICS.filter((t) => t.groupId === groupId);
}
