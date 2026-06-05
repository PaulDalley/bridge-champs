import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import AuctionDiagram from "./AuctionDiagram";
import "./JacobyConventionArticle.css";

const red = (symbol) => <span className="jca-suit jca-suit--red">{symbol}</span>;
const black = (symbol) => <span className="jca-suit jca-suit--black">{symbol}</span>;

function ReversesArticle() {
  return (
    <div className="jca-page">
      <Helmet>
        <title>Reverses in Bridge: How to Identify, Bid, and Respond</title>
        <meta
          name="description"
          content="Learn reverses in bridge with practical examples: requirements, 1NT vs reverse decisions, weak-hand responses, and competitive reverse adjustments."
        />
        <link rel="canonical" href="https://bridgechampions.com/bidding/advanced/reverses" />
      </Helmet>

      <article className="jca-article">
        <nav className="jca-topNav" aria-label="Breadcrumb">
          <Link to="/bidding/advanced" className="jca-footerLink jca-footerLink--top">
            ← Back to Bidding articles
          </Link>
        </nav>

        <header className="jca-hero">
          <p className="jca-kicker">Bidding</p>
          <h1 className="jca-title">Reverses in Bridge: How to Identify, Bid, and Respond</h1>
          <p className="jca-subtitle">A practical guide from stage 3 problems 11-15.</p>
          <p className="jca-intro">
            In this series I look at everything to do with reverses, from how to identify one through to how to
            respond to one, and everything in between. These bids are often misunderstood and vaguely defined, and
            players should be confident using them.
          </p>
        </header>

        <section className="jca-section">
          <h2 className="jca-heading">How to clearly identify a reverse</h2>
          <ul className="jca-list">
            <li>
              If partner wants to get back to your first suit and it requires going to the 3-level, you are in reverse
              territory.
            </li>
            <li>Standard requirement: 16+ points and an unbalanced hand.</li>
          </ul>
          <div className="jca-tableWrap">
            <table className="jca-table">
              <thead>
                <tr>
                  <th>Example auction</th>
                  <th>What it means</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="jca-bidCell">
                    <AuctionDiagram bidding="1♣ P 1♠ P 2♥" />
                  </td>
                  <td>Reverse: returning to clubs now needs 3{black("♣")}.</td>
                </tr>
                <tr>
                  <td className="jca-bidCell">
                    <AuctionDiagram bidding="1♥ P 1♠ P 2♣" />
                  </td>
                  <td>Not a reverse: partner can still return to hearts at 2{red("♥")}.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="jca-section">
          <h2 className="jca-heading">Reverse or 1NT?</h2>
          <p className="jca-paragraph">
            Do not force a reverse just because the hand is close. Some 2-4-2-5 type hands are balanced-ish enough for
            1NT (especially without a 5-card major).
          </p>
          <p className="jca-paragraph">
            Also focus on where your points are. If your points are stacked in short suits, that is often a strong
            indication that 1NT is right.
          </p>
          <p className="jca-paragraph jca-paragraph--callout">
            The flavour of a reverse is quality suits and quality values in those advertised suits. If you reverse,
            you really mean it.
          </p>
        </section>

        <section className="jca-section">
          <h2 className="jca-heading">How to respond to partner&apos;s reverse with a weak hand</h2>
          <p className="jca-paragraph">
            Practical recommendation: after partner reverses, use 2NT to show a bad hand. It says:
            &nbsp;&quot;With your 16+, I don&apos;t think we have enough for game unless you have extra.&quot;
          </p>
          <div className="jca-tableWrap">
            <table className="jca-table">
              <thead>
                <tr>
                  <th>Auction</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="jca-bidCell">
                    <AuctionDiagram bidding="1♦ P 1♠ P 2♥ P ?" />
                  </td>
                  <td>Bid 2NT with weak/limited values.</td>
                </tr>
                <tr>
                  <td className="jca-bidCell">
                    <AuctionDiagram bidding="1♦ P 1♠ P 2♥ P 2NT P 3♦ P ?" />
                  </td>
                  <td>Usually pass - opener has retreated to first 5+ suit.</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="jca-paragraph">
            This area is partnership agreement. Keep it simple, discuss it clearly, and be on the same page.
          </p>
        </section>

        <section className="jca-section">
          <h2 className="jca-heading">When not to reverse</h2>
          <p className="jca-paragraph">
            If you do not have enough to reverse, do not fudge it. Be accountable. Partner should be able to rely on
            reverse promises.
          </p>
          <p className="jca-paragraph">
            In those close spots, a natural rebid (like 2{black("♣")}) is often the disciplined action.
          </p>
        </section>

        <section className="jca-section">
          <h2 className="jca-heading">Reverses in competition</h2>
          <p className="jca-paragraph">
            In competitive auctions, things are fast-paced. You often do not have the luxury of normal non-competitive
            standards.
          </p>
          <p className="jca-paragraph">
            Reverses in competition are more about quality suits and practical competing values, not always a mountain
            of points.
          </p>
          <p className="jca-paragraph jca-paragraph--callout">
            In 2026, auctions are hypercompetitive. If you have a distributional hand with good suits, you have to get
            into the auction, otherwise it will pass you by.
          </p>
        </section>

        <section className="jca-section">
          <h2 className="jca-heading">Train this theme</h2>
          <ul className="jca-list">
            <li>
              <Link to="/bidding/practice?difficulty=3&problem=bid3-11">Reverses problem 11: Identify the reverse</Link>
            </li>
            <li>
              <Link to="/bidding/practice?difficulty=3&problem=bid3-12">Reverses problem 12: Reverse vs 1NT</Link>
            </li>
            <li>
              <Link to="/bidding/practice?difficulty=3&problem=bid3-13">Reverses problem 13: Responding with weak values</Link>
            </li>
            <li>
              <Link to="/bidding/practice?difficulty=3&problem=bid3-14">Reverses problem 14: Not enough to reverse</Link>
            </li>
            <li>
              <Link to="/bidding/practice?difficulty=3&problem=bid3-15">Reverses problem 15: Competition adjustment</Link>
            </li>
          </ul>
          <p className="jca-paragraph">
            Related reading: <Link to="/bidding/advanced">Bidding articles</Link> ·{" "}
            <Link to="/bidding/worthwhile-conventions/jacoby-2nt">Worthwhile Conventions: Jacoby 2NT</Link> ·{" "}
            <Link to="/bidding/basics">Bidding basics</Link>
          </p>
        </section>

        <footer className="jca-actions">
          <Link to="/bidding/advanced" className="jca-footerLink">
            ← Back to Bidding articles
          </Link>
        </footer>
      </article>
    </div>
  );
}

export default ReversesArticle;

