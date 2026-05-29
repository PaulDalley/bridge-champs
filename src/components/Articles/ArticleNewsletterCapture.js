import React, { useEffect, useMemo, useState } from "react";
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
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!firebase.auth().currentUser);

  const sourcePath = useMemo(() => {
    try {
      return window?.location?.pathname || "";
    } catch (_) {
      return "";
    }
  }, []);

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    const cleanFirstName = String(firstName || "")
      .trim()
      .split(/\s+/)[0];
    const cleanSurname = String(surname || "")
      .trim()
      .split(/\s+/)[0];
    const clean = String(email || "").trim().toLowerCase();
    if (cleanFirstName.length < 2) {
      setError("Please enter your first name.");
      return;
    }
    if (cleanSurname.length < 2) {
      setError("Please enter your surname.");
      return;
    }
    if (!isLikelyEmail(clean)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (String(password || "").length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const authRes = await firebase
        .auth()
        .createUserWithEmailAndPassword(clean, String(password || ""));
      const user = authRes?.user;
      const uid = user?.uid;

      if (!uid) {
        throw new Error("Could not create account. Please try again.");
      }

      const displayName = `${cleanFirstName} ${cleanSurname}`.trim();
      if (user.updateProfile && displayName) {
        await user.updateProfile({ displayName });
      }

      await firebase
        .firestore()
        .collection("membersData")
        .doc(uid)
        .set(
          {
            firstName: cleanFirstName,
            surname: cleanSurname,
            email: clean,
            signupSource: "article-top-capture",
            sourcePath,
            articleId: articleId || "unknown",
            articleType: articleType || "unknown",
            articleTitle: articleTitle || "Unknown article",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            userAgent: navigator.userAgent || "",
          },
          { merge: true }
        );

      setSubmitted(true);
      setFirstName("");
      setSurname("");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err?.message || "Could not create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section className="ArticleNewsletterCapture" aria-label="Create account">
        <p className="ArticleNewsletterCapture-success">
          Account created. You will receive updated convention ideas, practical tips, and new Bridge Champions training content.
        </p>
      </section>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  return (
    <section className="ArticleNewsletterCapture" aria-label="Create account">
      <h3 className="ArticleNewsletterCapture-heading">Create an account for updated bridge info</h3>
      <p className="ArticleNewsletterCapture-body">
        Create an account in seconds to receive updated convention ideas, practical table tips, and new training content.
      </p>
      <form className="ArticleNewsletterCapture-form" onSubmit={onSubmit}>
        <div className="ArticleNewsletterCapture-nameRow">
          <div>
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
          </div>
          <div>
            <label className="ArticleNewsletterCapture-label" htmlFor={`newsletter-surname-${articleId || "article"}`}>
              Surname
            </label>
            <input
              id={`newsletter-surname-${articleId || "article"}`}
              type="text"
              autoComplete="family-name"
              placeholder="Surname"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              className="ArticleNewsletterCapture-input"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>

        <label className="ArticleNewsletterCapture-label" htmlFor={`newsletter-email-${articleId || "article"}`}>
          Email
        </label>
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

        <label className="ArticleNewsletterCapture-label" htmlFor={`newsletter-password-${articleId || "article"}`}>
          Password
        </label>
        <div className="ArticleNewsletterCapture-row">
          <input
            id={`newsletter-password-${articleId || "article"}`}
            type="password"
            autoComplete="new-password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="ArticleNewsletterCapture-input"
            disabled={isSubmitting}
            required
          />
          <button
            type="submit"
            className="ArticleNewsletterCapture-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create account"}
          </button>
        </div>
        {error ? <p className="ArticleNewsletterCapture-error">{error}</p> : null}
        <p className="ArticleNewsletterCapture-note">
          Quick sign up: first name, surname, email, password.
        </p>
      </form>
    </section>
  );
};

export default ArticleNewsletterCapture;
