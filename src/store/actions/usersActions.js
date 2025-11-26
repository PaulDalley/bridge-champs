import database, { membersDataRef } from '../../firebase/config';
import * as actions from './actionTypes';

export const getUserQuizScore = (uid, quizId) => {
    return dispatch => {
        // console.log("FETCHING USERS SCORES:");
        membersDataRef.doc(uid).get()
            .then(docSnapshot => {
                let memberData = docSnapshot.data();
                // console.log("IS THERE MEMBERDATA:");
                // console.log(memberData);

                if (memberData && memberData.quizScores && memberData.totalQuizScore) {
                    let currentQuizScore = memberData.quizScores[quizId];
                    dispatch(setUserQuizScores(memberData.quizScores, memberData.totalQuizScore, currentQuizScore));
                } else {
                    dispatch(setUserQuizScores({}, 0, 0));
                }
            })
            .catch(err => console.log(err));
    }
};

export const startSubmitUserQuizScore = (uid, score, quizId) => {
    return dispatch => {
        if (score === undefined || isNaN(score)) return;
        // console.log("STARTING TO SUBMIT USER SCORE FOR:");
        // console.log("USER ID: ", uid);
        // console.log("QUIZ ID: ", quizId);
        // console.log("SCORE: ", score);
        // score = score / 10;
        let scoresObject;
        const transaction = database.runTransaction(t => {
            return t.get(membersDataRef.doc(uid))
                .then(docSnapshot => {
                    let data = docSnapshot.data();
                    let newScore = 0;
                    if (data && !data.quizScores[quizId]) {
                        newScore = Number(data.totalQuizScore) + Number(score);
                        scoresObject = data.quizScores;
                        scoresObject[quizId] = score;
                    }
                    else {
                        newScore = score;
                        scoresObject = {
                            [quizId]: score,
                        }
                    }
                    t.set(membersDataRef.doc(uid), {
                            totalQuizScore: newScore,
                            quizScores: scoresObject,
                        }, { merge: true }
                    );
                });
        })
            .then(res => {
                // console.log("Quiz score update success, ", res);
                dispatch(setUserQuizScores(scoresObject));
            })
            .catch(err => {
                console.log("Quiz score update failed:", err);
            });

    }
};

export const setUserQuizScores = (scoresObject, totalQuizScore, currentQuizScore) => ({
   type: actions.SET_USER_QUIZ_SCORES,
    quizScores: scoresObject,
    totalQuizScore,
    currentQuizScore,
});

export const setCurrentQuizScore = (scoresObject, quizId) => ({
    type: actions.SET_USER_CURRENT_QUIZ,
    currentQuizScore: scoresObject[quizId],
});