import $ from "jquery";
window.jQuery = window.$ = $;

// import $ from 'jquery';
// window.$ = $;

// import jQuery from 'jquery';
// import "./assets/css/materialize-required.css";
// import './assets/css/materialize.min.css';
// import './assets/js/materialize.min';

// import 'jquery';
// import "materialize-css/dist/css/materialize.min.css";
// import "materialize-css/dist/js/materialize.min.js";

// NEW: Doesn't work:
import "materialize-css";

import React, { Component, lazy, Suspense } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom"; // Routes replaced Switch component deprecated.
import "./App.css";
import Contact from "./components/UI/Contact";
import About from "./components/UI/About";
import PrivacyPolicy from "./components/UI/PrivacyPolicy";
import HomePage from "./components/HomePage";
import Articles from "./containers/Articles";
import CategoryArticles from "./containers/CategoryArticles";
import DisplayArticle from "./components/Articles/DisplayArticle";
import DisplayCategoryArticle from "./components/Articles/DisplayCategoryArticle";
import SpecificArticles from "./components/Articles/SpecificArticles";
import ArticlesByCategory from "./components/Articles/ArticlesByCategory";
import PracticeQuestionViewer from "./components/PracticeQuestions/PracticeQuestionViewer";
import CreatePracticeQuestionBundle from "./components/PracticeQuestions/CreatePracticeQuestionBundle";
import Quizzes from "./containers/Quizzes";
import DisplayQuiz from "./components/Quizzes/DisplayQuiz";
import PremiumMembership from "./components/Auth/PremiumMembership";
import CurrentTournaments from "./containers/CurrentTournaments";
import Questions from "./containers/Questions";
import Layout from "./components/Layout";
import AuthComponent from "./containers/AuthComponent";
import CompleteProfile from "./components/Auth/CompleteProfile";
import TestingGround from "./components/TestingGround";
import SkeletonLoader from "./components/UI/SkeletonLoader";
import Settings from "./components/UI/Settings";
import Flyer from "./components/Promotional/Flyer";
import AskBridgeQuestionPage from "./components/Questions/AskBridgeQuestionPage";
import HandSubmissionsAdmin from "./components/Admin/HandSubmissionsAdmin";
import CountingTrumpsTrainer from "./components/Counting/CountingTrumpsTrainer";
import CountingHub from "./components/Counting/CountingHub";
import CardPlayHub from "./components/CardPlay/CardPlayHub";
import CardPlayTrainer from "./components/CardPlay/CardPlayTrainer";
import DefenceHub from "./components/Defence/DefenceHub";
import BiddingHub from "./components/Bidding/BiddingHub";
import BiddingTrainer from "./components/Bidding/BiddingTrainer";
import JacobyConventionArticle from "./components/Bidding/JacobyConventionArticle";
import DefenceTrainer from "./components/Defence/DefenceTrainer";
import OtherHub from "./components/UI/OtherHub";
import SystemPage from "./components/System/SystemPage";
import SystemCardEditor from "./components/System/SystemCardEditor";
import BeginnerPracticePage from "./components/Beginner/BeginnerPracticePage";

import { firebase } from "./firebase/config";

// Lazy load heavy components for code splitting
const CreateArticle = lazy(() => import("./containers/CreateArticle"));
const CreateCategoryArticle = lazy(() => import("./containers/CreateCategoryArticle"));
const CreateQuiz = lazy(() => import("./containers/CreateQuiz"));
const DBComp = lazy(() => import("./containers/DBComp"));

// V2 System - New article editor
const CreateArticleV2 = lazy(() => import("./v2/pages/CreateArticleV2"));

import GoogleAnalytics from "./components/GoogleAnaytics";

import {
  userLoggedIn,
  userLoggedOut,
  setUser,
  userLoggedInSubscriptionExpires,
  authReady,
} from "./store/actions/authActions";
import { setUserQuizScores, setUserCompletedPractice } from "./store/actions/usersActions";
import {
  getArticlesRootPath,
  getPracticeRootPath,
  isLocalhostBuild,
} from "./utils/beginnerMode";

