import MakeBoard from "../components/MakeBoard";

// Render a stored article body (HTML + custom tags) into server-rendered React
// nodes. Mirrors the CRA's parseDocumentIntoJSX, but pure/SSR (no client deps):
//  - prose HTML  -> dangerouslySetInnerHTML (real text in the page = indexable)
//  - <MakeBoard/> -> the static board component
//  - <Callout type=…>…</Callout> -> styled block
//  - <Video>/YouTube URL -> responsive iframe

function youtubeId(url) {
  const m = String(url).match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? m[1] : null;
}

function videoEmbed(url) {
  const id = youtubeId(url);
  if (!id) return "";
  return (
    `<div class="bc-video"><iframe src="https://www.youtube.com/embed/${id}" ` +
    `title="Video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" ` +
    `allowfullscreen loading="lazy"></iframe></div>`
  );
}

// Wrap bare suit glyphs so hearts/diamonds render red. Harmless if a glyph is
// already wrapped (nested span, same colour).
function colorSuits(html) {
  return String(html)
    .replace(/([♥♦])/g, '<span class="red-suit">$1</span>')
    .replace(/([♠♣])/g, '<span class="black-suit">$1</span>');
}

function parseAttrs(tag) {
  const data = {};
  const re = /(\w+)="([^"]*)"/g;
  let m;
  while ((m = re.exec(tag)) !== null) data[m[1]] = m[2];
  return data;
}

export function renderBody(rawHtml) {
  if (!rawHtml) return [];
  let s = String(rawHtml)
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");

  // Unwrap MakeBoard tags that the editor wrapped in a block element.
  s = s.replace(/<[^>]*>(<MakeBoard[^>]*\/>)<\/[^>]*>/g, "$1");

  // Callouts -> styled blocks.
  s = s.replace(
    /<Callout\s+type=["'](rule|example|mistake|checklist|expert)["']\s*>([\s\S]*?)<\/Callout>/gi,
    (_, type, inner) =>
      `<div class="bc-callout bc-callout-${type.toLowerCase()}">` +
      `<span class="bc-callout-badge">${type}</span>${inner}</div>`
  );

  // Videos: explicit <Video> tags, then bare YouTube URLs.
  s = s.replace(/<Video\s+url=["']([^"']+)["']\s*\/>|<Video>([^<]+)<\/Video>/gi, (_, a, b) => videoEmbed(a || b));
  s = s.replace(
    /(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}[^\s<>"']*)/gi,
    (u) => videoEmbed(u)
  );

  const segments = s.split(/(<MakeBoard[^>]*\/>)/);
  const nodes = [];
  segments.forEach((seg, i) => {
    if (!seg) return;
    if (/^<MakeBoard/i.test(seg)) {
      nodes.push(<MakeBoard key={i} {...parseAttrs(seg)} />);
    } else if (seg.trim()) {
      nodes.push(
        <div key={i} className="bc-prose" dangerouslySetInnerHTML={{ __html: colorSuits(seg) }} />
      );
    }
  });
  return nodes;
}
