import $ from "jquery";
window.jQuery = window.$ = $;

// import $ from 'jquery';
// window.$ = $;

// import jQuery from 'jquery';
import "./assets/css/materialize-required.css";
// import './assets/css/materialize.min.css';
// import './assets/js/materialize.min';

// import 'jquery';
// import "materialize-css/dist/css/materialize.min.css";
// import "materialize-css/dist/js/materialize.min.js";

// NEW: Doesn't work:
import "materialize-css";

import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom"; // Routes replaced Switch component deprecated.
import "./App.css";
import ContactForm from "./components/UI/ContactForm";
import About from "./components/UI/About";
import Profile from "./components/UI/Profile";
import PrivacyPolicy from "./components/UI/PrivacyPolicy";
import HomePage from "./components/HomePage";
import Articles from "./containers/Articles";
import CategoryArticles from "./containers/CategoryArticles";
import DisplayArticle from "./components/Articles/DisplayArticle";
import SpecificArticles from "./components/Articles/SpecificArticles";
import ArticlesByCategory from "./components/Articles/ArticlesByCategory";
import Quizzes from "./containers/Quizzes";
import DisplayQuiz from "./components/Quizzes/DisplayQuiz";
import PremiumMembership from "./components/Auth/PremiumMembership";
import CurrentTournaments from "./containers/CurrentTournaments";
import Videos from "./containers/Videos";
import Questions from "./containers/Questions";
import Layout from "./components/Layout";
import AuthComponent from "./containers/AuthComponent";
import TestingGround from "./components/TestingGround";

import { firebase } from "./firebase/config";

import CreateArticle from "./containers/CreateArticle";
import CreateCategoryArticle from "./containers/CreateCategoryArticle";
import CreateQuiz from "./containers/CreateQuiz";
import DBComp from "./containers/DBComp";

import GoogleAnalytics from "./components/GoogleAnaytics";

import {
  userLoggedIn,
  userLoggedOut,
  setUser,
  userLoggedInSubscriptionExpires,
} from "./store/actions/authActions";
import { setUserQuizScores } from "./store/actions/usersActions";

// Configure redux store:
import configureStore from "./store/configureStore";
const store = configureStore();

const routes = (
  <Switch>
    <Route
      path="/create/db"
      // element={<DBComp />}
      component={DBComp}
    />

    <Route
      path="/create/article"
      // element={<CreateArticle type={"article"} />}
      render={() => <CreateArticle articleType="articles" bodyRef="article" />}
    />

    {/* CHANGES TO ADD NEW ROUTES FOR 3 TYPES OF ARTICLE */}
    <Route
      path="/create/defence"
      // element={<CreateArticle type={"article"} />}
      render={() => (
        <CreateCategoryArticle articleType="defence" bodyRef="defenceBody" />
      )}
    />

    <Route
      path="/create/cardPlay"
      // element={<CreateArticle type={"article"} />}
      render={() => (
        <CreateCategoryArticle articleType="cardPlay" bodyRef="cardPlayBody" />
      )}
    />

    <Route
      path="/create/bidding"
      // element={<CreateArticle type={"article"} />}
      render={() => (
        <CreateCategoryArticle articleType="bidding" bodyRef="biddingBody" />
      )}
    />

    <Route
      path="/edit/defence/:id"
      // element={<CreateArticle edit={true} type={"article"} />}
      render={() => (
        <CreateCategoryArticle
          edit={true}
          articleType="defence"
          bodyRef="defenceBody"
        />
      )}
    />
    <Route
      path="/edit/cardPlay/:id"
      // element={<CreateArticle edit={true} type={"article"} />}
      render={() => (
        <CreateCategoryArticle
          edit={true}
          articleType="cardPlay"
          bodyRef="cardPlayBody"
        />
      )}
    />
    <Route
      path="/edit/bidding/:id"
      // element={<CreateArticle edit={true} type={"article"} />}
      render={() => (
        <CreateCategoryArticle
          edit={true}
          articleType="bidding"
          bodyRef="biddingBody"
        />
      )}
    />
    <Route
      path="/defence"
      render={(routeProps) => (
        <CategoryArticles {...routeProps} articleType="defence" />
      )}
      exact
    />
    <Route
      path="/defence/:id"
      component={DisplayArticle}
      articleType="defence"
    />
    <Route
      path="/cardPlay"
      render={(routeProps) => (
        <CategoryArticles {...routeProps} articleType="cardPlay" />
      )}
      exact
    />
    <Route
      path="/cardPlay/:id"
      component={DisplayArticle}
      articleType="cardPlay"
    />
    <Route
      path="/bidding"
      render={(routeProps) => (
        <CategoryArticles {...routeProps} articleType="bidding" />
      )}
      exact
    />
    <Route
      path="/bidding/:id"
      component={DisplayArticle}
      articleType="bidding"
    />
    {/* END CHANGES TO ADD NEW ROUTES FOR 3 TYPES OF ARTICLE */}

    <Route
      path="/create/tournament"
      // element={<CreateArticle type={"tournament"} />}
      render={() => <CreateArticle articleType="tournament" />}
    />

    <Route
      path="/create/quiz"
      // element={<CreateQuiz />}
      articleType="quiz"
      component={CreateQuiz}
    />

    <Route
      path="/edit/article/:id"
      // element={<CreateArticle edit={true} type={"article"} />}
      render={() => (
        <CreateArticle edit={true} articleType="article" type="article" />
      )}
    />
    <Route
      path="/edit/quiz/:id"
      render={() => <CreateQuiz edit={true} articleType="quiz" type="quiz" />}
    />

    <Route path="/testingground" component={TestingGround} />

    <Route path="/profile" component={Profile} />

    <Route path="/membership" component={PremiumMembership} />
    <Route
      path="/articles"
      render={(routeProps) => <Articles {...routeProps} />}
      exact
    />
    <Route path="/article/:id" component={DisplayArticle} />
    <Route path="/quizzes" component={Quizzes} />
    <Route path="/quiz/:id" component={DisplayQuiz} />
    <Route path="/tournaments" component={CurrentTournaments} />
    <Route path="/tournament/:tournamentName" component={SpecificArticles} />
    <Route path="/conventions" component={ArticlesByCategory} />
    <Route path="/videos" component={Videos} />
    <Route path="/questions" component={Questions} />

    <Route path="/contact" component={ContactForm} />
    <Route path="/privacy" component={PrivacyPolicy} />

    <Route
      path="/about"
      component={About}
      // element={<About />}
    />

    {/*<Route path="/article/:id" component={Article} /> */}
    <Route
      path="/login"
      component={AuthComponent}
      // element={<AuthComponent />}
    />

    {/*<Route path="/signup" component={AuthComponent} />*/}
    <Route path="/success" render={() => <HomePage success />} />
    <Route path="/error" render={() => <HomePage error />} />
    {/*<Route path="/error" component={RegistrationError} />*/}

    {/*<Route path="/logout" component={Logout} /> */}
    {/*<Route path="auth" components={authComponent} /> */}
    <Route
      path="/"
      exact={true}
      component={HomePage}
      // element={<HomePage />}
    />
    {/*<Redirect to="/"/>*/}
  </Switch>
);

