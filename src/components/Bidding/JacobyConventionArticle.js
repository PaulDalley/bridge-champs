import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Helmet } from "react-helmet-async";
import "./JacobyConventionArticle.css";

/** Red suits (♥ ♦) — bridge standard */
const r = (symbol) => <span className="jca-suit jca-suit--red">{symbol}</span>;
/** Black suits (♣ ♠) */
const b = (symbol) => <span className="jca-suit jca-suit--black">{symbol}</span>;

function JacobyConventionArticle({ subscriptionActive, isAdmin, authReady }) {
  const canView = isAdmin || subscriptionActive;

  if (!authReady) {
    return (
      <div className="jca-page">
        <p className="jca-wait">Checking access…</p>
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="jca-page jca-page--lockedOuter">
        <Helmet>
          <title>Jacoby 2NT — Members</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <div className="jca-locked">
          <h1 className="jca-lockedTitle">Subscriber-only system notes</h1>
          <p className="jca-lockedText">
            The full Jacoby 2NT write-up is for members. The System overview page stays free for everyone — this
            article is the detailed notes.
          </p>
          <div className="jca-lockedActions">
            <Link to="/membership" className="jca-btnPrimary">
              View membership
            </Link>
            <Link to="/system" className="jca-link">
              ← Back to System
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="jca-page">
      <Helmet>
        <title>Worthwhile Conventions #1 — Jacoby 2NT</title>
        <meta
          name="description"
          content="Jacoby 2NT: core structure, opener rebids, and continuation methods after 1H/1S — 2NT."
        />
      </Helmet>

      <article className="jca-article">
        <nav className="jca-topNav" aria-label="Breadcrumb">
          <Link to="/system" className="jca-footerLink jca-footerLink--top">
            ← Back to System
          </Link>
        </nav>
        <header className="jca-hero">
          <p className="jca-kicker">Worthwhile Conventions</p>
          <h1 className="jca-title">#1 — Jacoby 2NT</h1>
          <p className="jca-subtitle">Start simple.</p>
          <p className="jca-intro">
            After 1{r("♥")} or 1{b("♠")}, a 2NT response is Jacoby: at least 4-card support and game-forcing values.
          </p>
        </header>

        <section className="jca-section">
          <h2 className="jca-heading">Core meaning</h2>
          <ul className="jca-list">
            <li>
              1{r("♥")} / 1{b("♠")} — 2NT shows 4+ card raise in opener&apos;s major.
            </li>
            <li>Game force: partnership is committed to game.</li>
            <li>The auction now focuses on shape and strength.</li>
          </ul>
        </section>

        <section className="jca-section">
          <h2 className="jca-heading">Opener rebids after Jacoby 2NT</h2>
          <div className="jca-tableWrap">
            <table className="jca-table">
              <thead>
                <tr>
                  <th>Rebid</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="jca-bidCell">
                    3{b("♣")}
                  </td>
                  <td>Minimum hand, typically 14 or fewer.</td>
                </tr>
                <tr>
                  <td className="jca-bidCell">
                    3{r("♦")}
                  </td>
                  <td>Non-minimum, no shortage.</td>
                </tr>
                <tr>
                  <td className="jca-bidCell">
                    3{r("♥")}
                  </td>
                  <td>
                    Non-minimum with lowest shortage (
                    <span className="jca-suit jca-suit--black">clubs</span>).
                  </td>
                </tr>
                <tr>
                  <td className="jca-bidCell">
                    3{b("♠")}
                  </td>
                  <td>
                    Non-minimum with middle shortage (
                    <span className="jca-suit jca-suit--red">diamonds</span>).
                  </td>
                </tr>
                <tr>
                  <td className="jca-bidCell">3NT</td>
                  <td>
                    Non-minimum with highest shortage — the <strong>other major</strong>: {r("♥")} if you opened 1
                    {b("♠")}, {b("♠")} if you opened 1{r("♥")}.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="jca-section">
          <h2 className="jca-heading">Continuations after opener rebids 3{b("♣")} (minimum)</h2>
          <h3 className="jca-subheading">Option A: Ask for shortage</h3>
          <p className="jca-paragraph">
            Responder bids 3{r("♦")} to ask whether opener has a shortage.
          </p>
          <div className="jca-tableWrap">
            <table className="jca-table">
              <thead>
                <tr>
                  <th>Opener rebid</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="jca-bidCell">
                    3{r("♥")}
                  </td>
                  <td>No shortage.</td>
                </tr>
                <tr>
                  <td className="jca-bidCell">
                    3{b("♠")}
                  </td>
                  <td>
                    Low shortage — <span className="jca-suit jca-suit--black">clubs</span>.
                  </td>
                </tr>
                <tr>
                  <td className="jca-bidCell">3NT</td>
                  <td>
                    Middle shortage — <span className="jca-suit jca-suit--red">diamonds</span>.
                  </td>
                </tr>
                <tr>
                  <td className="jca-bidCell">
                    4{b("♣")}
                  </td>
                  <td>
                    High shortage — the <strong>other major</strong>: {r("♥")} if you opened 1{b("♠")}, {b("♠")} if you
                    opened 1{r("♥")}.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="jca-subheading">Option B: Responder shows own shortage</h3>
          <p className="jca-paragraph jca-paragraph--callout">
            Instead of the 3{r("♦")} ask, responder can bid directly over opener&apos;s 3{b("♣")} (minimum) to show
            their own shortage:
          </p>
          <div className="jca-tableWrap jca-tableWrap--optionB">
            <table className="jca-table jca-table--optionB">
              <thead>
                <tr>
                  <th scope="col">Responder bids</th>
                  <th scope="col">Shortage</th>
                  <th scope="col">Which suit is short</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="jca-bidCell">
                    3{r("♥")}
                  </td>
                  <td className="jca-tableEmphasis">Low</td>
                  <td>
                    <span className="jca-suit jca-suit--black">clubs</span>
                  </td>
                </tr>
                <tr>
                  <td className="jca-bidCell">
                    3{b("♠")}
                  </td>
                  <td className="jca-tableEmphasis">Middle</td>
                  <td>
                    <span className="jca-suit jca-suit--red">diamonds</span>
                  </td>
                </tr>
                <tr>
                  <td className="jca-bidCell">3NT</td>
                  <td className="jca-tableEmphasis">High</td>
                  <td>
                    The <strong>other major</strong>: {r("♥")} if partner opened 1{b("♠")}; {b("♠")} if partner opened
                    1{r("♥")}.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <footer className="jca-actions">
          <Link to="/system" className="jca-footerLink">
            ← Back to System
          </Link>
        </footer>
      </article>
    </div>
  );
}

export default connect(({ auth }) => ({
  subscriptionActive: !!auth.subscriptionActive,
  isAdmin: auth.a === true,
  authReady: !!auth.authReady,
}))(JacobyConventionArticle);
