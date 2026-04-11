import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "react-materialize";
import { CARDPLAY_HAS_NEW } from "./CardPlayTrainer";
import "./CardPlayHub.css";

function CardPlayHub() {
  return (
    <div className="ch-page" aria-label="Declarer play home">
      <div className="ch-hero">
        <div className="ch-heroTitle">Declarer Play</div>
        <p className="ch-heroSub">
          Interactive deals and explanatory articles — two paths below.
        </p>
      </div>

      <div className="ch-hubPaths">
        <section className="ch-path ch-path--primary" aria-labelledby="hub-cardplay-hands-on">
          <h2 className="ch-sectionLabel" id="hub-cardplay-hands-on">
            Hands-on practice
          </h2>
          <div className="ch-spotlight">
            <Link
              to="/cardPlay/practice"
              className="ch-card ch-card--practiceTile ch-card--spotlight"
              aria-label="Learn by doing — interactive declarer play"
            >
              <div className="ch-cardHeader">
                <div className="ch-cardIcon ch-cardIcon--practice" aria-hidden="true">
                  <Icon>touch_app</Icon>
                </div>
                <div>
                  <div className="ch-cardTitle">
                    Learn by doing
                    {CARDPLAY_HAS_NEW && <span className="ch-newBadge" aria-label="New content">New</span>}
                  </div>
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

        <section className="ch-path ch-path--secondary" aria-labelledby="hub-cardplay-articles">
          <h2 className="ch-sectionLabel" id="hub-cardplay-articles">
            Articles & explanations
          </h2>
          <div className="ch-cards ch-cards--stack" role="list">
            <Link
              to="/cardPlay/articles"
              className="ch-card ch-card--article"
              role="listitem"
              aria-label="Articles and explanations — declarer play"
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
                Written explanations, examples, and video for declarer play.
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default CardPlayHub;
