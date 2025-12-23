import * as actions from './actionTypes';
import database, { firebase, quizzesRef, quizRef } from '../../firebase/config';

export const setCurrentQuiz = (quiz) => ({
    type: actions.SET_CURRENT_QUIZ,
    currentQuiz: quiz,
});

export const getQuizMetadata = (id) => {
    return dispatch => {
        // console.log("FETCHING QUIZ METADATA")
        // console.log(id);
        quizzesRef.where('body', '==', id)
            .get()
            .then(snapshot => {
                // console.log(snapshot);
                const quizMetadata = snapshot.docs[0].data();
                dispatch(setCurrentQuiz(quizMetadata));
            });
    }
}

// CREATE: ADD a new article:
export const startAddQuiz = (quiz, quizBody) => {
    return dispatch => {
        const batch = database.batch();
        const newQuizzesRef = quizzesRef.doc();
        const newQuizRef = quizRef.doc();
        // console.log("I AM SUBMITTING A NEW QUIZ TO FIRESTORE:");
        // console.log(newQuizzesRef);
        // console.log(newQuizzesRef.id);
        // console.log(newQuizRef);
        // console.log(newQuizRef.id);
        batch.set(newQuizzesRef, {
            ...quiz,
            body: newQuizRef.id,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        batch.set(newQuizRef, {
            ...quizBody
        });
        batch.commit()
            .then(() => {
                // dispatch(addQuiz(quiz, quizBody));
            })
            .catch((err) => dispatch(addQuizError(err)));

    }
}
export const addQuiz = (quiz, quizBody) => ({
    type: actions.ADD_QUIZ,
    quiz,
    quizBody
});


export const getQuiz = (id, router) => {
    return dispatch => {
        return quizRef.doc(id).get()
            .then(snapshot => {
                const quiz = snapshot.data();
                const id = snapshot.id;
                // console.log("I HAVE A QUIZ IN QUIZZES ACTIONS");
                // console.log(quiz);
                dispatch(setQuiz(quiz, id));
            })
            .catch(err => {
                // console.log(err);
                localStorage.setItem("contentRedirectId", id);
                localStorage.setItem("contentRedirectType", "quiz");
                router.push('/membership');
            });
    };
};

export const setQuiz = (quiz, id) => ({
    type: actions.FETCH_ONE_QUIZ,
    quiz,
    id,
});

const addQuizError = (err) => {
    console.log(err);
}



// DOWNLOAD QUIZZES:
export const getQuizzes = () => {
    return dispatch => {
        quizzesRef.orderBy('date', 'desc')
            .get()
            .then(snapshot => {
                const quizzes = [];
                snapshot.forEach(childSnapshot => {
                    quizzes.push({
                        id: childSnapshot.id,
                        ...childSnapshot.data(),
                    });
                });
                // console.log("JUST FETCHED QUIZZES!");
                // console.log(quizzes);
                dispatch(setQuizzes(quizzes));
            });
    };
};
export const setQuizzes = (quizzes) => ({
    type: actions.SET_QUIZZES,
    // quizzes,
    quizzes
});


export const startEditQuiz = (quiz, quizBody) => {
    return (dispatch) => {
        // console.log("STARTING AN EDIT OF")
        // console.log("metadata", quiz.id)
        // console.log("article body", quiz.body);
        // console.log("ABOUT TO EDIT THEM: ", quiz.title);
        const batch = database.batch();
        const quizBodyRef = quizRef.doc(quiz.body);
        const quizMetadataRef = quizzesRef.doc(quiz.id);
        batch.update(quizMetadataRef, {
            ...quiz,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        batch.update(quizBodyRef, {
            ...quizBody
        });
        batch.commit()
            .then(() => {
                dispatch(editQuiz(quiz, quizBody, quiz.id));
                // console.log("Edit successful");
            })
            .catch((err) => {
                // dispatch(quizError(err));
                console.log(err);
            });

    }
}

const editQuiz = (quiz, quizBody, id) => ({
    type: actions.EDIT_QUIZ,
    id,
    quiz,
    quizBody
});

export const startDeleteQuiz = (quizId, bodyId) => {
    return (dispatch) => {
        // console.log("STARTING A DELETE OF")
        // console.log("metadata", quizId)
        // console.log("article body", bodyId);
        const batch = database.batch();
        const quizBodyRef = quizRef.doc(bodyId);
        const quizMetadataRef = quizzesRef.doc(quizId);
        batch.delete(quizMetadataRef);
        batch.delete(quizBodyRef);
        batch.commit()
            .then(() => {
                // console.log("Article deleted");
                // dispatch(deleteArticle(articleId, bodyId));
            })
            .catch((err) => {
                // dispatch(articleError(err));
                console.log(err);
            });

    }
}