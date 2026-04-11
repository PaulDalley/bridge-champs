import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./TopicSwitchHub.css";

const TOPICS = [
  {
    id: "declarer",
    label: "Declarer",
    articlePath: "/cardPlay/articles",
    basicsPath: "/cardPlay/basics",
  },
  {
    id: "defence",
    label: "Defence",
    articlePath: "/defence/articles",
    basicsPath: "/defence/basics",
  },
  {
    id: "bidding",
    label: "Bidding",
    articlePath: "/bidding/advanced",
    basicsPath: "/bidding/basics",
  },
  {
    id: "counting",
    label: "Counting",
    articlePath: "/counting/articles",
    basicsPath: null,
  },
];

function ArticlesTopicHub({ history, location }) {
  const params = new URLSearchParams(location.search || "");
  const requestedTopic = params.get("topic") || "declarer";
  const selectedTopic = TOPICS.find((topic) => topic.id === requestedTopic) || TOPICS[0];

  const setTopic = (topicId) => {
    const nextParams = new URLSearchParams(location.search || "");
    nextParams.set("topic", topicId);
    history.replace(`${location.pathname}?${nextParams.toString()}`);
  };

  return (
    <div className="tsh-page">
      <div className="tsh-hero">
        <h1 className="tsh-title">Articles</h1>
        <p className="tsh-subtitle">
          Switch categories here the same way as trainer, then open deeper article sets.
        </p>
      </div>

      <div className="tsh-pillRow" role="tablist" aria-label="Article topics">
        {TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            role="tab"
            aria-selected={selectedTopic.id === topic.id}
            className={`tsh-pill ${selectedTopic.id === topic.id ? "tsh-pill--active" : ""}`}
            onClick={() => setTopic(topic.id)}
          >
            {topic.label}
          </button>
        ))}
      </div>

      <div className="tsh-cards">
        <Link className="tsh-card tsh-card--primary" to={selectedTopic.articlePath}>
          <div className="tsh-cardTitle">Open {selectedTopic.label} articles</div>
          <div className="tsh-cardText">
            Read current article series for {selectedTopic.label.toLowerCase()}.
          </div>
        </Link>

        {selectedTopic.basicsPath ? (
          <Link className="tsh-card" to={selectedTopic.basicsPath}>
            <div className="tsh-cardTitle">{selectedTopic.label} basics</div>
            <div className="tsh-cardText">Open beginner-friendly basics for this category.</div>
          </Link>
        ) : (
          <div className="tsh-card tsh-card--muted">
            <div className="tsh-cardTitle">{selectedTopic.label} basics</div>
            <div className="tsh-cardText">No separate basics list yet for this category.</div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(ArticlesTopicHub);
