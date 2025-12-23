import * as actions from "../actions/actionTypes";

export default (state = {}, action) => {
  switch (action.type) {
    case actions.USER_CHANGE_SUBSCRIPTION_ACTIVE_STATUS:
      return {
        ...state,
        subscriptionActive: action.subscriptionActive,
      };

    case actions.USER_LOGIN:
      // console.log(action);
      // console.log(action.user.uid);
      // console.log(action.user.email);
      // console.log(action.user.displayName);
      // console.log(action.user.totalQuizScore);
      // console.log(action.user.quizScores);
      let quizScore = undefined;
      if (action.user.totalQuizScore !== 0) {
        quizScore = action.user.totalQuizScore;
      }

      if (action.user.uid !== undefined) {
        return {
          ...state,
          uid: action.user.uid,
          email: action.user.email,
          displayName: action.user.displayName,
          photoURL: action.user.photoURL,
          quizScores: action.user.quizScores || {},
          totalQuizScore: quizScore,
          stripeCustomerId: action.user.stripeCustomerId || undefined,
          userName: action.user.username,
          paymentMethod: action.user.paymentMethod,
          // subscriptionActive: action.user.subscriptionActive,
          subscriptionExpires: action.user.subscriptionExpires,
        };
      } else {
        return {
          ...state,
          quizScores: action.user.quizScores || {},
          totalQuizScore: quizScore,
          stripeCustomerId: action.user.stripeCustomerId || undefined,
          userName: action.user.username,
          paymentMethod: action.user.paymentMethod,
          // subscriptionActive: action.user.subscriptionActive,
          subscriptionExpires: action.user.subscriptionExpires,
        };
      }

    case actions.USER_SET_SUBSCRIPTION_EXPIRES:
      // console.log("SUB EXP");
      // console.log(action);
      // console.log(action.subscriptionExpires)
      return {
        ...state,
        subscriptionExpires: action.subscriptionExpires,
        paymentMethod: action.paymentMethod,
        subscriptionActive: action.subscriptionActive,
        trialUsed: action.trialUsed,
        tier: action.tier,
      };

    case actions.USER_LOGOUT:
      // console.log(action);
      // const resetState = {};
      return {
        ...state,
        uid: "",
        email: "",
        displayName: "",
        photoURL: "",
      };

    case actions.USER_SET:
      return {
        ...state,
        a: action.a,
      };

    default:
      return state;
  }
};
