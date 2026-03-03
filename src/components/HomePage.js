import React, { Component } from "react";
import { Helmet } from "react-helmet-async";
import { Row, Col, Modal, Button, Icon, Preloader } from "react-materialize";
import "./Homepage.css";
import Add from "../containers/Add";
import $ from "jquery";
import { Link } from "react-router-dom";
import DailyFreeSingleton from "./HomePage/DailyFreeSingleton";
import AnimatedButton from "./UI/AnimatedButton";
import CategorySelector from "./HomePage/CategorySelector";
import WelcomeVideo from "./HomePage/WelcomeVideo";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { firebase } from "../firebase/config";

const photo = require("../assets/images/logo-small-inv-t-greybg.png");
const stripeVerifyCheckoutSessionUrl =
  "https://us-central1-bridgechampions.cloudfunctions.net/stripeVerifyCheckoutSession";

class HomePage extends Component {
  state = {
    successPage: false,
    showInfo: true,
    verifyingCheckout: false,
    verifyResult: null,
    verifyError: null,
    sessionId: null,
    waitingForAuth: false,
  };

  componentDidMount() {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (this.props.success) {
      this.setState({ successPage: true });
      setTimeout(() => {
        $("#success_modal_trigger").click();
      }, 35);

      // If we have a Stripe session_id in the URL, attempt post-checkout verification + activation.
      // This gives the user immediate feedback and serves as a fallback when the webhook is failing.
      try {
        const params = new URLSearchParams(window.location.search);
        const sessionId = params.get("session_id");
        // Fallback: if URL doesn't have a session id (or it's clearly not a Stripe session),
        // try the last stored one.
        let effectiveSessionId = sessionId;
        const looksLikeRedacted = effectiveSessionId === "..." || effectiveSessionId === "…";
        if (!effectiveSessionId || looksLikeRedacted || !String(effectiveSessionId).startsWith("cs_")) {
          const stored = localStorage.getItem("postCheckoutSessionId");
          if (stored && String(stored).startsWith("cs_")) {
            effectiveSessionId = stored;
          } else {
            const lastStored = localStorage.getItem("lastStripeCheckoutSessionId");
            if (lastStored && String(lastStored).startsWith("cs_")) {
              effectiveSessionId = lastStored;
            }
          }
        }

        if (effectiveSessionId) {
          // Keep storage in sync so login redirects can still work.
          try {
            localStorage.setItem("postCheckoutSessionId", effectiveSessionId);
          } catch (e) {
            // ignore
          }
          this.setState({ sessionId: effectiveSessionId }, () => this.maybeVerifyStripeCheckoutSession());
        }
      } catch (e) {
        // ignore
      }
    }
    if (this.props.error) {
      setTimeout(() => {
        $("#error_modal_trigger").click();
      }, 35);
    }
  }

  componentWillUnmount() {
    if (this._authUnsubscribe) {
      try {
        this._authUnsubscribe();
      } catch (e) {
        // ignore
      }
      this._authUnsubscribe = null;
    }
    if (this._authWaitTimeout) {
      clearTimeout(this._authWaitTimeout);
      this._authWaitTimeout = null;
    }
  }

  getEffectiveUid = () => {
    // Redux uid can lag behind Firebase auth state on page refresh.
    const authUid = firebase?.auth?.()?.currentUser?.uid;
    return this.props.uid || authUid || null;
  };

