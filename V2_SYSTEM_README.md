# V2 Article Creation System

## Overview

A completely new article creation system built from scratch, running in parallel with the existing system. **No existing data is modified or deleted** - the new system reads and writes to the same Firebase collections in a backward-compatible way.

## Features

✅ **Modern TipTap Editor** - Rich text editing with inline formatting
✅ **Quick Board Creation** - One-click board insertion while writing
✅ **Visual Board Creator** - Clean interface for creating bridge boards
✅ **Automatic Migration** - Existing MakeBoard tags are automatically converted
✅ **Backward Compatible** - Saves in same format as old system
✅ **Safe & Reversible** - Feature flag allows instant rollback

## Routes

- **Create Article**: `/create-article-v2/:category` (where category is `bidding`, `cardPlay`, or `defence`)
- **Edit Article**: `/edit-article-v2/:category/:id`

## How to Use

### Creating a New Article

1. Navigate to `/create-article-v2/bidding` (or `cardPlay` or `defence`)
2. Fill in article metadata (title, teaser, video URL, etc.)
3. Write your article content in the editor
4. Click **"Add Board"** button in the toolbar to insert a bridge board
5. Fill in the board details (hands, vulnerability, dealer, bidding)
6. Click **"Create Board"** - it will be inserted at your cursor position
7. Click **"Create Article"** to save

### Editing an Existing Article

1. Navigate to `/edit-article-v2/:category/:id`
2. The article loads with all existing content
3. Make your changes
4. Click **"Update Article"** to save

### Quick Board Insertion

While writing, click the **"Add Board"** button in the editor toolbar. A modal opens where you can:
- Select board type (single hand, two hands, or full board)
- Enter cards for each hand
- Set vulnerability and dealer
- Add bidding sequence
- Insert the board inline in your article

## Data Compatibility

- **Reads**: Existing articles from Firebase (same collections)
- **Writes**: Same format as old system (MakeBoard tags in HTML)
- **Migration**: Automatically converts old MakeBoard tags when loading articles
- **No Data Loss**: Original data is never deleted or modified

## Feature Flag

Located in `/src/v2/config.js`:

```javascript
export const USE_V2_SYSTEM = true; // Set to false to disable
```

To rollback:
1. Set `USE_V2_SYSTEM = false` in `src/v2/config.js`
2. Old system continues working normally
3. All data remains intact

## File Structure

```
src/v2/
├── config.js                    # Feature flag and configuration
├── types/
│   └── board.types.js           # Bridge board data types
├── utils/
│   └── boardMigration.js       # Migration utilities
├── services/
│   └── articleService.js       # Firebase data layer
├── components/
│   ├── ArticleEditor/          # TipTap editor component
│   └── BridgeBoardCreator/     # Board creation UI
└── pages/
    └── CreateArticleV2.js      # Main create/edit page
```

## Safety Guarantees

1. ✅ **No Deletion** - Old data is never deleted
2. ✅ **No Modification** - Existing documents are not changed
3. ✅ **Reversible** - Switch back via feature flag
4. ✅ **Testable** - Can test new system without affecting old
5. ✅ **Gradual** - Migrate articles one at a time if desired

## Testing

1. Start the app: `npm start`
2. Navigate to `/create-article-v2/cardPlay`
3. Create a test article with a board
4. Verify it saves correctly
5. Edit the article and verify boards are preserved
6. Check Firebase to confirm data structure matches old system

## Next Steps

- Test the system thoroughly
- Migrate existing articles if desired (automatic on load)
- Adjust UI/UX based on feedback
- Add more features as needed

## Rollback Procedure

If you need to revert to the old system:

1. Open `src/v2/config.js`
2. Set `USE_V2_SYSTEM = false`
3. Restart the app
4. Old routes continue working: `/create/cardPlay`, `/edit/cardPlay/:id`, etc.
5. All data remains intact

---

**Built from scratch - completely separate from old system**
**100% backward compatible - no data loss risk**




