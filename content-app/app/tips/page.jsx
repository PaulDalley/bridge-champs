import TipsBrowser from '../../components/TipsBrowser';
import TipsNotice from '../../components/TipsNotice';
import './tips.css';

export const metadata = {
  title: 'Reels — Bridge Champions',
  description: 'Quick video tips from Bridge Champions.',
  alternates: { canonical: 'https://bridgechampions.com/tips' },
};

export default function TipsIndexPage({ searchParams }) {
  const initial = typeof searchParams?.category === 'string' ? searchParams.category : 'All';
  return (
    <div className="tw-page">
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
