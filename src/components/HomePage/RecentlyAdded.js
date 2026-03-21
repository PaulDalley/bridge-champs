import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import "./RecentlyAdded.css";
import { THEME_PACKS } from "../../data/themePacks";

function RecentlyAdded({ uid, subscriptionActive, a, completedPractice }) {
  const showSubscribeCta = !subscriptionActive && a !== true;
  const completed = completedPractice || {};
  const packs = THEME_PACKS.map((pack) => {
    const done = uid ? pack.handIds.filter((id) => !!completed[id]).length : 0;
    const total = pack.handIds.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    return { ...pack, done, total, pct };
  });
  const originalPacks = packs.slice(0, 3);
  const originalPackIds = new Set(originalPacks.map((pack) => pack.id));
  const isPackComplete = (pack) => pack.total > 0 && pack.done >= pack.total;
  const allPacksComplete = packs.length > 0 && packs.every(isPackComplete);
  const packsToShow = (() => {
    if (packs.length <= 3 || allPacksComplete) return originalPacks;

    const unfinished = packs.filter((pack) => !isPackComplete(pack));
    const completedNonOriginal = packs.filter((pack) => isPackComplete(pack) && !originalPackIds.has(pack.id));
    const completedOriginal = packs.filter((pack) => isPackComplete(pack) && originalPackIds.has(pack.id));

    return [...unfinished, ...completedNonOriginal, ...completedOriginal].slice(0, 3);
  })();
  const cleanPackTitle = (title = "") => title.replace(/^Theme:\s*/i, "");

  return (
    <section className="RecentlyAdded" aria-label="Choose a topic">
      {showSubscribeCta && (
        <Link to="/membership" className="RecentlyAdded-subscribeCta">
          <span className="RecentlyAdded-subscribeCtaIcon">
            <i className="material-icons" aria-hidden>star</i>
          </span>
          <span className="RecentlyAdded-subscribeCtaContent">
            <strong>Start 7-day free trial</strong> — Unlock all training exercises, articles, and quizzes
          </span>
          <span className="RecentlyAdded-subscribeCtaBtn">Start free trial</span>
        </Link>
      )}
      <h2 className="RecentlyAdded-theme">Choose a topic</h2>

      <div className="RecentlyAdded-packGrid">
        {packsToShow.map((pack) => (
          <Link key={pack.id} to={pack.to} className="RecentlyAdded-packCard" title={pack.title}>
            <div className="RecentlyAdded-packHead">
              <span className="RecentlyAdded-packIcon">
                <i className="material-icons" aria-hidden>{pack.icon}</i>
              </span>
            </div>
            <h3 className="RecentlyAdded-packTitle">{cleanPackTitle(pack.title)}</h3>
            {!!pack.description && <p className="RecentlyAdded-packDesc">{pack.description}</p>}
            {showSubscribeCta && <span className="RecentlyAdded-freeStarter">Free starter included</span>}
            <div className="RecentlyAdded-packMeta">
              <span className="RecentlyAdded-packCount">{pack.done}/{pack.total} complete</span>
              <span className="RecentlyAdded-packPercent">{pack.pct}%</span>
            </div>
            <div className="RecentlyAdded-packProgress" aria-hidden>
              <span style={{ width: `${pack.pct}%` }} />
            </div>
            <span className="RecentlyAdded-packCta">{pack.done > 0 ? "Continue pack" : "Start pack"} →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default connect(({ auth, user }) => ({
  uid: auth?.uid,
  subscriptionActive: auth?.subscriptionActive,
  a: auth?.a,
  completedPractice: user?.completedPractice,
}))(RecentlyAdded);
