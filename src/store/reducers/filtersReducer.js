import * as actions from "../actions/actionTypes";

const defaultState = {
  category: '""',
  difficulty: '""',
  searchString: '""',
  hide: false,
  filterType: undefined,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case actions.SET_FILTER_TYPE:
      // console.log("SETTING FILTER TO: ", action.filterType);
      return {
        ...state,
        filterType: action.filterType,
      };

    case actions.SET_HIDE_COMPLETED_QUIZZES_FILTER:
      return {
        ...state,
        hide: action.hide,
        quizScores: action.quizScores,
      };

    case actions.SET_CATEGORY_FILTER:
      // console.log(action.category);
      return {
        ...state,
        category: action.category,
      };

    case actions.SET_DIFFICULTY_FILTER:
      // console.log(action.difficulty);
      return {
        ...state,
        difficulty: action.difficulty,
      };

    case actions.UPDATE_SEARCH_STRING:
      // console.log(action.searchString);
      return {
        ...state,
        searchString: action.searchString,
      };

    case actions.RESET_FILTERS:
      const currentQuizHiddenState = state.hide;
      return {
        category: '""',
        difficulty: '""',
        searchString: '""',
        filterType: undefined,
        hide: currentQuizHiddenState,
      };

    default:
      return state;
  }
};
