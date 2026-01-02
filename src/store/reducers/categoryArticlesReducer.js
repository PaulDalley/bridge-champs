import * as actions from "../actions/actionTypes";

/*
  biddingSummary: biddingSummaryRef,
  biddingBody: biddingBodyRef,
  cardPlaySummary: cardPlaySummaryRef,
  cardPlayBody: cardPlayBodyRef,
  defenceSummary: defenceSummaryRef,
  defenceBody: defenceBodyRef,
*/

const articlesDefaultState = {
  bidding: [],
  biddingBody: {},
  cardPlay: [],
  cardPlayBody: {},
  defence: [],
  defenceBody: {},
  article: {},
  currentArticle: undefined,
  fetchedByCategory: false,
};

export default (state = articlesDefaultState, action) => {
  switch (action.type) {
    case actions.SET_CATEGORY_COUNTS:
      return {
        ...state,
        articlesCount: action.articlesCount,
        quizCount: action.quizCount,
      };

    case actions.CATEGORY_ADD_ARTICLE:
      return {
        ...state,
        [action.summaryRef]: [action.article, ...state.articles],
        article: {
          ...state.article,
          [action.articleId]: action.articleBody,
        },
        currentArticle: state.currentArticle,
        fetchedByCategory: false,
      };
    // set all articles from a /articles json request:
    case actions.CATEGORY_SET_ARTICLES:
      // const newArticles = [...state.articles, action.articles];
      // console.log(`--- SETTING STORE ARTICLES FOR ${action.summaryRef} ---`);
      // console.log(action.articles);
      return {
        ...state,
        [action.summaryRef]: action.articles,
        article: state.article,
        currentArticle: state.currentArticle,
        fetchedByCategory: action.fetchedByCategory,
      };

    case actions.CATEGORY_DELETE_ARTICLE:
      let articles = state?.[action.summaryRef]?.filter((article) => {
        article.id !== action.articleId;
      });

      let article = { ...state?.article };
      article[action.bodyId] = undefined;

      return {
        ...state,
        [action.summaryRef]: articles,
        article: article,
        currentArticle: state.currentArticle,
        fetchedByCategory: state.fetchedByCategory,
      };

    // case actions.CATEGORY_EDIT_ARTICLE:

    // FOR INDIVIDUAL ARTICLES:
    case actions.CATEGORY_FETCH_ONE_ARTICLE:
      // action.article is the body document data
      // Store the entire body document, not just the body ID
      try {
        // Ensure action.article exists and action.id is valid
        if (!action.id) {
          console.error('CATEGORY_FETCH_ONE_ARTICLE: Missing article ID');
          return state;
        }
        
        // Ensure we have a valid article object
        const articleData = action.article || {};
        
        // Only update summaryRef if it's provided
        const updatedState = {
          ...state,
          article: {
            ...state.article,
            [action.id]: articleData, // Store the full body document (has 'text' and possibly 'body' fields)
          },
          currentArticle: state.currentArticle,
          fetchedByCategory: state.fetchedByCategory,
        };
        
        // Only set summaryRef if it exists in action
        if (action.summaryRef) {
          updatedState[action.summaryRef] = state.articles;
        }
        
        return updatedState;
      } catch (error) {
        console.error('Error in CATEGORY_FETCH_ONE_ARTICLE reducer:', error);
        return state; // Return unchanged state on error
      }

    case actions.SET_CURRENT_CATEGORY_ARTICLE:
      // console.log("--- SETTING CURRENT ARTICLE IN REDUCER ---");
      // console.log(action.currentArticle);
      return {
        ...state,
        currentArticle: action.currentArticle,
      };

    default:
      return state;
  }
};
