import * as actions from '../actions/actionTypes';

const articlesDefaultState = {
    articles: [],
    article: {},
    currentArticle: undefined,
    tournamentArticles: undefined,
    fetchedByCategory: false,
};

export default (state = articlesDefaultState, action) => {
    switch(action.type) {
        case actions.SET_COUNTS:
            return {
                ...state,
                articlesCount: action.articlesCount,
                quizCount: action.quizCount,
            }

        case actions.ADD_ARTICLE:
            return {
                articles: [
                    action.article,
                    ...state.articles,
                ],
                article: {
                    ...state.article,
                    [action.articleId]: action.articleBody
                },
                currentArticle: state.currentArticle,
                fetchedByCategory: false,

            };
        // set all articles from a /articles json request:
        case actions.SET_ARTICLES:
            // const newArticles = [...state.articles, action.articles];
            return {
                articles: action.articles,
                article: state.article,
                currentArticle: state.currentArticle,
                fetchedByCategory: action.fetchedByCategory,
            };

        case actions.DELETE_ARTICLE:
            let articles = state.articles.filter(article => {
                article.id !== action.articleId
            });

            let article = { ...state.article };
            article[action.bodyId] = undefined;

            return {
                articles,
                article,
                currentArticle: state.currentArticle,
                fetchedByCategory: state.fetchedByCategory
            };

        // case actions.EDIT_ARTICLE:

        // FOR INDIVIDUAL ARTICLES:
        case actions.FETCH_ONE_ARTICLE:
            return {
                articles: state.articles,
                article: {
                    ...state.article,
                    [action.id]: action.article.body
                },
                currentArticle: state.currentArticle,
                fetchedByCategory: state.fetchedByCategory,
            }

        case actions.SET_CURRENT_ARTICLE:
            // console.log("SETTING CURRENT ARTICLE");
            // console.log(action.currentArticle);
            return {
                ...state,
                currentArticle: action.currentArticle,
            }


        case actions.SET_TOURNAMENT_ARTICLES:
            return {
                ...state,
                tournamentArticles: action.tournamentArticles,
                fetchedByCategory: true,
                // tournamentArticles: data,
            }
        default:
            return state;
    }
};

