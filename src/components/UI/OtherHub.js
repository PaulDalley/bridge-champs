import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "react-materialize";
import "./OtherHub.css";

function OtherHub() {
  return (
    <div className="oh-page" aria-label="Other home">
      <div className="oh-hero">
        <div className="oh-heroTitle">Other</div>
        <div className="oh-heroSub">Extra resources and tools.</div>
      </div>

      <div className="oh-cards" role="list" aria-label="Other options">
        <Link to="/articles" className="oh-card" role="listitem" aria-label="Extra articles">
          <div className="oh-cardIcon" aria-hidden="true">
            <Icon>article</Icon>
          </div>
          <div className="oh-cardTitle">Extra articles</div>
          <div className="oh-cardText">All articles across the site.</div>
        </Link>

        <Link to="/quizzes" className="oh-card" role="listitem" aria-label="Quizzes">
          <div className="oh-cardIcon" aria-hidden="true">
            <Icon>quiz</Icon>
          </div>
          <div className="oh-cardTitle">Quizzes</div>
          <div className="oh-cardText">Test your understanding with quizzes.</div>
        </Link>

        <Link to="/ask" className="oh-card" role="listitem" aria-label="Ask a question">
          <div className="oh-cardIcon" aria-hidden="true">
            <Icon>question_answer</Icon>
          </div>
          <div className="oh-cardTitle">Ask</div>
          <div className="oh-cardText">Ask a bridge question and get help.</div>
        </Link>
      </div>
    </div>
  );
}

export default OtherHub;

