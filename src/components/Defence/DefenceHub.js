import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Icon } from "react-materialize";
import "./DefenceHub.css";

function DefenceHub() {
  const isAdmin = useSelector((state) => state.auth.a === true);

  return (
    <div className="ch-page" aria-label="Defence home">
      <div className="ch-hero">
        <div className="ch-heroTitle">Defence</div>
        <div className="ch-heroSub">
          Choose <strong>Practice</strong> for interactive hands, <strong>Advanced ideas</strong> for lessons and examples, or <strong>Basics</strong> for foundations (coming soon).
        </div>
      </div>

      <div className="ch-spotlight" role="presentation">
        <Link to="/defence/practice" className="ch-card ch-card--practiceTile ch-card--spotlight" role="listitem" aria-label="Practice defence">
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
      </div>

      <div className="ch-cards ch-cards--secondary" role="list" aria-label="Defence options">
        <Link to="/defence/articles" className="ch-card" role="listitem" aria-label="Advanced ideas">
          <div className="ch-cardHeader">
            <div className="ch-cardIcon ch-cardIcon--technique" aria-hidden="true">
              <Icon>school</Icon>
            </div>
            <div>
              <div className="ch-cardTitle">Advanced ideas</div>
              <div className="ch-cardMicro">Short lessons + examples</div>
            </div>
          </div>
          <div className="ch-cardText">Articles, videos and practice sets for defence.</div>
        </Link>

        {isAdmin ? (
          <Link to="/defence/basics" className="ch-card" role="listitem" aria-label="Improve your fundamentals">
            <div className="ch-cardHeader">
              <div className="ch-cardIcon ch-cardIcon--technique" aria-hidden="true">
                <Icon>menu_book</Icon>
              </div>
              <div>
                <div className="ch-cardTitle">Improve your fundamentals</div>
                <div className="ch-cardMicro">Coming soon</div>
              </div>
            </div>
            <div className="ch-cardText">Foundational defence concepts. New content being added.</div>
          </Link>
        ) : (
          <div className="ch-card ch-card--disabled" role="listitem" aria-label="Improve your fundamentals (coming soon)">
            <div className="ch-cardHeader">
              <div className="ch-cardIcon ch-cardIcon--technique" aria-hidden="true">
                <Icon>menu_book</Icon>
              </div>
              <div>
                <div className="ch-cardTitle">Improve your fundamentals</div>
                <div className="ch-cardMicro">Coming soon</div>
              </div>
            </div>
            <div className="ch-cardText">Foundational defence concepts. New content being added.</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DefenceHub;

