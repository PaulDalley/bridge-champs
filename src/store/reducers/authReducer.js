import * as actions from "../actions/actionTypes";

export default (state = { authReady: false }, action) => {
  switch (action.type) {
    case actions.AUTH_READY:
      return { ...state, authReady: true };

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

      const displayNameFromName =
        action.user.firstName != null || action.user.surname != null
          ? [action.user.firstName, action.user.surname].filter(Boolean).join(" ").trim()
          : "";
      const displayName = displayNameFromName || action.user.displayName || "";

      if (action.user.uid !== undefined) {
        return {
          ...state,
          uid: action.user.uid,
          email: action.user.email,
          displayName,
          firstName: action.user.firstName,
          surname: action.user.surname,
          photoURL: action.user.photoURL,
          quizScores: action.user.quizScores || {},
          totalQuizScore: quizScore,
          stripeCustomerId: action.user.stripeCustomerId || undefined,
          userName: action.user.username,
          paymentMethod: action.user.paymentMethod,
          subscriptionExpires: action.user.subscriptionExpires,
        };
      } else {
        return {
          ...state,
          displayName,
          firstName: action.user.firstName,
          surname: action.user.surname,
          quizScores: action.user.quizScores || {},
          totalQuizScore: quizScore,
          stripeCustomerId: action.user.stripeCustomerId || undefined,
          userName: action.user.username,
          paymentMethod: action.user.paymentMethod,
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
      return {
        ...state,
        uid: "",
        email: "",
        displayName: "",
        firstName: "",
        surname: "",
        photoURL: "",
        subscriptionActive: false,
        subscriptionExpires: undefined,
        a: false,
      };

    case actions.USER_SET:
      return {
        ...state,
        a: action.a,
      };

    case actions.USER_SET_PROFILE_NAME: {
      const displayName = [action.firstName, action.surname].filter(Boolean).join(" ").trim();
      return {
        ...state,
        firstName: action.firstName,
        surname: action.surname,
        displayName: displayName || state.displayName,
      };
    }

    case actions.USER_SET_BEGINNER_MODE:
      return {
        ...state,
        beginnerMode: !!action.beginnerMode,
      };

    default:
      return state;
  }
};
