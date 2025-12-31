import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import ArticleEditor from '../ArticleEditor/ArticleEditor';
import { convertOldHTMLToEditorFormat, convertEditorHTMLToContent } from '../../utils/contentMigration';
import { getArticleMetadata, getArticleBody, saveArticle, createBackup } from '../../services/articleService';
import './CreateArticleModern.css';

/**
 * Modern Article Creation/Editing Component
 * 
 * Unified interface for all article types
 * Uses modern editor with MakeBoard support
 */
const CreateArticleModern = ({ articleType = 'cardPlay' }) => {
  const history = useHistory();
  const { id } = useParams();
  const isEdit = !!id;

  // Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [teaser, setTeaser] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [articleNumber, setArticleNumber] = useState('');

  // Editor state
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Load article if editing
  useEffect(() => {
    if (isEdit && id) {
      loadArticle();
    }
  }, [isEdit, id]);

  const loadArticle = async () => {
    setLoading(true);
    try {
      const metadata = await getArticleMetadata(id, articleType);
      if (metadata) {
        setTitle(metadata.title || '');
        setCategory(metadata.category || '');
        setTeaser(metadata.teaser || '');
        setVideoUrl(metadata.videoUrl || '');
        setDifficulty(metadata.difficulty || '');
        setArticleNumber(metadata.articleNumber || '');

        // Load body
        if (metadata.body) {
          const body = await getArticleBody(metadata.body, articleType);
          if (body) {
            // Convert old format to editor format
            const bodyText = body.text || body.body || '';
            const editorHtml = convertOldHTMLToEditorFormat(bodyText);
            setEditorContent(editorHtml);
          }
        }
      }
    } catch (error) {
      console.error('Error loading article:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Convert editor content to article format
      const content = convertEditorHTMLToContent(editorContent);

      // Prepare article metadata
      const article = {
        articleType,
        title,
        category,
        teaser,
        videoUrl,
        difficulty,
        articleNumber,
      };

      // Prepare article body
      // Store in both formats for compatibility
      const articleBody = {
        blocks: JSON.stringify(content.blocks), // New format
        text: editorContent, // HTML format for backward compatibility
        version: 2,
      };

      // Create backup if editing
      if (isEdit) {
        const metadata = await getArticleMetadata(id, articleType);
        if (metadata && metadata.body) {
          const currentBody = await getArticleBody(metadata.body, articleType);
          if (currentBody) {
            await createBackup(metadata.body, articleType, currentBody.text || currentBody.body);
          }
        }
      }

      // Save article
      await saveArticle(article, articleBody, articleType, isEdit);

      // Navigate back
      const routeMap = {
        bidding: '/bidding',
        cardPlay: '/cardPlay',
        defence: '/defence',
        articles: '/articles',
      };
      history.push(routeMap[articleType] || '/');
    } catch (error) {
      console.error('Error saving article:', error);
      alert('Error saving article. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading article...</div>
      </div>
    );
  }

  return (
    <div className="create-article-modern max-w-5xl mx-auto p-6">
      <form onSubmit={handleSave}>
        <h2 className="text-3xl font-bold mb-6">
          {isEdit ? 'Edit' : 'Create'} {articleType} Article
        </h2>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Teaser */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Teaser
          </label>
          <textarea
            value={teaser}
            onChange={(e) => setTeaser(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Video URL */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            YouTube Video URL
          </label>
          <input
            type="url"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Editor */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Article Content *
          </label>
          <ArticleEditor
            content={editorContent}
            onChange={setEditorContent}
            placeholder="Start writing your article..."
            onInsertMakeBoard={(board) => {
              console.log('MakeBoard inserted:', board);
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => history.goBack()}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-secondary disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateArticleModern;

