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
      <div className="JustAdded-groups">
        <div className="JustAdded-group">
          <p className="JustAdded-groupTitle">This week</p>
          <ul className="JustAdded-list">
            <li>
              <Link to="/declarer/practice?difficulty=1&problem=cp1-12" className="JustAdded-link">
                See the 4-3 →
              </Link>
            </li>
            <li>
              <Link to="/bidding/practice?difficulty=2&problem=bid2-24" className="JustAdded-link">
                Slam judgment →
              </Link>
            </li>
          </ul>
        </div>

        <div className="JustAdded-group">
          <p className="JustAdded-groupTitle">Last week</p>
          <ul className="JustAdded-list">
            <li>
              <Link to="/bidding/practice?difficulty=1&problem=bid1-29" className="JustAdded-link">
                Modern Preempts →
              </Link>
            </li>
            <li>
              <Link to="/bidding/practice?difficulty=1&problem=bid1-34" className="JustAdded-link">
                Is this forcing? →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default JustAdded;
