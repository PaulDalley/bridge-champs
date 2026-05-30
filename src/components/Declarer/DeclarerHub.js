import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "react-materialize";
import { Helmet } from "react-helmet-async";
import { DECLARER_HAS_NEW } from "./DeclarerTrainer";
import "./DeclarerHub.css";

function DeclarerHub() {
  return (
    <div className="ch-page" aria-label="Declarer play home">
      <Helmet>
        <title>Declarer Play: Lessons & Practice | Bridge Champions</title>
        <meta
          name="description"
          content="Improve declarer play in bridge: trump management, finesses, hand planning, and counting tricks — interactive practice plus clear, worked-example articles."
        />
        <link rel="canonical" href="https://bridgechampions.com/declarer" />
        <meta property="og:url" content="https://bridgechampions.com/declarer" />
        <meta property="og:title" content="Declarer Play: Lessons & Practice | Bridge Champions" />
        <meta
          property="og:description"
          content="Improve declarer play in bridge: trump management, finesses, hand planning, and counting tricks — interactive practice plus clear, worked-example articles."
        />
      </Helmet>
      <div className="ch-hero">
        <h1 className="ch-heroTitle">Declarer Play</h1>
        <p className="ch-heroSub">
          Interactive deals and explanatory articles - two paths below.
        </p>
      </div>

      <div className="ch-hubPaths">
        <section className="ch-path ch-path--primary" aria-labelledby="hub-declarer-hands-on">
          <h2 className="ch-sectionLabel" id="hub-declarer-hands-on">
            Hands-on practice
          </h2>
          <div className="ch-spotlight">
            <Link
              to="/declarer/practice"
              className="ch-card ch-card--practiceTile ch-card--spotlight"
              aria-label="Learn by doing - interactive declarer play"
            >
              <div className="ch-cardHeader">
                <div className="ch-cardIcon ch-cardIcon--practice" aria-hidden="true">
                  <Icon>touch_app</Icon>
                </div>
                <div>
                  <div className="ch-cardTitle">
                    Learn by doing
                    {DECLARER_HAS_NEW && <span className="ch-newBadge" aria-label="New content">New</span>}
                  </div>
                  <div className="ch-cardMicro">Interactive hands at the table</div>
                </div>
              </div>
              <div className="ch-cardText">
                Short, focused deals with teaching prompts - the main path to improve.
              </div>
              <div className="ch-cardCta" aria-hidden="true">
                <span>Continue</span>
                <Icon>arrow_forward</Icon>
              </div>
            </Link>
          </div>
        </section>

        <section className="ch-path ch-path--secondary" aria-labelledby="hub-declarer-articles">
          <h2 className="ch-sectionLabel" id="hub-declarer-articles">
            Articles & explanations
          </h2>
          <div className="ch-cards ch-cards--stack" role="list">
            <Link
              to="/declarer/articles"
              className="ch-card ch-card--article"
              role="listitem"
              aria-label="Articles and explanations - declarer play"
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

export default DeclarerHub;
