import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "react-materialize";
import "./DefenceHub.css";

function DefenceHub() {
  return (
    <div className="ch-page" aria-label="Defence home">
      <div className="ch-hero">
        <div className="ch-heroTitle">Defence</div>
        <p className="ch-heroSub">
          Interactive deals and explanatory articles — two paths below.
        </p>
      </div>

      <div className="ch-hubPaths">
        <section className="ch-path ch-path--primary" aria-labelledby="hub-defence-hands-on">
          <h2 className="ch-sectionLabel" id="hub-defence-hands-on">
            Hands-on practice
          </h2>
          <div className="ch-spotlight">
            <Link
              to="/defence/practice"
              className="ch-card ch-card--practiceTile ch-card--spotlight"
              aria-label="Learn by doing — interactive defence"
            >
              <div className="ch-cardHeader">
                <div className="ch-cardIcon ch-cardIcon--practice" aria-hidden="true">
                  <Icon>touch_app</Icon>
                </div>
                <div>
                  <div className="ch-cardTitle">Learn by doing</div>
                  <div className="ch-cardMicro">Interactive hands at the table</div>
                </div>
              </div>
              <div className="ch-cardText">
                Short, focused deals with teaching prompts — the main path to improve.
              </div>
              <div className="ch-cardCta" aria-hidden="true">
                <span>Continue</span>
                <Icon>arrow_forward</Icon>
              </div>
            </Link>
          </div>
        </section>

        <section className="ch-path ch-path--secondary" aria-labelledby="hub-defence-articles">
          <h2 className="ch-sectionLabel" id="hub-defence-articles">
            Articles & explanations
          </h2>
          <div className="ch-cards ch-cards--stack" role="list">
            <Link
              to="/defence/articles"
              className="ch-card ch-card--article"
              role="listitem"
              aria-label="Articles and explanations — defence"
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
                Written explanations, practice sets, and video for defence ideas.
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DefenceHub;
