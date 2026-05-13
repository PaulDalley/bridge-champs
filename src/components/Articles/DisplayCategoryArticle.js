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
  beginnerCardPlaySummaryRef,
  beginnerCardPlayBodyRef,
  beginnerDefenceSummaryRef,
  beginnerDefenceBodyRef,
  beginnerBiddingSummaryRef,
  beginnerBiddingBodyRef,
} from "../../firebase/config";

import {
  parseDocumentIntoJSX,
  findArticleById,
  makeBoardObjectFromString,
  getDifficultyStr,
  hasVideosInContent,
} from "../../helpers/helpers";
import MakeBoard from "../../components/BridgeBoard/MakeBoard";
import { Col, ProgressBar } from "react-materialize";
import Comments from "../Comments/Comments";
import FeedbackForm from "./FeedbackForm";
import RelatedArticles from "./RelatedArticles";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import SkeletonLoader from "../UI/SkeletonLoader";

// Site-wide author + publisher identity for structured data and visible
// attribution. Update DEFAULT_AUTHOR.sameAs as you add public profiles
// (YouTube, LinkedIn, X, etc.) — Google reads sameAs to consolidate your
// author/brand identity across the web.
const DEFAULT_AUTHOR = {
  name: "Paul Dalley",
  jobTitle: "Bridge teacher",
  url: "https://bridgechampions.com/about",
  sameAs: [
    // "https://www.youtube.com/@bridgechampions",
    // "https://www.linkedin.com/in/paul-dalley",
  ],
};

const SITE_PUBLISHER = {
  name: "Bridge Champions",
  url: "https://bridgechampions.com",
  logoUrl:
    "https://firebasestorage.googleapis.com/v0/b/bridgechampions.appspot.com/o/logo.png?alt=media&token=583808ab-2c3b-49a6-8936-82dffe55ec95",
  sameAs: [
    "https://www.youtube.com/@BridgeChampions",
  ],
};

function formatLastUpdated(date) {
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-AU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  } catch (_) {
    return date.toDateString();
  }
}

// List path for redirect after delete
const getListPathForArticleType = (type) => {
  if (type === "biddingBasics") return "/bidding/basics";
  if (type === "bidding" || type === "biddingAdvanced") return "/bidding/advanced";
  if (type === "cardPlayBasics") return "/declarer/basics";
  if (type === "cardPlay") return "/declarer/articles";
  if (type === "beginnerCardPlay") return "/beginner/articles/declarer";
  if (type === "beginnerDefence") return "/beginner/articles/defence";
  if (type === "beginnerBidding") return "/beginner/articles/bidding";
  if (type === "defenceBasics") return "/defence/basics";
  if (type === "defence") return "/defence/articles";
  if (type === "counting") return "/counting/articles";
  return "/";
};

const getPracticePathForArticleType = (type) => {
  if (type === "bidding" || type === "biddingAdvanced" || type === "biddingBasics") return "/bidding/practice";
  if (type === "cardPlay" || type === "cardPlayBasics") return "/declarer/practice";
  if (type === "defence" || type === "defenceBasics") return "/defence/practice";
  if (type === "counting") return "/counting/practice";
  if (
    type === "beginnerCardPlay" ||
    type === "beginnerDefence" ||
    type === "beginnerBidding"
  ) {
    return "/beginner/practice";
  }
  return "/";
};

const hasProblemDeepLink = (path = "") =>
  /[?&]problem=/.test(String(path));

const makeBiddingProblemPath = (difficulty, problemId) =>
  `/bidding/practice?difficulty=${encodeURIComponent(String(difficulty))}&problem=${encodeURIComponent(problemId)}`;

