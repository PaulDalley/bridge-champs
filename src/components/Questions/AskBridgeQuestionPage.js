import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { firebase } from "../../firebase/config";
import "./AskBridgeQuestionPage.css";

const isProbablyValidUrl = (value) => {
  if (!value) return true;
  try {
    // Allow bare domains by auto-prefixing scheme for validation only
    const normalized = value.match(/^https?:\/\//i) ? value : `https://${value}`;
    // eslint-disable-next-line no-new
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
};

export default function AskBridgeQuestionPage(props) {
  const { history } = props;
  const uid = useSelector((state) => state.auth.uid);
  const email = useSelector((state) => state.auth.email);
  const displayName = useSelector((state) => state.auth.displayName);

  // On hard refresh, Redux auth fields can be briefly empty while Firebase restores the session.
  // Avoid redirecting to /login until Firebase has reported auth state at least once.
  const [authChecked, setAuthChecked] = useState(false);

  const [questionText, setQuestionText] = useState("");
  const [handUrl, setHandUrl] = useState("");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged(() => {
      setAuthChecked(true);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  useEffect(() => {
    const next = files.map((f) => ({
      name: f.name,
      url: URL.createObjectURL(f),
    }));
    setPreviews(next);
    return () => {
      next.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [files]);

  const currentUser = firebase.auth().currentUser;
  const effectiveUid = uid || currentUser?.uid;

  // Keep it simple: logged-in only
  useEffect(() => {
    if (!authChecked) return;
    if (!effectiveUid) history.push("/login");
  }, [authChecked, effectiveUid, history]);

  if (!authChecked) {
    return (
      <div className="AskBQPage">
        <div className="AskBQPage-container">
          <div className="AskBQPage-card" style={{ textAlign: "center" }}>
            Loading…
          </div>
        </div>
      </div>
    );
  }

  if (!effectiveUid) return null;

  const onFilesSelected = (e) => {
    const selected = Array.from(e.target.files || []);
    if (!selected.length) return;
    // images only
    const imageFiles = selected.filter((f) => f.type && f.type.startsWith("image/"));
    setFiles(imageFiles.slice(0, 3)); // cap to keep it simple
  };

  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const q = (questionText || "").trim();
    const url = (handUrl || "").trim();

    if (!q && files.length === 0 && !url) {
      setError("Please add a question, a photo, or a hand-record URL.");
      return;
    }
    if (url && !isProbablyValidUrl(url)) {
      setError("That URL doesn’t look right. Please paste a full link (or a domain).");
      return;
    }

    setSubmitting(true);
    try {
      const user = firebase.auth().currentUser;
      const userUid = user?.uid || effectiveUid;
      const userEmail = user?.email || email || null;
      const userDisplayName = user?.displayName || displayName || null;

      // Upload photos (optional)
      const uploaded = [];
      if (files.length > 0 && firebase.storage) {
        const storageRef = firebase.storage().ref();
        for (const f of files) {
          const safeName = (f.name || "photo").replace(/[^\w.\-]+/g, "_");
          const path = `hand-submissions/${userUid}/${Date.now()}-${safeName}`;
          const fileRef = storageRef.child(path);
          await fileRef.put(f);
          const downloadUrl = await fileRef.getDownloadURL();
          uploaded.push({
            name: f.name,
            contentType: f.type,
            size: f.size,
            storagePath: path,
            downloadUrl,
          });
        }
      }

      const submissionData = {
        type: "bridgeQuestion",
        uid: userUid,
        email: userEmail,
        displayName: userDisplayName,
        questionText: q || "",
        handUrl: url || "",
        photos: uploaded,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        userAgent: navigator.userAgent,
        pageUrl: window.location.href,
      };

      await firebase.firestore().collection("handSubmissions").add(submissionData);

      setSubmitted(true);
      setQuestionText("");
      setHandUrl("");
      setFiles([]);
    } catch (err) {
      console.error("AskBridgeQuestion submit error:", err);
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="AskBQPage">
      <Helmet>
        <title>Ask a Bridge Question - Bridge Champions</title>
      </Helmet>

      <div className="AskBQPage-container">
        <div className="AskBQPage-header">
          <h1>Ask a Bridge Question</h1>
          <p>
            Send Paul your question. If it’s easier, snap a photo of the hand record on your phone.
          </p>
        </div>

        {submitted ? (
          <div className="AskBQPage-success">
            <div className="AskBQPage-successIcon">✓</div>
            <h2>Sent</h2>
            <p>Thanks — your question has been sent.</p>
            <button className="AskBQPage-primaryBtn" onClick={() => setSubmitted(false)}>
              Ask another question
            </button>
          </div>
        ) : (
          <form className="AskBQPage-card" onSubmit={submit}>
            {error && <div className="AskBQPage-error">{error}</div>}

            <div className="AskBQPage-field">
              <label>Question (optional)</label>
              <textarea
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={7}
                placeholder={"What happened on this hand?\nWhat should I have done?"}
              />
            </div>

            <div className="AskBQPage-field">
              <label>Hand record URL (optional)</label>
              <input
                type="text"
                value={handUrl}
                onChange={(e) => setHandUrl(e.target.value)}
                placeholder="Paste a link (e.g. your club’s hand record)"
              />
            </div>

            <div className="AskBQPage-field">
              <label>Photo (optional)</label>
              <div className="AskBQPage-uploadRow">
                <input
                  id="ask-photo"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  multiple
                  onChange={onFilesSelected}
                  disabled={submitting}
                />
                <div className="AskBQPage-uploadHint">
                  Tip: on iPhone/Android this opens the camera so you can take a photo.
                </div>
              </div>

              {previews.length > 0 && (
                <div className="AskBQPage-previews">
                  {previews.map((p, idx) => (
                    <div key={p.url} className="AskBQPage-preview">
                      <img src={p.url} alt={`Upload preview ${idx + 1}`} />
                      <button
                        type="button"
                        className="AskBQPage-remove"
                        onClick={() => removeFile(idx)}
                        aria-label="Remove photo"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="AskBQPage-actions">
              <button className="AskBQPage-primaryBtn" type="submit" disabled={submitting}>
                {submitting ? "Sending…" : "Send"}
              </button>
              <button
                className="AskBQPage-secondaryBtn"
                type="button"
                disabled={submitting}
                onClick={() => history.push("/")}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