// Configure redux store:
import configureStore from "./store/configureStore";
const store = configureStore();
const beginnerLocalOnlyEnabled = isLocalhostBuild();

const routes = (
  <Switch>
    <Route
      path="/beginner/practice"
      exact
      render={(routeProps) =>
        beginnerLocalOnlyEnabled ? (
          <Redirect
            to={{
              pathname: "/beginner/practice/declarer",
              search: routeProps.location.search,
            }}
          />
        ) : (
          <Redirect to="/" />
        )
      }
    />
    <Route
      path="/beginner/practice/:categoryKey"
      exact
      render={(routeProps) =>
        beginnerLocalOnlyEnabled ? <BeginnerPracticePage {...routeProps} /> : <Redirect to="/" />
      }
    />
    <Route
      path="/beginner/articles"
      exact
      render={() =>
        beginnerLocalOnlyEnabled ? (
          <Redirect to="/beginner/practice/declarer" />
        ) : (
          <Redirect to="/" />
        )
      }
    />
    <Route
      path="/beginner/articles/declarer"
      exact
      render={(routeProps) => (
        beginnerLocalOnlyEnabled ? (
          <CategoryArticles
            {...routeProps}
            articleType="beginnerCardPlay"
            bodyRef="beginnerCardPlayBody"
          />
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/beginner/articles/declarer/:id"
      render={(routeProps) => (
        beginnerLocalOnlyEnabled ? (
          <DisplayCategoryArticle
            {...routeProps}
            articleType="beginnerCardPlay"
            bodyRef="beginnerCardPlayBody"
          />
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/beginner/articles/defence"
      exact
      render={(routeProps) => (
        beginnerLocalOnlyEnabled ? (
          <CategoryArticles
            {...routeProps}
            articleType="beginnerDefence"
            bodyRef="beginnerDefenceBody"
          />
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/beginner/articles/defence/:id"
      render={(routeProps) => (
        beginnerLocalOnlyEnabled ? (
          <DisplayCategoryArticle
            {...routeProps}
            articleType="beginnerDefence"
            bodyRef="beginnerDefenceBody"
          />
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/beginner/articles/bidding"
      exact
      render={(routeProps) => (
        beginnerLocalOnlyEnabled ? (
          <CategoryArticles
            {...routeProps}
            articleType="beginnerBidding"
            bodyRef="beginnerBiddingBody"
          />
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/beginner/articles/bidding/:id"
      render={(routeProps) => (
        beginnerLocalOnlyEnabled ? (
          <DisplayCategoryArticle
            {...routeProps}
            articleType="beginnerBidding"
            bodyRef="beginnerBiddingBody"
          />
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/beginner/articles/counting"
      exact
      render={(routeProps) => (
        beginnerLocalOnlyEnabled ? (
          <CategoryArticles
            {...routeProps}
            articleType="beginnerCounting"
            bodyRef="beginnerCountingBody"
          />
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/beginner/articles/counting/:id"
      render={(routeProps) => (
        beginnerLocalOnlyEnabled ? (
          <DisplayCategoryArticle
            {...routeProps}
            articleType="beginnerCounting"
            bodyRef="beginnerCountingBody"
          />
        ) : (
          <Redirect to="/" />
        )
      )}
    />

    <Route
      path="/practice"
      exact
      render={(routeProps) => (
        <Redirect
          to={{
            pathname: getPracticeRootPath(false),
            search: routeProps.location.search,
          }}
        />
      )}
    />
    <Route
      path="/learn"
      exact
      render={(routeProps) => (
        <Redirect
          to={{
            pathname: getArticlesRootPath(false),
            search: routeProps.location.search,
          }}
        />
      )}
    />
    <Route path="/other" component={OtherHub} exact />
    <Route path="/system" component={SystemCardEditor} exact />
    <Route
      path="/system/card"
      exact
      render={(routeProps) => (
        <Redirect to={{ pathname: "/system", search: routeProps.location.search }} />
      )}
    />
    <Route path="/system/recommendations" component={SystemPage} exact />

    <Route path="/cardPlay/practice" component={CardPlayTrainer} exact />
    <Route path="/cardPlay/articles" render={(routeProps) => <CategoryArticles {...routeProps} articleType="cardPlay" bodyRef="cardPlayBody" />} exact />
    <Route path="/cardPlay/articles/:id" render={(routeProps) => <DisplayCategoryArticle {...routeProps} articleType="cardPlay" bodyRef="cardPlayBody" />} />
    <Route path="/cardPlay/basics" render={(routeProps) => <CategoryArticles {...routeProps} articleType="cardPlayBasics" bodyRef="cardPlayBasicsBody" />} exact />
    <Route path="/cardPlay/basics/:id" render={(routeProps) => <DisplayCategoryArticle {...routeProps} articleType="cardPlayBasics" bodyRef="cardPlayBasicsBody" />} />
    <Route path="/cardPlay" component={CardPlayHub} exact />

    <Route path="/defence/practice" component={DefenceTrainer} exact />
    <Route path="/defence/articles" render={(routeProps) => <CategoryArticles {...routeProps} articleType="defence" bodyRef="defenceBody" />} exact />
    <Route path="/defence/articles/:id" render={(routeProps) => <DisplayCategoryArticle {...routeProps} articleType="defence" bodyRef="defenceBody" />} />
    <Route path="/defence/basics" render={(routeProps) => <CategoryArticles {...routeProps} articleType="defenceBasics" bodyRef="defenceBasicsBody" />} exact />
    <Route path="/defence/basics/:id" render={(routeProps) => <DisplayCategoryArticle {...routeProps} articleType="defenceBasics" bodyRef="defenceBasicsBody" />} />
    <Route path="/defence" component={DefenceHub} exact />

    <Route
      path="/counting/articles"
      render={(routeProps) => <CategoryArticles {...routeProps} articleType="counting" bodyRef="countingBody" />}
      exact
    />
    <Route
      path="/counting/articles/:id"
      render={(routeProps) => <DisplayCategoryArticle {...routeProps} articleType="counting" bodyRef="countingBody" />}
    />
    <Route path="/counting/practice" render={(routeProps) => <CountingTrumpsTrainer {...routeProps} trainerLabel="Counting" categoryKey="counting" />} exact />
    <Route path="/counting" component={CountingHub} exact />
    <Route path="/ask" component={AskBridgeQuestionPage} />
    <Route path="/admin/submissions" component={HandSubmissionsAdmin} />
    <Route
      path="/create/db"
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <DBComp />
        </Suspense>
      )}
    />

    <Route
      path="/create/article"
      create={true}
      creating={true}
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateArticle articleType="articles" bodyRef="article" />
        </Suspense>
      )}
    />

    {/* V2 SYSTEM ROUTES - New article editor */}
    <Route
      path="/create-article-v2/:category"
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateArticleV2 />
        </Suspense>
      )}
    />
    <Route
      path="/edit-article-v2/:category/:id"
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateArticleV2 />
        </Suspense>
      )}
    />

    {/* CHANGES TO ADD NEW ROUTES FOR 3 TYPES OF ARTICLE - more specific paths first so /create/defence/basics matches before /create/defence */}
    <Route
      path="/create/beginner/declarer"
      exact
      render={() => (
        beginnerLocalOnlyEnabled ? (
          <Suspense fallback={<SkeletonLoader type="article" />}>
            <CreateCategoryArticle
              articleType="beginnerCardPlay"
              bodyRef="beginnerCardPlayBody"
              create={true}
              creating={true}
            />
          </Suspense>
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/create/beginner/defence"
      exact
      render={() => (
        beginnerLocalOnlyEnabled ? (
          <Suspense fallback={<SkeletonLoader type="article" />}>
            <CreateCategoryArticle
              articleType="beginnerDefence"
              bodyRef="beginnerDefenceBody"
              create={true}
              creating={true}
            />
          </Suspense>
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/create/beginner/bidding"
      exact
      render={() => (
        beginnerLocalOnlyEnabled ? (
          <Suspense fallback={<SkeletonLoader type="article" />}>
            <CreateCategoryArticle
              articleType="beginnerBidding"
              bodyRef="beginnerBiddingBody"
              create={true}
              creating={true}
            />
          </Suspense>
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/create/beginner/counting"
      exact
      render={() => (
        beginnerLocalOnlyEnabled ? (
          <Suspense fallback={<SkeletonLoader type="article" />}>
            <CreateCategoryArticle
              articleType="beginnerCounting"
              bodyRef="beginnerCountingBody"
              create={true}
              creating={true}
            />
          </Suspense>
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/create/defence/basics"
      create={true}
      creating={true}
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle
            articleType="defenceBasics"
            bodyRef="defenceBasicsBody"
            create={true}
            creating={true}
          />
        </Suspense>
      )}
    />
    <Route
      path="/create/defence"
      exact
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle
            articleType="defence"
            bodyRef="defenceBody"
            create={true}
            creating={true}
          />
        </Suspense>
      )}
    />

    <Route
      path="/create/cardPlay/basics"
      create={true}
      creating={true}
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle
            articleType="cardPlayBasics"
            bodyRef="cardPlayBasicsBody"
            create={true}
            creating={true}
          />
        </Suspense>
      )}
    />
    <Route
      path="/create/cardPlay"
      exact
      create={true}
      creating={true}
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle
            articleType="cardPlay"
            bodyRef="cardPlayBody"
            create={true}
            creating={true}
          />
        </Suspense>
      )}
    />

    <Route
      path="/create/bidding"
      exact
      create={true}
      creating={true}
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle
            articleType="bidding"
            bodyRef="biddingBody"
            create={true}
            creating={true}
          />
        </Suspense>
      )}
    />
    <Route
      path="/create/bidding/basics"
      create={true}
      creating={true}
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle
            articleType="biddingBasics"
            bodyRef="biddingBasicsBody"
            create={true}
            creating={true}
          />
        </Suspense>
      )}
    />

    <Route
      path="/create/counting"
      create={true}
      creating={true}
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle articleType="counting" bodyRef="countingBody" create={true} creating={true} />
        </Suspense>
      )}
    />

    <Route
      path="/edit/beginnerCardPlay/:id"
      render={(routeProps) => (
        beginnerLocalOnlyEnabled ? (
          <Suspense fallback={<SkeletonLoader type="article" />}>
            <CreateCategoryArticle
              {...routeProps}
              edit={true}
              articleType="beginnerCardPlay"
              bodyRef="beginnerCardPlayBody"
            />
          </Suspense>
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/edit/beginnerDefence/:id"
      render={(routeProps) => (
        beginnerLocalOnlyEnabled ? (
          <Suspense fallback={<SkeletonLoader type="article" />}>
            <CreateCategoryArticle
              {...routeProps}
              edit={true}
              articleType="beginnerDefence"
              bodyRef="beginnerDefenceBody"
            />
          </Suspense>
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/edit/beginnerBidding/:id"
      render={(routeProps) => (
        beginnerLocalOnlyEnabled ? (
          <Suspense fallback={<SkeletonLoader type="article" />}>
            <CreateCategoryArticle
              {...routeProps}
              edit={true}
              articleType="beginnerBidding"
              bodyRef="beginnerBiddingBody"
            />
          </Suspense>
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/edit/beginnerCounting/:id"
      render={(routeProps) => (
        beginnerLocalOnlyEnabled ? (
          <Suspense fallback={<SkeletonLoader type="article" />}>
            <CreateCategoryArticle
              {...routeProps}
              edit={true}
              articleType="beginnerCounting"
              bodyRef="beginnerCountingBody"
            />
          </Suspense>
        ) : (
          <Redirect to="/" />
        )
      )}
    />
    <Route
      path="/edit/defence/:id"
      render={(routeProps) => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle
            {...routeProps}
            edit={true}
            articleType="defence"
            bodyRef="defenceBody"
          />
        </Suspense>
      )}
    />
    <Route
      path="/edit/cardPlay/:id"
      render={(routeProps) => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle
            {...routeProps}
            edit={true}
            articleType="cardPlay"
            bodyRef="cardPlayBody"
          />
        </Suspense>
      )}
    />
    <Route
      path="/edit/cardPlayBasics/:id"
      render={(routeProps) => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle
            {...routeProps}
            edit={true}
            articleType="cardPlayBasics"
            bodyRef="cardPlayBasicsBody"
          />
        </Suspense>
      )}
    />
    <Route
      path="/edit/defenceBasics/:id"
      render={(routeProps) => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle
            {...routeProps}
            edit={true}
            articleType="defenceBasics"
            bodyRef="defenceBasicsBody"
          />
        </Suspense>
      )}
    />
    <Route
      path="/edit/bidding/:id"
      render={(routeProps) => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle
            {...routeProps}
            edit={true}
            articleType="bidding"
            bodyRef="biddingBody"
          />
        </Suspense>
      )}
    />
    <Route
      path="/edit/biddingBasics/:id"
      render={(routeProps) => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle
            {...routeProps}
            edit={true}
            articleType="biddingBasics"
            bodyRef="biddingBasicsBody"
          />
        </Suspense>
      )}
    />

    <Route
      path="/edit/counting/:id"
      render={(routeProps) => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateCategoryArticle {...routeProps} edit={true} articleType="counting" bodyRef="countingBody" />
        </Suspense>
      )}
    />
    <Route path="/bidding/practice" component={BiddingTrainer} exact />
    <Route path="/bidding" component={BiddingHub} exact />
    <Route path="/bidding/worthwhile-conventions/jacoby-2nt" component={JacobyConventionArticle} exact />
    <Route path="/bidding/basics" render={(routeProps) => <CategoryArticles {...routeProps} articleType="biddingBasics" bodyRef="biddingBasicsBody" />} exact />
    <Route path="/bidding/basics/:id" render={(routeProps) => <DisplayCategoryArticle {...routeProps} articleType="biddingBasics" bodyRef="biddingBasicsBody" />} />
    <Route path="/bidding/advanced" render={(routeProps) => <CategoryArticles {...routeProps} articleType="bidding" bodyRef="biddingBody" />} exact />
    <Route path="/bidding/advanced/:id" render={(routeProps) => <DisplayCategoryArticle {...routeProps} articleType="bidding" bodyRef="biddingBody" />} />
    {/* END CHANGES TO ADD NEW ROUTES FOR 3 TYPES OF ARTICLE */}

    <Route
      path="/create/tournament"
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateArticle articleType="tournament" />
        </Suspense>
      )}
    />

    <Route
      path="/create/quiz"
      articleType="quiz"
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateQuiz />
        </Suspense>
      )}
    />

    <Route
      path="/edit/article/:id"
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateArticle edit={true} articleType="article" type="article" />
        </Suspense>
      )}
    />
    <Route
      path="/edit/quiz/:id"
      render={() => (
        <Suspense fallback={<SkeletonLoader type="article" />}>
          <CreateQuiz edit={true} articleType="quiz" type="quiz" />
        </Suspense>
      )}
    />

    <Route path="/testingground" component={TestingGround} />

    <Route path="/membership" component={PremiumMembership} />
    <Route path="/subscribe" component={PremiumMembership} />
    <Route path="/settings" component={Settings} />
    <Route
      path="/articles"
      render={(routeProps) => <Articles {...routeProps} />}
      exact
    />
    <Route path="/article/:id" component={DisplayArticle} />
    <Route path="/quizzes" component={Quizzes} />
    <Route path="/quiz/:id" component={DisplayQuiz} />
    <Route path="/practice-questions/:bundleId" component={PracticeQuestionViewer} />
    <Route
      path="/create-practice-questions/:category"
      render={(routeProps) => (
        <CreatePracticeQuestionBundle {...routeProps} articleType={routeProps.match.params.category} />
      )}
    />
    <Route
      path="/edit-practice-questions/:category/:bundleId"
      render={(routeProps) => (
        <CreatePracticeQuestionBundle {...routeProps} articleType={routeProps.match.params.category} />
      )}
    />
    <Route path="/tournaments" component={CurrentTournaments} />
    <Route path="/tournament/:tournamentName" component={SpecificArticles} />
    <Route path="/conventions" component={ArticlesByCategory} />
    <Route path="/questions" component={Questions} />

    <Route path="/contact" component={Contact} />
    <Route path="/privacy" component={PrivacyPolicy} />
    <Route path="/flyer" component={Flyer} />

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

    <Route path="/signup" component={AuthComponent} />
    <Route path="/complete-profile" component={CompleteProfile} />
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
/*const randomUpdateDailyArticle = () => {
  firebase
    .firestore()
    .collection("articles")
    .get()
    .then((docs) => {
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
*/

// END OF DAILY UPDATE CODE

// Firebase subscription to auth state in current application:
let subscribed = false;
let membersDataSubscriptionUnsubscribe;
let membersSubscriptionUnsubscribe;
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
    console.log("--- USER JUST LOGGED IN ---");
    console.log(user);

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

        // console.log("--- A USER LOGGED IN AND I HAVE THEIR DATA ---");
        // console.log(user);
        // console.log(docData);

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
          const cp = docData.completedPractice;
          store.dispatch(setUserCompletedPractice(typeof cp === "object" && cp !== null ? cp : {}));
        }
      });
    // subscribed = true;

    if (membersSubscriptionUnsubscribe) {
      membersSubscriptionUnsubscribe();
    }
    membersSubscriptionUnsubscribe = firebase
      .firestore()
      .collection("members")
      .doc(user.uid)
      .onSnapshot((snapshot) => {
        const data = snapshot.exists ? snapshot.data() : null;
        const exp = data?.["subscriptionExpires"];
        const expiresAt = exp ? (typeof exp.toMillis === "function" ? exp.toMillis() : (typeof exp.toDate === "function" ? exp.toDate().getTime() : new Date(exp).getTime())) : 0;
        const hasValidExpiry = expiresAt > Date.now();
        // Active if: (subscriptionActive is true AND not expired) OR (have a future expiry — handles legacy/manual docs)
        const explicitlyActive = data && data["subscriptionActive"] === true;
        const hasFutureExpiry = data && exp != null && hasValidExpiry;
        const subscriptionActive = !!(explicitlyActive && hasValidExpiry) || !!hasFutureExpiry;
        const rawTier = data?.["tier"] ?? "basic";
        const tier = typeof rawTier === "string" ? rawTier.toLowerCase() : "basic";
        store.dispatch(
          userLoggedInSubscriptionExpires(
            data?.["subscriptionExpires"] ?? null,
            data?.["paymentMethod"] ?? null,
            subscriptionActive,
            data?.["trialUsed"] ?? false,
            tier
          )
        );
      });

    store.dispatch(userLoggedIn(user));
    // console.log("STUFF:");
    // console.log(store.getState().auth.uid);
    store.dispatch(setUser(user));
    // console.log(store.getState().auth.a);
    store.dispatch(authReady());
  }
  // they just logged out - user == null:
  else {
    // console.log('logged out');
    if (membersDataSubscriptionUnsubscribe) {
      membersDataSubscriptionUnsubscribe();
    }
    if (membersSubscriptionUnsubscribe) {
      membersSubscriptionUnsubscribe();
    }
    store.dispatch(userLoggedOut());
    store.dispatch(authReady());
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
              <GoogleAnalytics />
            </Layout>
            {/*<CreateArticle type="article" />*/}
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
