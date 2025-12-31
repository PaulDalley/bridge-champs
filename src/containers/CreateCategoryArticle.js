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
import { categoriesRef, biddingSummaryRef, cardPlaySummaryRef, defenceSummaryRef } from "../firebase/config";
import "./CreateArticle.css";
import $ from "jquery";


import GenerateBridgeBoard from "../components/BridgeBoard/GenerateBridgeBoard";

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
  const [makeBoardTags, setMakeBoardTags] = useState([]); // Store MakeBoard tags separately
  const [pendingMakeBoardTag, setPendingMakeBoardTag] = useState(null); // Tag waiting to be inserted
  
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

  // Fetch article metadata when editing
  useEffect(() => {
    const currentArticleId = match?.params?.id;
    if (edit && currentArticleId && articleType) {
      // Reset article loaded state when starting a new edit
      setArticleLoaded(false);
      // The articleId in the URL is the body document ID, not the summary document ID
      // We need to query the summary collection to find the document where body == articleId
      const refMap = { bidding: biddingSummaryRef, cardPlay: cardPlaySummaryRef, defence: defenceSummaryRef };
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
      history.push('/' + articleType);
      return;
    }

    if (!creating && !create && !edit) {
      history.push('/' + articleType);
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
        // Preserve MakeBoard tags when loading into RichTextEditor
        // Extract MakeBoard tags and replace with placeholders
        const makeBoardPlaceholders = [];
        const makeBoardRegex = /<MakeBoard[^>]*\/>/g;
        let placeholderIndex = 0;
        let processedBody = _articleBody.replace(makeBoardRegex, (match) => {
          const placeholder = `__MAKEBOARD_PLACEHOLDER_${placeholderIndex}__`;
          makeBoardPlaceholders.push(match);
          placeholderIndex++;
          return placeholder;
        });
        
        // Convert HTML string to RichTextEditor value
        try {
          const editorValue = RichTextEditor.createValueFromString(processedBody, 'html');
          // Restore MakeBoard tags after RichTextEditor processes it
          let editorHtml = editorValue.toString('html');
          makeBoardPlaceholders.forEach((makeBoardTag, idx) => {
            const placeholder = `__MAKEBOARD_PLACEHOLDER_${idx}__`;
            editorHtml = editorHtml.replace(placeholder, makeBoardTag);
          });
          // Recreate editor value with restored MakeBoard tags
          const finalEditorValue = RichTextEditor.createValueFromString(editorHtml, 'html');
          setArticle(finalEditorValue);
        } catch (e) {
          logger.error('Error converting article to RichTextEditor value:', e);
          // Fallback: create empty and set as string (will be handled in submit)
          setArticle(_articleBody);
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
    };

    if (subcategory !== "") {
      _article["subcategory"] = subcategory;
    }

    let articleText = prepareArticleString(article.toString("html"));
    let articleBody = { text: articleText };

    dispatch(
      startAddArticle(_article, articleBody, useArticleType, useBodyRef)
    );

    switch (articleType) {
      case "defence":
        history.push("/defence");
        break;
      case "cardPlay":
        history.push("/cardPlay");
        break;
      case "bidding":
        history.push("/bidding");
        break;
    }
  };

  const submitEditArticle = (e) => {
    e.preventDefault();
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
    };

    if (subcategory !== "") {
      _article["subcategory"] = subcategory;
    }

    // Convert RichTextEditor value to HTML string
    let rawHtml = typeof article === 'string' 
      ? article
      : article.toString("html");
    
    // Check if MakeBoard tags are present in raw HTML
    const makeBoardRegex = /<MakeBoard[^>]*\/>/g;
    const foundMakeBoardTags = rawHtml.match(makeBoardRegex) || [];
    
    // Extract MakeBoard tags and replace with placeholders before processing
    const makeBoardPlaceholders = [];
    let placeholderIndex = 0;
    let processedHtml = rawHtml.replace(makeBoardRegex, (match) => {
      const placeholder = `__MAKEBOARD_PLACEHOLDER_${placeholderIndex}__`;
      makeBoardPlaceholders.push(match);
      placeholderIndex++;
      return placeholder;
    });
    
    // Now process the article string (unescape, handle suits, etc.)
    let articleText = prepareArticleString(processedHtml);
    
    // Restore MakeBoard tags after processing - use the original tags, not processed ones
    makeBoardPlaceholders.forEach((makeBoardTag, idx) => {
      const placeholder = `__MAKEBOARD_PLACEHOLDER_${idx}__`;
      // Replace placeholder with the original MakeBoard tag
      articleText = articleText.replace(placeholder, makeBoardTag);
    });
    
    // Final check - if MakeBoard tags are still missing, try to restore from stored tags
    if (!articleText.includes("MakeBoard") && makeBoardTags.length > 0) {
      logger.warn("MakeBoard tags were lost during processing, attempting to restore from stored tags");
      // This shouldn't happen if insertion worked, but as a fallback
    }
    
    let articleBody = { text: articleText };
    
    // Log for debugging
    if (articleText.includes("MakeBoard")) {
      logger.log(`MakeBoard tag found in final article text - will be saved. Found ${(articleText.match(/<MakeBoard[^>]*\/>/g) || []).length} tag(s)`);
    } else {
      logger.warn("MakeBoard tag NOT found in final article text - may have been lost");
      if (foundMakeBoardTags.length > 0) {
        logger.warn(`Found ${foundMakeBoardTags.length} MakeBoard tag(s) in raw HTML but lost during processing`);
      }
    }
    
    dispatch(startEditArticle(_article, articleBody, articleType, bodyRef));

    switch (articleType) {
      case "defence":
        history.push("/defence");
        break;
      case "cardPlay":
        history.push("/cardPlay");
        break;
      case "bidding":
        history.push("/bidding");
        break;
    }
  };

  const submitDeleteArticle = (e) => {
    e.preventDefault();
    let modal = $(".modal");
    let modalOverlay = $(".modal-overlay");
    modal.removeClass("open");
    modal.removeAttr("style");
    modalOverlay.remove();
    $("body").css({ overflow: "auto" });
    dispatch(startDeleteArticle(articleId, body, articleType, bodyRef));
    history.push('/' + articleType);
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
                      setPendingMakeBoardTag(makeBoardTag);
                      // Close modal after a short delay
                      setTimeout(() => {
                        const modalElement = document.getElementById('board-creator-modal');
                        if (modalElement) {
                          const instance = window.M?.Modal?.getInstance(modalElement);
                          if (instance) {
                            instance.close();
                          }
                        }
                        $("body").css({ overflow: "auto" });
                      }, 500);
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
                  <div style={{ 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    backgroundColor: '#e8f5e9', 
                    borderRadius: '4px',
                    border: '1px solid #4caf50'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <strong>MakeBoard tag ready to insert:</strong>
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
                          small
                          style={{ backgroundColor: '#0F4C3A' }}
                          onClick={() => {
                            // Insert at cursor position or end
                            const currentHtml = typeof article === 'string' 
                              ? article 
                              : article.toString('html');
                            const makeBoardTag = pendingMakeBoardTag;
                            
                            // Insert the tag (at end for now, could be improved to insert at cursor)
                            const newHtml = currentHtml + '\n\n' + makeBoardTag + '\n\n';
                            const newEditorValue = RichTextEditor.createValueFromString(newHtml, 'html');
                            setArticle(newEditorValue);
                            setPendingMakeBoardTag(null);
                            setMakeBoardTags([...makeBoardTags, makeBoardTag]);
                            Toast({
                              html: 'MakeBoard tag inserted into article',
                              classes: 'green',
                            });
                          }}
                        >
                          <Icon left>add</Icon>
                          Insert
                        </Button>
                        <Button
                          waves="light"
                          small
                          flat
                          onClick={() => setPendingMakeBoardTag(null)}
                        >
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
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
