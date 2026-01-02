import React, { Component } from "react";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  getArticle,
  getArticleMetadata,
} from "../../store/actions/categoryArticlesActions";
import "./DisplayArticle.css";
import "./ArticleListItem.css";
import logger from "../../utils/logger";

import {
  parseDocumentIntoJSX,
  makeDateString,
  findArticleById,
  makeBoardObjectFromString,
  getDifficultyStr,
  hasVideosInContent,
} from "../../helpers/helpers";
import MakeBoard from "../../components/BridgeBoard/MakeBoard";
import { Col, ProgressBar } from "react-materialize";
import Comments from "../Comments/Comments";
import FeedbackForm from "./FeedbackForm";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import SkeletonLoader from "../UI/SkeletonLoader";

// Helper function to render admin edit button
const renderAdminEditButton = (isAdmin, articleType, articleId, history) => {
  if (!isAdmin) return null;
  
  return (
    <div style={{ 
      display: 'flex', 
      gap: '0.5rem', 
      flexWrap: 'wrap', 
      marginTop: '1rem',
      position: 'relative',
      zIndex: 10
    }}>
      <button
        className="DisplayArticle-edit-btn"
        onClick={() => history.push('/edit/' + articleType + '/' + articleId)}
        aria-label={`Edit ${articleType} article`}
        title="Edit this article (Old System)"
        style={{ position: 'relative', right: 'auto', top: 'auto' }}
      >
        Edit Article (Old)
      </button>
      <button
        className="DisplayArticle-edit-btn"
        onClick={() => history.push('/edit-article-v2/' + articleType + '/' + articleId)}
        aria-label={`Edit ${articleType} article`}
        title="Edit this article (New V2 System)"
        style={{ 
          backgroundColor: '#0F4C3A',
          position: 'relative',
          right: 'auto',
          top: 'auto'
        }}
      >
        Edit Article (V2)
      </button>
    </div>
  );
};

// Helper function to render video section with premium paywall
const renderVideoSection = (videoUrl, tier, history) => {
  if (!videoUrl) return null;

  const isPremium = tier === 'premium';
  
  if (isPremium) {
    // Extract video ID from YouTube URL
    let videoId = '';
    try {
      const url = new URL(videoUrl);
      if (url.hostname.includes('youtube.com')) {
        videoId = url.searchParams.get('v');
      } else if (url.hostname.includes('youtu.be')) {
        videoId = url.pathname.slice(1);
      }
    } catch (e) {
      logger.error('Invalid video URL:', e);
      return null;
    }

    if (!videoId) return null;

    return (
      <div className="Article-video-container" role="region" aria-label="Video content">
        <iframe
          className="Article-video-player"
          src={'https://www.youtube.com/embed/' + videoId}
          title="Article video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          aria-label="YouTube video player"
        />
        <div className="Article-video-error" style={{ display: 'none', padding: '1rem', backgroundColor: '#fff3cd', border: '1px solid #ffc107', borderRadius: '4px', marginTop: '0.5rem' }}>
          <p style={{ margin: 0, color: '#856404' }}>
            <strong>⚠️ Video unavailable:</strong> This video may be set to Private. 
            Please change the video privacy setting to "Unlisted" in YouTube Studio for it to be viewable here.
          </p>
        </div>
      </div>
    );
  } else {
    // Non-premium users see paywall
    return (
      <div className="Article-video-container">
        <div className="Article-video-paywall">
          <div className="Article-video-blur">
            <div className="Article-video-lock-icon">🔒</div>
          </div>
          <div className="Article-video-paywall-content">
            <h3>Premium Content</h3>
            <p>Upgrade to Premium to watch this video</p>
            <button
              className="Article-video-upgrade-btn"
              onClick={() => history.push('/membership')}
              aria-label="Upgrade to premium membership to watch this video"
            >
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    );
  }
};

// export default connect(
//     (state) => ({
//       uid: state.auth.uid,
//       username: state.auth.username,
//       displayName: state.auth.displayName,
//       photoURL: state.auth.photoURL,
//       articles: state.articles.articles,
//       article: state.articles.article,
//       articleMetadata: state.articles.currentArticle,
//     }),
//     { getArticle, getArticleMetadata }
//   )(DisplayArticle);

