# Weekly Tournament — MVP spec (living doc)

Status: planning → ready to build Phase 1. Owner decisions are locked (below).

## Concept
A weekly duplicate-style event on the BEN play table. A fixed set of **10 deals**, the
same for everyone that week, played **solo vs bots** (human always South). Scored as a
duplicate using **IMPs (Standard Butler)**. A leaderboard (top 3 for now). Later: an
expert-replay layer, and (separate, big) real-time 2-human-vs-2-bot partnership play.

Members-only (same gate as Just Play), which also bounds BEN load/cost.

## Locked decisions
- Scoring: **IMPs only, Standard Butler** (datum = field average per board).
- Bidding/play: **free bid + play** the whole board (tests bidding and play).
- Seat: **human always South.**
- Eligibility: **all members.**
- Reset: **Friday 09:00 Australia/Sydney** (handle AEST/AEDT DST).
- Experts: an **admin flag** the owner sets (`membersData/{uid}.isExpert`).
- Integrity: **trust the client-recorded score for now** — NO server validation function
  in MVP (owner: "don't expect hackers yet"). Easy to add later.
- Boards: **fixed order 1→10.** One **scored attempt** per board, no redo; can review
  own boards afterward. Stop and resume across the week.
- Record the **full auction + every card** per board from day 1 (cheap; powers the
  expert replay + any future validation).
- Leaderboard: provisional during the week, **finalizes at the Friday reset.**

## Architecture
- **Frontend (this repo):** tournament mode (reuses PlayTable), the play flow, the
  leaderboard read+compute, gating.
- **Backend — Cloud Functions repo (`bridgechampions-cloud-functions`):**
  - `getWeeklyTournament(weekId)` callable — transactional **get-or-create** of
    `tournaments/{weekId}` with a **server-generated random seed** + open/close times,
    returns it. This is the only thing that keeps boards un-pre-studyable (no cron
    needed — created lazily on first access after reset). Boards are then **deterministic
    from the seed** (so no need to store 10 deals; client derives them).
  - Firestore **security rules** (below).
- **BEN on Cloud Run:** plays the three bot seats during tournament play (existing).

## Firestore data model
- `tournaments/{weekId}` → `{ seed, opensAt, closesAt, boardCount: 10 }`
  - `weekId` = ISO date of the week's Friday-09:00-Sydney start, e.g. `2026-06-20`.
- `tournamentResults/{weekId}/entries/{uid}__{boardIndex}` →
  `{ uid, displayName, boardIndex, contract, declarer, tricks, rawScoreNS, auction[], play[], finishedAt }`
  - `rawScoreNS` = result from the human's (N/S) side, via existing scoreContract.
  - `auction[]` = bids in order; `play[]` = cards in order (full record).
- `membersData/{uid}.isExpert: true` — owner-set flag.

## Scoring (Standard Butler IMPs)
For each board with the field's `rawScoreNS` values:
- datum = mean of all entries' rawScoreNS (Butler; optionally drop top/bottom later).
- player's board IMPs = imp(rawScoreNS − datum) using the standard IMP table.
- Tournament total = sum of board IMPs across the 10. Leaderboard sorted desc.
Scores are relative → recomputed as the field grows; lock at `closesAt`.
MVP: compute client-side (read the week's entries). Move to a function if the field gets large.

## Frontend flow
1. Members-gated "Weekly Tournament" entry (nav card or inside Just Play).
2. Call `getWeeklyTournament(currentWeekId)` → seed → derive boards 0..9.
3. Resume: read this uid's entries for the week → first board without an entry = next to play.
4. Play that board on the existing table (South), bots via BEN. On finish, write the
   result entry (with full auction/play). One attempt — a finished board can't be replayed for score.
5. After board 10 (or any time), show standings: top 3 + your rank/total.

## Phasing
- **Phase 1 (MVP):** the above — weekly boards, ordered solo play, IMP/Butler leaderboard (top 3).
- **Phase 2:** expert replay — replay viewer (read-only table stepping through auction+play),
  expert flag + a board×expert search UI. (Data already recorded in Phase 1.)
- **Phase 3 (separate, large):** real-time 2-human-vs-2-bot partnership tables (lobby/invites,
  shared live game doc, presence). Own project.

## Open / owner-supplied
- Copy: tournament name, entry label, button text, results wording (owner provides; placeholders meanwhile).
- Capacity: a tournament concentrates BEN load; current settings ~15-20 concurrent. Revisit
  the 20 vCPU quota if a weekly draws more at once.
