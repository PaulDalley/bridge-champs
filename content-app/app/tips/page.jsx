import TipsBrowser from '../../components/TipsBrowser';
import TipsNotice from '../../components/TipsNotice';
import { QUICK_TIPS } from '../../lib/quickTips';
import './tips.css';

export const metadata = {
  title: 'Reels — Bridge Champions',
  description: 'Quick video tips from Bridge Champions.',
  alternates: { canonical: 'https://bridgechampions.com/tips' },
};

export default function TipsIndexPage({ searchParams }) {
  const initial = typeof searchParams?.category === 'string' ? searchParams.category : 'All';
  // ItemList schema: tells crawlers this page is the canonical list of all reels.
  const listLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Reels — quick video tips',
    numberOfItems: QUICK_TIPS.length,
    itemListElement: QUICK_TIPS.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.title,
      url: `https://bridgechampions.com/tips/${t.slug}`,
    })),
  };
  return (
    <div className="tw-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(listLd) }} />
      <div className="tw-head">
        <div className="tw-crumb">
          <a href="/">Home</a> <span aria-hidden="true">/</span> <span>Reels</span>
        </div>
      </div>
      <h1 className="tw-list-h">Reels</h1>
      <p className="tw-list-sub">Quick video tips.</p>
      <TipsNotice />
      <TipsBrowser initialCategory={initial} />
    </div>
  );
}
