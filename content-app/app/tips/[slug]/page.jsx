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
    title: `${tip.title} — Quick tips — Bridge Champions`,
    description: `${tip.title} — a 30-second video tip from Bridge Champions.`,
    alternates: { canonical: `https://bridgechampions.com/tips/${tip.slug}` },
  };
}

export default function TipWatchPage({ params }) {
  const tip = getTip(params.slug);
  if (!tip) notFound();
  return <TipWatch startSlug={tip.slug} />;
}
