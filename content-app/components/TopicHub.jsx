// Renders a topic hub (e.g. /learn/bidding/conventions): the user's topic intro
// (verbatim) + curated article links remapped to their new /learn/<cat>/<slug> URLs.
// Topic data + intros are the user's content (lib/topicHubs.js, copied verbatim).

function formatIntro(intro) {
  const blocks = String(intro || "").trim().split(/\n\s*\n/);
  return blocks.map((blk, i) => {
    const lines = blk.split(/\n/).map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return null;
    if (lines.every((l) => l.startsWith("* "))) {
      return (
        <ul key={i}>
          {lines.map((l, j) => (
            <li key={j}>{l.slice(2)}</li>
          ))}
        </ul>
      );
    }
    if (lines.every((l) => /^\d+\.\s/.test(l))) {
      return (
        <ol key={i}>
          {lines.map((l, j) => (
            <li key={j}>{l.replace(/^\d+\.\s/, "")}</li>
          ))}
        </ol>
      );
    }
    return <p key={i}>{blk.replace(/\n/g, " ")}</p>;
  });
}

export default function TopicHub({ topic, slugToNew }) {
  const hrefFor = (a) => {
    const slug = String(a.to || "").split("/").filter(Boolean).pop();
    return slugToNew[slug] || a.to; // new URL when the article is live; else its old URL
  };
  const List = ({ articles }) => (
    <ul className="bc-cat-list">
      {(articles || []).map((a, i) => (
        <li key={i}>
          <a href={hrefFor(a)}>{a.title}</a>
          {a.level ? <span className="bc-level"> · {a.level}</span> : null}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <h1 className="bc-hub-title">{topic.name}</h1>
      {topic.intro ? (
        <div className="bc-prose bc-topic-intro">{formatIntro(topic.intro)}</div>
      ) : null}
      {Array.isArray(topic.groups) ? (
        topic.groups.map((g, i) => (
          <section key={i} className="bc-topic-group">
            <h2>{g.heading}</h2>
            <List articles={g.articles} />
          </section>
        ))
      ) : (
        <List articles={topic.articles} />
      )}
    </>
  );
}
