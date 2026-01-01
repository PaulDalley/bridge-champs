/**
 * Create/Edit Article Page - V2
 * Main page for creating and editing articles with the new system
 */

import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Row, Col, TextInput, Select, Button, Icon, Toast } from 'react-materialize';
import ArticleEditor from '../components/ArticleEditor/ArticleEditor';
import { getArticle, createArticle, updateArticle } from '../services/articleService';
import { migrateArticleBoards, extractMakeBoardTags } from '../utils/boardMigration';
import { ARTICLE_CATEGORIES } from '../config';
import './CreateArticleV2.css';

const CreateArticleV2 = ({ match, history }) => {
  const category = match?.params?.category;
  const id = match?.params?.id;
  const a = useSelector((state) => state.auth.a); // Use same variable name as old system
  const isEdit = !!id;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  
  // Article metadata
  const [title, setTitle] = useState('');
  const [teaser, setTeaser] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [hasVideo, setHasVideo] = useState(false);
  const [difficulty, setDifficulty] = useState('1');
  const [articleNumber, setArticleNumber] = useState('1');
  const [subcategory, setSubcategory] = useState('');
  const [categoryName, setCategoryName] = useState('');
  
  // Article content
  const [content, setContent] = useState('');
  // Store MakeBoard tags with their positions (placeholder -> tag mapping)
  const [makeBoardTags, setMakeBoardTags] = useState(new Map());
  
  // Debug: log makeBoardTags changes
  useEffect(() => {
    console.log('makeBoardTags updated:', makeBoardTags.size, Array.from(makeBoardTags.values()));
  }, [makeBoardTags]);

  // Auth check - same logic as old system
  useEffect(() => {
    if (a === false) {
      history.push(`/${category}`);
      return;
    }

    if (isEdit && id) {
      loadArticle();
    }
  }, [isEdit, id, category, a]);

  const loadArticle = async () => {
    console.log('=== LOAD ARTICLE START ===');
    console.log('id:', id);
    console.log('category:', category);
    
    try {
      setLoading(true);
      console.log('Loading state set to true');
      
      console.log('Calling getArticle...');
      const article = await getArticle(id, category);
      console.log('getArticle returned:', article);
      
      if (!article) {
        console.error('ERROR: Article is null or undefined');
        Toast({
          html: `Article not found. ID: ${id}`,
          classes: 'red',
          displayLength: 5000,
        });
        setTimeout(() => history.push(`/${category}`), 2000);
        return;
      }

      console.log('Setting metadata...');
      // Set metadata
      setTitle(article.title || '');
      setTeaser(article.teaser || '');
      setVideoUrl(article.videoUrl || '');
      setHasVideo(article.hasVideo === true);
      setDifficulty(String(article.difficulty || '1'));
      setArticleNumber(String(article.articleNumber || '1'));
      setSubcategory(article.subcategory || '');
      setCategoryName(article.category || '');
      console.log('Metadata set');

      // Load content and extract MakeBoard tags
      console.log('Loading content...');
      const bodyText = article.bodyContent?.text || '';
      console.log('bodyText length:', bodyText.length);
      console.log('bodyText preview:', bodyText.substring(0, 200));
      
      if (bodyText) {
        try {
          // Extract MakeBoard tags from loaded content and replace with placeholders
          console.log('Extracting MakeBoard tags...');
          const tags = extractMakeBoardTags(bodyText);
          console.log('Extracted tags:', tags.length, tags);
          
          // Create a map of placeholder ID -> tag for inline insertion
          const tagsMap = new Map();
          let contentWithPlaceholders = bodyText;
          
          // Replace each MakeBoard tag with a unique placeholder, working backwards to preserve indices
          for (let i = tags.length - 1; i >= 0; i--) {
            const tagInfo = tags[i];
            // Generate unique ID for this placeholder
            const placeholderId = `board_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`;
            // Embed ID directly in placeholder text for robustness
            const placeholder = `<p>[BRIDGE_BOARD:${placeholderId}]</p>`;
            // Replace from the end to preserve earlier indices
            const beforeTag = contentWithPlaceholders.substring(0, tagInfo.index);
            const afterTag = contentWithPlaceholders.substring(tagInfo.index + tagInfo.tag.length);
            contentWithPlaceholders = beforeTag + placeholder + afterTag;
            tagsMap.set(placeholderId, tagInfo.tag);
          }
          
          setMakeBoardTags(tagsMap);
          console.log('makeBoardTags set:', tagsMap.size);
          
          // Clean up any old placeholder text (legacy formats)
          contentWithPlaceholders = contentWithPlaceholders
            .replace(/\[Bridge board added\]/g, '')
            .replace(/<p>\[Bridge board added\]<\/p>/gi, '')
            // Remove old format placeholders that don't have embedded IDs
            .replace(/<p>\[Bridge Board\]<\/p>/gi, '')
            .trim();
          
          setContent(contentWithPlaceholders);
          console.log('Content set with placeholders, length:', contentWithPlaceholders.length);
        } catch (extractError) {
          console.error('=== EXTRACT TAGS ERROR ===');
          console.error('Error:', extractError);
          console.error('Stack:', extractError.stack);
          setContent(bodyText);
          setMakeBoardTags([]);
        }
      } else {
        console.warn('No body text found');
        setContent('');
        setMakeBoardTags([]);
      }
      
      console.log('=== LOAD ARTICLE SUCCESS ===');
    } catch (error) {
      console.error('=== LOAD ARTICLE ERROR ===');
      console.error('Error type:', error?.constructor?.name || typeof error);
      console.error('Error message:', error?.message || String(error));
      console.error('Error stack:', error?.stack);
      console.error('Error name:', error?.name);
      console.error('Full error object:', error);
      console.error('Error keys:', error ? Object.keys(error) : 'error is null/undefined');
      
      Toast({
        html: `Error: ${error?.message || 'Unknown error'}`,
        classes: 'red',
        displayLength: 10000,
      });
    } finally {
      console.log('Setting loading state to false');
      setLoading(false);
      console.log('=== LOAD ARTICLE END ===');
    }
  };

  const handleSave = async () => {
    console.log('=== HANDLE SAVE START ===');
    
    if (!title.trim()) {
      console.warn('Save failed: No title');
      Toast({
        html: 'Please enter a title',
        classes: 'orange',
      });
      return;
    }

    try {
      setSaving(true);
      console.log('Saving state set to true');

      // Replace placeholders with MakeBoard tags in content
      console.log('=== SAVE DEBUG ===');
      console.log('content length:', content.length);
      console.log('makeBoardTags count:', makeBoardTags.size);
      
      // Remove old placeholder text
      let finalContent = content
        .replace(/\[Bridge board added\]/g, '')
        .replace(/<p>\[Bridge board added\]<\/p>/gi, '')
        .trim();
      
      // Replace [BRIDGE_BOARD:unique_id] placeholders with actual MakeBoard tags
      // Format: <p>[BRIDGE_BOARD:board_12345]</p>
      const placeholderRegex = /<p>\[BRIDGE_BOARD:([^\]]+)\]<\/p>/gi;
      let replacedCount = 0;
      const usedIds = new Set(); // Track which IDs we've used to prevent duplicates
      
      finalContent = finalContent.replace(placeholderRegex, (match, placeholderId) => {
        // Skip if we've already used this ID (prevents duplicate replacements)
        if (usedIds.has(placeholderId)) {
          console.warn(`Duplicate placeholder ID detected: ${placeholderId}, skipping`);
          return ''; // Remove duplicate
        }
        
        // Find the board tag for this specific placeholder ID
        const boardTag = makeBoardTags.get(placeholderId);
        if (boardTag) {
          console.log(`Replacing placeholder ${placeholderId} with board tag`);
          usedIds.add(placeholderId);
          replacedCount++;
          return boardTag; // Replace with actual MakeBoard tag
        }
        console.warn(`No board tag found for placeholder ID: ${placeholderId}`);
        return ''; // Remove placeholder if no matching board
      });
      
      // Also handle legacy format placeholders (for backward compatibility)
      // Only do this if we haven't replaced all boards yet
      if (replacedCount < makeBoardTags.size) {
        const legacyPlaceholderRegex = /<p[^>]*data-board-id="([^"]+)"[^>]*>\[Bridge Board\]<\/p>/gi;
        finalContent = finalContent.replace(legacyPlaceholderRegex, (match, placeholderId) => {
          if (usedIds.has(placeholderId)) {
            return '';
          }
          const boardTag = makeBoardTags.get(placeholderId);
          if (boardTag) {
            usedIds.add(placeholderId);
            replacedCount++;
            return boardTag;
          }
          return '';
        });
      }
      
      // CRITICAL: Remove any remaining placeholder text that wasn't replaced
      // This ensures placeholders don't appear in saved content
      finalContent = finalContent
        .replace(/<p>\[BRIDGE_BOARD:[^\]]+\]<\/p>/gi, '') // Remove any remaining new format placeholders
        .replace(/<p[^>]*>\[Bridge Board\]<\/p>/gi, '') // Remove any remaining old format placeholders
        .replace(/\[BRIDGE_BOARD:[^\]]+\]/g, '') // Remove any loose new format placeholder text
        .replace(/\[Bridge Board\]/g, ''); // Remove any loose old format placeholder text
      
      // Verify all boards are in the content
      const finalTagCount = (finalContent.match(/<MakeBoard[^>]*\/>/g) || []).length;
      console.log(`Final content has ${finalTagCount} MakeBoard tag(s), expected ${makeBoardTags.size}`);
      
      if (makeBoardTags.size > finalTagCount) {
        console.error(`ERROR: ${makeBoardTags.size - finalTagCount} board(s) were lost during save!`);
      }
      
      // Verify tags are in finalContent
      const tagCount = (finalContent.match(/<MakeBoard[^>]*\/>/g) || []).length;
      console.log('VERIFICATION: MakeBoard tags in finalContent:', tagCount, 'Expected:', makeBoardTags.size);
      
      console.log('finalContent length:', finalContent.length);
      console.log('finalContent ends with:', finalContent.slice(-500));

      const articleData = {
        title: title.trim(),
        teaser: teaser.trim(),
        videoUrl: videoUrl.trim(),
        hasVideo: hasVideo,
        difficulty,
        articleNumber,
        category: categoryName || category,
        ...(subcategory && { subcategory }),
      };
      
      console.log('Article data:', articleData);
      console.log('isEdit:', isEdit);
      console.log('id:', id);
      console.log('category:', category);

      if (isEdit) {
        console.log('=== EDIT MODE ===');
        try {
          // For edit, we need the summary ID, not the body ID
          // If id is a body ID, we need to find the summary first
          console.log('Fetching article to get summary ID...');
          const article = await getArticle(id, category);
          console.log('Article fetched:', article);
          
          if (!article) {
            console.error('ERROR: Article is null');
            throw new Error('Article not found');
          }
          
          if (!article.id) {
            console.error('ERROR: Article.id is missing. Article:', article);
            throw new Error('Could not find article summary ID');
          }
          
          const summaryId = article.id;
          console.log('Summary ID:', summaryId);
          console.log('Calling updateArticle...');
          
          await updateArticle(summaryId, articleData, finalContent, category);
          console.log('updateArticle completed successfully');
          
          Toast({
            html: 'Article updated successfully!',
            classes: 'green',
          });
        } catch (editError) {
          console.error('=== EDIT ERROR ===');
          console.error('Error type:', editError.constructor.name);
          console.error('Error message:', editError.message);
          console.error('Error stack:', editError.stack);
          console.error('Full error object:', editError);
          throw editError;
        }
      } else {
        console.log('=== CREATE MODE ===');
        try {
          console.log('Calling createArticle...');
          const { summaryId } = await createArticle(articleData, finalContent, category);
          console.log('createArticle completed. Summary ID:', summaryId);
          
          Toast({
            html: 'Article created successfully!',
            classes: 'green',
          });
          history.push(`/edit-article-v2/${category}/${summaryId}`);
        } catch (createError) {
          console.error('=== CREATE ERROR ===');
          console.error('Error type:', createError.constructor.name);
          console.error('Error message:', createError.message);
          console.error('Error stack:', createError.stack);
          console.error('Full error object:', createError);
          throw createError;
        }
      }
      
      console.log('=== HANDLE SAVE SUCCESS ===');
    } catch (error) {
      console.error('=== HANDLE SAVE ERROR ===');
      console.error('Error type:', error?.constructor?.name || typeof error);
      console.error('Error message:', error?.message || String(error));
      console.error('Error stack:', error?.stack);
      console.error('Error name:', error?.name);
      console.error('Full error object:', error);
      console.error('Error keys:', error ? Object.keys(error) : 'error is null/undefined');
      
      Toast({
        html: `Error saving article: ${error?.message || 'Unknown error'}`,
        classes: 'red',
        displayLength: 10000,
      });
    } finally {
      console.log('Setting saving state to false');
      setSaving(false);
      console.log('=== HANDLE SAVE END ===');
    }
  };

  if (loading) {
    return (
      <div className="CreateArticleV2-loading">
        <p>Loading article... (ID: {id}, Category: {category})</p>
      </div>
    );
  }
  
  // Show error if no article loaded in edit mode
  if (isEdit && !loading && !title) {
    return (
      <div className="CreateArticleV2-loading">
        <p style={{ color: 'red', fontSize: '1.5rem' }}>
          Article not loaded.
          <br />
          <strong>ID:</strong> {id}
          <br />
          <strong>Category:</strong> {category}
          <br />
          <br />
          Check browser console (F12) for detailed error messages.
          <br />
          <br />
          <Button onClick={() => {
            setLoading(true);
            loadArticle();
          }} style={{ marginTop: '1rem' }}>
            Retry Loading
          </Button>
          <Button 
            flat 
            onClick={() => history.push(`/${category}`)}
            style={{ marginTop: '1rem', marginLeft: '1rem' }}
          >
            Go Back
          </Button>
        </p>
      </div>
    );
  }

  const categoryInfo = ARTICLE_CATEGORIES[category] || { name: category };

  return (
    <div className="CreateArticleV2">
      <div className="CreateArticleV2-header">
        <h2>{isEdit ? 'Edit' : 'Create'} {categoryInfo.name} Article</h2>
        {isEdit && <p style={{ fontSize: '1.2rem', color: '#666' }}>V2 System - Article ID: {id}</p>}
      </div>

      <div className="CreateArticleV2-content">
        {/* Metadata Form */}
        <Row>
          <Col s={12}>
            <TextInput
              label="Article Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Col>
        </Row>

        <Row>
          <Col s={12} m={6}>
            <TextInput
              label="Teaser/Introduction"
              value={teaser}
              onChange={(e) => setTeaser(e.target.value)}
              multiline
            />
          </Col>
          <Col s={12} m={6}>
            <TextInput
              label="Video URL (YouTube)"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </Col>
        </Row>

        <Row>
          <Col s={12}>
            <div style={{ 
              marginTop: '1.5rem', 
              marginBottom: '1rem',
              padding: '1rem',
              backgroundColor: '#f5f5f5',
              borderRadius: '4px',
              border: '1px solid #ddd'
            }}>
              <label 
                htmlFor="hasVideoCheckbox"
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
                  id="hasVideoCheckbox"
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
          </Col>
        </Row>

        <Row>
          <Col s={6} m={3}>
            <Select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              label="Difficulty"
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </Select>
          </Col>
          <Col s={6} m={3}>
            <TextInput
              label="Article Number"
              value={articleNumber}
              onChange={(e) => setArticleNumber(e.target.value)}
            />
          </Col>
          <Col s={12} m={6}>
            <TextInput
              label="Subcategory (optional)"
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
            />
          </Col>
        </Row>

               {/* Article Editor */}
               <Row>
                 <Col s={12}>
                   <div className="CreateArticleV2-editor">
                     {makeBoardTags.size > 0 && (
                       <div style={{ 
                         padding: '1rem', 
                         backgroundColor: '#e8f5e9', 
                         border: '1px solid #4caf50', 
                         borderRadius: '4px',
                         marginBottom: '1rem'
                       }}>
                         <strong>Boards added ({makeBoardTags.size}):</strong> Boards are inserted at cursor position.
                       </div>
                     )}
                     <ArticleEditor
                       content={content}
                       onChange={setContent}
                    onBoardAdded={(makeBoardTag, placeholderId) => {
                      console.log('=== onBoardAdded CALLED ===');
                      console.log('Received makeBoardTag:', makeBoardTag);
                      console.log('Placeholder ID:', placeholderId);
                      
                      if (!makeBoardTag || typeof makeBoardTag !== 'string') {
                        console.error('ERROR: Invalid makeBoardTag:', makeBoardTag);
                        Toast({
                          html: 'Error: Invalid board tag',
                          classes: 'red',
                        });
                        return;
                      }
                      
                      setMakeBoardTags(prev => {
                        const updated = new Map(prev);
                        const id = placeholderId || `board_${Date.now()}`;
                        updated.set(id, makeBoardTag);
                        console.log('Updated makeBoardTags:', updated.size, 'tags');
                        Toast({
                          html: `Board added! (${updated.size} total)`,
                          classes: 'green',
                        });
                        return updated;
                      });
                    }}
                       placeholder="Start writing your article content here. Click 'Add Board' to insert bridge boards inline."
                     />
                   </div>
                 </Col>
               </Row>

        {/* Actions */}
        <Row>
          <Col s={12}>
            <div className="CreateArticleV2-actions">
              <Button
                waves="light"
                onClick={handleSave}
                disabled={saving}
                style={{ backgroundColor: '#0F4C3A', marginRight: '1rem' }}
              >
                <Icon left>{isEdit ? 'save' : 'add'}</Icon>
                {saving ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}
              </Button>
              <Button
                waves="light"
                flat
                onClick={() => history.push(`/${category}`)}
              >
                Cancel
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default withRouter(CreateArticleV2);

