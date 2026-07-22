/**
 * Quick-fill chips for the system card editor ("Let me do as much as I can for you").
 *
 * Organised by the SAME sections as the visible ABF card (sectionId matches
 * VISIBLE_CARD_SECTIONS ids), so the picker renders as a blank card with chips
 * living inside their own section.
 *
 * DRAFT WORDING — every `patch` text is for Paul to review/adjust.
 *
 * Shape:
 *   group.exclusive: true            -> picking one chip unpicks the group's others
 *   group.hiddenWhenChipSelected     -> hide this group while that chip is selected
 *   chip.patch: { PdfField: "text" } -> text written onto the card
 *   chip.append: true                -> joins onto earlier text with " · "
 *   chip.clearsGroups: [groupId]     -> selecting this chip deselects those groups
 *   chip.copyLeadsToNT: true         -> at build time, copy each lead *_S value to *_NT
 */

export const QUICK_CHIP_SECTIONS = [
  {
    sectionId: "sec_1",
    title: "Names & basic system",
    groups: [
      {
        id: "g-basic-system",
        label: "Basic system",
        exclusive: true,
        chips: [
          { id: "sys-standard", label: "Standard", patch: { BasicSystem: "Standard" } },
          { id: "sys-2over1", label: "2 over 1 Game Force", patch: { BasicSystem: "2 over 1 Game Force" } },
          { id: "sys-precision", label: "Precision", patch: { BasicSystem: "Precision" } },
        ],
      },
    ],
  },
  {
    sectionId: "sec_2",
    title: "1. Opening bids",
    groups: [
      {
        id: "g-1c",
        label: "1♣",
        exclusive: true,
        chips: [
          { id: "1c-2", label: "1♣ = 2+", patch: { Open1C: "2+" } },
          { id: "1c-3", label: "1♣ = 3+", patch: { Open1C: "3+" } },
        ],
      },
      {
        id: "g-1d",
        label: "1♦",
        exclusive: true,
        chips: [
          { id: "1d-3", label: "1♦ = 3+", patch: { Open1D: "3+" } },
          { id: "1d-4", label: "1♦ = 4+", patch: { Open1D: "4+" } },
        ],
      },
      {
        id: "g-majors",
        label: "Majors",
        exclusive: true,
        chips: [
          { id: "maj-5", label: "5 card majors", patch: { Open1H: "5+", Open1S: "5+" } },
          { id: "maj-4", label: "4 card majors", patch: { Open1H: "4+", Open1S: "4+" } },
        ],
      },
      {
        id: "g-open-points",
        label: "Points to open",
        exclusive: true,
        chips: [
          {
            id: "pts-11",
            label: "11+ points to open",
            append: true,
            patch: { Open1C: "11+ HCP", Open1D: "11+ HCP", Open1H: "11+ HCP", Open1S: "11+ HCP" },
          },
          {
            id: "pts-10",
            label: "10+",
            append: true,
            patch: { Open1C: "10+ HCP", Open1D: "10+ HCP", Open1H: "10+ HCP", Open1S: "10+ HCP" },
          },
          {
            id: "pts-9",
            label: "9+",
            append: true,
            patch: { Open1C: "9+ HCP", Open1D: "9+ HCP", Open1H: "9+ HCP", Open1S: "9+ HCP" },
          },
        ],
      },
      {
        id: "g-1nt",
        label: "1NT",
        exclusive: true,
        chips: [
          { id: "1nt-1517", label: "1NT 15-17", patch: { Open1NT: "15-17 balanced" } },
          { id: "1nt-1214", label: "1NT 12-14", patch: { Open1NT: "12-14 balanced" } },
        ],
      },
      {
        id: "g-1nt-resp",
        label: "Responses to 1NT",
        exclusive: true,
        chips: [
          {
            id: "nt-2transfers",
            label: "Stayman + 2 transfers",
            patch: { Resp1NT2CStyle: "Stayman", Resp1NT2D: "Transfer to ♥", Resp1NT2H: "Transfer to ♠" },
          },
          {
            id: "nt-4transfers",
            label: "Stayman + 4 transfers",
            patch: {
              Resp1NT2CStyle: "Stayman",
              Resp1NT2D: "Transfer to ♥",
              Resp1NT2H: "Transfer to ♠",
              Resp1NT2S: "Transfer to ♣",
              Resp1NT2NT: "Transfer to ♦",
            },
          },
        ],
      },
      {
        id: "g-2c",
        label: "2♣",
        exclusive: true,
        chips: [
          { id: "2c-strong", label: "2♣ strong", patch: { Open2C: "Strong" } },
          { id: "2c-gf", label: "2♣ game force", patch: { Open2C: "Game force" } },
          { id: "2c-natural", label: "2♣ natural clubs", patch: { Open2C: "Natural clubs" } },
        ],
      },
      {
        id: "g-2d",
        label: "2♦",
        exclusive: true,
        chips: [
          { id: "2d-weak", label: "2♦ natural weak", patch: { Open2D: "6+ less than opening hand (natural weak 2)" } },
          { id: "2d-multi", label: "Multi 2♦", patch: { Open2D: "Multi — weak 2 in either major" } },
          { id: "2d-mexican", label: "Mexican 2♦ (18-19)", patch: { Open2D: "18-19 balanced" } },
        ],
      },
      {
        id: "g-weak2s",
        label: "2♥ / 2♠",
        exclusive: true,
        chips: [
          {
            id: "w2-natural",
            label: "Natural weak 2s",
            patch: {
              Open2H: "6+ less than opening hand (natural weak 2)",
              Open2S: "6+ less than opening hand (natural weak 2)",
            },
          },
        ],
      },
      {
        id: "g-2nt",
        label: "2NT",
        exclusive: true,
        chips: [
          { id: "2nt-2022", label: "2NT 20-22", patch: { Open2NT: "20-22 balanced" } },
          { id: "2nt-2021", label: "2NT 20-21", patch: { Open2NT: "20-21 balanced" } },
          { id: "2nt-other", label: "Other", patch: {} },
        ],
      },
      {
        id: "g-3nt",
        label: "3NT",
        exclusive: true,
        chips: [
          { id: "3nt-gambling", label: "Gambling (solid minor)", patch: { Open3NT: "Gambling — solid minor" } },
          { id: "3nt-other", label: "Other", patch: {} },
        ],
      },
    ],
  },
  {
    sectionId: "sec_4",
    title: "3. Competitive bids / overcalls",
    groups: [
      {
        id: "g-negx",
        label: "Negative doubles thru",
        exclusive: true,
        chips: [
          { id: "negx-2h", label: "2♥", patch: { Doubles_1: "Negative", NegXLimit: "2♥" } },
          { id: "negx-2s", label: "2♠", patch: { Doubles_1: "Negative", NegXLimit: "2♠" } },
          { id: "negx-3h", label: "3♥", patch: { Doubles_1: "Negative", NegXLimit: "3♥" } },
          { id: "negx-4h", label: "4♥", patch: { Doubles_1: "Negative", NegXLimit: "4♥" } },
          { id: "negx-4s", label: "4♠", patch: { Doubles_1: "Negative", NegXLimit: "4♠" } },
        ],
      },
      {
        id: "g-respx",
        label: "Responsive doubles thru",
        exclusive: true,
        chips: [
          { id: "respx-2h", label: "2♥", patch: { Doubles_2: "Responsive", RespXLimit: "2♥" } },
          { id: "respx-2s", label: "2♠", patch: { Doubles_2: "Responsive", RespXLimit: "2♠" } },
          { id: "respx-3h", label: "3♥", patch: { Doubles_2: "Responsive", RespXLimit: "3♥" } },
          { id: "respx-4h", label: "4♥", patch: { Doubles_2: "Responsive", RespXLimit: "4♥" } },
          { id: "respx-4s", label: "4♠", patch: { Doubles_2: "Responsive", RespXLimit: "4♠" } },
        ],
      },
      {
        id: "g-jumpover",
        label: "Jump overcalls",
        exclusive: true,
        chips: [
          { id: "jo-weak", label: "Weak jump overcalls", patch: { JumpOvercall: "Weak" } },
          { id: "jo-int", label: "Intermediate jump overcalls", patch: { JumpOvercall: "Intermediate" } },
        ],
      },
      {
        id: "g-two-suited",
        label: "Two-suited overcalls",
        exclusive: false,
        chips: [
          { id: "michaels", label: "Michaels cue bids", patch: { ImmedCueMinor: "Michaels", ImmedCueMajor: "Michaels" } },
        ],
      },
      {
        id: "g-unt",
        label: "Unusual NT",
        exclusive: true,
        chips: [
          { id: "unt-lubs", label: "LUBS", patch: { UnusualNT: "LUBS (two lowest unbid suits)" } },
          { id: "unt-minors", label: "Minors", patch: { UnusualNT: "Minors" } },
        ],
      },
      {
        id: "g-1nt-over",
        label: "1NT overcall",
        exclusive: true,
        chips: [
          { id: "nto-1518", label: "1NT overcall 15-18", patch: { Overcall1NT: "15-18" } },
          { id: "nto-1618", label: "1NT overcall 16-18", patch: { Overcall1NT: "16-18" } },
        ],
      },
    ],
  },
  {
    sectionId: "sec_5",
    title: "4. Basic responses",
    groups: [
      {
        id: "g-jump-raises",
        label: "Jump raises",
        exclusive: true,
        chips: [
          { id: "jr-limit", label: "Jump raises: limit", patch: { JumpRaiseMajor: "Limit", JumpRaiseMinor: "Limit" } },
          { id: "jr-weak", label: "Jump raises: weak", patch: { JumpRaiseMajor: "Weak", JumpRaiseMinor: "Weak" } },
        ],
      },
    ],
  },
  {
    sectionId: "sec_6",
    title: "5. Play conventions — leads & signals",
    groups: [
      {
        id: "g-leads",
        label: "Leads (suit contracts)",
        exclusive: true,
        chips: [
          { id: "lead-4th", label: "4th highest", patch: { FourHonourLead_S: "4th highest" } },
          {
            id: "lead-35",
            label: "3rd and 5th",
            clearsGroups: ["g-4small"],
            patch: {
              FourHonourLead_S: "3rd and 5th",
              FourSmallLead_S: "3rd and 5th",
              ThreeSmallLead_S: "3rd and 5th",
            },
          },
        ],
      },
      {
        id: "g-leads-nt",
        label: "Leads in NT",
        exclusive: true,
        chips: [
          { id: "nt-same", label: "Same as suits", copyLeadsToNT: true, patch: {} },
          { id: "nt-4th", label: "4th highest in NT", patch: { FourHonourLead_NT: "4th highest" } },
          {
            id: "nt-35",
            label: "3rd and 5th in NT",
            patch: {
              FourHonourLead_NT: "3rd and 5th",
              FourSmallLead_NT: "3rd and 5th",
              ThreeSmallLead_NT: "3rd and 5th",
            },
          },
        ],
      },
      {
        id: "g-seq",
        label: "Sequences (pick any)",
        exclusive: false,
        chips: [
          { id: "seq-overlead", label: "Overlead", append: true, patch: { SeqLead_S: "Overlead", SeqLead_NT: "Overlead" } },
          { id: "seq-kcount", label: "K for count", append: true, patch: { SeqLead_S: "K for count", SeqLead_NT: "K for count" } },
        ],
      },
      {
        id: "g-4small",
        label: "From 4 small",
        exclusive: true,
        hiddenWhenChipSelected: "lead-35",
        chips: [
          { id: "4s-2nd", label: "2nd highest", patch: { FourSmallLead_S: "2nd highest" } },
          { id: "4s-top", label: "Top of nothing", patch: { FourSmallLead_S: "Top of nothing" } },
          { id: "4s-3rd", label: "3rd", patch: { FourSmallLead_S: "3rd" } },
        ],
      },
      {
        id: "g-partner-suit",
        label: "In partner's suit",
        exclusive: true,
        chips: [
          {
            id: "ps-same",
            label: "Same as other suits",
            patch: { LeadPartnersSuit_S: "Same as other suits", LeadPartnersSuit_NT: "Same as other suits" },
          },
          { id: "ps-other", label: "Other", patch: {} },
        ],
      },
      {
        id: "g-carding",
        label: "Signals",
        exclusive: true,
        chips: [
          {
            id: "udca",
            label: "UDCA",
            patch: {
              CountType_S: "Reverse",
              CountType_NT: "Reverse",
              SignalPartnerLead_S: "Reverse attitude (low = encourage)",
              SignalPartnerLead_NT: "Reverse attitude (low = encourage)",
            },
          },
          {
            id: "natural-carding",
            label: "Natural carding",
            patch: {
              CountType_S: "Natural",
              CountType_NT: "Natural",
              SignalPartnerLead_S: "Natural attitude (high = encourage)",
              SignalPartnerLead_NT: "Natural attitude (high = encourage)",
            },
          },
        ],
      },
      {
        id: "g-discards",
        label: "Discards",
        exclusive: true,
        chips: [
          { id: "mckenny", label: "McKenny", patch: { DiscardType_S: "McKenny", DiscardType_NT: "McKenny" } },
          { id: "oddeven", label: "Odd/even", patch: { DiscardType_S: "Odd/even", DiscardType_NT: "Odd/even" } },
          { id: "disc-natural", label: "Natural discards", patch: { DiscardType_S: "Natural", DiscardType_NT: "Natural" } },
        ],
      },
    ],
  },
  {
    sectionId: "sec_7",
    title: "6. Slam conventions",
    groups: [
      {
        id: "g-rkcb",
        label: "Blackwood",
        exclusive: true,
        chips: [
          { id: "rkcb-1430", label: "RKCB 1430", patch: { RKCBStyle: "1430" } },
          { id: "rkcb-3041", label: "RKCB 3041", patch: { RKCBStyle: "3041" } },
          { id: "bw-simple", label: "Simple Blackwood", patch: { RKCBStyle: "Simple Blackwood" } },
        ],
      },
      {
        id: "g-slam-other",
        label: "Also play",
        exclusive: false,
        chips: [
          { id: "gerber", label: "Gerber over NT", patch: { GerberWhen: "Over NT openings" } },
          { id: "cues", label: "Cue bids", append: true, patch: { SlamNotes_1: "Cue bidding" } },
        ],
      },
    ],
  },
];

