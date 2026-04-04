import React from "react";
import { Link, withRouter } from "react-router-dom";
import "./TopicSwitchHub.css";

const TOPICS = [
  {
    id: "declarer",
    label: "Declarer",
    practicePath: "/cardPlay/practice",
    legacyPath: "/cardPlay",
  },
  {
    id: "defence",
    label: "Defence",
    practicePath: "/defence/practice",
    legacyPath: "/defence",
  },
  {
    id: "bidding",
    label: "Bidding",
    practicePath: "/bidding/practice",
    legacyPath: "/bidding",
  },
  {
    id: "counting",
    label: "Counting",
    practicePath: "/counting/practice",
    legacyPath: "/counting",
  },
];

function PracticeTrainerHub({ history, location }) {
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
        <h1 className="tsh-title">Practice Trainer</h1>
        <p className="tsh-subtitle">
          Move between categories quickly, then jump straight into interactive trainer hands.
        </p>
      </div>

      <div className="tsh-pillRow" role="tablist" aria-label="Practice topics">
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
        <Link className="tsh-card tsh-card--primary" to={selectedTopic.practicePath}>
          <div className="tsh-cardTitle">Open {selectedTopic.label} trainer</div>
          <div className="tsh-cardText">
            Continue directly in the {selectedTopic.label.toLowerCase()} practice flow.
          </div>
        </Link>

        <Link className="tsh-card" to={selectedTopic.legacyPath}>
          <div className="tsh-cardTitle">{selectedTopic.label} overview</div>
          <div className="tsh-cardText">Open the current topic hub page (legacy entry point).</div>
        </Link>
      </div>
    </div>
  );
}

export default withRouter(PracticeTrainerHub);
