import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  getArticle,
  getArticleMetadata,
  startDeleteArticle,
} from "../../store/actions/categoryArticlesActions";
import "./DisplayArticle.css";
import "./ArticleListItem.css";
import logger from "../../utils/logger";
import {
  firebase,
  articlesRef,
  articleRef,
  biddingSummaryRef,
  biddingBodyRef,
  biddingBasicsSummaryRef,
  biddingBasicsBodyRef,
  biddingAdvancedSummaryRef,
  biddingAdvancedBodyRef,
  cardPlaySummaryRef,
  cardPlayBodyRef,
  cardPlayBasicsSummaryRef,
  cardPlayBasicsBodyRef,
  defenceSummaryRef,
  defenceBodyRef,
  defenceBasicsSummaryRef,
  defenceBasicsBodyRef,
  countingSummaryRef,
} from "../../firebase/config";

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
import SkeletonLoader from "../UI/SkeletonLoader";

// List path for redirect after delete
const getListPathForArticleType = (type) => {
  if (type === "biddingBasics") return "/bidding/basics";
  if (type === "bidding" || type === "biddingAdvanced") return "/bidding/advanced";
  if (type === "cardPlayBasics") return "/cardPlay/basics";
  if (type === "cardPlay") return "/cardPlay/articles";
  if (type === "defenceBasics") return "/defence/basics";
  if (type === "defence") return "/defence/articles";
  if (type === "counting") return "/counting/articles";
  return "/";
};

// Helper function to render admin edit and delete buttons
const renderAdminEditButton = (isAdmin, articleType, articleId, bodyRef, history, dispatch, summaryRefMap) => {
  if (!isAdmin) return null;

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this article? This cannot be undone.")) return;
    const summaryRef = summaryRefMap[articleType];
    if (!summaryRef || !bodyRef) return;
    try {
      const snap = await summaryRef.where("body", "==", articleId).limit(1).get();
      if (snap.empty) {
        window.alert("Could not find article metadata to delete.");
        return;
      }
      const summaryDocId = snap.docs[0].id;
      dispatch(startDeleteArticle(summaryDocId, articleId, articleType, bodyRef));
      history.push(getListPathForArticleType(articleType));
    } catch (err) {
      console.error("Delete failed:", err);
      window.alert(err?.message || "Failed to delete article.");
    }
  };

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
      <button
        type="button"
        className="DisplayArticle-edit-btn"
        onClick={handleDelete}
        aria-label={`Delete ${articleType} article`}
        title="Delete this article"
        style={{ backgroundColor: '#b71c1c', color: '#fff' }}
      >
        Delete Article
      </button>
    </div>
  );
};

