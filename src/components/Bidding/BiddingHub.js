import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "react-materialize";
import "./BiddingHub.css";

function BiddingHub() {
  return (
    <div className="ch-page" aria-label="Bidding home">
      <div className="ch-hero">
        <div className="ch-heroTitle">Bidding</div>
        <p className="ch-heroSub">
          Interactive deals and explanatory articles — two paths below.
        </p>
      </div>

      <div className="ch-hubPaths">
        <section className="ch-path ch-path--primary" aria-labelledby="hub-bidding-hands-on">
          <h2 className="ch-sectionLabel" id="hub-bidding-hands-on">
            Hands-on practice
          </h2>
          <div className="ch-spotlight">
            <Link
              to="/bidding/practice"
              className="ch-card ch-card--practiceTile ch-card--spotlight"
              aria-label="Learn by doing — interactive bidding"
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

        <section className="ch-path ch-path--secondary" aria-labelledby="hub-bidding-articles">
          <h2 className="ch-sectionLabel" id="hub-bidding-articles">
            Articles & explanations
          </h2>
          <div className="ch-cards ch-cards--stack" role="list">
            <Link
              to="/bidding/advanced"
              className="ch-card ch-card--article"
              role="listitem"
              aria-label="Articles and explanations — bidding"
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
                Written explanations, examples, and video for bidding ideas.
              </div>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default BiddingHub;
