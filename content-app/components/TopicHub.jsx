import { TRAINER_PATH } from "../lib/topicHubs";

// Render a topic intro string into paragraphs + lists (author's words; layout only).
function renderIntro(intro) {
  if (!intro || !intro.trim()) return null;
  const nodes = [];
  let para = [], bullets = [], numbers = [];
  const flushPara = () => { if (para.length) { nodes.push(<p key={`p${nodes.length}`} className="th-intro">{para.join(" ")}</p>); para = []; } };
  const flushBullets = () => { if (bullets.length) { nodes.push(<ul key={`u${nodes.length}`} className="th-introList">{bullets.map((b, i) => <li key={i}>{b}</li>)}</ul>); bullets = []; } };
  const flushNumbers = () => { if (numbers.length) { nodes.push(<ol key={`o${nodes.length}`} className="th-introList">{numbers.map((b, i) => <li key={i}>{b}</li>)}</ol>); numbers = []; } };
  intro.replace(/\r/g, "").split("\n").forEach((raw) => {
    const line = raw.trim();
    if (!line) { flushPara(); flushBullets(); flushNumbers(); return; }
    const ub = line.match(/^[*-]\s*(.*)$/);
    const ob = line.match(/^\d+[.)]\s+(.*)$/);
    if (ub) { flushPara(); flushNumbers(); bullets.push(ub[1]); }
    else if (ob) { flushPara(); flushBullets(); numbers.push(ob[1]); }
    else { flushBullets(); flushNumbers(); para.push(line); }
  });
  flushPara(); flushBullets(); flushNumbers();
  return nodes.length ? nodes : null;
}

const lastSeg = (p) => String(p || "").split("/").filter(Boolean).pop();

function PathSteps({ list, hrefFor }) {
  return (
    <ol className="th-path">
      {list.map((a, i) => {
        const last = i === list.length - 1;
        return (
          <li className="th-step" key={a.to + i}>
            <div className="th-rail">
              <span className="th-node">{i + 1}</span>
              {!last && <span className="th-railLine" />}
            </div>
            <a className="th-articleCard" href={hrefFor(a)}>
              <span className="th-articleTitle">{a.title}</span>
              {a.level ? <span className={`th-level th-level--${a.level}`}>{a.level}</span> : null}
            </a>
          </li>
        );
      })}
    </ol>
  );
}

export default function TopicHub({ cat, topic, slugToNew }) {
  const articles = topic.articles || [];
  const siblings = (cat.topics || []).filter((x) => x.slug !== topic.slug);
  const hrefFor = (a) => slugToNew[lastSeg(a.to)] || a.to; // remap to new /learn URL
  const intro = renderIntro(topic.intro);

  return (
    <div className={`th-page th-page--${cat.key}`}>
      <nav className="th-breadcrumb" aria-label="Breadcrumb">
        <a href="/learn">Learn</a>
        <span className="sep" aria-hidden="true">&rsaquo;</span>
        <a href="/learn">{cat.label}</a>
        <span className="sep" aria-hidden="true">&rsaquo;</span>
        <span>{topic.name}</span>
      </nav>

      <div className="th-headRow">
        <div>
          <h1 className="th-title">{topic.name}</h1>
          <div className="th-titleSuits">
            <span className="th-suits" aria-hidden="true">
              <span className="s">&spades;</span><span className="h">&hearts;</span><span className="d">&diams;</span><span className="c">&clubs;</span>
            </span>
          </div>
        </div>
      </div>

      {intro ? <div className="th-introBox">{intro}</div> : null}

      {articles.length > 0 && (
        <a className="th-cta" href={topic.trainerHref || TRAINER_PATH[cat.key] || "/"}>
          <div>
            <div className="th-ctaText">Practise {topic.name.toLowerCase()} in the trainer</div>
            <div className="th-ctaSub">Interactive practice hands</div>
          </div>
          <span className="th-ctaArrow" aria-hidden="true">&rarr;</span>
        </a>
      )}
      {articles.length > 0 && topic.treadmillHref && (
        <a className="th-cta th-cta--treadmill" href={topic.treadmillHref}>
          <div>
            <div className="th-ctaText">Practise {topic.name.toLowerCase()} on the treadmill</div>
            <div className="th-ctaSub">Treadmill trainer</div>
          </div>
          <span className="th-ctaArrow" aria-hidden="true">&rarr;</span>
        </a>
      )}

      {articles.length > 0 ? (
        topic.groups ? (
          topic.groups.map((g, gi) => (
            <div className="th-group" key={g.heading + gi}>
              <h2 className="th-sectionLabel">{g.heading}</h2>
              <PathSteps list={g.articles || []} hrefFor={hrefFor} />
            </div>
          ))
        ) : (
          <>
            <h2 className="th-sectionLabel">Work through it</h2>
            <PathSteps list={articles} hrefFor={hrefFor} />
          </>
        )
      ) : (
        <p className="th-empty">Articles coming soon.</p>
      )}

      {siblings.length > 0 && (
        <div className="th-siblings">
          <div className="th-siblingsLabel">More {cat.label.toLowerCase()} topics</div>
          <div className="th-chips">
            {siblings.map((s) => (
              <a key={s.slug} className="th-chip" href={`/learn/${cat.key}/${s.slug}`}>
                {s.name} &rarr;
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
