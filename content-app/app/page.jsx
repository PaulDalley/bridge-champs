import { listAllArticles, categoryLabel } from '../lib/articles';
import HomeAuth from '../components/HomeAuth';
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

const TOPICS = [
  { category: 'bidding',  suit: '♣', suitClass: 'green-suit', href: '/learn/bidding' },
  { category: 'declarer', suit: '♠', suitClass: 'black-suit', href: '/learn/declarer' },
  { category: 'defence',  suit: '♥', suitClass: 'red-suit',   href: '/learn/defence' },
];

export default async function HomePage() {
  let recentArticles = [];
  try {
    const all = await listAllArticles();
    recentArticles = all
      .filter((a) => a.updatedAt)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 8)
      .map((a) => ({
        title: a.title,
        href: `/learn/${a.category}/${a.slug}`,
        category: categoryLabel(a.category),
      }));
  } catch (_) {}

  return (
    <div className="hp">
      <HomeAuth recentArticles={recentArticles}>
        <section className="hp-hero">
          <p className="hp-hero-suits" aria-hidden="true">
            <span className="red-suit">♥</span>
            <span className="black-suit">♠</span>
            <span className="red-suit">♦</span>
            <span className="green-suit">♣</span>
          </p>
          <h1 className="hp-hero-title">Welcome to Bridge Champions</h1>
          <p className="hp-hero-sub">
            For the last 15 years, studying, practising, and playing tournament bridge has been my
            life. I&apos;m bringing what I&apos;ve learned to my members—clear, practical lessons,
            no nonsense.
          </p>
          <div className="hp-hero-actions">
            <a href="/membership" className="hp-btn-primary">Start 7-day free trial</a>
            <a href="/learn" className="hp-btn-ghost">Browse lessons</a>
          </div>
        </section>
      </HomeAuth>

      <section className="hp-topics">
        {TOPICS.map(({ category, suit, suitClass, href }) => (
          <a key={category} href={href} className="hp-topic-card">
            <span className={`hp-topic-suit ${suitClass}`} aria-hidden="true">{suit}</span>
            <span className="hp-topic-name">{categoryLabel(category)}</span>
            <span className="hp-topic-arrow">→</span>
          </a>
        ))}
      </section>

      <section className="hp-testimonials">
        <h2 className="hp-sec-label">What members say</h2>
        <div className="hp-testimonials-grid">
          <figure className="hp-testimonial">
            <blockquote>
              Bridge Champions is different (and better!) than your average internet based learning
              tool. It is both practical and insightful, regularly delivering novel ways to
              understand bidding and card play in an easy-to-follow format. Any specific areas of
              interest can be looked up and revised in a perfect &ldquo;hands on&rdquo; format.
              Paul Dalley&apos;s proactive and multi dimensional initiative has increased my
              &ldquo;bridge awareness&rdquo; significantly.
            </blockquote>
            <figcaption>David Bavin, Sydney</figcaption>
          </figure>
          <figure className="hp-testimonial">
            <blockquote>
              I am absolutely loving your work! I have very much the calculating, mathematical
              approach to bridge (comes from 35 years as a Professor of Medicine) so I like the
              design of your site and your approach to teaching. It allows me to test myself with
              immediate feedback from an expert&mdash;all done with compact, specific, and engaging
              comments. You do a great job of making it appear you were here looking over my
              shoulder. You are also clearly committed to making the website the best it can be.
            </blockquote>
            <figcaption>Ian Whyte, Newcastle</figcaption>
          </figure>
          <figure className="hp-testimonial">
            <blockquote>
              Bridge Champions has transformed my game with its clear lessons on fundamentals,
              bidding, counting, defence and declarer play, all reinforced by simple, practical
              exercises that are easy to follow. I especially enjoy using the memory exercises on
              the treadmill, making it a fun and effective way to sharpen my bridge skills every
              day.
            </blockquote>
            <figcaption>Terry Simmons, President, Easts Bridge Club</figcaption>
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
            <strong>If you can&apos;t explain it simply, you don&apos;t understand it</strong>
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
    </div>
  );
}
