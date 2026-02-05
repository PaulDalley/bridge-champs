import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSelector } from "react-redux";
import { firebase } from "../../firebase/config";
import "./HandSubmissionsAdmin.css";

const formatDateTime = (ts) => {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString();
};

export default function HandSubmissionsAdmin(props) {
  const { history } = props;
  const isAdmin = useSelector((state) => state.auth.a === true);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    setError("");

    const unsub = firebase
      .firestore()
      .collection("handSubmissions")
      .orderBy("createdAt", "desc")
      .limit(50)
      .onSnapshot(
        (snap) => {
          const next = [];
          snap.forEach((doc) => next.push({ id: doc.id, ...doc.data() }));
          setItems(next);
          setLoading(false);
        },
        (err) => {
          console.error("HandSubmissionsAdmin snapshot error:", err);
          setError(err?.message || "Failed to load submissions.");
          setLoading(false);
        }
      );

    return () => unsub();
  }, [isAdmin]);

  const counts = useMemo(() => {
    const total = items.length;
    const withPhoto = items.filter((i) => (i.photos || []).length > 0 || i.fileUrl).length;
    return { total, withPhoto };
  }, [items]);

  useEffect(() => {
    if (!isAdmin) history.push("/");
  }, [isAdmin, history]);
  if (!isAdmin) return null;

  return (
    <div className="HSAdmin">
      <Helmet>
        <title>Question Inbox - Bridge Champions</title>
      </Helmet>

      <div className="HSAdmin-container">
        <div className="HSAdmin-header">
          <h1>Question Inbox</h1>
          <p>
            Latest submissions: <strong>{counts.total}</strong> (with photo:{" "}
            <strong>{counts.withPhoto}</strong>)
          </p>
          <div className="HSAdmin-actions">
            <button className="HSAdmin-btn" onClick={() => history.push("/settings")}>
              Back to Settings
            </button>
          </div>
        </div>

        {error && <div className="HSAdmin-error">{error}</div>}
        {loading && <div className="HSAdmin-loading">Loading…</div>}

        {!loading && !error && items.length === 0 && (
          <div className="HSAdmin-empty">No submissions yet.</div>
        )}

        <div className="HSAdmin-list">
          {items.map((it) => {
            const photos = it.photos || [];
            const firstPhotoUrl =
              photos[0]?.downloadUrl || it.fileUrl || null;
            const question = it.questionText || it.handText || "";
            const url = it.handUrl || "";
            return (
              <div key={it.id} className="HSAdmin-item">
                {firstPhotoUrl ? (
                  <a className="HSAdmin-thumb" href={firstPhotoUrl} target="_blank" rel="noreferrer">
                    <img src={firstPhotoUrl} alt="submission attachment" />
                  </a>
                ) : (
                  <div className="HSAdmin-thumb HSAdmin-thumb--empty">No photo</div>
                )}

                <div className="HSAdmin-body">
                  <div className="HSAdmin-meta">
                    <span className="HSAdmin-metaItem">
                      <strong>When:</strong> {formatDateTime(it.createdAt)}
                    </span>
                    {it.email && (
                      <span className="HSAdmin-metaItem">
                        <strong>User:</strong> {it.email}
                      </span>
                    )}
                    {it.uid && (
                      <span className="HSAdmin-metaItem HSAdmin-mono">
                        <strong>uid:</strong> {it.uid}
                      </span>
                    )}
                  </div>

                  {question && <div className="HSAdmin-text">{question}</div>}

                  {url && (
                    <div className="HSAdmin-url">
                      <strong>Hand URL:</strong>{" "}
                      <a href={url} target="_blank" rel="noreferrer">
                        {url}
                      </a>
                    </div>
                  )}

                  {(it.pageUrl || it.url) && (
                    <div className="HSAdmin-context">
                      <strong>Page:</strong>{" "}
                      <a href={it.pageUrl || it.url} target="_blank" rel="noreferrer">
                        {it.pageUrl || it.url}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

