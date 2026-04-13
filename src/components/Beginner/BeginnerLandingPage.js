import React, { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { firebase } from "../../firebase/config";
import { sendBeginnerLandingCtaClick, getMarketingParamsFromSearch } from "../../utils/analytics";
import { BEGINNER_LANDING_TESTIMONIALS } from "../../data/beginner/beginnerLandingTestimonials";
import "./BeginnerLandingPage.css";

const PRACTICE_PATH = "/beginner/practice/declarer";
const VIDEO_DOC = "beginnerLandingVideo";
/** Shown when Firestore `beginnerLandingVideo` has no URL (admins can override in site settings). */
const DEFAULT_BEGINNER_LANDING_INTRO_VIDEO = "https://www.youtube.com/shorts/_2fhCCQ-iR4";

const SITE_ORIGIN = "https://bridgechampions.com";
const LANDING_CANONICAL = `${SITE_ORIGIN}/beginner`;
/** Same asset as index.html og:image — 1200×630-friendly brand image for shares and previews. */
const OG_IMAGE_URL =
  "https://firebasestorage.googleapis.com/v0/b/bridgechampions.appspot.com/o/logo.png?alt=media&token=583808ab-2c3b-49a6-8936-82dffe55ec95";

function getYouTubeEmbedUrl(url) {
  if (!url) return "";
  let videoId = "";
  if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("watch?v=")[1].split("&")[0];
  } else if (url.includes("youtu.be/")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  } else if (url.includes("youtube.com/embed/")) {
    return url;
  } else if (url.includes("youtube.com/shorts/")) {
    const after = url.split("youtube.com/shorts/")[1] || "";
    videoId = after.split("?")[0].split("/")[0];
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1` : "";
}

function BeginnerLandingVideo({ isAdmin }) {
  const [videoUrl, setVideoUrl] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchUrl = async () => {
      try {
        const doc = await firebase.firestore().collection("siteSettings").doc(VIDEO_DOC).get();
        if (!cancelled) {
          const fromDb = doc.exists ? String(doc.data()?.url || "").trim() : "";
          const u = fromDb || DEFAULT_BEGINNER_LANDING_INTRO_VIDEO;
          setVideoUrl(u);
          setEditUrl(u);
        }
      } catch (e) {
        console.error("BeginnerLandingVideo fetch error:", e);
        if (!cancelled) {
          setVideoUrl(DEFAULT_BEGINNER_LANDING_INTRO_VIDEO);
          setEditUrl(DEFAULT_BEGINNER_LANDING_INTRO_VIDEO);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchUrl();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSave = async () => {
    try {
      await firebase.firestore().collection("siteSettings").doc(VIDEO_DOC).set({
        url: editUrl,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      setVideoUrl(editUrl);
      setIsEditing(false);
    } catch (e) {
      console.error("BeginnerLandingVideo save error:", e);
      alert("Could not save video URL. Please try again.");
    }
  };

  const embedUrl = getYouTubeEmbedUrl(isEditing ? editUrl : videoUrl);

  if (loading) {
    return (
      <div className="BeginnerLanding-videoSkeleton" aria-hidden="true">
        <div className="BeginnerLanding-videoSkeleton-inner" />
      </div>
    );
  }

  if (isAdmin && isEditing) {
    return (
      <div className="BeginnerLanding-video BeginnerLanding-video--editing">
        <div className="BeginnerLanding-video-admin">
          <input
            type="text"
            className="BeginnerLanding-video-input"
            placeholder="YouTube URL"
            value={editUrl}
            onChange={(e) => setEditUrl(e.target.value)}
            aria-label="Beginner landing video YouTube URL"
          />
          <button type="button" className="btn btn-small green" onClick={handleSave}>
            Save
          </button>
          <button
            type="button"
            className="btn btn-small"
            onClick={() => {
              setEditUrl(videoUrl);
              setIsEditing(false);
            }}
          >
            Cancel
          </button>
        </div>
        {editUrl && (
          <div className="BeginnerLanding-video-frame">
            <iframe
              src={getYouTubeEmbedUrl(editUrl)}
              title="Video preview"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    );
  }

  if (!videoUrl) {
    if (isAdmin) {
      return (
        <div className="BeginnerLanding-video BeginnerLanding-video--empty">
          <p>No beginner landing video set.</p>
          <button type="button" className="btn btn-small" onClick={() => setIsEditing(true)}>
            Add video URL
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="BeginnerLanding-video">
      {isAdmin && (
        <button
          type="button"
          className="BeginnerLanding-video-edit"
          onClick={() => setIsEditing(true)}
          title="Edit landing video"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
        </button>
      )}
      <div className="BeginnerLanding-video-frame">
        <iframe
          src={embedUrl}
          title="Introduction to learning bridge from scratch"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}

function BeginnerLandingPage({ location, isAdmin }) {
  const search = location?.search || "";
  const toPractice = { pathname: PRACTICE_PATH, search };

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Learn Bridge from Scratch — Bridge Champions",
    description:
      "Start learning contract bridge with a short intro and interactive practice. Clear steps for complete beginners—try your first hands free.",
    url: LANDING_CANONICAL,
    isPartOf: {
      "@type": "WebSite",
      name: "Bridge Champions",
      url: SITE_ORIGIN,
    },
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const onCtaClick = useCallback((placement) => {
    sendBeginnerLandingCtaClick({
      placement,
      destination: PRACTICE_PATH,
      ...getMarketingParamsFromSearch(search),
    });
  }, [search]);

  return (
    <div className="BeginnerLanding">
      <Helmet>
        <title>Learn Bridge from Scratch — Free Start | Bridge Champions</title>
        <meta
          name="description"
          content="Start learning contract bridge with a short intro and interactive practice. Clear steps for complete beginners—try your first hands free."
        />
        <link rel="canonical" href={LANDING_CANONICAL} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="Bridge Champions" />
        <meta property="og:url" content={LANDING_CANONICAL} />
        <meta property="og:title" content="Learn Bridge from Scratch — Bridge Champions" />
        <meta
          property="og:description"
          content="Interactive practice and clear steps for complete beginners. Try your first hands free—no fluff."
        />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={LANDING_CANONICAL} />
        <meta name="twitter:title" content="Learn Bridge from Scratch — Bridge Champions" />
        <meta
          name="twitter:description"
          content="Interactive practice for complete beginners. Try your first hands free."
        />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <section className="BeginnerLanding-hero" aria-labelledby="BeginnerLanding-heading">
        <div className="BeginnerLanding-hero-overlay" aria-hidden="true" />
        <div className="BeginnerLanding-hero-inner">
          <p className="BeginnerLanding-eyebrow">New · Beginner path</p>
          <h1 id="BeginnerLanding-heading" className="BeginnerLanding-title">
            Learn bridge <span className="BeginnerLanding-title-accent">from scratch</span>
          </h1>
          <p className="BeginnerLanding-lead">
            You&apos;ll know how to play bridge in 5-10 minutes from now.
          </p>
          <p className="BeginnerLanding-trust">
            Taught by{" "}
            <span className="BeginnerLanding-trustName">Paul Dalley</span>—national champion in Australia and New
            Zealand, and Australian team representative. Clear steps, no filler.
          </p>
          <p className="BeginnerLanding-aboutLinkWrap">
            <Link className="BeginnerLanding-aboutLink" to={{ pathname: "/about", search }}>
              More about Paul
            </Link>
          </p>
          <Link
            className="BeginnerLanding-cta BeginnerLanding-cta--primary"
            to={toPractice}
            onClick={() => onCtaClick("hero")}
          >
            Start Playing
          </Link>
        </div>
      </section>

      <div className="BeginnerLanding-body">
        <section className="BeginnerLanding-section" aria-labelledby="BeginnerLanding-video-heading">
          <h2 id="BeginnerLanding-video-heading" className="BeginnerLanding-sectionTitle">
            Quick hello
          </h2>
          <p className="BeginnerLanding-sectionIntro BeginnerLanding-sectionIntro--oneLine">
            Short intro below—captions work with sound off.
          </p>
          <BeginnerLandingVideo isAdmin={isAdmin} />
        </section>

        <section
          className="BeginnerLanding-section BeginnerLanding-section--testimonials"
          aria-labelledby="BeginnerLanding-testimonials-heading"
        >
          <h2 id="BeginnerLanding-testimonials-heading" className="BeginnerLanding-sectionTitle">
            What members say
          </h2>
          <ul className="BeginnerLanding-testimonials">
            {BEGINNER_LANDING_TESTIMONIALS.map((item, index) => (
              <li key={index} className="BeginnerLanding-testimonial">
                <blockquote className="BeginnerLanding-testimonial-quote">
                  <p>&ldquo;{item.quote}&rdquo;</p>
                </blockquote>
              </li>
            ))}
          </ul>
        </section>

        <section
          className="BeginnerLanding-section BeginnerLanding-section--personal"
          aria-labelledby="BeginnerLanding-personal-heading"
        >
          <h2 id="BeginnerLanding-personal-heading" className="BeginnerLanding-sectionTitle">
            From me
          </h2>
          <div className="BeginnerLanding-personalCard">
            <p>
              I run this—when members write in, they hear from me, not a bot.{" "}
              <Link to={{ pathname: "/contact", search }} className="BeginnerLanding-inlineLink">
                Contact
              </Link>
            </p>
          </div>
        </section>
      </div>

      <div className="BeginnerLanding-sticky" role="region" aria-label="Start playing beginner practice">
        <div className="BeginnerLanding-sticky-inner">
          <Link
            className="BeginnerLanding-cta BeginnerLanding-cta--primary BeginnerLanding-cta--sticky"
            to={toPractice}
            onClick={() => onCtaClick("sticky")}
          >
            Start Playing
          </Link>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = (state) => ({
  isAdmin: state.auth.a === true,
});

export default withRouter(connect(mapStateToProps)(BeginnerLandingPage));