const BIDDING_ARTICLE_PRACTICE_TARGETS = [
  {
    patterns: [/lebensohl/i],
    path: makeBiddingProblemPath(3, "bid3-6"),
  },
  {
    patterns: [/1-level overcall/i, /one-level overcall/i],
    path: makeBiddingProblemPath(1, "bid1-17"),
  },
  {
    patterns: [/2-level overcall/i, /two-level overcall/i],
    path: makeBiddingProblemPath(1, "bid1-22"),
  },
  {
    patterns: [/preempt/i],
    path: makeBiddingProblemPath(1, "bid1-29"),
  },
  {
    patterns: [/is this auction forcing/i, /is this forcing/i, /forcing-status/i],
    path: makeBiddingProblemPath(1, "bid1-34"),
  },
  {
    patterns: [/duplicate bidding/i, /disciplined duplicate/i],
    path: makeBiddingProblemPath(2, "bid2-1"),
  },
  {
    patterns: [/advanced hand evaluation/i, /evaluate a hand beyond raw points/i],
    path: makeBiddingProblemPath(2, "bid2-6"),
  },
  {
    patterns: [/responding to a double/i, /respond after partner doubles/i],
    path: makeBiddingProblemPath(2, "bid2-14"),
  },
  {
    patterns: [/when is double the right call/i, /\bdoubles?\b/i],
    path: makeBiddingProblemPath(2, "bid2-9"),
  },
  {
    patterns: [/power of pass/i, /when is pass the strongest bid/i],
    path: makeBiddingProblemPath(2, "bid2-19"),
  },
  {
    patterns: [/slam judgment/i, /when to bid slam/i],
    path: makeBiddingProblemPath(2, "bid2-24"),
  },
  {
    patterns: [/splinter/i],
    path: makeBiddingProblemPath(3, "bid3-1"),
  },
  {
    patterns: [/should you open the bidding/i, /opening hand evaluation/i],
    path: makeBiddingProblemPath(1, "bid1-1"),
  },
  {
    patterns: [/respond to partner'?s opening bid/i, /responding to partner/i],
    path: makeBiddingProblemPath(1, "bid1-6"),
  },
  {
    patterns: [/modern 1nt opening/i, /1nt opening really promise/i],
    path: makeBiddingProblemPath(1, "bid1-11"),
  },
];

const getExactPracticePathForArticle = ({ articleType, title, articleText }) => {
  if (!(articleType === "bidding" || articleType === "biddingAdvanced" || articleType === "biddingBasics")) {
    return "";
  }

  if (/lebensohl/i.test(`${title || ""}\n${articleText || ""}`)) {
    return makeBiddingProblemPath(3, "bid3-6");
  }

  const titleText = String(title || "");
  const target = BIDDING_ARTICLE_PRACTICE_TARGETS.find(({ patterns }) =>
    patterns.some((pattern) => pattern.test(titleText))
  );

  return target?.path || "";
};

const ARTICLE_TOPIC_TABS = [
  { id: "declarer", label: "Declarer", path: "/declarer/articles", types: ["cardPlay"] },
  { id: "defence", label: "Defence", path: "/defence/articles", types: ["defence"] },
  { id: "bidding", label: "Bidding", path: "/bidding/advanced", types: ["bidding", "biddingAdvanced"] },
];
const BEGINNER_ARTICLE_TOPIC_TABS = [
  {
    id: "declarer",
    label: "Declarer",
    path: "/beginner/articles/declarer",
    types: ["beginnerCardPlay"],
  },
  {
    id: "defence",
    label: "Defence",
    path: "/beginner/articles/defence",
    types: ["beginnerDefence"],
  },
  {
    id: "bidding",
    label: "Bidding",
    path: "/beginner/articles/bidding",
    types: ["beginnerBidding"],
  },
];

const escapeRegExp = (input = "") =>
  String(input).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const stripLeadingDuplicateTitle = (html, title) => {
  if (!html || !title) return html;
  const titlePattern = escapeRegExp(String(title).trim());
  const re = new RegExp(
    `^\\s*<h[12][^>]*>\\s*${titlePattern}\\s*<\\/h[12]>\\s*`,
    "i"
  );
  return html.replace(re, "");
};

const toSafeDate = (value) => {
  if (!value) return null;
  if (typeof value?.toDate === "function") return value.toDate();
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
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
  const isLoggedIn = Boolean(uid);

  // Hidden articles (drafts in /pillars) are admin-only. Non-admins get a
  // simple "not found" panel and no <meta> leakage. Sitemap/prerender skip
  // these too, so no crawler should ever arrive here.
  const isHiddenDraft = useMetaData?.isHidden === true;
  // For logged-out users, metadata can lag; the body doc is readable for free articles and carries isFree too.
  const isFree = useMetaData?.isFree === true || isFreeFromBodyDoc === true;
  const canWatchVideo = isAdmin || isPremium || isFree;
  const metadataPracticePath = useMetaData?.ctaTarget || "";
  const exactPracticePath = getExactPracticePathForArticle({
    articleType,
    title: useMetaData?.title,
    articleText,
  });
  const preferredPracticePath = hasProblemDeepLink(metadataPracticePath)
    ? metadataPracticePath
    : exactPracticePath || metadataPracticePath || getPracticePathForArticleType(articleType);
  const subscribeThenPracticePath = `/subscribe?redirectTo=${encodeURIComponent(preferredPracticePath)}`;
  const isLebensohlArticle =
    articleId === "fI7DC63YopLtZy9fIobM" ||
    articleId === "wsCt4ouPgZU1cB86fj2A" ||
    useMetaData?.body === "wsCt4ouPgZU1cB86fj2A" ||
    /lebensohl/i.test(String(useMetaData?.title || "")) ||
    /lebensohl/i.test(String(articleText || ""));
  const signInThenTrialPath = `/login?redirectTo=${encodeURIComponent(subscribeThenPracticePath)}`;
  const trialSignupPath = `/signup?redirectTo=${encodeURIComponent(subscribeThenPracticePath)}`;
  const ctaPath = isPremium || isAdmin ? preferredPracticePath : isLoggedIn ? subscribeThenPracticePath : trialSignupPath;
  const ctaButtonLabel = isPremium || isAdmin
    ? "Train this theme now"
    : isLoggedIn
      ? "Start your 7-day free trial"
      : "Create your account and start a 7-day free trial";
  const [freeUpdating, setFreeUpdating] = useState(false);
  const [freeError, setFreeError] = useState("");

  if (articleText) {
    const articleTextForRender = stripLeadingDuplicateTitle(
      articleText,
      useMetaData?.title
    );
    // Pass canWatchVideo so free articles unlock embedded videos even for logged-out users.
    articleDataArray = parseDocumentIntoJSX(
      articleTextForRender,
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

  const getOgImageUrl = () => {
    const baseUrl = "https://bridgechampions.com";
    return articleId ? `${baseUrl}/og/${articleId}.png` : `${baseUrl}/og/default.png`;
  };

  const getArticleUrl = () => {
    const baseUrl = "https://bridgechampions.com";
    if (articleType === "cardPlay") return `${baseUrl}/declarer/articles/${articleId}`;
    if (articleType === "biddingBasics") return `${baseUrl}/bidding/advanced/${articleId}`;
    if (articleType === "bidding") return `${baseUrl}/bidding/advanced/${articleId}`;
    if (articleType === "biddingAdvanced") return `${baseUrl}/bidding/advanced/${articleId}`;
    if (articleType === "cardPlayBasics") return `${baseUrl}/declarer/articles/${articleId}`;
    if (articleType === "defence") return `${baseUrl}/defence/articles/${articleId}`;
    if (articleType === "defenceBasics") return `${baseUrl}/defence/articles/${articleId}`;
    if (articleType === "counting") return `${baseUrl}/declarer/articles/${articleId}`;
    if (articleType === "beginnerCardPlay") return `${baseUrl}/beginner/articles/declarer/${articleId}`;
    if (articleType === "beginnerDefence") return `${baseUrl}/beginner/articles/defence/${articleId}`;
    if (articleType === "beginnerBidding") return `${baseUrl}/beginner/articles/bidding/${articleId}`;
    return `${baseUrl}/${articleType}/${articleId}`;
  };

  const getCategoryName = () => {
    const categoryMap = {
      cardPlay: "Declarer Play",
      cardPlayBasics: "Declarer Play – Improve your fundamentals",
      defence: "Defence",
      defenceBasics: "Defence – Improve your fundamentals",
      bidding: "Bidding – Articles & explanations",
      biddingBasics: "Bidding – Improve your fundamentals",
      biddingAdvanced: "Bidding – Articles & explanations",
      beginnerCardPlay: "Beginner Declarer",
      beginnerDefence: "Beginner Defence",
      beginnerBidding: "Beginner Bidding",
    };
    return categoryMap[articleType] || articleType;
  };
  const isBeginnerArticleType = articleType?.startsWith("beginner");
  const topicTabs = isBeginnerArticleType
    ? BEGINNER_ARTICLE_TOPIC_TABS
    : ARTICLE_TOPIC_TABS;
  const activeTopicId =
    topicTabs.find((tab) => tab.types.includes(articleType))?.id || "declarer";
  const backToListDestination = {
    pathname: getListPathForArticleType(articleType),
    search: location?.search || "",
  };
  const backToListLabel = `Back to ${getCategoryName()} articles`;
  const createdDate = toSafeDate(useMetaData?.createdAt);
  const updatedDate = toSafeDate(useMetaData?.updatedAt) || createdDate;
  const customAuthorName = useMetaData?.authorName;
  const looksLikePerson =
    typeof customAuthorName === "string" &&
    /\s/.test(customAuthorName.trim()) &&
    !/champion|bridge\b/i.test(customAuthorName);
  const articleAuthor = looksLikePerson
    ? {
        "@type": "Person",
        name: customAuthorName,
        url: DEFAULT_AUTHOR.url,
      }
    : {
        "@type": "Person",
        "@id": "https://bridgechampions.com/#author",
        name: DEFAULT_AUTHOR.name,
        jobTitle: DEFAULT_AUTHOR.jobTitle,
        url: DEFAULT_AUTHOR.url,
        ...(DEFAULT_AUTHOR.sameAs && DEFAULT_AUTHOR.sameAs.length
          ? { sameAs: DEFAULT_AUTHOR.sameAs }
          : {}),
      };
  const visibleAuthorName = looksLikePerson ? customAuthorName : DEFAULT_AUTHOR.name;
  const siteBaseUrl = SITE_PUBLISHER.url;
  const breadcrumbItems = [
    { name: "Home", path: "/" },
    { name: `${getCategoryName()} Articles`, path: getListPathForArticleType(articleType) },
    { name: useMetaData?.title || "Article", path: null },
  ];
  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: useMetaData?.title || "Bridge Champions article",
    description: getArticleDescription(),
    image: [getOgImageUrl()],
    author: articleAuthor,
    publisher: {
      "@type": "Organization",
      "@id": "https://bridgechampions.com/#organization",
      name: SITE_PUBLISHER.name,
      url: SITE_PUBLISHER.url,
      logo: {
        "@type": "ImageObject",
        url: SITE_PUBLISHER.logoUrl,
      },
      ...(SITE_PUBLISHER.sameAs && SITE_PUBLISHER.sameAs.length
        ? { sameAs: SITE_PUBLISHER.sameAs }
        : {}),
    },
    articleSection: getCategoryName(),
    datePublished: createdDate ? createdDate.toISOString() : undefined,
    dateModified: updatedDate ? updatedDate.toISOString() : undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getArticleUrl(),
    },
    keywords: [useMetaData?.primaryKeyword, useMetaData?.seoSubtopic]
      .filter(Boolean)
      .join(", "),
  };
  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.path ? `${siteBaseUrl}${item.path}` : getArticleUrl(),
    })),
  };
  const articleContainerClassName = `DisplayArticle-container${
    isBeginnerArticleType ? " DisplayArticle-container--beginner" : ""
  }`;
  const articleContentClassName = `DisplayArticle-content${
    isBeginnerArticleType ? " DisplayArticle-content--beginner" : ""
  }`;

  // Merged-article redirect: if this summary points at a primary URL via
  // redirectTo, bounce visitors there immediately. The primary URL holds
  // the canonical and the prerendered content; this URL is excluded from
  // sitemap + RelatedArticles so Google should drop it from the index.
  const redirectTarget =
    typeof useMetaData?.redirectTo === "string" && useMetaData.redirectTo.startsWith("/")
      ? useMetaData.redirectTo
      : null;
  if (redirectTarget) {
    return <Redirect to={redirectTarget} />;
  }

  if (isHiddenDraft && !isAdmin) {
    return (
      <>
        <Helmet>
          <title>Not found — Bridge Champions</title>
          <meta name="robots" content="noindex,nofollow" />
        </Helmet>
        <article
          className="DisplayArticle-container"
          aria-label="Article not available"
          style={{ padding: "3rem 1.5rem", maxWidth: "60rem", margin: "0 auto" }}
        >
          <h1 style={{ fontSize: "var(--text-3xl)", fontWeight: 800 }}>
            This article isn’t available.
          </h1>
          <p style={{ fontSize: "var(--text-base)", lineHeight: 1.6 }}>
            The page you’re looking for is either still being drafted or has
            been moved. Try the{" "}
            <a href="/learn" style={{ color: "#0f4c3a", fontWeight: 700 }}>
              learn library
            </a>{" "}
            or head back to the{" "}
            <a href="/" style={{ color: "#0f4c3a", fontWeight: 700 }}>
              home page
            </a>
            .
          </p>
        </article>
      </>
    );
  }

  return (
    <>
      {useMetaData && (
        <Helmet>
          <title>{getArticleTitle()}</title>
          <meta name="description" content={getArticleDescription()} />
          {isHiddenDraft && <meta name="robots" content="noindex,nofollow" />}
          <link rel="canonical" href={getArticleUrl()} />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="article" />
          <meta property="og:url" content={getArticleUrl()} />
          <meta property="og:title" content={useMetaData.title || "Bridge Champions"} />
          <meta property="og:description" content={getArticleDescription()} />
          <meta property="og:site_name" content="Bridge Champions" />
          <meta property="og:image" content={getOgImageUrl()} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:image:alt" content={`${useMetaData.title || "Bridge Champions"} \u2014 Bridge Champions`} />
          {useMetaData.videoUrl && (
            <meta property="og:video" content={useMetaData.videoUrl} />
          )}
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={getArticleUrl()} />
          <meta name="twitter:title" content={useMetaData.title || "Bridge Champions"} />
          <meta name="twitter:description" content={getArticleDescription()} />
          <meta name="twitter:image" content={getOgImageUrl()} />
          
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
          {updatedDate && (
            <meta property="article:modified_time" content={updatedDate.toISOString()} />
          )}
          <script type="application/ld+json">
            {JSON.stringify(articleStructuredData)}
          </script>
          <script type="application/ld+json">
            {JSON.stringify(breadcrumbStructuredData)}
          </script>
        </Helmet>
      )}
      
      <article className={articleContainerClassName} aria-label="Article content">
        {isHiddenDraft && isAdmin && (
          <div className="DisplayArticle-draftBanner" role="status">
            <strong>HIDDEN DRAFT</strong> · Only admins can see this URL.
            It is excluded from the sitemap and emits <code>noindex,nofollow</code>.
            Use the <a href="/pillars">/pillars</a> page to publish when ready.
          </div>
        )}
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
          <div
            className="DisplayArticle-breadcrumbs"
            role="navigation"
            aria-label="Breadcrumb"
          >
            {breadcrumbItems.map((item, idx) => (
              <React.Fragment key={`${item.name}-${idx}`}>
                {item.path ? (
                  <a href={item.path}>{item.name}</a>
                ) : (
                  <span aria-current="page">{item.name}</span>
                )}
                {idx < breadcrumbItems.length - 1 ? (
                  <span className="DisplayArticle-breadcrumb-sep" aria-hidden="true">
                    /
                  </span>
                ) : null}
              </React.Fragment>
            ))}
          </div>
          {(updatedDate || visibleAuthorName) && (
            <div
              className="DisplayArticle-byline"
              aria-label="Article byline"
            >
              {visibleAuthorName && (
                <span className="DisplayArticle-byline-author">
                  By{" "}
                  <a
                    href="/about"
                    className="DisplayArticle-byline-authorLink"
                    rel="author"
                  >
                    {visibleAuthorName}
                  </a>
                </span>
              )}
              {visibleAuthorName && updatedDate && (
                <span className="DisplayArticle-byline-sep" aria-hidden="true">
                  ·
                </span>
              )}
              {updatedDate && (
                <span className="DisplayArticle-byline-updated">
                  Updated{" "}
                  <time dateTime={updatedDate.toISOString()}>
                    {formatLastUpdated(updatedDate)}
                  </time>
                </span>
              )}
            </div>
          )}
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
        </header>
      )}

      <div className="DisplayArticle-topicNavWrap">
        <p className="DisplayArticle-topicHint">Browse topics:</p>
        <div className="DisplayArticle-topicNavRow">
        <div className="DisplayArticle-topicNav" role="tablist" aria-label="Article topics">
          {topicTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTopicId === tab.id}
              className={`DisplayArticle-topicPill ${
                activeTopicId === tab.id ? "DisplayArticle-topicPill--active" : ""
              }`}
              onClick={() => history.push(tab.path)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        </div>
      </div>

      <div className="DisplayArticle-backNavWrap">
        <button
          type="button"
          className="DisplayArticle-backNavBtn"
          onClick={() => history.push(backToListDestination)}
          aria-label={backToListLabel}
        >
          <span aria-hidden="true">←</span> {backToListLabel}
        </button>
      </div>
      
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
          beginnerCardPlay: beginnerCardPlaySummaryRef,
          beginnerDefence: beginnerDefenceSummaryRef,
          beginnerBidding: beginnerBiddingSummaryRef,
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
                          beginnerCardPlay: beginnerCardPlaySummaryRef,
                          beginnerDefence: beginnerDefenceSummaryRef,
                          beginnerBidding: beginnerBiddingSummaryRef,
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
                          beginnerCardPlay: beginnerCardPlayBodyRef,
                          beginnerDefence: beginnerDefenceBodyRef,
                          beginnerBidding: beginnerBiddingBodyRef,
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
      
      <div className={articleContentClassName} role="article">
        {articleDataArray}
      </div>

      {isLebensohlArticle ? (
        <section className="DisplayArticle-ctaCard" aria-label="Lebensohl trainer call to action">
          <h3 className="DisplayArticle-ctaHeading">Try the Lebensohl problem questions</h3>
          <p className="DisplayArticle-ctaBody">
            This topic has guided problem questions so you can practice the exact decisions, not just read about them.
          </p>

          {isPremium || isAdmin ? (
            <>
              <button
                type="button"
                className="DisplayArticle-ctaButton"
                onClick={() => history.push(preferredPracticePath)}
              >
                Open Lebensohl trainer questions
              </button>
              <p className="DisplayArticle-ctaHint">
                You are unlocked - go run the reps.
              </p>
            </>
          ) : isLoggedIn ? (
            <>
              <button
                type="button"
                className="DisplayArticle-ctaButton"
                onClick={() => history.push(subscribeThenPracticePath)}
              >
                Start 7-day free trial to unlock questions
              </button>
              <p className="DisplayArticle-ctaHint">
                You are signed in. Start trial, then jump straight into the problem set.
              </p>
            </>
          ) : (
            <>
              <details className="DisplayArticle-ctaFlowDetails">
                <summary className="DisplayArticle-ctaFlowSummary">
                  Sign in first (takes about 1 minute)
                </summary>
                <div className="DisplayArticle-ctaFlowBody">
                  <p>
                    Step 1: Sign in or create your account.
                  </p>
                  <button
                    type="button"
                    className="DisplayArticle-ctaButton"
                    onClick={() => history.push(signInThenTrialPath)}
                  >
                    Sign in / create account
                  </button>
                  <p className="DisplayArticle-ctaHint">
                    Step 2: Start your 7-day free trial. Step 3: open the Lebensohl problem questions.
                  </p>
                </div>
              </details>
            </>
          )}
        </section>
      ) : (
        <section className="DisplayArticle-ctaCard" aria-label="Practice call to action">
          <h3 className="DisplayArticle-ctaHeading">Build the habit with guided practice</h3>
          <p className="DisplayArticle-ctaBody">
            Reading helps, but trainer reps are what make bidding decisions automatic under pressure.
            Use the trainer to train your mind and lock this theme in.
          </p>
          <button
            type="button"
            className="DisplayArticle-ctaButton"
            onClick={() => history.push(ctaPath)}
          >
            {ctaButtonLabel}
          </button>
          {!isPremium && !isAdmin && (
            <p className="DisplayArticle-ctaHint">
              Sign up first, then choose your subscription plan. Includes a 7-day free trial.
            </p>
          )}
        </section>
      )}

      <RelatedArticles
        articleType={articleType}
        currentArticleId={articleId}
        currentBodyId={useMetaData?.body || articleId}
        currentTitle={useMetaData?.title}
        currentDifficulty={useMetaData?.difficulty}
      />

      <div className="DisplayArticle-backNavWrap DisplayArticle-backNavWrap--bottom">
        <button
          type="button"
          className="DisplayArticle-backNavBtn"
          onClick={() => history.push(backToListDestination)}
          aria-label={backToListLabel}
        >
          <span aria-hidden="true">←</span> {backToListLabel}
        </button>
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
