import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { MONTHLY_THEME } from "../../data/monthlyTheme";
import { PLAN_CHECKLIST_ITEMS, getPlanCompletion } from "../../data/planChecklist";
import "./RecentlyAdded.css";

function RecentlyAdded({ uid, subscriptionActive, a, quizScores, completedPractice }) {
  const theme = MONTHLY_THEME;
  const completion = getPlanCompletion(PLAN_CHECKLIST_ITEMS, quizScores || {}, completedPractice || {});

  const trainingItems = PLAN_CHECKLIST_ITEMS.filter((p) => p.type === "practice" || p.type === "quiz");
  const articleItems = PLAN_CHECKLIST_ITEMS.filter((p) => p.type === "article");

  const trainingDone = trainingItems.filter((p) => completion[p.id]).length;
  const trainingTotal = trainingItems.length;
  const articleDone = articleItems.filter((p) => completion[p.id]).length;
  const articleTotal = articleItems.length;

  const firstTraining = trainingItems.find((p) => !completion[p.id]);
  const firstArticle = articleItems.find((p) => !completion[p.id]);

  const showSubscribeCta = !subscriptionActive && a !== true;

  return (
    <section className="RecentlyAdded" aria-label="Monthly theme and plan">
      {showSubscribeCta && (
        <Link to="/membership" className="RecentlyAdded-subscribeCta">
          <span className="RecentlyAdded-subscribeCtaIcon">
            <i className="material-icons" aria-hidden>star</i>
          </span>
          <span className="RecentlyAdded-subscribeCtaContent">
            <strong>Get full access</strong> — Subscribe to unlock all training exercises, articles, and quizzes
          </span>
          <span className="RecentlyAdded-subscribeCtaBtn">Subscribe now</span>
        </Link>
      )}
      <p className="RecentlyAdded-label">This month&apos;s theme</p>
      <h2 className="RecentlyAdded-theme">{theme.label}</h2>

      <div className="RecentlyAdded-todo">
        <Link
          to={firstTraining?.path || "/counting/practice"}
          className="RecentlyAdded-box"
          title="Training exercises"
        >
          <span className="RecentlyAdded-boxIcon">
            <i className="material-icons" aria-hidden>fitness_center</i>
          </span>
          <span className="RecentlyAdded-boxContent">
            <span className="RecentlyAdded-boxLabel">Training exercises</span>
            <span className="RecentlyAdded-boxCount">{uid ? `${trainingDone}/${trainingTotal}` : `0/${trainingTotal}`}</span>
          </span>
        </Link>
        <Link
          to={firstArticle?.path || "/counting/articles"}
          className="RecentlyAdded-box"
          title="Articles"
        >
          <span className="RecentlyAdded-boxIcon">
            <i className="material-icons" aria-hidden>menu_book</i>
          </span>
          <span className="RecentlyAdded-boxContent">
            <span className="RecentlyAdded-boxLabel">Articles</span>
            <span className="RecentlyAdded-boxCount">{uid ? `${articleDone}/${articleTotal}` : `0/${articleTotal}`}</span>
          </span>
        </Link>
      </div>
    </section>
  );
}

export default connect(({ auth, user }) => ({
  uid: auth?.uid,
  subscriptionActive: auth?.subscriptionActive,
  a: auth?.a,
  quizScores: user?.quizScores,
  completedPractice: user?.completedPractice,
}))(RecentlyAdded);
