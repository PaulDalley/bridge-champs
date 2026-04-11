import React from "react";

function HowToUse() {
  return (
    <section className="HomePage-howToUse" aria-label="How to use this site">
      <h2 className="HomePage-howToUse-title">How to use this site</h2>

      <div className="HomePage-howToUse-block">
        <span className="HomePage-howToUse-icon" aria-hidden>
          <i className="material-icons">touch_app</i>
        </span>
        <div className="HomePage-howToUse-content">
          <p className="HomePage-howToUse-lead">
            <span className="HomePage-howToUse-mainWay">Learn by doing</span> — exercises by topic and theme that you can master.
          </p>
          <p className="HomePage-howToUse-tagline">Simple, practical — and the gains are real.</p>
          <p className="HomePage-howToUse-soon">Coming soon (this week): short videos to go with the exercises.</p>
        </div>
      </div>

      <div className="HomePage-howToUse-block">
        <span className="HomePage-howToUse-icon" aria-hidden>
          <i className="material-icons">menu_book</i>
        </span>
        <div className="HomePage-howToUse-content">
          <p className="HomePage-howToUse-lead">
            <strong className="HomePage-howToUse-consolidate">Consolidate</strong> — Articles that go into detail, and can be watched as a video instead.
          </p>
        </div>
      </div>
    </section>
  );
}

export default HowToUse;
