import React from 'react';
import './CategoryArticleListItem.css';
import {
  makeDateString,
  getLevelStr,
} from '../../helpers/helpers';

// Build the canonical, crawlable article URL. Mirrors getArticlePathByType in
// containers/CategoryArticles.js — keep the two in sync. `seg` is the readable
// slug when available, otherwise the body/id hash (which redirects to the slug).
const buildArticleHref = (type, seg) => {
  if (!seg || !type) return null;
  if (type === "counting") return `/counting/articles/${seg}`;
  if (type === "cardPlay") return `/declarer/articles/${seg}`;
  if (type === "beginnerCardPlay") return `/beginner/articles/declarer/${seg}`;
  if (type === "beginnerDefence") return `/beginner/articles/defence/${seg}`;
  if (type === "beginnerBidding") return `/beginner/articles/bidding/${seg}`;
  if (type === "defence") return `/defence/articles/${seg}`;
  if (type === "biddingBasics") return `/bidding/basics/${seg}`;
  if (type === "biddingAdvanced") return `/bidding/advanced/${seg}`;
  if (type === "cardPlayBasics") return `/declarer/basics/${seg}`;
  if (type === "defenceBasics") return `/defence/basics/${seg}`;
  if (type === "bidding") return `/bidding/advanced/${seg}`;
  return `/${type}/${seg}`;
};

const CategoryArticleListItem = ({
  createdAt,
  body,
  category,
  difficulty,
  articleNumber,
  id,
  slug,
  teaser,
  teaser_board,
  title,
  clickHandler,
  a,
  subscriptionActive,
  articleType,
  hasVideo,
  isFree,
}) => {
  // Article is locked if user is not an admin AND doesn't have an active subscription
  // Admins (a === true) always have access, regardless of subscription status
  const isAdmin = a === true;
  const isLocked = !isAdmin && !subscriptionActive && !isFree;

  // Canonical href so the card is a real, crawlable <a> link (prefer the slug;
  // the body/id hash redirects to the slug if that's all we have).
  const href = buildArticleHref(articleType, slug || body || id);

  const handleClick = () => {
    if (clickHandler) {
      const articleObj = {
        createdAt,
        body,
        category,
        difficulty,
        articleNumber,
        id,
        slug,
        teaser,
        teaser_board,
        title,
      };
      clickHandler(articleObj, body, articleType);
    }
  };

  // Plain left-click → SPA navigation (no full reload). Let the browser handle
  // modifier/middle clicks so "open in new tab" still works off the real href.
  const handleAnchorClick = (e) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    e.preventDefault();
    handleClick();
  };

  const isNewArticle = (createdAt) => {
    if (!createdAt) return false;
    const articleDate = createdAt.toDate ? createdAt.toDate() : new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return articleDate > thirtyDaysAgo;
  };

  const showNew = isNewArticle(createdAt);
  const diffString = getLevelStr(difficulty);

  return (
    <a
      className={`ArticleCard ${isLocked ? 'ArticleCard--locked' : ''} ${isFree ? 'ArticleCard--free' : ''}`}
      href={href || undefined}
      onClick={handleAnchorClick}
    >
      {/* Lock Icon for Premium Content */}
      {isLocked && (
        <div className="ArticleCard-lock">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}

      {/* New Badge */}
      {showNew && (
        <div className="ArticleCard-new-badge">
          NEW
        </div>
      )}

      {/* Video Badge */}
      {hasVideo && (
        <div className="ArticleCard-video-badge">
          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '1.6rem', height: '1.6rem' }}>
            <path d="M8 5v14l11-7z"/>
          </svg>
          <span>Article + Video</span>
        </div>
      )}

      {/* Article Content */}
      <div className="ArticleCard-content">
        {/* Badges */}
        <div className="ArticleCard-meta">
          <span className="badge badge-number">
            #{articleNumber}
          </span>
        </div>

        {/* Title */}
        <h3 className="ArticleCard-title">{title}</h3>

        {/* Teaser Text */}
        {teaser && (
          <p className="ArticleCard-teaser">{teaser}</p>
        )}

        {/* Locked Overlay */}
        {isLocked && (
          <div className="ArticleCard-locked-overlay">
            <div className="ArticleCard-locked-cta">
              <span className="btn btn-secondary btn-small">
                Start 7-day free trial
              </span>
            </div>
          </div>
        )}
      </div>
    </a>
  );
};

export default CategoryArticleListItem;
