import React from "react";
import { Link } from "react-router-dom";
import "./JustAdded.css";
import {
  HOME_PAGE_RECOMMENDED_ARTICLES,
  HOME_PAGE_RECOMMENDED_ARTICLES_TITLE,
} from "../../data/homePageRecommendedArticles";

function JustAdded() {
  const items = HOME_PAGE_RECOMMENDED_ARTICLES.filter(
    (item) => item?.path && item?.label
  );

  if (!items.length) return null;

  return (
    <section
      className="JustAdded"
      aria-label={HOME_PAGE_RECOMMENDED_ARTICLES_TITLE}
    >
      <div className="JustAdded-labelWrap">
        <span className="JustAdded-pin" aria-hidden>
          <i className="material-icons">push_pin</i>
        </span>
        <h2 className="JustAdded-label">{HOME_PAGE_RECOMMENDED_ARTICLES_TITLE}</h2>
      </div>
      <div className="JustAdded-groups JustAdded-groups--single">
        <div className="JustAdded-group">
          <ul className="JustAdded-list">
            {items.map((item) => (
              <li key={item.path}>
                <Link to={item.path} className="JustAdded-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default JustAdded;
