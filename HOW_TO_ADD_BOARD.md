# How to Add a MakeBoard to an Article - Step by Step

## Current Process (Old System)

### Step 1: Open Article Editor
1. Navigate to edit an article (e.g., `/edit/cardPlay/[article-id]`)
2. Or create a new article (e.g., `/create/cardPlay`)

### Step 2: Find the "Create Board" Button
- Look for the **"Create Board"** button next to the "Article Content" label
- It should be a green button with a plus icon
- Located at the top of the editor area

### Step 3: Create the Board
1. Click **"Create Board"** button
2. A modal will open with the board creation form
3. Fill in:
   - **Board Type**: Single, Double, or Full
   - **Position**: Which hand(s) to show
   - **Vulnerability**: None, N/S, E/W, or All
   - **Dealer**: North, South, East, or West
   - **Hands**: Enter cards for each position (e.g., "AKQ" for spades)
   - **Bidding**: Enter bidding sequence (optional)

### Step 4: Generate the Board
1. Click the **"Generate Board"** button at the bottom of the modal
2. The modal should close automatically
3. **IMPORTANT**: A green box should appear below the editor with:
   - "✓ MakeBoard tag ready!" message
   - Preview of the generated tag
   - **"Add to Article"** button (large, green)
   - "Dismiss" button

### Step 5: Add the Board to Article
1. Click the **"Add to Article"** button in the green box
2. You should see a success message: "MakeBoard tag added! It will be inserted when you save."
3. The green box will disappear
4. A yellow box may appear showing how many MakeBoard tags are stored

### Step 6: Save the Article
1. Scroll down to the bottom
2. Click **"Edit Article"** button (or "Submit Article" for new articles)
3. The article will save with the MakeBoard tag included
4. You'll be redirected back to the article list

## Troubleshooting

### If "Add to Article" button doesn't appear:
1. **Check browser console** (F12 → Console tab)
2. Look for error messages
3. Check if you see: `"GenerateBridgeBoard: Calling onBoardGenerated..."`
4. Check if you see: `"CreateCategoryArticle: Received MakeBoard tag..."`

### If the green box doesn't appear:
- The modal might not be closing properly
- Try clicking "Generate Board" again
- Check console for errors

### If board doesn't save:
- Make sure you clicked "Add to Article" (not just "Generate Board")
- Make sure you clicked "Edit Article" at the bottom to save
- Check console for any errors during save

## Expected Behavior

✅ **Working correctly:**
1. Click "Create Board" → Modal opens
2. Fill in board → Click "Generate Board"
3. Modal closes → Green box appears with "Add to Article" button
4. Click "Add to Article" → Success message
5. Click "Edit Article" → Article saves with board

❌ **Not working:**
- Green box doesn't appear after generating
- "Add to Article" button is missing
- Board doesn't save when you click "Edit Article"

## What to Check

1. **Browser Console** (F12):
   - Any red errors?
   - Do you see the debug messages?

2. **Visual Check**:
   - Is the green box visible?
   - Is the "Add to Article" button there?

3. **After Saving**:
   - Does the article load correctly?
   - Does the board appear in the article?