// console.log(firebase.auth().currentUser);
// const localStorageKey = localStorage.key(0);
// let user;
// if (localStorageKey !== null) {
//     user = JSON.parse(localStorage.getItem(localStorageKey));
//     if (user.uid) {
//         store.dispatch(userLoggedIn(user));
//         store.dispatch(setUser(user));
//     }
//     else {
//         store.dispatch(userLoggedOut());
//     }
// }

// ## WORKING daily update code:
const randomUpdateDailyArticle = () => {
  firebase
    .firestore()
    .collection("articles")
    .get()
    .then((docs) => {
      console.log(docs.docs);
      console.log(docs.docs.length);
      let idx = Math.floor(Math.random() * docs.docs.length);
      let id = docs.docs[idx].id;
      const metadata = docs.docs[idx].data();
      metadata.id = id;
      const bodyId = metadata.body;
      const fetchRef = firebase.firestore().collection("article");
      const dailyToUpdate = firebase
        .firestore()
        .collection("freeDaily")
        .doc("article");
      return doUpdateTransactionArticle(
        metadata,
        bodyId,
        fetchRef,
        dailyToUpdate,
        "article"
      );
    });
};

const doUpdateTransactionArticle = (
  metadata,
  bodyToFetch,
  fetchRef,
  dailyToUpdate,
  type
) => {
  console.log("fetching " + type + " with id: " + bodyToFetch);
  return fetchRef
    .doc(bodyToFetch)
    .get()
    .then((doc) => {
      metadata.text = doc.data().body.text;
      console.log(metadata);
      return dailyToUpdate.set(metadata);
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};

const randomUpdateDailyQuiz = () => {
  firebase
    .firestore()
    .collection("quizzes")
    .get()
    .then((docs) => {
      console.log(docs.docs);
      console.log(docs.docs.length);
      let idx = Math.floor(Math.random() * docs.docs.length);
      let id = docs.docs[idx].id;
      const metadata = docs.docs[idx].data();
      metadata.id = id;
      const bodyId = metadata.body;
      const fetchRef = firebase.firestore().collection("quiz");
      const dailyToUpdate = firebase
        .firestore()
        .collection("freeDaily")
        .doc("quiz");
      return doUpdateTransactionQuiz(
        metadata,
        bodyId,
        fetchRef,
        dailyToUpdate,
        "quiz"
      );
    });
};

const doUpdateTransactionQuiz = (
  metadata,
  bodyToFetch,
  fetchRef,
  dailyToUpdate,
  type
) => {
  //   console.log("fetching " + type + " with id: " + bodyToFetch);
  return fetchRef
    .doc(bodyToFetch)
    .get()
    .then((doc) => {
      const fetchedData = doc.data();
      metadata.question = fetchedData.question;
      metadata.answer = fetchedData.answer;
      metadata.answers = fetchedData.answers;
      return dailyToUpdate.set(metadata);
      // const data = {...metadata, ...doc.data()}
    })
    .then((res) => console.log(res))
    .catch((err) => console.log(err));
};
const updateDailies = () => {
  randomUpdateDailyArticle();
  randomUpdateDailyQuiz();
};

// END OF DAILY UPDATE CODE

// Firebase subscription to auth state in current application:
let subscribed = false;
let membersDataSubscriptionUnsubscribe;
firebase.auth().onAuthStateChanged((user) => {
  // TESTING PURPOSES:
  // firebase.firestore().collection('members')
  //     .where("subscriptionId", "==", "sub_CbwSqwR5hKcraJ")
  //     .get()
  //     .then(snapshot => {
  //         // let data = snapshot.data()[0];
  //         console.log(snapshot);
  //         console.log(snapshot.docs[0].id);
  //     });

  // they just logged in:
  if (user) {
    // ## RUN THIS EVERY 24 hrs.
    // updateDailies();

    // firebase.firestore().collection('members').doc(user.uid)
    //     .get()
    //     .then(snapshot => {
    //         const data = snapshot.data();
    //         console.log(data.trialUsed);
    //     })

    // Randomly get an article:
    // firebase.firestore().collection('article').doc("0svJaujqFhKzHQEA87Mn")
    //     .get()
    //     .then(doc => {
    //         console.log(doc);
    //         console.log(doc.data());
    //     });

    // ARTICLE VERSION;

    // firebase.firestore().collection('article').doc(bodyId)
    //     .get()
    //     .then(doc => {
    //         metadata.text = doc.data().body.text;
    //         const bodyToFetch = metadata.body
    //         console.log(metadata);
    //
    //         // const data = {...metadata, ...doc.data()}
    //         // console.log(data);
    //         // console.log(doc.data().body.text)
    //          const fetchRef = firebase.firestore().collection('freeDaily').doc('article')
    //          doUpdateTransactionArticle(metadata, bodyToFetch, fetchRef, type)
    //     });
    // })

    // user.email
    // user.displayName
    // user.photoURL,
    // user.uid
    // console.log('logged in');
    // console.log(user);

    // if (!subscribed) {
    // $.post("https://us-central1-bridgechampions.cloudfunctions.net/updateDailyFree", {key: "xoxo"}, (data, status) => {
    //     console.log(status);
    //     console.log(data);
    //   })
    //   .catch(err => {
    //         console.log(err)
    //   });

    membersDataSubscriptionUnsubscribe = firebase
      .firestore()
      .collection("membersData")
      .doc(user.uid)
      .onSnapshot((doc) => {
        // console.log(doc);
        const docData = doc.data();
        // console.log(docData);
        const userData = { ...user, ...docData };

        console.log("--- A USER LOGGED IN AND I HAVE THEIR DATA ---");
        console.log(user);
        console.log(docData);

        if (docData) {
          store.dispatch(userLoggedIn(userData));
          // console.log(docData);
          store.dispatch(
            setUserQuizScores(
              userData.quizScores,
              userData.totalQuizScore,
              false
            )
          );
        }
      });
    // subscribed = true;

    firebase
      .firestore()
      .collection("members")
      .doc(user.uid)
      .get()
      .then((snapshot) => {
        // console.log(snapshot);
        const data = snapshot.data();
        console.log("--- MORE USER DATA ---");
        console.log(data);
        // console.log(data['subscriptionExpires']);
        if (data) {
          store.dispatch(
            userLoggedInSubscriptionExpires(
              data["subscriptionExpires"],
              data["paymentMethod"],
              data["subscriptionActive"],
              data["trialUsed"]
            )
          );
        }
      });
    // }

    store.dispatch(userLoggedIn(user));
    // console.log("STUFF:");
    // console.log(store.getState().auth.uid);
    store.dispatch(setUser(user));
    // console.log(store.getState().auth.a);
  }
  // they just logged out - user == null:
  else {
    // console.log('logged out');
    if (membersDataSubscriptionUnsubscribe) {
      membersDataSubscriptionUnsubscribe();
    }
    store.dispatch(userLoggedOut());
  }
});

// <Provider store={store}></Provider>
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            {/*<Navbar />*/}
            <Layout>
              {routes}
              {/* <GoogleAnalytics /> */}
            </Layout>
            {/*<CreateArticle type="article" />*/}
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
