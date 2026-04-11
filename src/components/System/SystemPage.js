import React, { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { connect } from "react-redux";
import { SYSTEM_GROUPS, getTopicsByGroupId } from "../../data/systemPrescription";
import { TOPIC_ID_TO_PDF_FIELDS } from "../../data/systemCardAbfLayout";
import { getYouTubeEmbedUrl } from "../../utils/youtubeId";
import "./SystemPage.css";

function isExternalUrl(url) {
  return /^https?:\/\//i.test(url);
}

function DetailLink({ href, children, className = "sy-link" }) {
  if (!href) return null;
  if (isExternalUrl(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}

function SectionIntroVideo({ url, label }) {
  const [open, setOpen] = useState(false);
  const embed = getYouTubeEmbedUrl(url);
  if (!url || !embed) return null;
  return (
    <div className="sy-sectionVideo">
      <button type="button" className="sy-watchBtn sy-watchBtn--ghost" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        {open ? "Hide" : "▶"} {label || "Section intro video"}
      </button>
      {open && (
        <div className="sy-videoFrame">
          <iframe title={label || "Section video"} src={embed} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        </div>
      )}
    </div>
  );
}

/** One prescription row: notes, article link, optional per-line YouTube, or divider (or) */
function PrescriptionLineBlock({ line }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const embed = line.videoUrl ? getYouTubeEmbedUrl(line.videoUrl) : null;

  if (line.divider) {
    return (
      <div className="sy-prescriptionLine sy-prescriptionLine--divider" role="presentation">
        <p className="sy-prescriptionOr">or</p>
      </div>
    );
  }

  return (
    <div className="sy-prescriptionLine">
      <p className="sy-tilePrescription sy-tilePrescription--line">{line.text}</p>
      {line.notes != null && line.notes !== "" ? (
        <div className="sy-prescriptionNotes">
          {(Array.isArray(line.notes) ? line.notes : [line.notes]).map((note, j) => (
            <p key={j} className="sy-prescriptionNote">
              {note}
            </p>
          ))}
        </div>
      ) : null}
      {line.detailUrl ? (
        <DetailLink href={line.detailUrl} className="sy-lineLink">
          {line.linkLabel || "Read more →"}
        </DetailLink>
      ) : null}
      {embed ? (
        <div className="sy-lineVideo">
          <button
            type="button"
            className="sy-watchBtn sy-watchBtn--ghost"
            onClick={() => setVideoOpen((v) => !v)}
            aria-expanded={videoOpen}
          >
            {videoOpen ? "Hide video" : line.videoLabel || "Show video"}
          </button>
          {videoOpen && (
            <div className="sy-videoFrame sy-videoFrame--line">
              <iframe
                title={line.videoLabel || line.text}
                src={embed}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function TopicTile({ topic, uid, addToCardLink }) {
  const [expanded, setExpanded] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const hasBullets = Array.isArray(topic.extraBullets) && topic.extraBullets.length > 0;
  const hasLines = Array.isArray(topic.prescriptionLines) && topic.prescriptionLines.length > 0;
  const embed = topic.videoUrl ? getYouTubeEmbedUrl(topic.videoUrl) : null;

  const toggleExpand = useCallback(() => setExpanded((e) => !e), []);
  const toggleVideo = useCallback(() => setVideoOpen((v) => !v), []);

  return (
    <article className="sy-tile" aria-labelledby={`sy-topic-${topic.id}`}>
      <h3 className="sy-tileTitle" id={`sy-topic-${topic.id}`}>
        {topic.title}
      </h3>
      <div className="sy-tileBody">
        {hasLines ? (
          <>
            {topic.prescription != null && String(topic.prescription).trim() !== "" ? (
              <p className="sy-tilePrescription sy-tilePrescription--lead">{topic.prescription}</p>
            ) : null}
            <div className="sy-prescriptionLines">
              {topic.prescriptionLines.map((line, i) => (
                <PrescriptionLineBlock key={i} line={line} />
              ))}
            </div>
            {topic.notes != null && topic.notes !== "" ? (
              <div className="sy-prescriptionNotes sy-prescriptionNotes--afterLines">
                {(Array.isArray(topic.notes) ? topic.notes : [topic.notes]).map((note, j) => (
                  <p key={j} className="sy-prescriptionNote">
                    {note}
                  </p>
                ))}
              </div>
            ) : null}
          </>
        ) : (
          <>
            {topic.prescription != null && String(topic.prescription).trim() !== "" ? (
              <div className="sy-tileBlurb">
                <p className="sy-tilePrescription">{topic.prescription}</p>
              </div>
            ) : null}
            {topic.notes != null && topic.notes !== "" ? (
              <div className="sy-prescriptionNotes">
                {(Array.isArray(topic.notes) ? topic.notes : [topic.notes]).map((note, j) => (
                  <p key={j} className="sy-prescriptionNote">
                    {note}
                  </p>
                ))}
              </div>
            ) : null}
          </>
        )}
        <div className="sy-tileActions">
          {hasBullets && (
            <button type="button" className="sy-watchBtn" onClick={toggleExpand} aria-expanded={expanded}>
              {expanded ? "Less" : "More"}
            </button>
          )}
          {embed && (
            <button type="button" className="sy-watchBtn" onClick={toggleVideo} aria-expanded={videoOpen}>
              {videoOpen ? "Hide video" : topic.videoLabel || "Show video"}
            </button>
          )}
          {addToCardLink && uid && (
            <Link to={addToCardLink} className="sy-tileCta sy-tileCta--add">
              Add to my card
            </Link>
          )}
          {!hasLines && topic.detailUrl ? (
            <DetailLink href={topic.detailUrl} className="sy-tileCta">
              {topic.detailLinkLabel || "Read more →"}
            </DetailLink>
          ) : null}
        </div>
        {expanded && hasBullets && (
          <ul className="sy-tileBullets">
            {topic.extraBullets.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
        {videoOpen && embed && (
          <div className="sy-videoFrame sy-videoFrame--tile">
            <iframe title={topic.videoLabel || topic.title} src={embed} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
          </div>
        )}
      </div>
    </article>
  );
}

function SystemPage({ uid }) {
  return (
    <div className="sy-page">
      <Helmet>
        <title>{`Paul's System recommendation — Bridge Champions`}</title>
        <meta
          name="description"
          content="Paul's System recommendation on Bridge Champions — agreements, notes, and videos (page under construction)."
        />
      </Helmet>

      <header className="sy-hero">
        <h1 className="sy-heroTitle">{`Paul's System recommendation`}</h1>
        <p className="sy-heroTagline" role="note">
          Under construction — more soon.
        </p>
        <Link to="/system/card" className="sy-heroCta">
          My system card →
        </Link>
        <div className="sy-heroVision">
          <h2 className="sy-heroVisionLabel">Vision</h2>
          <p className="sy-heroVisionText">
            System notes you can share with partners and evolve together.
          </p>
        </div>
      </header>

      <main className="sy-main">
        {SYSTEM_GROUPS.map((group) => {
          const topics = getTopicsByGroupId(group.id);
          return (
            <section key={group.id} id={group.anchorId} className="sy-section" aria-labelledby={`sy-sec-${group.id}`}>
              <h2 className="sy-sectionTitle" id={`sy-sec-${group.id}`}>
                {group.title}
              </h2>
              <SectionIntroVideo url={group.introVideoUrl} label="Section video" />
              <div className="sy-grid">
                {topics.map((topic) => {
                  const addToCardLink = TOPIC_ID_TO_PDF_FIELDS[topic.id]
                    ? `/system/card?topic=${encodeURIComponent(topic.id)}`
                    : null;
                  return (
                    <TopicTile
                      key={topic.id}
                      topic={topic}
                      uid={uid}
                      addToCardLink={addToCardLink}
                    />
                  );
                })}
              </div>
            </section>
          );
        })}
      </main>
    </div>
  );
}

const mapStateToProps = (state) => ({
  uid: state.auth.uid,
});

export default connect(mapStateToProps)(SystemPage);
