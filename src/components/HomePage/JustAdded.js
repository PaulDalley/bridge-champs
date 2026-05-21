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
              <Link to="/bidding/practice?difficulty=3&problem=bid3-16" className="JustAdded-link">
                4th suit forcing →
              </Link>
            </li>
            <li>
              <Link to="/defence/practice?difficulty=1&problem=df1-23" className="JustAdded-link">
                Opening Leads →
              </Link>
            </li>
          </ul>
        </div>

        <div className="JustAdded-group">
          <p className="JustAdded-groupTitle">Last week</p>
          <ul className="JustAdded-list">
            <li>
              <Link to="/bidding/practice?difficulty=3&problem=bid3-11" className="JustAdded-link">
                Reverses →
              </Link>
            </li>
            <li>
              <Link to="/defence/practice?difficulty=1&problem=df1-18" className="JustAdded-link">
                Deadly Duck →
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default JustAdded;
