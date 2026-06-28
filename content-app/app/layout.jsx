import "./globals.css";
import "./learn-hub.css";
import Script from "next/script";
import { Inter } from "next/font/google";
import NavAuth from "../components/NavAuth";
import { CATEGORIES } from "../lib/topicHubs";

const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

const OG_IMAGE = "https://firebasestorage.googleapis.com/v0/b/bridgechampions.appspot.com/o/logo.png?alt=media&token=583808ab-2c3b-49a6-8936-82dffe55ec95";
const SITE_LD = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": "https://bridgechampions.com/#organization", name: "Bridge Champions", url: "https://bridgechampions.com", logo: { "@type": "ImageObject", url: OG_IMAGE }, sameAs: ["https://www.youtube.com/@BridgeChampions"] },
    { "@type": "WebSite", "@id": "https://bridgechampions.com/#website", name: "Bridge Champions", url: "https://bridgechampions.com", publisher: { "@id": "https://bridgechampions.com/#organization" } },
  ],
};

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
  const cats = CATEGORIES.filter((c) => Array.isArray(c.topics) && c.topics.length > 0);
  return (
    <footer className="bc-footer">
      <div className="bc-footer-inner">
        <nav className="bc-footer-hubs" aria-label="Browse topics">
          {cats.map((c) => (
            <div className="bc-footer-col" key={c.key}>
              <a className="bc-footer-head" href={`/learn/${c.key}`}>{c.label}</a>
              <ul>
                {c.topics.map((t) => (
                  <li key={t.slug}>
                    <a href={`/learn/${c.key}/${t.slug}`}>{t.name}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
        <div className="bc-footer-meta">
          <span>© 2018–2026 Bridge Champions</span>
          <span>
            <a href="/learn">Learn</a> · <a href="/about">About</a> · <a href="/all-articles">All lessons</a>
          </span>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SITE_LD) }} />
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
