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
              <Link to="/defence/practice?problem=df1-13" className="JustAdded-link">
                Forcing declarer →
              </Link>
            </li>
            <li>
              <Link to="/bidding/practice?difficulty=2&problem=bid2-19" className="JustAdded-link">
                The Power of Pass →
              </Link>
            </li>
          </ul>
        </div>

        <div className="JustAdded-group">
          <p className="JustAdded-groupTitle">Last week</p>
          <ul className="JustAdded-list">
            <li>
              <Link to="/bidding/practice?difficulty=3&problem=bid3-1" className="JustAdded-link">
                Splinters →
              </Link>
            </li>
            <li>
              <Link to="/bidding/practice?difficulty=3&problem=bid3-6" className="JustAdded-link">
                Lebensohl →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default JustAdded;
