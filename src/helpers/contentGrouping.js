/**
 * Content Grouping Helpers
 * Groups articles, videos, and practice questions by difficulty level for display with banners
 */

/**
 * Group articles, videos, and practice questions by difficulty level
 * Returns an array of { level, articles, videos, practiceQuestions } objects, sorted by level
 * @param {Array} articles - Array of article objects with difficulty property
 * @param {Array} videos - Array of video objects with difficulty property
 * @param {Array} practiceQuestions - Array of practice question bundle objects with difficulty property
 * @returns {Array<{level: string, articles: Array, videos: Array, practiceQuestions: Array}>}
 */
export const groupContentByLevel = (articles = [], videos = [], practiceQuestions = []) => {
  const allLevels = new Set();
  
  // Collect all levels from articles
  articles.forEach(article => {
    const level = article?.difficulty || '1';
    allLevels.add(level);
  });
  
  // Collect all levels from videos
  videos.forEach(video => {
    const level = video?.difficulty || '1';
    allLevels.add(level);
  });

  // Collect all levels from practice questions
  practiceQuestions.forEach(bundle => {
    const level = bundle?.difficulty || '1';
    allLevels.add(level);
  });

  if (allLevels.size === 0) {
    return [];
  }

  // Group by level
  const grouped = {};
  
  // Group articles
  articles.forEach(article => {
    const level = article?.difficulty || '1';
    if (!grouped[level]) {
      grouped[level] = { level, articles: [], videos: [], practiceQuestions: [] };
    }
    grouped[level].articles.push(article);
  });

  // Group videos
  videos.forEach(video => {
    const level = video?.difficulty || '1';
    if (!grouped[level]) {
      grouped[level] = { level, articles: [], videos: [], practiceQuestions: [] };
    }
    grouped[level].videos.push(video);
  });

  // Group practice questions
  practiceQuestions.forEach(bundle => {
    const level = bundle?.difficulty || '1';
    if (!grouped[level]) {
      grouped[level] = { level, articles: [], videos: [], practiceQuestions: [] };
    }
    grouped[level].practiceQuestions.push(bundle);
  });

  // Convert to array and sort
  const result = Object.values(grouped)
    .map(group => ({
      ...group,
      // Sort articles within level by articleNumber
      articles: group.articles.sort((a, b) => {
        const numA = Number(a?.articleNumber || 0);
        const numB = Number(b?.articleNumber || 0);
        return numA - numB;
      }),
      // Sort videos by createdAt (newest first)
      videos: group.videos.sort((a, b) => {
        const dateA = a?.createdAt?.toDate ? a.createdAt.toDate() : new Date(a?.createdAt || 0);
        const dateB = b?.createdAt?.toDate ? b.createdAt.toDate() : new Date(b?.createdAt || 0);
        return dateB - dateA;
      }),
      // Sort practice questions by articleNumber
      practiceQuestions: group.practiceQuestions.sort((a, b) => {
        const numA = Number(a?.articleNumber || 0);
        const numB = Number(b?.articleNumber || 0);
        return numA - numB;
      }),
    }))
    .sort((a, b) => {
      // Sort levels numerically
      return Number(a.level) - Number(b.level);
    });

  return result;
};

/**
 * Map category name to video category string
 * @param {string} articleType - 'cardPlay', 'bidding', or 'defence'
 * @returns {string} - 'Declarer Play', 'Bidding', or 'Defence'
 */
export const mapCategoryToVideoCategory = (articleType) => {
  const mapping = {
    cardPlay: 'Declarer Play',
    bidding: 'Bidding',
    defence: 'Defence',
  };
  return mapping[articleType] || articleType;
};