const DisplayCategoryArticle = ({
  location,
  history,
  articleType,
  bodyRef,
  match,
  articleNumber,
  difficulty,
}) => {
  const uid = useSelector((state) => state.auth.uid);
  const username = useSelector((state) => state.auth.username);
  const displayName = useSelector((state) => state.auth.displayName);
  const photoURL = useSelector((state) => state.auth.photoURL);
  const a = useSelector((state) => state.auth.a);
  const tier = useSelector((state) => state.auth.tier);
  const articles = useSelector(
    (state) => state.categoryArticles?.[articleType]
  );
  const article = useSelector((state) => state.categoryArticles?.article);
  const articleMetadata = useSelector(
    (state) => state.categoryArticles?.currentArticle
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const articleId = match.params.id;
    dispatch(getArticle(articleId, history, bodyRef));
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, []);

  const articleId = match.params.id;
  let articleText = '';

  if (article && articleId) {
    try {
      // article[articleId] is the body document, which has 'text' or 'body' field
      const bodyDoc = article?.[articleId];
      if (bodyDoc) {
        // Handle different possible structures
        if (typeof bodyDoc === 'string') {
          articleText = bodyDoc;
        } else if (bodyDoc.text) {
          articleText = typeof bodyDoc.text === 'string' ? bodyDoc.text : String(bodyDoc.text || '');
        } else if (bodyDoc.body) {
          if (typeof bodyDoc.body === 'string') {
            articleText = bodyDoc.body;
          } else if (bodyDoc.body?.text) {
            articleText = typeof bodyDoc.body.text === 'string' ? bodyDoc.body.text : String(bodyDoc.body.text || '');
          } else {
            articleText = '';
          }
        } else {
          articleText = '';
        }
      } else {
        articleText = '';
      }
    } catch (error) {
      console.error('Error extracting article text:', error);
      articleText = '';
    }
  }
  
  // Ensure articleText is always a string
  if (typeof articleText !== 'string') {
    console.warn('articleText is not a string, converting:', typeof articleText, articleText);
    articleText = String(articleText || '');
  }

  let useMetaData = undefined;

  if (articleMetadata !== undefined) {
    useMetaData = articleMetadata;
  } else {
    useMetaData = findArticleById(articles, articleId);
  }
  if (!useMetaData) {
    dispatch(getArticleMetadata(articleId, articleType));
  }

  let articleDataArray = [];
  const hasVideos = articleText ? hasVideosInContent(articleText) : false;
  const isPremium = tier === 'premium';

  if (articleText) {
    articleDataArray = parseDocumentIntoJSX(articleText, false, undefined, undefined, tier, history);
  }

  // console.log(
  //   `--- Trying to display article with id: ${articleId} and bodyRef: ${bodyRef} ---`
  // );
  // console.log(articles);
  // console.log(article);
  // console.log(articleText);
  // console.log("-- metadata generated in component --");
  // console.log(useMetaData);
  // console.log("--- metadata from store.categoryArticles.currentArticle ---");
  // console.log(articleMetadata);
  // console.log(useMetaData);

  // console.log(articleDataArray);
  // console.log("--- DIFFICULTY AND ARTICLE LEVEL INFORMATION ---");
  // console.log(articleMetadata?.articleNumber);
  // console.log(articleMetadata?.difficulty);

  if (!article) {
    return (
      <div className="DisplayArticle-container">
        <SkeletonLoader type="article" />
      </div>
    );
  }

  // Generate SEO meta tags
  const getArticleTitle = () => {
    if (useMetaData?.title) {
      return `${useMetaData.title} - Bridge Champions`;
    }
    return "Bridge Champions - Expert Bridge Insights";
  };

  const getArticleDescription = () => {
    if (useMetaData?.teaser) {
      return useMetaData.teaser;
    }
    if (useMetaData?.title) {
      return `Learn about ${useMetaData.title} from expert Bridge Champions. Improve your game with world-class insights and strategies.`;
    }
    return "Learn Bridge or improve your mastery with daily access into the minds, insights and recent play of some of the most knowledgeable Bridge Champions and expert players around.";
  };

  const getArticleUrl = () => {
    const baseUrl = "https://bridgechampions.com";
    return `${baseUrl}/${articleType}/${articleId}`;
  };

  const getCategoryName = () => {
    const categoryMap = {
      cardPlay: "Declarer Play",
      defence: "Defence",
      bidding: "Bidding"
    };
    return categoryMap[articleType] || articleType;
  };

  return (
    <>
      {useMetaData && (
        <Helmet>
          <title>{getArticleTitle()}</title>
          <meta name="description" content={getArticleDescription()} />
          <link rel="canonical" href={getArticleUrl()} />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="article" />
          <meta property="og:url" content={getArticleUrl()} />
          <meta property="og:title" content={useMetaData.title || "Bridge Champions"} />
          <meta property="og:description" content={getArticleDescription()} />
          <meta property="og:site_name" content="Bridge Champions" />
          {useMetaData.videoUrl && (
            <meta property="og:video" content={useMetaData.videoUrl} />
          )}
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={getArticleUrl()} />
          <meta name="twitter:title" content={useMetaData.title || "Bridge Champions"} />
          <meta name="twitter:description" content={getArticleDescription()} />
          
          {/* Article specific meta */}
          <meta property="article:section" content={getCategoryName()} />
          {useMetaData.difficulty && (
            <meta property="article:tag" content={`Level ${useMetaData.difficulty}`} />
          )}
          {useMetaData.createdAt && (
            <meta property="article:published_time" content={
              useMetaData.createdAt.toDate 
                ? useMetaData.createdAt.toDate().toISOString()
                : new Date(useMetaData.createdAt).toISOString()
            } />
          )}
        </Helmet>
      )}
      
      <article className="DisplayArticle-container" aria-label="Article content">
        {articleMetadata && (
          <header style={{ textAlign: 'center', marginBottom: '3rem', paddingBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
            <h1 className="DisplayArticle-title">{useMetaData.title}</h1>
          {hasVideos && !isPremium && (
            <div className="DisplayArticle-video-notice" style={{
              marginTop: '1rem',
              marginBottom: '1.5rem',
              padding: '1.2rem',
              backgroundColor: '#f0f7ff',
              borderLeft: '4px solid #0F4C3A',
              borderRadius: '4px',
              fontSize: '1.5rem',
              lineHeight: '1.6',
              color: '#1a1d23',
              maxWidth: '75rem',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <strong>📹 Video Available:</strong> A video of this article is available if you prefer watching or listening - for premium users only.
            </div>
          )}
          {hasVideos && isPremium && (
            <div className="DisplayArticle-video-notice" style={{
              marginTop: '1rem',
              marginBottom: '1.5rem',
              padding: '1.2rem',
              backgroundColor: '#f0f9f4',
              borderLeft: '4px solid #0F4C3A',
              borderRadius: '4px',
              fontSize: '1.5rem',
              lineHeight: '1.6',
              color: '#1a1d23',
              maxWidth: '75rem',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}>
              <strong>📹 Video Available:</strong> A video version of this article is available below - the same content as the text, just in case you prefer watching or listening.
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginTop: '1.5rem' }}>
            <div className="DisplayArticle-category" aria-label="Article number">
              Article {useMetaData.articleNumber}
            </div>
            {(() => {
              if (!useMetaData.createdAt) return null;
              const articleDate = useMetaData.createdAt.toDate ? useMetaData.createdAt.toDate() : new Date(useMetaData.createdAt);
              const thirtyDaysAgo = new Date();
              thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
              const isNew = articleDate > thirtyDaysAgo;
              return isNew ? (
                <span className="ArticleListItem-new-badge" aria-label="New article">NEW</span>
              ) : null;
            })()}
          </div>
        </header>
      )}
      
      {renderAdminEditButton(a, articleType, articleId, history)}
      {renderVideoSection(useMetaData?.videoUrl, tier, history)}
      
      <div className="DisplayArticle-content" role="article">
        {articleDataArray}
      </div>

      {article && (
        <section aria-label="Comments section">
          <Comments
            uid={uid}
            username={username}
            displayName={displayName}
            photoURL={photoURL}
            parentId={article.id}
          />
        </section>
      )}

      {/* Feedback Form */}
      <FeedbackForm
        articleId={articleId}
        articleType={articleType}
        articleTitle={useMetaData?.title}
      />
    </article>
    </>
  );
};

export default DisplayCategoryArticle;