/** Lead field stems that "Same as suits" mirrors from *_S to *_NT. */
const NT_MIRROR_STEMS = ["SeqLead", "FourHonourLead", "FourSmallLead", "ThreeSmallLead", "LeadPartnersSuit"];

/** chipId -> { chip, group, section } and groupId -> group lookups */
const CHIP_INDEX = {};
const GROUP_INDEX = {};
QUICK_CHIP_SECTIONS.forEach((section) => {
  section.groups.forEach((group) => {
    GROUP_INDEX[group.id] = group;
    group.chips.forEach((chip) => {
      CHIP_INDEX[chip.id] = { chip, group, section };
    });
  });
});

export function getChipEntry(chipId) {
  return CHIP_INDEX[chipId] || null;
}

/**
 * Toggle a chip within a selection set, enforcing per-group exclusivity and any
 * `clearsGroups` on the chip. Returns a NEW array of selected chip ids.
 */
export function toggleChip(selectedIds, chipId) {
  const entry = CHIP_INDEX[chipId];
  if (!entry) return selectedIds;
  const has = selectedIds.includes(chipId);
  if (has) return selectedIds.filter((id) => id !== chipId);
  let next = selectedIds;
  if (entry.group.exclusive) {
    const groupChipIds = new Set(entry.group.chips.map((c) => c.id));
    next = next.filter((id) => !groupChipIds.has(id));
  }
  (entry.chip.clearsGroups || []).forEach((groupId) => {
    const g = GROUP_INDEX[groupId];
    if (!g) return;
    const ids = new Set(g.chips.map((c) => c.id));
    next = next.filter((id) => !ids.has(id));
  });
  return [...next, chipId];
}

