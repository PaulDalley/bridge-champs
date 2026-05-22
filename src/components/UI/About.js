import React from "react";
import { Helmet } from "react-helmet-async";
import { Row, Col, Card } from "react-materialize";
import $ from "jquery";
import "./About.css";

const PAUL_PROFILE_URL = "https://bridgechampions.com/about";
const PAUL_IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/bridgechampions.appspot.com/o/logo.png?alt=media&token=583808ab-2c3b-49a6-8936-82dffe55ec95";

const ACHIEVEMENTS = [
  { year: "2026", text: "Qualified for the Australian team" },
  { year: "2026", text: "1st place: National Open Teams (Canberra)" },
  { year: "2026", text: "1st place: South West Pacific Teams (Canberra)" },
  { year: "2025", text: "1st place: Gold Coast Pairs" },
  { year: "2025", text: "1st place: Adelaide Open Teams" },
  { year: "2025", text: "1st place: New Zealand Open Teams" },
];

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://bridgechampions.com/#author",
  name: "Paul Dalley",
  url: PAUL_PROFILE_URL,
  image: PAUL_IMAGE_URL,
  jobTitle: "Bridge teacher",
  description:
    "Paul Dalley is an Australian international bridge player and the founder of Bridge Champions. He has won multiple national open team championships in Australia and New Zealand and represented Australia internationally.",
  knowsAbout: [
    "Contract bridge",
    "Bridge bidding systems",
    "Bridge declarer play",
    "Bridge defence",
    "Bridge conventions",
    "Bridge teaching",
  ],
  worksFor: {
    "@id": "https://bridgechampions.com/#organization",
  },
  award: ACHIEVEMENTS.map((a) => `${a.year} — ${a.text}`),
  sameAs: [
    "https://www.youtube.com/@BridgeChampions",
  ],
};

const aboutPageJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: PAUL_PROFILE_URL,
  name: "About Bridge Champions",
  description:
    "Bridge Champions is run by Paul Dalley, an Australian international bridge player and teacher. Our mission is to make high-quality bridge insights clear and practical for every player.",
  mainEntity: {
    "@id": "https://bridgechampions.com/#author",
  },
  publisher: {
    "@id": "https://bridgechampions.com/#organization",
  },
};

class About extends React.Component {
  componentDidMount() {
    $("html, body").animate({ scrollTop: 0 }, 800);
  }

  render() {
    return (
      <>
        <Helmet>
          <title>About Bridge Champions &mdash; Paul Dalley, Australian international bridge player</title>
          <meta
            name="description"
            content="Bridge Champions is run by Paul Dalley, an Australian international bridge player who has won multiple national open team championships. Learn about our teaching approach."
          />
          <link rel="canonical" href={PAUL_PROFILE_URL} />
          <meta property="og:type" content="profile" />
          <meta property="og:url" content={PAUL_PROFILE_URL} />
          <meta
            property="og:title"
            content="About Bridge Champions — Paul Dalley"
          />
          <meta
            property="og:description"
            content="Australian international bridge player and teacher behind Bridge Champions. Clear, practical lessons drawn from top-level competitive play."
          />
          <meta property="og:site_name" content="Bridge Champions" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="About Bridge Champions — Paul Dalley" />
          <meta
            name="twitter:description"
            content="Australian international bridge player and teacher behind Bridge Champions."
          />
          <script type="application/ld+json">{JSON.stringify(personJsonLd)}</script>
          <script type="application/ld+json">{JSON.stringify(aboutPageJsonLd)}</script>
        </Helmet>

        <div className="About-container">
          <Row>
            <Col s={12} m={10} l={8} offset="m1 l2">
              <Card className="About-card">
                <h1 className="About-title">About Bridge Champions</h1>

                <div className="About-content">
                  <section className="About-section">
                    <h2>Our mission</h2>
                    <p>
                      Bridge Champions makes high-quality bridge insights
                      accessible in a way that is clear and simple for the
                      average player. We take the strategies and thinking from
                      top-level bridge and distil them into practical advice
                      you can use at your next game.
                    </p>
                  </section>

                  <section className="About-section" id="paul-dalley">
                    <h2>About Paul Dalley</h2>
                    <p>
                      Bridge Champions is run by{" "}
                      <strong>Paul Dalley</strong>, an Australian international
                      bridge player and teacher. Paul has won multiple national
                      open team championships in Australia and New Zealand, and
                      has represented Australia on the open national team in
                      recent years.
                    </p>
                    <p>
                      Paul regularly discusses bridge with top players in
                      Australia and internationally, bringing their insights
                      and expertise into the lessons and practice on Bridge
                      Champions.
                    </p>

                    <h3>Recent achievements</h3>
                    <ul className="About-achievements">
                      {ACHIEVEMENTS.map((a) => (
                        <li key={`${a.year}-${a.text}`}>
                          <strong>{a.year}</strong> &mdash; {a.text}
                        </li>
                      ))}
                    </ul>
                  </section>

                  <section className="About-section">
                    <h2>How we teach</h2>
                    <p>
                      Every article and trainer exercise on this site follows
                      the same three-step approach:
                    </p>
                    <ol className="About-method">
                      <li>
                        <strong>Make the idea concrete.</strong> Lead with a
                        real hand or a real bidding sequence &mdash; not jargon.
                      </li>
                      <li>
                        <strong>Explain the why, not just the what.</strong>{" "}
                        Rules without reasons are forgotten quickly.
                      </li>
                      <li>
                        <strong>Then practise.</strong> Each article links to
                        the relevant trainer questions so the idea sticks
                        before you face it at the table.
                      </li>
                    </ol>
                    <p>
                      We don&rsquo;t publish thin convention summaries or
                      AI-generated filler. Every article is reviewed against
                      actual competitive practice.
                    </p>
                  </section>

                  <section className="About-section">
                    <h2>How we keep content current</h2>
                    <p>
                      Bridge conventions, system notes, and partnership
                      agreements evolve. We display a{" "}
                      <strong>Last updated</strong> date on every article and
                      revisit articles whenever expert practice shifts or a
                      reader points out a gap. If you spot something out of
                      date, use the feedback button at the bottom of any
                      article &mdash; we&rsquo;ll fix it.
                    </p>
                  </section>

                  <div className="About-cta">
                    <p>
                      Start with the{" "}
                      <a href="/beginner">beginner&nbsp;lessons</a>, browse the
                      full <a href="/learn">learn&nbsp;library</a>, or jump
                      straight into the practice trainers under{" "}
                      <a href="/bidding">bidding</a>,{" "}
                      <a href="/declarer">declarer</a>, and{" "}
                      <a href="/defence">defence</a>.
                    </p>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default About;
