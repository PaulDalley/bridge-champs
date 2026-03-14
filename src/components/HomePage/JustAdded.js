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
          5 New Matchpoint bidding exercises with videos →
        </Link>
        <span className="JustAdded-sep" aria-hidden> · </span>
        <Link to="/defence/practice?problem=df1-5" className="JustAdded-link">
          4 new defence problems →
        </Link>
      </div>
    </section>
  );
}

export default JustAdded;
