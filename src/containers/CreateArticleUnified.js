import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { Button, Icon, Row, TextInput, Select, Modal } from 'react-materialize';
import UnifiedArticleEditor, { blocksToHTML } from '../components/ArticleEditor/UnifiedArticleEditor';
import { startAddArticle, startEditArticle, getArticle } from '../store/actions/categoryArticlesActions';
import logger from '../utils/logger';
import './CreateArticleUnified.css';

/**
 * Modern Unified Article Creation/Editing Component
 * 
 * Replaces both CreateArticle and CreateCategoryArticle with a single,
 * modern, block-based editor that solves the MakeBoard tag issue.
 * 
 * Supports all article types: bidding, cardPlay, defence, articles
 */

const CreateArticleUnified = ({ articleType, bodyRef, create = false, edit = false }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const a = useSelector((state) => state.auth.a);
  const _article = useSelector((state) => state.categoryArticles?.article);
  
  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [difficulty, setDifficulty] = useState('');
  const [articleNumber, setArticleNumber] = useState('');
  const [teaser, setTeaser] = useState('');
  const [teaserBoard, setTeaserBoard] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [subcategory, setSubcategory] = useState('');
  
  // Editor state
  const [contentBlocks, setContentBlocks] = useState(null);
  const [articleLoaded, setArticleLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load article if editing
  useEffect(() => {
    if (edit && id && !articleLoaded) {
      setLoading(true);
      dispatch(getArticle(id, null, bodyRef)).then(() => {
        setLoading(false);
      });
    }
  }, [edit, id, bodyRef, dispatch, articleLoaded]);

  // Populate form when article loads
  useEffect(() => {
    if (edit && _article && !articleLoaded) {
      setTitle(_article.title || '');
      setCategory(_article.category || '');
      setDifficulty(_article.difficulty || '');
      setArticleNumber(_article.articleNumber || '');
      setTeaser(_article.teaser || '');
      setTeaserBoard(_article.teaser_board || '');
      setVideoUrl(_article.videoUrl || '');
      setSubcategory(_article.subcategory || '');
      
      // Load content - try new format first, fallback to old HTML
      const bodyText = _article[bodyRef]?.text || _article[bodyRef]?.body || '';
      if (bodyText) {
        // Check if it's already blocks (JSON)
        try {
          const parsed = JSON.parse(bodyText);
          if (Array.isArray(parsed) || (parsed.blocks && Array.isArray(parsed.blocks))) {
            setContentBlocks(Array.isArray(parsed) ? parsed : parsed.blocks);
          } else {
            // Old HTML format - editor will convert it
            setContentBlocks(bodyText);
          }
        } catch (e) {
          // Not JSON, treat as HTML
          setContentBlocks(bodyText);
        }
      } else {
        setContentBlocks(null);
      }
      
      setArticleLoaded(true);
    }
  }, [edit, _article, bodyRef, articleLoaded]);

  // Load categories
  useEffect(() => {
    if (a && articleType) {
      // Get categories from Firebase
      const categoriesRef = require('../firebase/config').categoriesRef;
      const unsubscribe = categoriesRef
        .where('articleType', '==', articleType)
        .onSnapshot((snapshot) => {
          const cats = [];
          snapshot.forEach((doc) => {
            cats.push(doc.data().category);
          });
          setCategories(['[Add New Category]', ...cats]);
        });
      
      return () => unsubscribe();
    }
  }, [a, articleType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!contentBlocks || contentBlocks.length === 0) {
      logger.error('No content to save');
      return;
    }

    setLoading(true);

    try {
      // Prepare article metadata
      const article = {
        articleType: articleType,
        title: title,
        category: category,
        difficulty: difficulty,
        articleNumber: articleNumber,
        teaser_board: teaserBoard,
        teaser: teaser,
        videoUrl: videoUrl,
      };

      if (subcategory) {
        article.subcategory = subcategory;
      }

      // Prepare content - store as blocks (JSON) for new format
      // Also generate HTML for backward compatibility
      const blocksJSON = JSON.stringify(contentBlocks);
      const htmlContent = blocksToHTML(contentBlocks);
      
      // Store both formats during migration period
      const articleBody = {
        blocks: blocksJSON, // New format
        text: htmlContent,   // Old format for backward compatibility
      };

      if (edit) {
        // Edit existing article
        article.id = _article.id;
        article.body = _article.body;
        await dispatch(startEditArticle(article, articleBody, articleType, bodyRef));
      } else {
        // Create new article
        await dispatch(startAddArticle(article, articleBody, articleType, bodyRef));
      }

      // Navigate back
      switch (articleType) {
        case 'defence':
          history.push('/defence');
          break;
        case 'cardPlay':
          history.push('/cardPlay');
          break;
        case 'bidding':
          history.push('/bidding');
          break;
        case 'articles':
          history.push('/articles');
          break;
        default:
          history.push('/');
      }
    } catch (error) {
      logger.error('Error saving article:', error);
      setLoading(false);
    }
  };

  if (loading && !articleLoaded) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <p>Loading article...</p>
      </div>
    );
  }

  return (
    <div className="CreateArticleUnified">
      <form onSubmit={handleSubmit}>
        <h3 style={{ paddingTop: '3rem', textAlign: 'center' }}>
          {edit ? 'Edit' : 'Create'} {articleType} Article
        </h3>

        <Row>
          <TextInput
            s={12}
            name="title"
            label="Article Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Row>

        <Row>
          <Select
            s={12}
            name="category"
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </Row>

        {category === '[Add New Category]' && (
          <Row>
            <TextInput
              s={12}
              name="newCategory"
              label="New Category Name"
              onChange={(e) => {
                // Add category to Firebase
                const categoriesRef = require('../firebase/config').categoriesRef;
                categoriesRef.add({
                  category: e.target.value,
                  articleType: articleType,
                });
                setCategory(e.target.value);
              }}
            />
          </Row>
        )}

        <Row>
          <TextInput
            s={12}
            name="teaser"
            label="Teaser (Short Description)"
            value={teaser}
            onChange={(e) => setTeaser(e.target.value)}
          />
        </Row>

        <Row>
          <TextInput
            s={12}
            name="videoUrl"
            label="YouTube Video URL (Optional)"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </Row>

        <Row>
          <div style={{ width: '100%', marginTop: '2rem' }}>
            <label style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '1rem', display: 'block' }}>
              Article Content
            </label>
            <UnifiedArticleEditor
              initialContent={contentBlocks}
              onChange={setContentBlocks}
              articleType={articleType}
            />
          </div>
        </Row>

        <Row style={{ marginTop: '2rem' }}>
          <Button
            type="submit"
            waves="light"
            className="CreateArticleUnified-submit"
            disabled={loading}
          >
            <Icon left>save</Icon>
            {loading ? 'Saving...' : edit ? 'Save Changes' : 'Create Article'}
          </Button>
        </Row>
      </form>
    </div>
  );
};

export default CreateArticleUnified;




