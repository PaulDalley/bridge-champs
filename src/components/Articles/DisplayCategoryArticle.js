import React, { Component } from "react";
import { connect } from "react-redux";
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
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import SkeletonLoader from "../UI/SkeletonLoader";

// Helper function to render admin edit button
const renderAdminEditButton = (isAdmin, articleType, articleId, history) => {
  if (!isAdmin) return null;
  
  return (
    <button
      className="DisplayArticle-edit-btn"
      onClick={() => history.push('/edit/' + articleType + '/' + articleId)}
      aria-label={`Edit ${articleType} article`}
      title="Edit this article"
    >
      Edit Article
    </button>
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
  let articleText;

  if (article) {
    articleText = article?.[articleId]?.text;
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

  return (
    <article className="DisplayArticle-container" aria-label="Article content">
      {articleMetadata && (
        <header>
          <h1 className="DisplayArticle-title">{useMetaData.title}</h1>
          {hasVideos && !isPremium && (
            <div className="DisplayArticle-video-notice" style={{
              marginTop: '1rem',
              marginBottom: '1rem',
              padding: '1.2rem',
              backgroundColor: '#f0f7ff',
              borderLeft: '4px solid #0F4C3A',
              borderRadius: '4px',
              fontSize: '1.5rem',
              lineHeight: '1.6',
              color: '#1a1d23'
            }}>
              <strong>📹 Video Available:</strong> A video of this article is available if you prefer watching or listening - for premium users only.
            </div>
          )}
          <div className="DisplayArticle-category" aria-label="Article number">
            Article {useMetaData.articleNumber}
          </div>
          <div
            className={`DisplayArticle-difficulty ArticlesListItem-difficulty-general`}
            aria-label={`Difficulty level ${useMetaData.difficulty}`}
          >
            Level {useMetaData.difficulty}
          </div>
          <div className="DisplayArticle-createdAt">
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
    </article>
  );
};

export default DisplayCategoryArticle;
