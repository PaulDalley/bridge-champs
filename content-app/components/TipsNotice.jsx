// Small "beta" notice for the Quick Tips feature — new + collecting feedback.
export default function TipsNotice() {
  return (
    <div className="tips-notice">
      <span className="tips-notice-badge">New</span>
      <span className="tips-notice-text">
        Being tested — please email{' '}
        <a href="mailto:paul.dalley@hotmail.com">paul.dalley@hotmail.com</a>{' '}
        with any issues.
      </span>
    </div>
  );
}
