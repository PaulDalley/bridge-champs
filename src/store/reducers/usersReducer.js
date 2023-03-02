import * as actions from '../actions/actionTypes';

const userDefaultState = {
    quizScores: undefined,
    totalQuizScore: undefined,
    quizScoresFetched: false,
    currentQuizScore: false,
};

export default (state = userDefaultState, action) => {
    switch(action.type) {
        case actions.SET_USER_QUIZ_SCORES:
            // console.log("SETTING MEMBERS QUIZ SCORES TO THIS:");
           // console.log(action.quizScores);
            return {
                ...state,
                quizScores: action.quizScores,
                totalQuizScore: action.totalQuizScore,
                quizScoresFetched: true,
                currentQuizScore: action.currentQuizScore,
            }

        case actions.SET_USER_CURRENT_QUIZ:
            return {
                ...state,
                currentQuizScore: action.currentQuizScore,
            }

        default:
            return state;
    }
};