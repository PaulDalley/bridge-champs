import { notFound } from 'next/navigation';
import TipWatch from '../../../components/TipWatch';
import { getTip, QUICK_TIPS } from '../../../lib/quickTips';
import '../tips.css';

export const revalidate = 3600;

export function generateStaticParams() {
  return QUICK_TIPS.map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }) {
  const tip = getTip(params.slug);
  if (!tip) return {};
  // Structural meta only (reuses Paul's title verbatim; no bridge copy authored).
  return {
    title: `${tip.title} — Reels — Bridge Champions`,
    description: `${tip.title} — a quick video tip from Bridge Champions.`,
    alternates: { canonical: `https://bridgechampions.com/tips/${tip.slug}` },
  };
}

export default function TipWatchPage({ params }) {
  const tip = getTip(params.slug);
  if (!tip) notFound();
  // VideoObject schema so search engines treat this as a video page (video rich
  // results). Structural only — name reuses Paul's title verbatim.
  const videoLd = tip.videoId
    ? {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: tip.title,
        description: `${tip.title} — a quick video tip from Bridge Champions.`,
        thumbnailUrl: [`https://i.ytimg.com/vi/${tip.videoId}/hqdefault.jpg`],
        uploadDate: tip.pub || undefined,
        embedUrl: `https://www.youtube.com/embed/${tip.videoId}`,
        publisher: { '@id': 'https://bridgechampions.com/#organization' },
        url: `https://bridgechampions.com/tips/${tip.slug}`,
      }
    : null;
  return (
    <>
      {videoLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoLd) }} />
      )}
      <TipWatch startSlug={tip.slug} />
    </>
  );
}
