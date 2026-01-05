/**
 * Article Grouping Helpers
 * Groups articles by difficulty level for display with banners
 */

/**
 * Group articles by difficulty level
 * Returns an array of { level, articles } objects, sorted by level
 * @param {Array} articles - Array of article objects with difficulty property
 * @returns {Array<{level: string, articles: Array}>}
 */
export const groupArticlesByLevel = (articles) => {
  if (!articles || articles.length === 0) {
    return [];
  }

  // Group articles by difficulty level
  const grouped = articles.reduce((acc, article) => {
    const level = article?.difficulty || '1';
    
    if (!acc[level]) {
      acc[level] = [];
    }
    
    acc[level].push(article);
    return acc;
  }, {});

  // Convert to array and sort by level
  const result = Object.entries(grouped)
    .map(([level, articles]) => ({
      level,
      articles: articles.sort((a, b) => {
        // Sort articles within level by articleNumber
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


