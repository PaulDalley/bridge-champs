import WelcomeVideo from '../components/WelcomeVideo';
import HomeAuth from '../components/HomeAuth';
import GuestOnly from '../components/GuestOnly';
import QuickTips from '../components/QuickTips';
import './home.css';

export const metadata = {
  title: 'Bridge Champions — Bridge Lessons & Practice',
  description:
    'Clear lessons, hands-on practice, and quizzes for beginners and experienced players—whether you\'re learning the basics or sharpening play at the table.',
  alternates: { canonical: 'https://bridgechampions.com/' },
  openGraph: {
    type: 'website',
    url: 'https://bridgechampions.com/',
    title: 'Bridge Champions — Bridge Lessons & Practice',
    description: 'Clear lessons, hands-on practice, and quizzes for beginners and experienced players.',
    images: [{ url: 'https://firebasestorage.googleapis.com/v0/b/bridgechampions.appspot.com/o/logo.png?alt=media&token=583808ab-2c3b-49a6-8936-82dffe55ec95', width: 1200, height: 630 }],
    siteName: 'Bridge Champions',
  },
};

export const revalidate = 3600;

export default function HomePage() {
  return (
    <div className="hp">
      <HomeAuth>
        <section className="hp-hero">
          <div className="hp-hero-bg" aria-hidden="true" />
          <div className="hp-hero-inner">
            <p className="hp-hero-suits" aria-hidden="true">
              <span className="hp-hero-suit-red">♥</span>
              <span>♠</span>
              <span className="hp-hero-suit-red">♦</span>
              <span>♣</span>
            </p>
            <h1 className="hp-hero-title">
              Welcome to <span className="hp-hero-accent">Bridge Champions</span>
            </h1>
            <p className="hp-hero-sub">
              For the last 15 years, studying, practising, and playing tournament bridge has been my
              life. I&apos;m bringing what I&apos;ve learned to my members—clear, practical lessons,
              no nonsense.
            </p>
            <div className="hp-hero-actions">
              <a href="/membership" className="hp-btn-primary">Start 7-day free trial</a>
              <a href="/learn" className="hp-btn-ghost">Browse lessons</a>
            </div>
            <WelcomeVideo />
          </div>

          <div className="hp-statbar">
            <div className="hp-stat">
              <span className="hp-stat-num">15 years</span>
              <span className="hp-stat-label">studying &amp; playing tournament bridge</span>
            </div>
            <span className="hp-stat-div" aria-hidden="true" />
            <div className="hp-stat">
              <span className="hp-stat-num">Dozens</span>
              <span className="hp-stat-label">of national championships</span>
            </div>
            <span className="hp-stat-div" aria-hidden="true" />
            <div className="hp-stat">
              <span className="hp-stat-num">Australia</span>
              <span className="hp-stat-label">represented on the national team</span>
            </div>
          </div>
        </section>
      </HomeAuth>

      <QuickTips />

      <section className="hp-testimonials">
        <h2 className="hp-sec-label">What members say</h2>
        <div className="hp-testimonials-grid">
          <figure className="hp-testimonial">
            <span className="hp-testimonial-mark" aria-hidden="true">&ldquo;</span>
            <blockquote>
              Bridge Champions is different (and better!) than your average internet based learning
              tool. It is both practical and insightful, regularly delivering novel ways to
              understand bidding and card play in an easy-to-follow format. Any specific areas of
              interest can be looked up and revised in a perfect &ldquo;hands on&rdquo; format.
              Paul Dalley&apos;s proactive and multi dimensional initiative has increased my
              &ldquo;bridge awareness&rdquo; significantly.
            </blockquote>
            <figcaption>
              <span className="hp-testimonial-avatar" aria-hidden="true">DB</span>
              David Bavin, Sydney
            </figcaption>
          </figure>
          <figure className="hp-testimonial">
            <span className="hp-testimonial-mark" aria-hidden="true">&ldquo;</span>
            <blockquote>
              I am absolutely loving your work! I have very much the calculating, mathematical
              approach to bridge (comes from 35 years as a Professor of Medicine) so I like the
              design of your site and your approach to teaching. It allows me to test myself with
              immediate feedback from an expert&mdash;all done with compact, specific, and engaging
              comments. You do a great job of making it appear you were here looking over my
              shoulder. You are also clearly committed to making the website the best it can be.
            </blockquote>
            <figcaption>
              <span className="hp-testimonial-avatar" aria-hidden="true">IW</span>
              Ian Whyte, Newcastle
            </figcaption>
          </figure>
          <figure className="hp-testimonial">
            <span className="hp-testimonial-mark" aria-hidden="true">&ldquo;</span>
            <blockquote>
              Bridge Champions has transformed my game with its clear lessons on fundamentals,
              bidding, counting, defence and declarer play, all reinforced by simple, practical
              exercises that are easy to follow. I especially enjoy using the memory exercises on
              the treadmill, making it a fun and effective way to sharpen my bridge skills every
              day.
            </blockquote>
            <figcaption>
              <span className="hp-testimonial-avatar" aria-hidden="true">TS</span>
              Terry Simmons, President, Easts Bridge Club
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="hp-about">
        <div className="hp-about-mission">
          <h2 className="hp-about-byline">Built by Paul Dalley</h2>
          <p>
            Bridge Champions is run by Paul Dalley, an accomplished bridge player with dozens of
            national championships in Australia and New Zealand. Paul has represented Australia on
            the national team multiple times in recent years.
          </p>
          <p>
            I&apos;ve spent the last decade immersing myself in bridge improvement - studying,
            practicing, and refining my understanding of the game. It was time-consuming, often
            overwhelming, and filled with trial and error.
          </p>
          <p>
            Bridge Champions is my effort to package that journey for you.{' '}
            <strong className="hp-about-pull">If you can&apos;t explain it simply, you don&apos;t understand it</strong>
            {' '}— and I&apos;m committed to breaking down complex concepts into clear, actionable
            lessons.
          </p>
          <p>
            Whether you&apos;re defending, declaring, or bidding — you&apos;ll find focused,
            practical content designed to make you a better player without requiring endless hours
            of study.
          </p>
          <p className="hp-about-sig">— Paul Dalley</p>
        </div>
        <div className="hp-about-achievements">
          <h3>Recent achievements</h3>
          <ul>
            <li><strong>2026</strong> &mdash; Qualified for the Australian team.</li>
            <li><strong>2026</strong> &mdash; 1st place: National Open Teams (Canberra)</li>
            <li><strong>2026</strong> &mdash; 1st place: South West Pacific Teams (Canberra)</li>
            <li><strong>2025</strong> &mdash; 1st place: Gold Coast Pairs</li>
            <li><strong>2025</strong> &mdash; 1st place: Adelaide Open Teams</li>
            <li><strong>2025</strong> &mdash; 1st place: New Zealand Open Teams</li>
          </ul>
          <p>
            Paul regularly discusses bridge with top players both in Australia and internationally,
            bringing their insights and expertise to Bridge Champions members.
          </p>
        </div>
      </section>

      <GuestOnly>
        <section className="hp-cta">
          <div className="hp-cta-bg" aria-hidden="true" />
          <div className="hp-cta-inner">
            <p className="hp-cta-suits" aria-hidden="true">
              <span className="hp-hero-suit-red">♥</span> ♠ <span className="hp-hero-suit-red">♦</span> ♣
            </p>
            <p className="hp-cta-line">clear, practical lessons, no nonsense.</p>
            <a href="/membership" className="hp-btn-primary hp-cta-btn">Start 7-day free trial</a>
          </div>
        </section>
      </GuestOnly>
    </div>
  );
}
