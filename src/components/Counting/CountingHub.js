import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Icon } from "react-materialize";
import "./CountingHub.css";

function CountingHub({ subscriptionActive }) {
  const isMember = !!subscriptionActive;

  return (
    <div className="ch-page" aria-label="Counting home">
      <div className="ch-hero">
        <div className="ch-heroTitle">Counting</div>
        <div className="ch-heroSub">
          Choose <strong>Practice</strong> for interactive hands, or <strong>Technique</strong> to learn the ideas behind the training.
        </div>
      </div>

      <div className="ch-cards" role="list" aria-label="Counting options">
        <Link to="/counting/practice" className="ch-card ch-card--practiceTile" role="listitem" aria-label="Practice counting">
          <div className="ch-cardHeader">
            <div className="ch-cardIcon ch-cardIcon--practice" aria-hidden="true">
              <Icon>fitness_center</Icon>
            </div>
            <div>
              <div className="ch-cardTitle">
                Practice
                {!isMember && <span className="ch-badge">Preview</span>}
              </div>
              <div className="ch-cardMicro">Quick, interactive hands</div>
            </div>
          </div>
          <div className="ch-cardText">
            Watch the play, pause for prompts, and build the counting habit.
          </div>
          {!isMember && (
            <div className="ch-cardNote">
              Members get full access. Non-members can try 1 practice hand per difficulty.
            </div>
          )}
        </Link>

        <Link to="/counting/articles" className="ch-card" role="listitem" aria-label="Learn correct technique">
          <div className="ch-cardHeader">
            <div className="ch-cardIcon ch-cardIcon--technique" aria-hidden="true">
              <Icon>school</Icon>
            </div>
            <div>
              <div className="ch-cardTitle">Learn the correct technique</div>
              <div className="ch-cardMicro">Short lessons + examples</div>
            </div>
          </div>
          <div className="ch-cardText">
            Clear explanations for the decisions you’re practising.
          </div>
        </Link>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  subscriptionActive: state.auth.subscriptionActive,
});

export default connect(mapStateToProps)(CountingHub);

