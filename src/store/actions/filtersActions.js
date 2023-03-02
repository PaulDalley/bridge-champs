import * as actions from '../actions/actionTypes';

export const hideCompletedQuizzesFilter = (hide, quizScores) => ({
   type: actions.SET_HIDE_COMPLETED_QUIZZES_FILTER,
   hide,
   quizScores,
});

export const setDifficultyFilter = (difficulty) => ({
    type: actions.SET_DIFFICULTY_FILTER,
    difficulty,
});

export const setCategoryFilter = (category) => ({
    type: actions.SET_CATEGORY_FILTER,
    category,
});

export const updateSearchString = (searchString) => ({
    type: actions.UPDATE_SEARCH_STRING,
    searchString,
});

export const resetFilters = () => ({
   type: actions.RESET_FILTERS,
});

export const setFilterType = (filterType) => ({
    type: actions.SET_FILTER_TYPE,
    filterType,
});