  maybeVerifyStripeCheckoutSession = () => {
    const { sessionId } = this.state;

    if (!sessionId) return;

    const effectiveUid = this.getEffectiveUid();
    if (effectiveUid) {
      return this.verifyStripeCheckoutSession(effectiveUid);
    }

    // Persist session id so after login we can automatically retry activation.
    try {
      localStorage.setItem("postCheckoutSessionId", sessionId);
    } catch (e) {
      // ignore
    }

    // Wait for Firebase auth to become ready, then retry automatically.
    if (!this._authUnsubscribe && firebase?.auth) {
      this._authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
        if (user?.uid) {
          this.setState({ waitingForAuth: false }, () => this.verifyStripeCheckoutSession(user.uid));
        }
      });
    }

    // Give it a few seconds; if it still hasn't resolved, show the guidance message.
    this.setState({ waitingForAuth: true });
    if (this._authWaitTimeout) clearTimeout(this._authWaitTimeout);
    this._authWaitTimeout = setTimeout(() => {
      const uidNow = this.getEffectiveUid();
      if (!uidNow) {
        this.setState({
          waitingForAuth: false,
          verifyingCheckout: false,
          verifyResult: null,
          verifyError:
            "We’re still waiting for your login session to load. Please click “Log in now”, sign in, and we’ll retry activation automatically.",
        });
      }
    }, 4000);
  };

  verifyStripeCheckoutSession = (effectiveUid) => {
    const { sessionId } = this.state;

    if (!sessionId) return;

    if (!effectiveUid) {
      // Persist session id so after login we can automatically retry activation.
      try {
        localStorage.setItem("postCheckoutSessionId", sessionId);
      } catch (e) {
        // ignore
      }
      this.setState({
        verifyingCheckout: false,
        verifyResult: null,
        verifyError:
          "You're not logged in yet. Please log in with the same account you used to subscribe. We'll automatically retry activation after you sign in.",
      });
      return;
    }

    this.setState({ verifyingCheckout: true, verifyError: null, verifyResult: null });

    $.post(stripeVerifyCheckoutSessionUrl, { sessionId, uid: effectiveUid })
      .done((resp) => {
        // Clear post-checkout markers so we don't re-trigger activation for other logins.
        try {
          localStorage.removeItem("postCheckoutSessionId");
          localStorage.removeItem("postCheckoutExpectedUid");
        } catch (e) {
          // ignore
        }
        this.setState({ verifyingCheckout: false, verifyResult: resp, verifyError: null });
      })
      .fail((jqXHR) => {
        let message = "Unable to verify your subscription right now.";
        try {
          const body = JSON.parse(jqXHR.responseText);
          message = body.error || message;
          if (body.debug) {
            message += `\n\nDebug: ${JSON.stringify(body.debug)}`;
          }
        } catch (e) {
          if (jqXHR.responseText) message = jqXHR.responseText;
        }
        this.setState({
          verifyingCheckout: false,
          verifyResult: null,
          verifyError: `Verification failed (${jqXHR.status || "unknown"}): ${message}`,
        });
      });
  };

  scrollToMission = () => {
    const missionSection = document.getElementById('mission-section');
    if (missionSection) {
      missionSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  render() {
    let whenSubExpiresMinus2Days = undefined;
    if (this.props.subscriptionExpires) {
      whenSubExpiresMinus2Days =
        new Date(this.props.subscriptionExpires).getTime() -
        2 * 24 * 60 * 60 * 1000;
    }

    return (
      <div className="HomePage">
        <Helmet>
          <title>Bridge Champions - Winning Bridge Insights from World Class Experts</title>
          <meta name="description" content="Learn Bridge or improve your mastery with daily access into the minds, insights and recent play of some of the most knowledgeable Bridge Champions and expert players around. Knowledge and quizzes that will improve your play." />
          <link rel="canonical" href="https://bridgechampions.com/" />
          <meta property="og:url" content="https://bridgechampions.com/" />
          <meta property="og:title" content="Bridge Champions - Winning Bridge Insights from World Class Experts" />
          <meta property="og:description" content="Learn Bridge from world class experts and champions. Improve your game with daily insights and quizzes." />
        </Helmet>
        <Add goto="create/db" history={this.props.history} />

        {/* SUCCESS MODAL */}
        {this.props.success && (
          <Modal
            trigger={
              <Button
                id="success_modal_trigger"
                style={{ opacity: 0, zIndex: -1, position: "absolute" }}
              >
                btn
              </Button>
            }
            className="HomePage-success-modal"
            options={{
              dismissible: false,
              startingTop: '10%',
              endingTop: '10%'
            }}
          >
            <div className="HomePage-success-content BCModal-content">
              <button className="BCModal-close modal-close" aria-label="Close dialog" title="Close">
                <i className="material-icons">close</i>
              </button>
              <div className="HomePage-success-icon">
                <i className="fas fa-check-circle"></i>
              </div>
              <h1 className="HomePage-success-title">Welcome to Bridge Champions!</h1>
              <p className="HomePage-success-subtitle">
                {this.state.sessionId && !this.state.verifyResult?.ok
                  ? "Finalizing your subscription…"
                  : "Your subscription is now active"}
              </p>
              <div className="HomePage-success-message">
                {this.state.sessionId && (
                  <div style={{ marginBottom: "1.25rem" }}>
                    {this.state.verifyingCheckout && (
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <Preloader size="small" />
                        <div>
                          <strong>Activating your access…</strong>
                          <div style={{ fontSize: "0.95rem", opacity: 0.85 }}>
                            (If Stripe webhooks are delayed/failing, this may take a few seconds.)
                          </div>
                        </div>
                      </div>
                    )}

                    {!this.state.verifyingCheckout && this.state.verifyResult?.ok && (
                      <div style={{ padding: "0.75rem 1rem", border: "1px solid #2e7d32", borderRadius: 8 }}>
                        <strong>Success:</strong> Your access has been activated.
                        <div style={{ fontSize: "0.95rem", opacity: 0.85, marginTop: "0.25rem" }}>
                          Subscription expires: {this.state.verifyResult?.data?.expiresIso || "—"}
                        </div>
                      </div>
                    )}

                    {!this.state.verifyingCheckout && this.state.verifyError && (
                      <div style={{ padding: "0.75rem 1rem", border: "1px solid #c62828", borderRadius: 8 }}>
                        <strong>We couldn’t activate your access automatically.</strong>
                        <div style={{ marginTop: "0.5rem", whiteSpace: "pre-wrap" }}>
                          {this.state.verifyError}
                        </div>
                        {this.state.sessionId && (
                          <div style={{ marginTop: "0.75rem", fontSize: "0.95rem", opacity: 0.9 }}>
                            <strong>Detected session_id:</strong>{" "}
                            {String(this.state.sessionId).slice(0, 18)}
                            {String(this.state.sessionId).length > 18 ? "…" : ""}{" "}
                            (len {String(this.state.sessionId).length})
                            {!String(this.state.sessionId).startsWith("cs_") && (
                              <div style={{ marginTop: "0.35rem", opacity: 0.95 }}>
                                Stripe session IDs start with <code>cs_</code>. If your URL shows{" "}
                                <code>session_id=...</code> (or anything not starting with <code>cs_</code>), you’ll need to start a fresh checkout from the Membership page so we can capture the real session ID.
                              </div>
                            )}
                          </div>
                        )}
                        <div style={{ marginTop: "0.75rem" }}>
                          <Button onClick={() => this.props.history.push("/login")} style={{ marginRight: "0.75rem" }}>
                            Log in now
                            <Icon right>login</Icon>
                          </Button>
                          <Button onClick={this.verifyStripeCheckoutSession}>
                            Retry activation
                            <Icon right>refresh</Icon>
                          </Button>
                        </div>
                        <div style={{ fontSize: "0.95rem", opacity: 0.85, marginTop: "0.75rem" }}>
                          If payment succeeded but access still won’t activate, this typically means the Stripe webhook signing secret is misconfigured.
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {(!this.state.sessionId || this.state.verifyResult?.ok) && (
                  <>
                    <p>
                      Thank you for subscribing! Your membership is now active and you have full access to all our premium content.
                    </p>
                    <p>
                      You can start exploring our comprehensive articles, instructional videos, practice questions, and interactive quizzes right away.
                    </p>
                  </>
                )}
                {this.state.sessionId && !this.state.verifyResult?.ok && !this.state.verifyingCheckout && this.state.verifyError && (
                  <p>
                    We couldn’t activate your access automatically yet. Please use the options above to log in and retry, or wait a minute and refresh — if payment went through, the webhook may still be processing.
                  </p>
                )}
              </div>
              <div className="HomePage-success-footer">
                <p className="HomePage-success-thanks">
                  From the team at Bridge Champions and our contributing players, we hope you enjoy it!
                </p>
              </div>
            </div>
          </Modal>
        )}

        {/* ERROR MODAL */}
        {this.props.error && (
          <Modal
            trigger={
              <Button
                id="error_modal_trigger"
                style={{ opacity: 0, zIndex: -1, position: "absolute" }}
              >
                btn
              </Button>
            }
            className="BCModal"
            options={{ dismissible: true }}
          >
            <div className="BCModal-content">
              <button className="BCModal-close modal-close" aria-label="Close dialog" title="Close">
                <i className="material-icons">close</i>
              </button>
              <h1 className="HomePage-modal-title">There was some problem processing your subscription.</h1>
              <p className="HomePage-modal-text">
                Please check the status of your payment on PayPal.com or with your
                credit card provider to see if the transaction occurred.
                <br />
                <br />
                If it did not, feel free to try subscribing again{" "}
                <Link to="/membership">here</Link>.
              </p>
              <p className="HomePage-modal-text">
                If your payment was successfully processed and you cannot access
                our subscriber content, then please contact support using the
                Contact us form in the footer below. We appreciate your patience
                in this regard.
              </p>
              <div style={{ marginTop: "1.25rem", textAlign: "right" }}>
                <Button className="modal-close" flat>
                  Close
                </Button>
              </div>
            </div>
          </Modal>
        )}

        {/* HERO BANNER */}
        <section className="HomePage-hero">
          <div className="HomePage-hero-overlay" />
          
          <div className="HomePage-hero-content">
            <div className="HomePage-hero-badge">
              <span className="suit-symbol red-suit">♥</span>
              <span className="suit-symbol black-suit">♠</span>
              <span className="suit-symbol red-suit">♦</span>
              <span className="suit-symbol black-suit">♣</span>
            </div>

            <h1 className="HomePage-hero-title">
              Welcome to
              <br />
              <span className="HomePage-hero-title-accent">Bridge Champions</span>
            </h1>
            
            <p className="HomePage-hero-subtitle">
              Over the last 15 years, I’ve spent a lot of time studying and practicing bridge. Now I’m bringing the core lessons to my members. I keep it simple and practical.
            </p>

            {/* Welcome Video */}
            <div className="HomePage-hero-video">
              <WelcomeVideo />
            </div>

            <div className="HomePage-hero-actions">
              <button
                className="btn btn-secondary btn-large"
                onClick={this.scrollToMission}
              >
                Learn More
              </button>

              {(this.props.subscriptionExpires === undefined ||
                !this.props.uid ||
                (whenSubExpiresMinus2Days !== undefined &&
                  new Date() > whenSubExpiresMinus2Days)) &&
                !this.state.successPage && (
                  <Link to="/membership" className="btn btn-outline btn-large">
                    Subscribe Now
                  </Link>
                )}
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="HomePage-content">
          <div className="container">
            <CategorySelector />
          </div>
        </section>

        {/* MISSION SECTION */}
        <section id="mission-section" className="HomePage-mission">
          <div className="container">
            <div className="HomePage-mission-content">
              <h2 className="HomePage-mission-title">About Bridge Champions</h2>
              
              <div className="HomePage-mission-text">
                <p>
                  I've spent the last decade immersing myself in bridge improvement - studying, practicing, and refining my understanding of the game. It was time-consuming, often overwhelming, and filled with trial and error.
                </p>
                
                <p>
                  Bridge Champions is my effort to package that journey for you. <strong>If you can't explain it simply, you don't understand it</strong> - and I'm committed to breaking down complex concepts into clear, actionable lessons.
                </p>
                
                <p>
                  Whether you're defending, declaring, or bidding - you'll find focused, practical content designed to make you a better player without requiring endless hours of study.
                </p>
                
                <p className="HomePage-mission-signature">
                  — Paul Dalley
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT PAUL SECTION */}
        <section className="HomePage-about">
          <div className="container">
            <div className="HomePage-about-content">
              <h2 className="HomePage-about-title">About Paul Dalley</h2>
              
              <div className="HomePage-about-text">
                <p>
                  Bridge Champions is run by Paul Dalley, an accomplished bridge player with dozens of
                  national championships in Australia and New Zealand. Paul has represented Australia on
                  the national team multiple times in recent years.
                </p>

                <h3 className="HomePage-about-subtitle">Recent Achievements</h3>
                <ul className="HomePage-about-achievements">
                  <li><strong>2026</strong> — Qualified for the Australian team.</li>
                  <li><strong>2026</strong> — 1st place: National Open Teams (Canberra)</li>
                  <li><strong>2026</strong> — 1st place: South West Pacific Teams (Canberra)</li>
                  <li><strong>2025</strong> — 1st place: Gold Coast Pairs</li>
                  <li><strong>2025</strong> — 1st place: Adelaide Open Teams</li>
                  <li><strong>2025</strong> — 1st place: New Zealand Open Teams</li>
                </ul>

                <p>
                  Paul regularly discusses bridge with top players both in Australia and internationally,
                  bringing their insights and expertise to Bridge Champions members.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default withRouter(
  connect(
    ({ auth }) => ({
      subscriptionActive: auth.subscriptionActive,
      subscriptionExpires: auth.subscriptionExpires,
      a: auth.a,
      uid: auth.uid,
    }),
    null
  )(HomePage)
);