// Helper function to render video section with premium paywall
const renderVideoSection = (videoUrl, canWatchVideo, history) => {
  if (!videoUrl) return null;
  
  if (canWatchVideo) {
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
              onClick={() => {
                if (typeof sessionStorage !== "undefined") sessionStorage.setItem("subscription_upgrade_source", "video");
                history.push("/membership");
              }}
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

  const articleId = match.params.id;

  // Fetch body doc whenever the route articleId changes (prevents stale content when navigating).
  useEffect(() => {
    if (!articleId) return;
    dispatch(getArticle(articleId, history, bodyRef));
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }, [articleId, bodyRef, history, dispatch]);
  let articleText = '';
  let isFreeFromBodyDoc = false;

  if (article && articleId) {
    try {
      // article[articleId] is the body document, which has 'text' or 'body' field
      const bodyDoc = article?.[articleId];
      if (bodyDoc) {
        isFreeFromBodyDoc = bodyDoc.isFree === true;
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

  // IMPORTANT: `categoryArticles.currentArticle` is global and can be stale when navigating between articles.
  // Only use it if it matches the current article body id, otherwise fall back to list lookup/fetch.
  const currentMetaMatchesThisArticle =
    articleMetadata && articleMetadata.body === articleId;

  let useMetaData = currentMetaMatchesThisArticle
    ? articleMetadata
    : findArticleById(articles, articleId);

  // Fetch metadata whenever we don't have it for the current article.
  useEffect(() => {
    if (!articleId) return;
    if (useMetaData) return;
    dispatch(getArticleMetadata(articleId, articleType));
  }, [articleId, articleType, useMetaData, dispatch]);

  let articleDataArray = [];
  const hasVideos = articleText ? hasVideosInContent(articleText) : false;
  const isPremium = tier === 'premium';
  const isAdmin = a === true;
  // For logged-out users, metadata can lag; the body doc is readable for free articles and carries isFree too.
  const isFree = useMetaData?.isFree === true || isFreeFromBodyDoc === true;
  const canWatchVideo = isAdmin || isPremium || isFree;
  const [freeUpdating, setFreeUpdating] = useState(false);
  const [freeError, setFreeError] = useState("");

  if (articleText) {
    // Pass canWatchVideo so free articles unlock embedded videos even for logged-out users.
    articleDataArray = parseDocumentIntoJSX(
      articleText,
      false,
      undefined,
      undefined,
      tier,
      history,
      canWatchVideo
    );
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
    if (articleType === "biddingBasics") return `${baseUrl}/bidding/basics/${articleId}`;
    if (articleType === "bidding") return `${baseUrl}/bidding/advanced/${articleId}`;
    if (articleType === "cardPlayBasics") return `${baseUrl}/cardPlay/basics/${articleId}`;
    if (articleType === "defenceBasics") return `${baseUrl}/defence/basics/${articleId}`;
    return `${baseUrl}/${articleType}/${articleId}`;
  };

  const getCategoryName = () => {
    const categoryMap = {
      cardPlay: "Declarer Play",
      cardPlayBasics: "Declarer Play – Improve your fundamentals",
      defence: "Defence",
      defenceBasics: "Defence – Improve your fundamentals",
      bidding: "Bidding – Advanced ideas",
      biddingBasics: "Bidding – Improve your fundamentals",
      biddingAdvanced: "Bidding – Advanced Ideas",
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
        <div className="ArticleTopBanner">
          <strong>Heads up:</strong> We’re adding video versions to all articles—more coming soon.
        </div>
        {articleMetadata && (
          <header
            className={`DisplayArticle-header ${
              isFree ? "DisplayArticle-header--free" : ""
            } ${!isFree && !canWatchVideo ? "DisplayArticle-header--locked" : ""}`}
          >
            <h1 className="DisplayArticle-title">{useMetaData.title}</h1>
          {hasVideos && !canWatchVideo && (
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
              <strong>📹 Premium Video:</strong> This article includes a video version. Start a 7-day free trial to watch.
            </div>
          )}
          {hasVideos && canWatchVideo && (
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
              <strong>📹 Video Available:</strong> This article includes a video version below (same content as the text).
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
      
      <div style={{ maxWidth: '75rem', marginLeft: 'auto', marginRight: 'auto' }}>
        {renderAdminEditButton(a, articleType, articleId, bodyRef, history, dispatch, {
          cardPlay: cardPlaySummaryRef,
          cardPlayBasics: cardPlayBasicsSummaryRef,
          defence: defenceSummaryRef,
          defenceBasics: defenceBasicsSummaryRef,
          bidding: biddingSummaryRef,
          biddingBasics: biddingBasicsSummaryRef,
          biddingAdvanced: biddingAdvancedSummaryRef,
          counting: countingSummaryRef,
        })}
      </div>

      {a === true && (
        <div className="ArticleAdminToggle">
          <p>
            {(() => {
              const id = `free-article-${articleType}-${articleId}`;
              return (
                <>
                  <input
                    id={id}
                    type="checkbox"
                    checked={isFree}
                    disabled={freeUpdating}
                    onChange={async (e) => {
                      const nextVal = e.target.checked;
                      setFreeUpdating(true);
                      setFreeError("");
                      try {
                        const summaryRefMap = {
                          cardPlay: cardPlaySummaryRef,
                          cardPlayBasics: cardPlayBasicsSummaryRef,
                          defence: defenceSummaryRef,
                          defenceBasics: defenceBasicsSummaryRef,
                          bidding: biddingSummaryRef,
                          biddingBasics: biddingBasicsSummaryRef,
                          biddingAdvanced: biddingAdvancedSummaryRef,
                          articles: articlesRef,
                        };
                        const bodyRefMap = {
                          cardPlay: cardPlayBodyRef,
                          cardPlayBasics: cardPlayBasicsBodyRef,
                          defence: defenceBodyRef,
                          defenceBasics: defenceBasicsBodyRef,
                          bidding: biddingBodyRef,
                          biddingBasics: biddingBasicsBodyRef,
                          biddingAdvanced: biddingAdvancedBodyRef,
                          articles: articleRef,
                        };
                        const summaryRef = summaryRefMap[articleType];
                        const bodyRef = bodyRefMap[articleType];
                        if (!summaryRef || !bodyRef) throw new Error(`Unknown articleType: ${articleType}`);

                        const bodyId = articleId; // route id is the BODY doc id in this system

                        const snap = await summaryRef.where("body", "==", bodyId).limit(1).get();
                        if (snap.empty) throw new Error("Could not find summary doc for this article");

                        await snap.docs[0].ref.set(
                          {
                            isFree: nextVal,
                            freeUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                          },
                          { merge: true }
                        );

                        await bodyRef.doc(bodyId).set(
                          {
                            isFree: nextVal,
                            freeUpdatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                          },
                          { merge: true }
                        );

                        dispatch(getArticleMetadata(bodyId, articleType));
                      } catch (err) {
                        setFreeError(err?.message || String(err));
                      } finally {
                        setFreeUpdating(false);
                      }
                    }}
                  />
                  <label htmlFor={id}>Make this article free (bypass paywall)</label>
                </>
              );
            })()}
          </p>
          {freeError && <div className="ArticleAdminToggleError">{freeError}</div>}
        </div>
      )}

      {renderVideoSection(useMetaData?.videoUrl, canWatchVideo, history)}
      
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
