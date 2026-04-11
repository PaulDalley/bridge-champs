import React from "react";
import { Link } from "react-router-dom";
import "./JustAdded.css";

function JustAdded() {
  return (
    <section className="JustAdded" aria-label="What's new">
      <div className="JustAdded-labelWrap">
        <span className="JustAdded-pin" aria-hidden>
          <i className="material-icons">push_pin</i>
        </span>
        <h2 className="JustAdded-label">Just added</h2>
      </div>
      <div className="JustAdded-links">
        <Link to="/bidding/practice?difficulty=2&problem=bid2-1" className="JustAdded-link">
          Matchpoint bidding — club duplicate decisions →
        </Link>
        <span className="JustAdded-sep" aria-hidden> · </span>
        <Link to="/defence/practice?problem=df1-9" className="JustAdded-link">
          The enemy's 5-card suit (defence theme) →
        </Link>
        <span className="JustAdded-sep" aria-hidden> · </span>
        <Link to="/cardPlay/practice?difficulty=2&problem=cp2-6" className="JustAdded-link">
          Using entries productively →
        </Link>
      </div>
    </section>
  );
}

export default JustAdded;
