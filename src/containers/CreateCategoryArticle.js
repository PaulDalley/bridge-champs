import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// import { withRouter } from "../hoc/withRouter";
import {
  findQuizById,
  replaceSuitMacros,
  prepareArticleString,
} from "../helpers/helpers";
import {
  startAddArticle,
  startEditArticle,
  getArticleMetadata,
  getArticle,
  startDeleteArticle,
  getArticleBackups,
  restoreArticleFromBackup,
} from "../store/actions/categoryArticlesActions";
import {
  Row,
  TextInput,
  Select,
  Button,
  Icon,
  Toast,
  Col,
  Modal,
  Textarea,
  DatePicker,
} from "react-materialize"; // Input component deprecated
import { categoriesRef, biddingSummaryRef, biddingBasicsSummaryRef, biddingAdvancedSummaryRef, cardPlaySummaryRef, cardPlayBasicsSummaryRef, defenceSummaryRef, defenceBasicsSummaryRef } from "../firebase/config";
import "./CreateArticle.css";
import $ from "jquery";


import GenerateBridgeBoard from "../components/BridgeBoard/GenerateBridgeBoard";
import BoardManager from "../components/Articles/BoardManager";

import RichTextEditor from "react-rte";

import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import logger from "../utils/logger";

const CreateCategoryArticle = ({
  articleType,
  bodyRef,
  history,
  edit,
  create,
  creating,
  match,
}) => {
  const a = useSelector((state) => state.auth.a);
  const articles = useSelector(
    (state) => state.categoryArticles?.[articleType]
  );
  const _article = useSelector((state) => state.categoryArticles?.article);
  const currentArticle = useSelector((state) => state.categoryArticles?.currentArticle);
  const dispatch = useDispatch();

  const [article, setArticle] = useState(RichTextEditor.createEmptyValue());
  const [articleId, setArticleId] = useState(match?.params?.id); // This is the body document ID from URL
  const [summaryDocumentId, setSummaryDocumentId] = useState(null); // This is the summary document ID
  const [articleLoaded, setArticleLoaded] = useState(false);
  const [backups, setBackups] = useState([]);
  const [showBackups, setShowBackups] = useState(false);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [makeBoardTags, setMakeBoardTags] = useState([]); // Store MakeBoard tags separately with positions
  const [pendingMakeBoardTag, setPendingMakeBoardTag] = useState(null); // Tag waiting to be inserted
  const [placedBoardIds, setPlacedBoardIds] = useState(new Set()); // Track which boards have been placed in text
  
  // Generate unique IDs for boards
  const generateBoardId = () => `board-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  // Insert board placeholder at cursor position (or end if cursor position not available)
  const insertBoardAtCursor = (boardId) => {
    try {
      // Get current HTML content
      const currentHtml = typeof article === 'string' 
        ? article 
        : article.toString('html');
      
      // Create placeholder - use a visible marker that will be replaced on save
      const placeholder = `<p style="background-color: #e3f2fd; padding: 0.5rem; border-left: 3px solid #0F4C3A; margin: 1rem 0;">[BOARD:${boardId}]</p>`;
      
      // Try to insert at cursor if possible, otherwise append
      // RichTextEditor doesn't easily expose cursor position, so we'll append for now
      // In a future version, we could use the editor's selection API
      const newHtml = currentHtml + placeholder;
      const newEditorValue = RichTextEditor.createValueFromString(newHtml, 'html');
      setArticle(newEditorValue);
      
      // Mark board as placed
      setPlacedBoardIds(new Set([...placedBoardIds, boardId]));
      
      M.toast({ 
        html: 'Board placeholder inserted! You can move it in the text. The board will appear here when you save.',
        classes: 'green',
        displayLength: 4000
      });
    } catch (e) {
      logger.error('Error inserting board placeholder:', e);
      M.toast({ 
        html: 'Error inserting board. Please try again.',
        classes: 'red',
        displayLength: 3000
      });
    }
  };
  
  // RichTextEditor toolbar configuration
  const toolbarConfig = {
    display: [
      'INLINE_STYLE_BUTTONS',
      'BLOCK_TYPE_BUTTONS',
      'LINK_BUTTONS',
      'BLOCK_TYPE_DROPDOWN',
      'HISTORY_BUTTONS'
    ],
    INLINE_STYLE_BUTTONS: [
      { label: 'Bold', style: 'BOLD', className: 'custom-button' },
      { label: 'Italic', style: 'ITALIC', className: 'custom-button' },
      { label: 'Underline', style: 'UNDERLINE', className: 'custom-button' },
      { label: 'Strikethrough', style: 'STRIKETHROUGH', className: 'custom-button' },
      { label: 'Code', style: 'CODE', className: 'custom-button' }
    ],
    BLOCK_TYPE_DROPDOWN: [
      { label: 'Normal', style: 'unstyled' },
      { label: 'Heading 1', style: 'header-one' },
      { label: 'Heading 2', style: 'header-two' },
      { label: 'Heading 3', style: 'header-three' },
      { label: 'Blockquote', style: 'blockquote' }
    ],
    BLOCK_TYPE_BUTTONS: [
      { label: 'UL', style: 'unordered-list-item' },
      { label: 'OL', style: 'ordered-list-item' }
    ]
  };
  const [difficulty, setDifficulty] = useState("1");
  const [articleNumber, setArticleNumber] = useState("1");
  const [teaser, setTeaser] = useState("");
  const [teaserBoard, setTeaserBoard] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("[Add New Category]");
  const [subcategory, setSubcategory] = useState("");
  const [categories, setCategories] = useState(["[Add New Category]"]);
  const [newCategory, setNewCategory] = useState("");
  const [body, setBody] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [hasVideo, setHasVideo] = useState(false);
  const [categoriesSubscription, setCategoriesSubscription] =
    useState(undefined);

  const setDataIfEditing = (articleMetadata) => {
    if (!articleMetadata) return;

    let {
      body,
      category,
      difficulty,
      articleNumber,
      teaser,
      teaser_board,
      title,
      subcategory,
      videoUrl,
      hasVideo,
      id,
    } = articleMetadata;

    if (subcategory === undefined) subcategory = "";
    if (!difficulty) difficulty = "1";
    if (!articleNumber) articleNumber = "1";
    if (!title) title = "";
    if (!category) category = "[Add New Category]";
    if (!teaser) teaser = "";
    if (!teaser_board) teaser_board = "";
    
    setArticle("");
    setDifficulty(String(difficulty));
    setArticleNumber(String(articleNumber));
    setTeaser(teaser);
    setTeaserBoard(teaser_board);
    setTitle(title);
    setCategory(category);
    setSubcategory(subcategory || "");
    setVideoUrl(videoUrl || "");
    setHasVideo(hasVideo === true);
    setBody(body);

    // Only fetch article body if we have a body ID
    if (body) {
      dispatch(getArticle(body, history, bodyRef));
    }
  };

  const addCategory = (e) => {
    e.preventDefault();
    categoriesRef
      .doc(newCategory)
      .set({
        category: newCategory,
      })
      .then(() => {
        setNewCategory("");
      });
  };

  const getListPathForArticleType = (type) => {
    if (type === "biddingBasics") return "/bidding/basics";
    if (type === "bidding") return "/bidding/advanced";
    if (type === "cardPlayBasics") return "/cardPlay/basics";
    if (type === "defenceBasics") return "/defence/basics";
    return "/" + type;
  };

  // Fetch article metadata when editing
  useEffect(() => {
    const currentArticleId = match?.params?.id;
    if (edit && currentArticleId && articleType) {
      // Reset article loaded state when starting a new edit
      setArticleLoaded(false);
      // The articleId in the URL is the body document ID, not the summary document ID
      // We need to query the summary collection to find the document where body == articleId
      const refMap = { bidding: biddingSummaryRef, biddingBasics: biddingBasicsSummaryRef, biddingAdvanced: biddingAdvancedSummaryRef, cardPlay: cardPlaySummaryRef, cardPlayBasics: cardPlayBasicsSummaryRef, defence: defenceSummaryRef, defenceBasics: defenceBasicsSummaryRef };
      const summaryRef = refMap[articleType];
      
      summaryRef
        .where("body", "==", currentArticleId)
        .get()
        .then((snapshot) => {
          if (snapshot && snapshot.docs.length > 0) {
            const doc = snapshot.docs[0];
            const data = doc.data();
            // Store the summary document ID (this is what we'll use when saving)
            setSummaryDocumentId(doc.id);
            // Add the document ID to the data
            const dataWithId = { ...data, id: doc.id };
            setDataIfEditing(dataWithId);
          }
        })
        .catch((err) => {
          // Error will be handled by error boundary
        });
    }
  }, [edit, match?.params?.id, articleType]);

  // Auth check and categories subscription
  useEffect(() => {
    if (a === false) {
      history.push(getListPathForArticleType(articleType));
      return;
    }

    if (!creating && !create && !edit) {
      history.push(getListPathForArticleType(articleType));
      return;
    }

    const _categoriesSubscription = categoriesRef.onSnapshot((snapshot) => {
      if (snapshot && snapshot.docs.length > 0) {
        const categories = snapshot.docs.map((doc) => doc.id);
        setCategories(["[Add New Category]", ...categories]);
      }
    });
    setCategoriesSubscription(_categoriesSubscription);

    return () => {
      if (categoriesSubscription) categoriesSubscription();
    };
  }, [a, articleType, creating, create, edit]);

  // Load article body when it arrives
  useEffect(() => {
    if (body && _article) {
      let _articleBody = _article?.[body]?.text;
      if (_articleBody && !articleLoaded) {
        setArticleLoaded(true);
        logger.log('=== LOADING ARTICLE ===');
        logger.log('Article body length:', _articleBody.length);
        
        // Extract MakeBoard tags and store them separately
        const makeBoardRegex = /<MakeBoard[^>]*\/>/g;
        const extractedTags = [];
        let match;
        
        // Reset regex lastIndex to ensure we catch all matches
        makeBoardRegex.lastIndex = 0;
        
        // Extract all MakeBoard tags from the article
        while ((match = makeBoardRegex.exec(_articleBody)) !== null) {
          extractedTags.push({
            id: generateBoardId(), // Add unique ID for each board
            tag: match[0],
            position: extractedTags.length,
          });
          logger.log('Extracted MakeBoard tag on load:', match[0].substring(0, 100));
        }
        
        logger.log('Total MakeBoard tags extracted on load:', extractedTags.length);
        
        // Store MakeBoard tags separately with IDs
        setMakeBoardTags(extractedTags);
        
        // Create HTML without MakeBoard tags for RichTextEditor
        const bodyWithoutTags = _articleBody.replace(makeBoardRegex, '');
        logger.log('Body without tags length:', bodyWithoutTags.length);
        
        // Convert HTML string to RichTextEditor value
        try {
          const editorValue = RichTextEditor.createValueFromString(bodyWithoutTags, 'html');
          setArticle(editorValue);
          logger.log('Article loaded into RichTextEditor successfully');
        } catch (e) {
          logger.error('Error converting article to RichTextEditor value:', e);
          // Fallback: create empty and set as string (will be handled in submit)
          setArticle(bodyWithoutTags);
        }
      }
    }
  }, [_article, body, articleLoaded]);

  const submitArticle = (e) => {
    e.preventDefault();
    const useArticleType = articleType;
    const useBodyRef = bodyRef;

    let _article = {
      articleType: articleType,
      title: title,
      category: category,
      difficulty: difficulty,
      teaser_board: teaserBoard,
      teaser: teaser,
      articleNumber: articleNumber,
      videoUrl: videoUrl,
      hasVideo: hasVideo,
    };

    if (subcategory !== "") {
      _article["subcategory"] = subcategory;
    }

    let articleText = prepareArticleString(article.toString("html"));
    let articleBody = { text: articleText };

    dispatch(
      startAddArticle(_article, articleBody, useArticleType, useBodyRef)
    );

    history.push(getListPathForArticleType(articleType));
  };

  const submitEditArticle = (e) => {
    e.preventDefault();
    
    // CRITICAL: Log the current state before processing
    logger.log('=== SUBMIT EDIT ARTICLE CALLED ===');
    logger.log('makeBoardTags state:', makeBoardTags);
    logger.log('makeBoardTags length:', makeBoardTags.length);
    logger.log('makeBoardTags content:', JSON.stringify(makeBoardTags));
    
    // Use the summary document ID (not the body ID from URL)
    const summaryId = summaryDocumentId || match?.params?.id;
    if (!summaryId) {
      logger.error("No summary document ID found for editing");
      return;
    }
    let _article = {
      articleType: articleType,
      title: title,
      category: category,
      difficulty: difficulty,
      articleNumber: articleNumber,
      teaser_board: teaserBoard,
      teaser: teaser,
      body: body,
      id: summaryId, // This should be the summary document ID
      videoUrl: videoUrl,
      hasVideo: hasVideo,
    };

    if (subcategory !== "") {
      _article["subcategory"] = subcategory;
    }

    // Convert RichTextEditor value to HTML string
    let rawHtml = typeof article === 'string' 
      ? article
      : article.toString("html");
    
    logger.log('=== SAVING ARTICLE ===');
    logger.log('Raw HTML length:', rawHtml.length);
    logger.log('Stored MakeBoard tags:', makeBoardTags.length);
    
    // First, extract any MakeBoard tags that might already be in the HTML
    // (in case they were preserved from a previous save)
    // Use a more flexible regex to catch various formats
    const makeBoardRegex = /<MakeBoard[^>]*\/>/g;
    const existingTags = [];
    let match;
    // Reset regex lastIndex to ensure we catch all matches
    makeBoardRegex.lastIndex = 0;
    while ((match = makeBoardRegex.exec(rawHtml)) !== null) {
      existingTags.push(match[0]);
      logger.log('Found existing MakeBoard tag in HTML:', match[0].substring(0, 50) + '...');
    }
    
    // Remove MakeBoard tags from HTML before processing (we'll add them back)
    let htmlWithoutTags = rawHtml.replace(makeBoardRegex, '');
    
    // Process the article string (unescape, handle suits, etc.)
    // IMPORTANT: prepareArticleString should NOT process MakeBoard tags
    let articleText = prepareArticleString(htmlWithoutTags);
    
    // Replace board placeholders with actual MakeBoard tags
    // Placeholders look like: [BOARD:board-id]
    const boardPlaceholderRegex = /\[BOARD:([^\]]+)\]/g;
    const boardMap = new Map();
    
    // Create a map of board IDs to tags
    makeBoardTags.forEach(boardItem => {
      if (boardItem.id && boardItem.tag) {
        boardMap.set(boardItem.id, boardItem.tag);
      }
    });
    
    // Replace placeholders with actual tags
    articleText = articleText.replace(boardPlaceholderRegex, (match, boardId) => {
      const tag = boardMap.get(boardId);
      if (tag) {
        logger.log(`Replacing placeholder [BOARD:${boardId}] with MakeBoard tag`);
        return tag;
      }
      logger.warn(`No board found for ID: ${boardId}`);
      return match; // Keep placeholder if board not found
    });
    
    // Merge stored MakeBoard tags back into the article
    // Combine existing tags from HTML with newly added tags
    logger.log('BEFORE MERGE - makeBoardTags:', makeBoardTags);
    logger.log('BEFORE MERGE - existingTags:', existingTags);
    
    // Safely extract tags from makeBoardTags array
    const newTags = Array.isArray(makeBoardTags) 
      ? makeBoardTags
          .filter(item => {
            // Only include boards that haven't been placed (no placeholder in text)
            const boardId = item?.id;
            return boardId && !placedBoardIds.has(boardId);
          })
          .map(item => {
            // Handle both { tag: "..." } and direct string formats
            const tag = typeof item === 'string' ? item : (item?.tag || item);
            logger.log('Extracting unplaced tag from makeBoardTags:', tag?.substring(0, 50));
            return tag;
          })
          .filter(tag => tag && typeof tag === 'string')
      : [];
    
    const allMakeBoardTags = [...existingTags, ...newTags];
    
    logger.log('Total MakeBoard tags to merge:', allMakeBoardTags.length);
    logger.log('Existing from HTML:', existingTags.length);
    logger.log('New unplaced from stored array:', newTags.length);
    logger.log('Placed boards (not appending):', placedBoardIds.size);
    logger.log('All tags to insert:', allMakeBoardTags.map(t => t?.substring(0, 50)));
    
    if (allMakeBoardTags.length > 0) {
      // Append unplaced MakeBoard tags at the end
      const tagsToInsert = allMakeBoardTags.join('\n\n');
      articleText = articleText + '\n\n' + tagsToInsert;
      logger.log(`Merging ${allMakeBoardTags.length} MakeBoard tag(s) into article`);
      logger.log('Sample tag:', allMakeBoardTags[0].substring(0, 100));
    }
    
    // Verify tags are in the final text
    makeBoardRegex.lastIndex = 0; // Reset regex
    const finalTagCount = (articleText.match(makeBoardRegex) || []).length;
    if (finalTagCount > 0) {
      logger.log(`✓ Article will be saved with ${finalTagCount} MakeBoard tag(s)`);
      logger.log('Final article text length:', articleText.length);
    } else if (allMakeBoardTags.length > 0) {
      logger.error(`✗ ERROR: ${allMakeBoardTags.length} MakeBoard tag(s) were lost during processing!`);
      logger.error('Article text before adding tags:', articleText.substring(articleText.length - 200));
      // As a last resort, append them directly without processing
      articleText = articleText + '\n\n' + allMakeBoardTags.join('\n\n');
      logger.log('Added tags as last resort. New length:', articleText.length);
    } else {
      logger.log('No MakeBoard tags to save');
    }
    
    // Final verification - check if tags are actually in the text
    makeBoardRegex.lastIndex = 0;
    const finalCheck = articleText.match(makeBoardRegex);
    if (finalCheck) {
      logger.log('✓ Final verification: MakeBoard tags are in the text');
    } else if (allMakeBoardTags.length > 0) {
      logger.error('✗ Final verification FAILED: MakeBoard tags are NOT in the text!');
      // Emergency fallback: append raw tags
      articleText = articleText + '\n\n' + allMakeBoardTags.map(item => item.tag).join('\n\n');
    }
    
    let articleBody = { text: articleText };
    
    // FINAL VERIFICATION: Check if MakeBoard tags are actually in the text being saved
    const finalMakeBoardCheck = articleText.match(/<MakeBoard[^>]*\/>/g);
    logger.log('=== FINAL CHECK BEFORE SAVING ===');
    logger.log('articleBody.text length:', articleBody.text.length);
    logger.log('MakeBoard tags in final text:', finalMakeBoardCheck ? finalMakeBoardCheck.length : 0);
    if (finalMakeBoardCheck) {
      logger.log('✓ MakeBoard tags ARE in the text being saved');
      logger.log('Sample tag from final text:', finalMakeBoardCheck[0].substring(0, 100));
    } else if (allMakeBoardTags.length > 0) {
      logger.error('✗ CRITICAL: MakeBoard tags are NOT in the final text, but they should be!');
      logger.error('This means the tags were lost during processing.');
      // Emergency: append them one more time
      articleBody.text = articleText + '\n\n' + allMakeBoardTags.join('\n\n');
      logger.log('Emergency fix: Re-appended tags. New length:', articleBody.text.length);
    }
    
    logger.log('Dispatching startEditArticle...');
    dispatch(startEditArticle(_article, articleBody, articleType, bodyRef));

    history.push(getListPathForArticleType(articleType));
  };

  const submitDeleteArticle = (e) => {
    e.preventDefault();
    let modal = $(".modal");
    let modalOverlay = $(".modal-overlay");
    modal.removeClass("open");
    modal.removeAttr("style");
    modalOverlay.remove();
    $("body").css({ overflow: "auto" });
    // Use summary document ID (not body id) so the reducer and Firestore delete the correct docs
    const summaryId = summaryDocumentId || articleId;
    dispatch(startDeleteArticle(summaryId, body, articleType, bodyRef));
    history.push(getListPathForArticleType(articleType));
  };

  const loadBackups = async () => {
    if (!body || !bodyRef) return;
    setLoadingBackups(true);
    try {
      const backupsList = await dispatch(getArticleBackups(body, bodyRef));
      setBackups(backupsList);
      setShowBackups(true);
      // Open the modal programmatically
      setTimeout(() => {
        const modalElement = document.getElementById('backup-modal');
        if (modalElement) {
          const instance = window.M?.Modal?.getInstance(modalElement);
          if (instance) {
            instance.open();
          }
        }
      }, 100);
    } catch (err) {
      logger.error("Failed to load backups:", err);
      Toast({
        html: "Failed to load backups",
        classes: "red",
      });
    } finally {
      setLoadingBackups(false);
    }
  };

  const handleRestoreBackup = async (backupId) => {
    if (!window.confirm("Are you sure you want to restore this backup? This will replace the current article content.")) {
      return;
    }
    
    try {
      await dispatch(restoreArticleFromBackup(backupId, bodyRef));
      Toast({
        html: "Article restored from backup successfully! Reloading...",
        classes: "green",
      });
      
      // Reload the article
      setTimeout(() => {
        dispatch(getArticle(body, history, bodyRef));
        setArticleLoaded(false);
        setShowBackups(false);
      }, 1000);
    } catch (err) {
      logger.error("Failed to restore backup:", err);
      Toast({
        html: "Failed to restore backup",
        classes: "red",
      });
    }
  };

  const formatBackupDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleString();
    } catch (e) {
      return "Unknown date";
    }
  };

  // START OF RENDERING CODE:
  let categoriesJSX = categories.map((category) => (
    <option key={category} value={category}>
      {category}
    </option>
  ));

  let categoriesInput = (
    <Select
      s={12}
      name="category"
      type="select"
      label="Article Category"
      value={category}
      onChange={(e) => setCategory(e.target.value)}
    >
      {categoriesJSX}
    </Select>
  );

  return (
    <div className="CreateArticle-container">
      <form>
        <h3 style={{ paddingTop: "3rem", textAlign: "center" }}>
          {" "}
          Create {articleType} post
        </h3>
        <Row>
          <TextInput
            s={12}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            label="Post Title"
          />
        </Row>
        <Row>{categoriesInput}</Row>
        {category === "[Add New Category]" && (
          <Row>
            <TextInput
              s={6}
              name="newCategory"
              onChange={(e) => setNewCategory(e.target.value)}
              label="Add New Category"
              value={newCategory}
            />
            <Button
              floating
              flat
              onClick={(e) => addCategory(e)}
              className="green darken-5"
              waves="light"
              icon={<Icon>add</Icon>}
            />
          </Row>
        )}

        <Row>
          <TextInput
            s={6}
            name="subcategory"
            label="Add (Optional) Subcategory or leave blank"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
          ></TextInput>
        </Row>

        <Row>
          <Select
            s={12}
            name="difficulty"
            type="select"
            label="Article Difficulty Level"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            {[
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20,
            ].map((n) => {
              return <option key={n} value={String(n)}>Level {n}</option>;
            })}
          </Select>
        </Row>
        <Row>
          <Select
            s={12}
            name="articleNumber"
            type="select"
            label="Article Number At This Difficulty Level"
            value={articleNumber}
            onChange={(e) => setArticleNumber(e.target.value)}
          >
            {[
              1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
              20,
            ].map((n) => {
              return <option key={n} value={String(n)}>Level {n}</option>;
            })}
          </Select>
        </Row>
        <Row>
          <TextInput
            s={12}
            name="teaserBoard"
            label="Article Teaser Hand"
            value={teaserBoard}
            onChange={(e) => setTeaserBoard(e.target.value)}
          ></TextInput>
        </Row>
        <Row>
          <TextInput
            s={12}
            name="teaser"
            label="Article Teaser Introduction"
            value={teaser}
            onChange={(e) => setTeaser(e.target.value)}
          ></TextInput>
        </Row>
        <Row>
          <TextInput
            s={12}
            name="videoUrl"
            label="YouTube Video URL (Optional - Premium Only)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          ></TextInput>
        </Row>
        <Row>
          <div style={{ 
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginTop: '1rem',
            marginBottom: '1rem'
          }}>
            <label 
              htmlFor="hasVideoCheckboxOld"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                fontSize: '1.6rem',
                fontWeight: '500',
                margin: 0,
                userSelect: 'none'
              }}
              onClick={(e) => {
                e.preventDefault();
                setHasVideo(!hasVideo);
              }}
            >
              <input
                id="hasVideoCheckboxOld"
                type="checkbox"
                checked={hasVideo}
                onChange={(e) => setHasVideo(e.target.checked)}
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: '20px',
                  height: '20px',
                  marginRight: '12px',
                  cursor: 'pointer',
                  flexShrink: 0,
                  opacity: 1,
                  position: 'relative',
                  zIndex: 1
                }}
              />
              <span style={{ pointerEvents: 'none' }}>Article contains video</span>
            </label>
          </div>
        </Row>
        <Row>
          <div style={{ width: '100%', marginBottom: '1rem', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '1.6rem', fontWeight: 'bold', display: 'block', margin: 0 }}>
                Article Content
              </label>
              <Modal
                header="Create Bridge Board"
                trigger={
                  <Button
                    waves="light"
                    small
                    style={{ 
                      backgroundColor: '#0F4C3A',
                      marginLeft: '1rem',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    <Icon left>add_circle</Icon>
                    Create Board
                  </Button>
                }
                options={{
                  onCloseEnd: () => {
                    $("body").css({ overflow: "auto" });
                  }
                }}
                id="board-creator-modal"
              >
                <div style={{ padding: '1rem 0', maxHeight: '80vh', overflowY: 'auto' }}>
                  <GenerateBridgeBoard 
                    onBoardGenerated={(makeBoardTag) => {
                      console.log('CreateCategoryArticle: Received MakeBoard tag:', makeBoardTag?.substring(0, 50));
                      if (makeBoardTag) {
                        setPendingMakeBoardTag(makeBoardTag);
                        logger.log('MakeBoard tag set, pendingMakeBoardTag should now be visible');
                        // Close modal immediately so user can see the "Add to Article" button
                        setTimeout(() => {
                          const modalElement = document.getElementById('board-creator-modal');
                          if (modalElement) {
                            const instance = window.M?.Modal?.getInstance(modalElement) || M.Modal.getInstance(modalElement);
                            if (instance) {
                              instance.close();
                            }
                          }
                          $("body").css({ overflow: "auto" });
                        }, 100);
                      } else {
                        logger.error('MakeBoard tag is null or undefined');
                      }
                    }}
                  />
                </div>
              </Modal>
            </div>
            <p style={{ fontSize: '1.2rem', color: '#666', marginBottom: '1rem' }}>
              💡 Tip: Paste YouTube URLs directly in the text to embed videos (e.g., https://www.youtube.com/watch?v=VIDEO_ID)
            </p>
            {(articleLoaded || !edit) && (
              <>
                <RichTextEditor
                  value={article}
                  onChange={(article) => {
                    setArticle(article);
                  }}
                  className="editor"
                  toolbarConfig={toolbarConfig}
                  placeholder="Start typing your article content here..."
                />
                {pendingMakeBoardTag && (
                  <div 
                    style={{ 
                      marginTop: '1.5rem', 
                      padding: '1.5rem', 
                      backgroundColor: '#e8f5e9', 
                      borderRadius: '8px',
                      border: '2px solid #4caf50',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      zIndex: 1000,
                      position: 'relative'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      flexWrap: 'wrap', 
                      gap: '1rem' 
                    }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <strong style={{ fontSize: '1.4rem', color: '#2e7d32' }}>
                          ✓ MakeBoard tag ready!
                        </strong>
                        <div style={{ 
                          marginTop: '0.5rem', 
                          padding: '0.5rem', 
                          backgroundColor: '#f5f5f5', 
                          borderRadius: '4px',
                          fontSize: '1.2rem',
                          fontFamily: 'monospace',
                          wordBreak: 'break-all'
                        }}>
                          {pendingMakeBoardTag.substring(0, 100)}...
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <Button
                          waves="light"
                          style={{ 
                            backgroundColor: '#0F4C3A',
                            fontSize: '1.3rem',
                            padding: '0 2rem',
                            height: 'auto',
                            lineHeight: '3rem'
                          }}
                          onClick={() => {
                            // Store the MakeBoard tag separately instead of inserting into RichTextEditor
                            // This prevents RichTextEditor from stripping it
                            let makeBoardTag = pendingMakeBoardTag;
                            
                            // Ensure the tag is in the correct format (unescape if needed)
                            // RichTextEditor might escape < and >, so unescape them
                            makeBoardTag = makeBoardTag
                              .replace(/&lt;/g, '<')
                              .replace(/&gt;/g, '>')
                              .replace(/&amp;/g, '&');
                            
                            // Verify it's a valid MakeBoard tag
                            if (!makeBoardTag.match(/<MakeBoard[^>]*\/>/)) {
                              logger.error('Invalid MakeBoard tag format:', makeBoardTag);
                              M.toast({ 
                                html: 'Error: Invalid MakeBoard tag format',
                                classes: 'red',
                                displayLength: 3000
                              });
                              return;
                            }
                            
                            // Add to the stored tags array with unique ID
                            const newBoard = {
                              id: generateBoardId(),
                              tag: makeBoardTag,
                              position: makeBoardTags.length,
                            };
                            setMakeBoardTags([...makeBoardTags, newBoard]);
                            
                            setPendingMakeBoardTag(null);
                            logger.log('MakeBoard tag stored with ID:', newBoard.id);
                            
                            // Use Materialize toast
                            M.toast({ 
                              html: `Board added! You can see it below. It will be inserted at the end of your article when you save.`,
                              classes: 'green',
                              displayLength: 4000
                            });
                          }}
                        >
                          <Icon left>add</Icon>
                          Add to Article
                        </Button>
                        <Button
                          waves="light"
                          flat
                          style={{ 
                            fontSize: '1.2rem',
                            padding: '0 1.5rem',
                            height: 'auto',
                            lineHeight: '3rem'
                          }}
                          onClick={() => setPendingMakeBoardTag(null)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                    <div style={{ 
                      marginTop: '1rem', 
                      padding: '0.75rem', 
                      backgroundColor: '#fff3cd', 
                      borderRadius: '4px',
                      fontSize: '1.2rem',
                      color: '#856404'
                    }}>
                      💡 Click "Add to Article" to include this board. The board will be saved at the END of your article when you click "Edit Article" at the bottom.
                    </div>
                  </div>
                )}
                {/* Visual Board Manager - Shows all boards with preview */}
                <BoardManager
                  boards={makeBoardTags}
                  onDelete={(index) => {
                    const newBoards = makeBoardTags.filter((_, i) => i !== index);
                    setMakeBoardTags(newBoards);
                    M.toast({ 
                      html: 'Board removed',
                      classes: 'orange',
                      displayLength: 2000
                    });
                  }}
                  onMoveUp={(index) => {
                    if (index === 0) return;
                    const newBoards = [...makeBoardTags];
                    [newBoards[index - 1], newBoards[index]] = [newBoards[index], newBoards[index - 1]];
                    setMakeBoardTags(newBoards);
                  }}
                  onMoveDown={(index) => {
                    if (index === makeBoardTags.length - 1) return;
                    const newBoards = [...makeBoardTags];
                    [newBoards[index], newBoards[index + 1]] = [newBoards[index + 1], newBoards[index]];
                    setMakeBoardTags(newBoards);
                  }}
                />
              </>
            )}
            {edit && !articleLoaded && (
              <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                <p>Loading article content...</p>
              </div>
            )}
          </div>
        </Row>
        {!edit && (
          <Button
            className="CreateArticle-submit"
            onClick={(e) => submitArticle(e)}
            waves="light"
          >
            Submit Article
            <Icon left>done_all</Icon>
          </Button>
        )}
        {edit && (
          <>
            <Button
              className="CreateArticle-edit"
              onClick={(e) => submitEditArticle(e)}
              waves="light"
              style={{ paddingRight: "1rem", marginRight: "1rem" }}
            >
              Edit Article
              <Icon left>done_all</Icon>
            </Button>
            <Button
              waves="light"
              className="CreateArticle-backup"
              onClick={loadBackups}
              style={{ marginRight: "1rem" }}
              disabled={loadingBackups}
            >
              <Icon left>history</Icon>
              {loadingBackups ? "Loading..." : "View Backups"}
            </Button>
          </>
        )}

        {edit && (
          <Modal
            header="Confirm Deletion"
            trigger={
              <Button waves="light" className="CreateArticle-delete">
                Delete Article
                <Icon left> delete</Icon>
              </Button>
            }
          >
            <br />
            <p style={{ fontSize: "2rem", fontWeight: "bold" }}>
              Are you sure you want to delete?
            </p>
            <br />
            <br />
            <Button
              waves="light"
              className="CreateArticle-delete"
              onClick={(e) => submitDeleteArticle(e)}
            >
              Delete Article
              <Icon left> delete</Icon>
            </Button>
          </Modal>
        )}

        {edit && (
          <Modal
            header="Article Backups"
            trigger={
              <div style={{ display: "none" }} id="backup-modal-trigger"></div>
            }
            options={{
              onCloseEnd: () => setShowBackups(false),
            }}
            id="backup-modal"
          >
            <div style={{ padding: "1rem 0" }}>
              {backups.length === 0 ? (
                <p>No backups found for this article.</p>
              ) : (
                <>
                  <p style={{ marginBottom: "1.5rem", color: "#666" }}>
                    Select a backup to restore. This will replace the current article content.
                  </p>
                  <div style={{ maxHeight: "60vh", overflowY: "auto" }}>
                    {backups.map((backup) => (
                      <div
                        key={backup.id}
                        style={{
                          border: "1px solid #e0e0e0",
                          borderRadius: "4px",
                          padding: "1rem",
                          marginBottom: "1rem",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <div style={{ marginBottom: "0.5rem" }}>
                          <strong>Backed up:</strong> {formatBackupDate(backup.backedUpAt)}
                        </div>
                        {backup.title && (
                          <div style={{ marginBottom: "0.5rem", color: "#666" }}>
                            <strong>Title:</strong> {backup.title}
                          </div>
                        )}
                        <div style={{ marginBottom: "1rem", fontSize: "1.2rem", color: "#666" }}>
                          {backup.previousContent?.substring(0, 100)}...
                        </div>
                        <Button
                          waves="light"
                          small
                          onClick={() => handleRestoreBackup(backup.id)}
                          style={{ backgroundColor: "#0F4C3A" }}
                        >
                          <Icon left>restore</Icon>
                          Restore This Version
                        </Button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Modal>
        )}
      </form>
    </div>
  );
};

export default withRouter(CreateCategoryArticle);
