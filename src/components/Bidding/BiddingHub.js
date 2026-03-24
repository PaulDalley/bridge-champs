import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "react-materialize";
import "./BiddingHub.css";

function BiddingHub() {
  return (
    <div className="ch-page" aria-label="Bidding home">
      <div className="ch-hero">
        <div className="ch-heroTitle">Bidding</div>
        <div className="ch-heroSub">
          Choose <strong>Practice</strong> for interactive bidding, or <strong>Advanced ideas</strong> for lessons and examples.
        </div>

      </div>

      <div className="ch-spotlight" role="presentation">
        <Link to="/bidding/practice" className="ch-card ch-card--practiceTile ch-card--spotlight" role="listitem" aria-label="Practice bidding">
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

      <div className="ch-cards ch-cards--secondary" role="list" aria-label="Bidding options">
        <Link to="/bidding/advanced" className="ch-card" role="listitem" aria-label="Advanced ideas">
          <div className="ch-cardHeader">
            <div className="ch-cardIcon ch-cardIcon--technique" aria-hidden="true">
              <Icon>school</Icon>
            </div>
            <div>
              <div className="ch-cardTitle">Advanced ideas</div>
              <div className="ch-cardMicro">Short lessons + examples</div>
            </div>
          </div>
          <div className="ch-cardText">Articles, videos and examples for bidding.</div>
        </Link>
      </div>
    </div>
  );
}

export default BiddingHub;
