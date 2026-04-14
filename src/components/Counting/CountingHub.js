import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Icon } from "react-materialize";
import { COUNTING_HAS_NEW } from "./CountingTrumpsTrainer";
import "./CountingHub.css";

function CountingHub({ subscriptionActive }) {
  const isMember = !!subscriptionActive;

  return (
    <div className="ch-page" aria-label="Counting home">
      <div className="ch-hero">
        <div className="ch-heroTitle">Counting</div>
        <p className="ch-heroSub">
          Interactive hands and explanatory articles — two paths below.
        </p>
      </div>

      <div className="ch-hubPaths">
        <section className="ch-path ch-path--primary" aria-labelledby="hub-counting-hands-on">
          <h2 className="ch-sectionLabel" id="hub-counting-hands-on">
            Hands-on practice
          </h2>
          <div className="ch-spotlight">
            <Link
              to="/counting/practice"
              className="ch-card ch-card--practiceTile ch-card--spotlight"
              aria-label="Learn by doing — interactive counting"
            >
              <div className="ch-cardHeader">
                <div className="ch-cardIcon ch-cardIcon--practice" aria-hidden="true">
                  <Icon>touch_app</Icon>
                </div>
                <div>
                  <div className="ch-cardTitle">
                    Learn by doing
                    {COUNTING_HAS_NEW && <span className="ch-newBadge" aria-label="New content">New</span>}
                    {!isMember && <span className="ch-badge">Preview</span>}
                  </div>
                  <div className="ch-cardMicro">Quick, interactive hands</div>
                </div>
              </div>
              <div className="ch-cardText">
                Watch the play, pause for prompts, and build the counting habit — the main path to improve.
              </div>
              {!isMember && (
                <div className="ch-cardNote">
                  Members get full access. Non-members can try 1 practice hand per stage.
                </div>
              )}
              <div className="ch-cardCta" aria-hidden="true">
                <span>Continue</span>
                <Icon>arrow_forward</Icon>
              </div>
            </Link>
          </div>
        </section>

        <section className="ch-path ch-path--secondary" aria-labelledby="hub-counting-articles">
          <h2 className="ch-sectionLabel" id="hub-counting-articles">
            Articles & explanations
          </h2>
          <div className="ch-cards ch-cards--stack" role="list">
            <Link
              to="/counting/articles"
              className="ch-card ch-card--article"
              role="listitem"
              aria-label="Articles and explanations — counting technique"
            >
              <div className="ch-cardHeader">
                <div className="ch-cardIcon ch-cardIcon--technique" aria-hidden="true">
                  <Icon>article</Icon>
                </div>
                <div>
                  <div className="ch-cardTitle">Read in depth</div>
                  <div className="ch-cardMicro">Explanatory articles and video</div>
                </div>
              </div>
              <div className="ch-cardText">
                Clear written explanations for the technique behind the training.
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  subscriptionActive: state.auth.subscriptionActive,
});

export default connect(mapStateToProps)(CountingHub);
