# Recently added on homepage (logged-in users)

## Goal
For logged-in users, show a "Recently added" section on the front page: articles and problems (or links to practice) so there’s something new and clickable when they land.

## Current state
- **HomePage** – Hero, then CategorySelector (Defence / Declarer Play / Bidding), then Mission, About Paul. No per-user or "recent" block.
- **TopTen** – Exists and fetches "Latest Content" from Firestore (`articles`, `cardPlay`, `defence`, `bidding`, `quizzes`) via `fetchDataChunk(collection, 10, "createdAt")`, merges and sorts by `createdAt`. It’s not rendered anywhere on the live homepage.
- **Data** – Articles (and category articles) and quizzes live in Firestore with `createdAt`. Declarer/Counting **problems** are in-code (e.g. `CardPlayTrainer.js`, `CountingTrumpsTrainer.js`), not in Firestore.

## Approach

### Phase 1 (this implementation)
- **Who**: Logged-in users only (`uid` present).
- **What**: "Recently added" = recent **articles** (including category articles) and **quizzes** from Firestore, sorted by `createdAt`.
- **Where**: New section between the hero and "What would you like to study today?" (CategorySelector).
- **How**:
  - Reuse `fetchDataChunk(collection, limit, "createdAt")` for: `articles`, `cardPlay`, `defence`, `bidding`, `counting`, `quizzes`.
  - Merge results, sort by `createdAt` desc, take top N (e.g. 8).
  - Render a compact row/grid of cards: title, type label (e.g. "Article", "Declarer", "Quiz"), link. Use existing list item components where possible (e.g. `CategoryArticleListItem`, `QuizListItem`) or a slim card that links correctly.
- **Problems**: No "recent problems" from Firestore. Add a single **"Try practice"** card that links to e.g. `/cardPlay/practice` or `/counting/practice` so the block still feels like "something to do."

### Phase 2 (later, optional)
- Add "New" badges for content added in the last 7–14 days (you already have `isNewArticle`-style logic in `CategoryArticleListItem`).
- Optionally track "recently added" problems in code (e.g. `addedAt` or a "new" list) and show 1–2 "New problem" entries that link to the trainer with a specific problem or level.

### Phase 3 (optional)
- Personalization: "Continue where you left off" or "Recommended for you" using progress/preferences (larger change).

## Collections and links
| Collection  | Link pattern           | Label (example) |
|------------|------------------------|-----------------|
| articles   | /article/:id           | Article         |
| cardPlay   | /cardPlay/articles/:id | Declarer        |
| defence    | /defence/articles/:id  | Defence         |
| bidding    | /bidding/articles/:id  | Bidding         |
| counting   | /counting/articles/:id | Counting        |
| quizzes    | /quiz/:id              | Quiz            |

(Confirm bidding route in App.js if different.)

## Files to add/touch
- **New**: `src/components/HomePage/RecentlyAdded.js` – fetches merged recent items, renders compact cards; only renders when `uid` is set.
- **New**: `src/components/HomePage/RecentlyAdded.css` – layout for the section.
- **Edit**: `src/components/HomePage.js` – render `RecentlyAdded` when `this.props.uid` is truthy (e.g. above `CategorySelector`).