/** Is this group hidden given the current selection (e.g. "3rd and 5th" covers it)? */
export function isGroupHidden(group, selectedIds) {
  return Boolean(group.hiddenWhenChipSelected && selectedIds.includes(group.hiddenWhenChipSelected));
}

/**
 * Deterministically build card values for the selected chips.
 * Chips apply in DATA ORDER (stable under remove/re-add); `append: true`
 * chips join with " · "; a `copyLeadsToNT` chip mirrors lead *_S values to *_NT.
 */
export function buildQuickFillValues(selectedIds) {
  const selected = new Set(selectedIds);
  const out = {};
  let mirrorNT = false;
  QUICK_CHIP_SECTIONS.forEach((section) => {
    section.groups.forEach((group) => {
      group.chips.forEach((chip) => {
        if (!selected.has(chip.id)) return;
        if (chip.copyLeadsToNT) mirrorNT = true;
        Object.entries(chip.patch).forEach(([field, text]) => {
          if (chip.append && out[field]) {
            out[field] = `${out[field]} · ${text}`;
          } else {
            out[field] = text;
          }
        });
      });
    });
  });
  if (mirrorNT) {
    NT_MIRROR_STEMS.forEach((stem) => {
      if (out[`${stem}_S`] && !out[`${stem}_NT`]) {
        out[`${stem}_NT`] = out[`${stem}_S`];
      }
    });
  }
  return out;
}
