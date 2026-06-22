import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://bridgechampions.com"),
  title: { default: "Bridge Champions", template: "%s" },
};

function Header() {
  return (
    <header className="bc-header">
      <div className="bc-header-inner">
        <a href="/" className="bc-logo" aria-label="Bridge Champions home">
          Bridge Champions
        </a>
        <nav className="bc-nav" aria-label="Primary">
          <a href="/learn">Learn</a>
          <a href="/practice">Practice</a>
          <a href="/just-play">Just Play</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bc-footer">
      <div className="bc-footer-inner">
        <span>© 2018–2026 Bridge Champions</span>
        <span>
          <a href="/about">About</a> · <a href="/all-articles">All lessons</a>
        </span>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
