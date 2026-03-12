import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {
  PLAN_CHECKLIST_ITEMS,
  getPlanCompletion,
} from "../../data/planChecklist";
import "./PlanChecklist.css";


function PlanChecklist({ uid, quizScores, completedPractice }) {
  const completion = getPlanCompletion(PLAN_CHECKLIST_ITEMS, quizScores || {}, completedPractice || {});

  if (PLAN_CHECKLIST_ITEMS.length === 0) return null;

  const completedCount = Object.values(completion).filter(Boolean).length;
  const total = PLAN_CHECKLIST_ITEMS.length;
  const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  return (
    <section className="PlanChecklist" aria-label="Your plan">
      <div className="container">
        <div className="PlanChecklist-header">
          <h2 className="PlanChecklist-title">Your plan</h2>
          <div className="PlanChecklist-progress" role="progressbar" aria-valuenow={completedCount} aria-valuemin={0} aria-valuemax={total} title={`${completedCount} of ${total} complete`}>
            <div className="PlanChecklist-progressBar" style={{ width: `${pct}%` }} />
          </div>
          <p className="PlanChecklist-subtitle">
            {uid ? (completedCount === total ? "Done" : `${completedCount} of ${total}`) : "Sign in to save progress"}
          </p>
        </div>
        <ul className="PlanChecklist-list">
          {PLAN_CHECKLIST_ITEMS.map((item, idx) => {
            const done = !!completion[item.id];
            const path = item.path || (item.type === "article" ? "/counting/articles" : "/counting/practice");
            const stepNum = idx + 1;
            return (
              <li key={`${item.type}-${item.id}`} className="PlanChecklist-item">
                <Link
                  to={path}
                  className={`PlanChecklist-link ${done ? "PlanChecklist-link--done" : "PlanChecklist-link--todo"}`}
                  title={item.title}
                >
                  <span className="PlanChecklist-check" aria-hidden="true">
                    {done ? "✓" : ""}
                  </span>
                  <span className="PlanChecklist-label">Step {stepNum}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

const mapStateToProps = (state) => ({
  uid: state.auth?.uid,
  quizScores: state.user?.quizScores,
  completedPractice: state.user?.completedPractice,
});

export default connect(mapStateToProps)(PlanChecklist);
