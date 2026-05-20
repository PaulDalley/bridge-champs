import React, { useMemo, useState } from "react";
import { firebase } from "../../firebase/config";
import "./ArticleNewsletterCapture.css";

const isLikelyEmail = (value = "") =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());

const ArticleNewsletterCapture = ({
  articleId,
  articleType,
  articleTitle,
}) => {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const sourcePath = useMemo(() => {
    try {
      return window?.location?.pathname || "";
    } catch (_) {
      return "";
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const cleanFirstName = String(firstName || "")
      .trim()
      .split(/\s+/)[0];
    const clean = String(email || "").trim().toLowerCase();
    if (cleanFirstName.length < 2) {
      setError("Please enter your first name.");
      return;
    }
    if (!isLikelyEmail(clean)) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      await firebase.firestore().collection("newsletterLeads").add({
        firstName: cleanFirstName,
        name: cleanFirstName,
        email: clean,
        source: "article-top-capture",
        sourcePath,
        articleId: articleId || "unknown",
        articleType: articleType || "unknown",
        articleTitle: articleTitle || "Unknown article",
        status: "new",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent || "",
      });
      setSubmitted(true);
      setFirstName("");
      setEmail("");
    } catch (err) {
      setError(err?.message || "Could not save email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="ArticleNewsletterCapture" aria-label="Newsletter signup">
        <p className="ArticleNewsletterCapture-success">
          You are in. I will send a monthly email with fresh convention ideas, practical mistakes to avoid, and standout new training content.
        </p>
      </section>
    );
  }

  return (
    <section className="ArticleNewsletterCapture" aria-label="Newsletter signup">
      <h3 className="ArticleNewsletterCapture-heading">Get the monthly bridge newsletter</h3>
      <p className="ArticleNewsletterCapture-body">
        Latest convention ideas, practical table tips, and the strongest new article or trainer updates each month.
      </p>
      <form className="ArticleNewsletterCapture-form" onSubmit={onSubmit}>
        <label className="ArticleNewsletterCapture-label" htmlFor={`newsletter-firstname-${articleId || "article"}`}>
          First name
        </label>
        <input
          id={`newsletter-firstname-${articleId || "article"}`}
          type="text"
          autoComplete="given-name"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="ArticleNewsletterCapture-input"
          disabled={isSubmitting}
          required
        />
        <label className="ArticleNewsletterCapture-label" htmlFor={`newsletter-email-${articleId || "article"}`}>
          Email
        </label>
        <div className="ArticleNewsletterCapture-row">
          <input
            id={`newsletter-email-${articleId || "article"}`}
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="ArticleNewsletterCapture-input"
            disabled={isSubmitting}
            required
          />
          <button
            type="submit"
            className="ArticleNewsletterCapture-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Get updates"}
          </button>
        </div>
        {error ? <p className="ArticleNewsletterCapture-error">{error}</p> : null}
        <p className="ArticleNewsletterCapture-note">
          Free and unsubscribe anytime.
        </p>
      </form>
    </section>
  );
};

export default ArticleNewsletterCapture;
