import TipsBrowser from '../../components/TipsBrowser';
import './tips.css';

export const metadata = {
  title: 'Quick tips — Bridge Champions',
  description: '30-second video tips from Bridge Champions.',
  alternates: { canonical: 'https://bridgechampions.com/tips' },
};

export default function TipsIndexPage({ searchParams }) {
  const initial = typeof searchParams?.category === 'string' ? searchParams.category : 'All';
  return (
    <div className="tw-page">
      <div className="tw-head">
        <div className="tw-crumb">
          <a href="/">Home</a> <span aria-hidden="true">/</span> <span>Quick tips</span>
        </div>
      </div>
      <h1 className="tw-list-h">Quick tips</h1>
      <p className="tw-list-sub">30-second video tips.</p>
      <TipsBrowser initialCategory={initial} />
    </div>
  );
}
