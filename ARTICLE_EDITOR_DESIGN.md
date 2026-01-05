# Modern Unified Article Editor - Design Document

## Current Problems

1. **Two Separate Systems:**
   - `CreateArticle.js` - for "extra" articles (class component)
   - `CreateCategoryArticle.js` - for category articles (functional component)
   - Different storage structures, different field names (`body` vs `text`)

2. **MakeBoard Tag Issues:**
   - RichTextEditor (react-rte) strips custom HTML tags
   - Tags stored as HTML strings get lost during save/load
   - Complex workarounds that don't work reliably

3. **Inconsistent Data Structure:**
   - Extra articles: `{ body: articleBody }`
   - Category articles: `{ text: articleText }`
   - Different Firebase collections for similar data

## Modern Solution: Block-Based Content Structure

### Core Concept
Instead of storing HTML strings, store content as an array of **blocks**:

```javascript
{
  blocks: [
    { type: 'paragraph', content: 'This is a paragraph...' },
    { type: 'heading', level: 2, content: 'Section Title' },
    { type: 'makeboard', data: { hand: {...}, bidding: '...', ... } },
    { type: 'video', url: 'https://youtube.com/...' },
    { type: 'paragraph', content: 'More text...' }
  ]
}
```

### Benefits
1. **MakeBoard as first-class citizen** - Not HTML string, but structured data
2. **No more tag stripping** - Editor works with blocks, not HTML
3. **Easy to extend** - Add new block types (images, code, etc.)
4. **Better rendering** - Each block type has its own renderer
5. **Version control friendly** - JSON is easier to diff than HTML

### Architecture

#### 1. Unified Article Editor Component
- Single component for ALL article types
- Block-based editor (using Slate.js or similar)
- Custom block types: paragraph, heading, makeboard, video, list, etc.

#### 2. Content Structure
```typescript
interface ArticleBlock {
  id: string;
  type: 'paragraph' | 'heading' | 'makeboard' | 'video' | 'list' | 'code';
  content?: string; // For text blocks
  data?: any; // For complex blocks (makeboard, video)
  level?: number; // For headings
}

interface ArticleContent {
  blocks: ArticleBlock[];
  version: number; // For migration/backup
}
```

#### 3. Storage Structure
- **Unified**: All articles use same structure
- **Consistent field name**: Always `content` (not `body` or `text`)
- **Backward compatible**: Migration script to convert old articles

#### 4. Editor Features
- Visual block editor (drag to reorder)
- Inline toolbar for formatting
- Block-specific controls (e.g., MakeBoard generator modal)
- Real-time preview
- Auto-save drafts

### Implementation Plan

#### Phase 1: Core Editor
1. Install Slate.js (modern, extensible editor)
2. Create `UnifiedArticleEditor` component
3. Implement basic block types (paragraph, heading)
4. Create block renderer components

#### Phase 2: Custom Blocks
1. Implement MakeBoard block type
2. Implement Video block type
3. Add block insertion UI (toolbar buttons)

#### Phase 3: Migration & Unification
1. Create migration utility to convert old HTML → blocks
2. Update Firebase actions to use new structure
3. Update display components to render blocks
4. Unified create/edit interface

#### Phase 4: Polish
1. Auto-save drafts
2. Version history (already have backup system)
3. Better UX (drag-drop, keyboard shortcuts)

### Migration Strategy

1. **Dual-write**: Save both old format (HTML) and new format (blocks)
2. **Gradual migration**: Convert articles on edit
3. **Backward compatibility**: Display components handle both formats
4. **Cleanup**: Remove old format after all articles migrated

### File Structure

```
src/
  components/
    ArticleEditor/
      UnifiedArticleEditor.js       # Main editor component
      BlockRenderer.js              # Renders blocks
      blocks/
        ParagraphBlock.js
        HeadingBlock.js
        MakeBoardBlock.js           # MakeBoard as block, not HTML!
        VideoBlock.js
      toolbar/
        BlockToolbar.js
        FormatToolbar.js
      utils/
        blockUtils.js               # Block manipulation
        migration.js                # HTML → blocks conversion
  containers/
    CreateArticleUnified.js         # Single create/edit component
  store/
    actions/
      articleActions.js             # Unified actions
```

### Key Advantages

1. **No more MakeBoard tag loss** - Stored as structured data
2. **Unified system** - One editor for all article types
3. **Extensible** - Easy to add new block types
4. **Modern** - Uses current best practices
5. **Maintainable** - Cleaner code, easier to debug



