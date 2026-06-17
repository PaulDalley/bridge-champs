import React from "react";
import { Helmet } from "react-helmet-async";
import PlayTable from "../PlayTable/PlayTable";

/**
 * "Just Play" — its own top-level page (promoted out of Practical Learning).
 * A clean wrapper around the BEN-powered play table; the site header provides nav.
 */
function PracticalJustPlayPage() {
  return (
    <div className="pt-justPlayPage">
      <Helmet>
        <title>Just Play — Bridge Champions</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <PlayTable embedded />
    </div>
  );
}

export default PracticalJustPlayPage;
