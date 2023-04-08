import database, {
  firebase,
  membersRef,
  usersRef,
  googleAuthProvider,
  facebookAuthProvider,
} from "../../firebase/config";
import * as actions from "./actionTypes";

export const changeSubscriptionActiveStatus = (status) => ({
  type: actions.USER_CHANGE_SUBSCRIPTION_ACTIVE_STATUS,
  subscriptionActive: status,
});

export const startGoogleLogin = () => {
  return () => {
    return firebase.auth().signInWithPopup(googleAuthProvider);
  };
};
export const startFacebookLogin = () => {
  return () => {
    return firebase.auth().signInWithPopup(facebookAuthProvider);
  };
};

export const startEmailAndPasswordLogin = (email, password) => {
  return () => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  };
};

export const signupEmailAndPasswordLogin = (email, password) => {
  return () => {
    // console.log("IN ACTION SIGNUP W EMAIL");
    // console.log(`EMAIL: ${email}, PASSWORD: ${password}`);
    return firebase.auth().createUserWithEmailAndPassword(email, password);
    //  .catch(err => {
    //    if (err.code === 'auth/email-already-in-use') {
    //// DO ACCOUNT LINKING HERE:
  };
};

export const signOut = () => {
  return () => {
    firebase.auth().signOut();
  };
};

export const userLoggedIn = (user) => ({
  type: actions.USER_LOGIN,
  user,
});

export const userLoggedInSubscriptionExpires = (
  subscriptionExpires,
  paymentMethod,
  subscriptionActive,
  trialUsed = false
) => ({
  type: actions.USER_SET_SUBSCRIPTION_EXPIRES,
  subscriptionExpires,
  paymentMethod,
  subscriptionActive,
  trialUsed,
});

export const userLoggedOut = () => ({
  type: actions.USER_LOGOUT,
});

export const setUser = (user) => {
  return (dispatch) => {
    // database.runTransaction((transaction) => {
    //     return Promise.all([
    //         transaction.get(user_),
    //         transaction.get(dataStats)
    //     ])
    // }).then(([userSnapshot, dataStatsSnapshot]) => {
    //    const userBool = userSnapshot.exists && userSnapshot.data().OK;
    //    const { articlesCount, quizCount } = dataStatsSnapshot.data();
    //    console.log(userBool);
    //    console.log(articlesCount, quizCount);
    //    dispatch(setUserAction(userBool, articlesCount, quizCount));
    // });

    // const references = [usersRef.doc(user.uid), membersRef.doc(user.uid)];
    // return database.runTransaction(t => {
    //     return Promise.all(
    //         references.map(async (element) => {
    //             const doc = await t.get(element)
    //         })
    //     ).then(res => console.log(res));
    // });

    usersRef
      .doc(user.uid)
      .get()
      .then((snapshot) => {
        let bool = snapshot.exists && snapshot.data().OK;
        dispatch(setUserAction(bool));
      });
  };
};

export const resetUserProfileBlank = (uid) => {
  return (dispatch) => {
    let user = firebase.auth().currentUser;
    user.updateProfile({
      displayName: "",
      photoURL: "",
    });
  };
};

export const setUserAction = (b) => ({
  type: actions.USER_SET,
  a: b,
});
