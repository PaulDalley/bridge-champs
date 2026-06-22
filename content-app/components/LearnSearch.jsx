"use client";
import { useMemo, useState } from "react";

// Client-side article search for the Learn landing. `index` is a prebuilt list
// of { title, href, catLabel, topicName } (hrefs already mapped to new URLs).
export default function LearnSearch({ index }) {
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return [];
    return index.filter((a) => a.title.toLowerCase().includes(s)).slice(0, 12);
  }, [q, index]);

  return (
    <div className="lh-search">
      <div className="lh-searchBox">
        <span className="lh-searchIcon" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
        <input
          className="lh-searchInput"
          type="search"
          placeholder="Search articles…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search articles"
        />
      </div>
      {q.trim() && (
        <ul className="lh-searchResults">
          {results.length ? (
            results.map((a) => (
              <li key={a.href}>
                <a href={a.href}>
                  <span>{a.title}</span>
                  <span className="lh-srTopic">
                    {a.catLabel} &middot; {a.topicName}
                  </span>
                </a>
              </li>
            ))
          ) : (
            <li className="lh-searchEmpty">No matches.</li>
          )}
        </ul>
      )}
    </div>
  );
}
