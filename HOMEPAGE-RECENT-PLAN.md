# Front page “recently added” for logged-in users – plan

## What you already have

- **HomePage** shows a **RecentlyAdded** section **only when the user is logged in** (`this.props.uid`).
- **RecentlyAdded** already:
  - Fetches the latest from Firestore: **articles**, **cardPlay**, **defence**, **bidding**, **counting**, **quizzes** (4 per collection, ordered by `createdAt`).
  - Merges them, sorts by date, shows the **8 most recent** items as clickable cards.
  - Adds two **Practice** cards: “Declarer problem” and “Counting problem”.
- So logged-in users already see “New for you” with recently added content and practice links.

## How to see it on localhost

1. Run the app: from `ishbridge-41` run `npm start`.
2. Open `http://localhost:3000` (or the port shown).
3. **Log in** (the section only appears when `uid` is set).
4. Scroll just below the hero: you should see **“New for you”** and either:
   - A grid of recent articles/quizzes (if Firestore has recent docs with `createdAt`), or
   - The fallback: two practice cards only.

If you see “Loading…” then “New for you” with no articles, Firestore may have no (or old) `createdAt` on those collections, or rules may limit reads.

## Optional improvements (pick what you want)

1. **Copy and placement**
   - Change title to something like “New and waiting for you” or “Something new to try”.
   - Add a short subtitle when there are items: e.g. “Latest articles and practice – pick one and dive in.”

2. **“New” badges**
   - For items added in the last 7 (or 14) days, show a small “New” badge on the card using `createdAt`.

3. **Highlight new practice problems**
   - Practice problems (declarer/counting) live in code and have `newUntil` dates. You could:
     - Add a small “New practice” strip that links to specific problem IDs that are still “new” (e.g. from a shared config or exported list), or
     - Keep the current two practice cards but add a line like “Including new problems this week” when any problem has `newUntil` in the future.

4. **Empty state**
   - When there are no recent articles from Firestore, the fallback already shows the two practice cards. You could make that more prominent (e.g. “Start with a quick problem” and larger buttons).

5. **Order / position**
   - RecentlyAdded is already directly under the hero. If you want it even more prominent, we could move it higher (e.g. above the hero) or add a short hero line like “Check out what’s new” that scrolls to this section.

## Next step

- **Now:** Run the app, log in, and look at the “New for you” section on the front page.
- **Then:** Decide which of the options above (if any) you want, and we can implement them next.
