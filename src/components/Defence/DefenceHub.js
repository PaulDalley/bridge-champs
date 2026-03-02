import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "react-materialize";
import "./DefenceHub.css";

function DefenceHub() {
  return (
    <div className="ch-page" aria-label="Defence home">
      <div className="ch-hero">
        <div className="ch-heroTitle">Defence</div>
        <div className="ch-heroSub">
          Choose <strong>Practice</strong> for interactive hands, or <strong>Technique</strong> to learn the ideas behind defence.
        </div>
      </div>

      <div className="ch-cards" role="list" aria-label="Defence options">
        <Link to="/defence/practice" className="ch-card ch-card--practiceTile" role="listitem" aria-label="Practice defence">
          <div className="ch-cardHeader">
            <div className="ch-cardIcon ch-cardIcon--practice" aria-hidden="true">
              <Icon>fitness_center</Icon>
            </div>
            <div>
              <div className="ch-cardTitle">Practice</div>
              <div className="ch-cardMicro">Interactive hands</div>
            </div>
          </div>
          <div className="ch-cardText">Short, focused problems with teaching prompts.</div>
        </Link>

        <Link to="/defence/articles" className="ch-card" role="listitem" aria-label="Learn defence technique">
          <div className="ch-cardHeader">
            <div className="ch-cardIcon ch-cardIcon--technique" aria-hidden="true">
              <Icon>school</Icon>
            </div>
            <div>
              <div className="ch-cardTitle">Learn the correct technique</div>
              <div className="ch-cardMicro">Short lessons + examples</div>
            </div>
          </div>
          <div className="ch-cardText">Articles, videos and practice sets for defence.</div>
        </Link>
      </div>
    </div>
  );
}

export default DefenceHub;

