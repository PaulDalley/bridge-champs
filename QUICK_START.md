# Quick Start Guide - Modern Article System

## 🚀 Getting Started

The new modern article and MakeBoard system is complete! Here's how to use it:

## 1. Test the MakeBoard Editor

```javascript
import { BoardEditor } from './features/bridge-board';

function TestBoardEditor() {
  return (
    <BoardEditor
      onSave={(board) => {
        console.log('Board saved:', board);
        // board is a JSON object, not a string!
      }}
      onCancel={() => console.log('Cancelled')}
    />
  );
}
```

## 2. Test the Article Editor

```javascript
import { CreateArticleModern } from './features/articles';

function TestArticleEditor() {
  return <CreateArticleModern articleType="cardPlay" />;
}
```

## 3. Add to App.js

Add these routes to test:

```javascript
import CreateArticleModern from './features/articles';

// In your routes:
<Route
  path="/test/create/:articleType"
  render={({ match }) => (
    <CreateArticleModern articleType={match.params.articleType} />
  )}
/>
```

Then visit: `/test/create/cardPlay`

## 4. What to Test

1. **Create a board**:
   - Click "🎴 Add Board" in editor
   - Fill in hands (e.g., North: AKQ in spades)
   - Save board
   - Verify it appears in editor

2. **Save article**:
   - Fill in title, content
   - Add MakeBoard
   - Click "Create Article"
   - Check Firebase - should see both formats

3. **Edit article**:
   - Load existing article
   - Should auto-convert old format
   - Edit and save
   - Verify MakeBoard still works

## 5. Verify Data

Check Firebase console:
- New articles should have `blocks` field (JSON)
- Also have `text` field (HTML) for compatibility
- MakeBoard data should be in JSON format

## 🎯 Success Criteria

✅ MakeBoard can be created and saved
✅ MakeBoard appears in editor
✅ Article saves successfully
✅ Old articles can be loaded
✅ MakeBoard data is preserved

## 🐛 Troubleshooting

**Issue**: Tailwind styles not working
- Check `postcss.config.js` exists
- Verify Tailwind directives in `index.css`
- Restart dev server

**Issue**: Firebase errors
- Check `firebase/modernConfig.js` exists
- Verify Firebase v9 is installed
- Check Firebase config matches old config

**Issue**: MakeBoard not showing
- Check browser console for errors
- Verify MakeBoardExtension is loaded
- Check TipTap is working

## 📚 Documentation

- `MODERN_SYSTEM_COMPLETE.md` - Full system overview
- `IMPLEMENTATION_SUMMARY.md` - Implementation details
- `MAKEBOARD_REDESIGN.md` - MakeBoard design

---

**Ready to test!** Start with the MakeBoard editor, then try the full article editor.



