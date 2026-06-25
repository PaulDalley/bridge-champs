import "./globals.css";
import "./learn-hub.css";
import Script from "next/script";
import { Inter } from "next/font/google";
import NavAuth from "../components/NavAuth";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata = {
  metadataBase: new URL("https://bridgechampions.com"),
  title: { default: "Bridge Champions", template: "%s" },
};

function Header() {
  return (
    <header className="bc-header">
      <div className="bc-header-inner">
        <a href="/" className="bc-logo" aria-label="Bridge Champions home">
          <span className="bc-suits" aria-hidden="true">
            <span className="black-suit">&spades;</span>
            <span className="red-suit">&hearts;</span>
            <span className="red-suit">&diams;</span>
            <span className="green-suit">&clubs;</span>
          </span>
          Bridge Champions
        </a>
        <nav className="bc-nav" aria-label="Primary">
          <a href="/learn" className="bc-active">Learn</a>
          <a href="/practice">Practice</a>
          <a href="/just-play">Just Play</a>
          <span className="bc-nav-auth"><NavAuth /></span>
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
    <html lang="en" className={inter.variable}>
      <body>
        <Header />
        {children}
        <Footer />
        {/* Google Analytics (GA4) — same property as the CRA app, so the
            Next-served pages (homepage + /learn/**) report pageviews too. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VC7DZTPE7E"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-VC7DZTPE7E');`}
        </Script>
      </body>
    </html>
  );
}
