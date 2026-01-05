import React from 'react';
import { Link } from 'react-router-dom';
import './Flyer.css';

const Flyer = () => {
  return (
    <div className="Flyer-container">
      <div className="Flyer-content">
        {/* Header */}
        <div className="Flyer-header">
          <h1 className="Flyer-title">Bridge Champions</h1>
          <p className="Flyer-tagline">Clear, Simple Bridge Instruction for Club Players</p>
        </div>

        {/* Photo Placeholder */}
        <div className="Flyer-photo-section">
          <div className="Flyer-photo-placeholder">
            <p className="Flyer-photo-text">Photo Coming Soon</p>
            <p className="Flyer-photo-note">(Photo will be added here)</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="Flyer-main">
          <section className="Flyer-section">
            <h2 className="Flyer-section-title">What is Bridge Champions?</h2>
            <p className="Flyer-text">
              Bridge Champions is an online learning platform designed specifically for club players who want to improve their game without the overwhelm. Created by Paul Dalley, a multiple national champion and Australian team representative, the platform brings 15 years of bridge expertise directly to you.
            </p>
            <p className="Flyer-text">
              <strong>Our goal is simple:</strong> Help you become a better bridge player through clear, practical instruction that fits into your life. No endless theory, no confusing jargon—just the core lessons that actually matter, presented in a way that makes sense.
            </p>
          </section>

          <section className="Flyer-section">
            <h2 className="Flyer-section-title">What You'll Get</h2>
            <div className="Flyer-features">
              <div className="Flyer-feature">
                <span className="Flyer-feature-icon">📚</span>
                <div>
                  <h3 className="Flyer-feature-title">Comprehensive Articles</h3>
                  <p className="Flyer-feature-text">Step-by-step guides on declarer play, bidding, and defense. Organized by difficulty level so you can learn at your own pace.</p>
                </div>
              </div>
              
              <div className="Flyer-feature">
                <span className="Flyer-feature-icon">🎥</span>
                <div>
                  <h3 className="Flyer-feature-title">Instructional Videos</h3>
                  <p className="Flyer-feature-text">Watch and learn with video lessons that bring concepts to life. Perfect for visual learners or when you prefer watching over reading.</p>
                </div>
              </div>
              
              <div className="Flyer-feature">
                <span className="Flyer-feature-icon">🎯</span>
                <div>
                  <h3 className="Flyer-feature-title">Practice Questions</h3>
                  <p className="Flyer-feature-text">Test your understanding with interactive practice hands. See the answer, then check your thinking against expert analysis.</p>
                </div>
              </div>
              
              <div className="Flyer-feature">
                <span className="Flyer-feature-icon">📝</span>
                <div>
                  <h3 className="Flyer-feature-title">Interactive Quizzes</h3>
                  <p className="Flyer-feature-text">Challenge yourself with quizzes that reinforce key concepts and help you track your progress.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="Flyer-section Flyer-pricing">
            <h2 className="Flyer-section-title">Membership Options</h2>
            <div className="Flyer-pricing-cards">
              <div className="Flyer-pricing-card">
                <h3 className="Flyer-pricing-name">Basic Membership</h3>
                <div className="Flyer-pricing-price">$25<span>/month</span></div>
                <ul className="Flyer-pricing-benefits">
                  <li>All articles on Declarer Play, Defence, and Bidding</li>
                  <li>Interactive quizzes and practice hands</li>
                  <li>Organized by difficulty level</li>
                </ul>
              </div>
              
              <div className="Flyer-pricing-card Flyer-pricing-card-featured">
                <div className="Flyer-pricing-badge">MOST POPULAR</div>
                <h3 className="Flyer-pricing-name">Premium</h3>
                <div className="Flyer-pricing-price">$50<span>/month</span></div>
                <ul className="Flyer-pricing-benefits">
                  <li><strong>Everything in Basic, plus:</strong></li>
                  <li>Exclusive instructional videos</li>
                  <li>Submit bridge questions to Paul</li>
                  <li>Receive video or email responses from expert players</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="Flyer-section Flyer-promo">
            <div className="Flyer-promo-box">
              <h2 className="Flyer-promo-title">Special Offer for Harbourview Bridge Club</h2>
              <div className="Flyer-promo-code">
                <span className="Flyer-promo-label">Use Promo Code:</span>
                <span className="Flyer-promo-code-text">HARBOURVIEW</span>
              </div>
              <p className="Flyer-promo-description">
                <strong>🎉 Get 1 Month FREE with Premium Membership!</strong>
                <br />
                Enter the code <strong>HARBOURVIEW</strong> when signing up for Premium membership and receive your first month completely free. This gives you full access to all Premium features including exclusive videos, the ability to submit questions to Paul, and expert responses—all at no cost for the first month.
              </p>
            </div>
          </section>

          <section className="Flyer-section">
            <h2 className="Flyer-section-title">Why Bridge Champions?</h2>
            <p className="Flyer-text">
              As a club player, you know that improving at bridge takes time and practice. But it doesn't have to be complicated. Bridge Champions focuses on <strong>simplicity and real improvement</strong>—the lessons that actually make a difference at the table.
            </p>
            <p className="Flyer-text">
              Whether you're working on your declarer play, refining your bidding, or sharpening your defense, you'll find content designed specifically for players like you. No need to wade through advanced theory or tournament-level strategies—just clear, practical guidance that helps you play better bridge.
            </p>
          </section>

          <section className="Flyer-section Flyer-cta">
            <h2 className="Flyer-cta-title">Ready to Improve Your Game?</h2>
            <p className="Flyer-cta-text">Join Bridge Champions today and start your journey to better bridge.</p>
            <div className="Flyer-cta-buttons">
              <a 
                href="https://bridgechampions.com/membership" 
                className="Flyer-cta-button Flyer-cta-button-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Sign Up Now
              </a>
              <a 
                href="https://bridgechampions.com" 
                className="Flyer-cta-button Flyer-cta-button-secondary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn More
              </a>
            </div>
            <p className="Flyer-cta-note">
              Visit us at <strong>bridgechampions.com</strong>
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="Flyer-footer">
          <p className="Flyer-footer-text">
            Bridge Champions - Clear, simple bridge instruction. Real improvement without the overwhelming time commitment.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Flyer;

