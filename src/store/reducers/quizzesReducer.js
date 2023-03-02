import * as actions from '../actions/actionTypes';

const quizzesDefaultState = {
    quizzes: [],
    quiz: {},
    currentQuiz: undefined,
};

export default (state = quizzesDefaultState, action) => {
    switch (action.type) {
        case actions.ADD_QUIZ:
            return {
                quizzes: [
                    action.quiz,
                    ...state.quizzes,
                ],
                quiz: {
                    ...state.quiz,
                    [action.quizBody.id]: {
                        id: action.quizBody.id,
                        question: action.quizBody.question,
                        answer: action.quizBody.answer,
                        answers: action.quizBody.answers
                    },
                },
                currentQuiz: state.currentQuiz
            };
        case actions.SET_QUIZZES:
            return {
                quizzes: action.quizzes,
                quiz: state.quiz,
                currentQuiz: state.currentQuiz
            };

        case actions.REMOVE_QUIZ:
            let quizzes = [ ...state.quizzes ].filter(quiz => {
                quiz.id !== action.id
            });
            // let quiz = [ ...state.quiz ].filter(a => {
            //     a.id !== action.id
            // });
            let quiz = { ...state.quiz };
            quiz[action.id] = undefined;

            return {
                quizzes,
                quiz,
                currentQuiz: state.currentQuiz
            };

        case actions.SET_CURRENT_QUIZ:
            // console.log("SETTING CURRENT QUIZ TO METADATA")
            // console.log(action.currentQuiz);
            return {
                ...state,
                currentQuiz: action.currentQuiz,
            }

        // singular quiz:
        case actions.FETCH_ONE_QUIZ:
            return {
                quizzes: state.quizzes,
                quiz: { ...state.quiz, [action.id]: action.quiz },
                currentQuiz: state.currentQuiz
            };

        case actions.EDIT_QUIZ:
            let changeQuizIndex = state.quizzes.findIndex(quiz => quiz.id === action.id);
            let updatedQuizzes = [
                ...state.quizzes.slice(0,changeQuizIndex),
                action.quiz,
                ...state.quizzes.slice(changeQuizIndex+1)
            ];

            let updatedQuizBodies = {...state.quiz, [action.quiz.body]: action.quizBody}
            return {
                quizzes: updatedQuizzes,
                quiz: updatedQuizBodies,
                currentQuiz: state.currentQuiz,
            }
        default:
            return state;
    }
};