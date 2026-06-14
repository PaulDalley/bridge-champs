import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getArticles } from "../../store/actions/categoryArticlesActions";

// Tokens that don't help distinguish topics within the same subcategory.
const STOP_TOKENS = new Set([
  "the","a","an","and","or","but","of","to","in","on","at","for","with","by",
  "is","are","was","were","be","been","being","this","that","these","those",
  "as","it","its","from","into","over","under","after","before","when","then",
  "you","your","we","our","i","me","my","they","their","them","he","she","his",
  "her","do","does","did","not","no","so","if","than","also","just","very","up",
  "down","out","about","one","two","three","four","five","six","seven","eight",
  "nine","ten","new","how","why","what","which","who","where","yes","let",
  "lets","using","use","used","there","here",
  "have","has","had","get","got","make","makes","made","take","takes","took",
  "find","finds","found","show","shows","showed","need","want","wanted",
  "more","most","less","least","much","many","some","any","all","each","every",
  "card","cards","hand","hands","play","plays","played","trick","tricks",
  "suit","suits","bridge","article","articles","learn","guide",
  "beginner","beginners","declarer","defence","bidding","counting","advanced",
  "basics","basic","rules","tips","start","starting","first","early","late",
  "good","better","best","right","wrong","plan","build","keep","control",
]);

function tokenise(title) {
  if (!title) return [];
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9\s\-]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOP_TOKENS.has(t));
}

function getListPathForArticleType(type) {
  if (type === "biddingBasics") return "/bidding/basics";
  if (type === "bidding" || type === "biddingAdvanced") return "/bidding/advanced";
  if (type === "cardPlay") return "/declarer/articles";
  if (type === "beginnerCardPlay") return "/beginner/articles/declarer";
  if (type === "beginnerDefence") return "/beginner/articles/defence";
  if (type === "beginnerBidding") return "/beginner/articles/bidding";
  if (type === "defence") return "/defence/articles";
  if (type === "counting") return "/counting/articles";
  return "/";
}

function getPracticePathForArticleType(type) {
  if (type === "bidding" || type === "biddingAdvanced" || type === "biddingBasics") return "/bidding/practice";
  if (type === "cardPlay" || type === "cardPlayBasics") return "/declarer/practice";
  if (type === "defence" || type === "defenceBasics") return "/defence/practice";
  if (type === "counting") return "/counting/practice";
  if (
    type === "beginnerCardPlay" ||
    type === "beginnerDefence" ||
    type === "beginnerBidding"
  ) {
    return "/beginner/practice";
  }
  return "/";
}

function getCategoryLabelForArticleType(type) {
  if (type === "biddingBasics") return "more bidding basics";
  if (type === "bidding" || type === "biddingAdvanced") return "more bidding";
  if (type === "cardPlay") return "more declarer play";
  if (type === "defence") return "more defence";
  if (type === "counting") return "more counting";
  if (type === "beginnerCardPlay") return "more beginner declarer";
  if (type === "beginnerDefence") return "more beginner defence";
  if (type === "beginnerBidding") return "more beginner bidding";
  return "more articles";
}

function getPracticeLabelForArticleType(type) {
  if (type === "bidding" || type === "biddingAdvanced" || type === "biddingBasics")
    return "Practice the bidding trainer";
  if (type === "cardPlay" || type === "cardPlayBasics")
    return "Practice the declarer trainer";
  if (type === "defence" || type === "defenceBasics")
    return "Practice the defence trainer";
  if (type === "counting") return "Practice the counting trainer";
  if (
    type === "beginnerCardPlay" ||
    type === "beginnerDefence" ||
    type === "beginnerBidding"
  )
    return "Practice the beginner trainer";
  return "Open the trainer";
}

function toDifficultyNumber(value) {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function pickRelatedArticles({
  allArticles,
  currentBodyId,
  currentSummaryId,
  currentTitle,
  currentDifficulty,
  limit,
}) {
  if (!Array.isArray(allArticles) || allArticles.length === 0) return [];
  const currentTokens = new Set(tokenise(currentTitle));
  const currentDiff = toDifficultyNumber(currentDifficulty);

  const scored = allArticles
    .filter((a) => {
      if (!a || typeof a !== "object") return false;
      if (a.isHidden === true) return false;
      // Post-merge redirect stubs must not be suggested as related reading.
      if (typeof a.redirectTo === "string" && a.redirectTo.startsWith("/")) {
        return false;
      }
      const bodyId = a.body || a.id;
      if (!bodyId) return false;
      if (bodyId === currentBodyId) return false;
      if (a.id === currentSummaryId) return false;
      const title = String(a.title || "").trim();
      if (!title) return false;
      return true;
    })
    .map((a) => {
      const tokens = tokenise(a.title);
      let overlap = 0;
      for (const t of tokens) if (currentTokens.has(t)) overlap++;
      const diff = toDifficultyNumber(a.difficulty);
      const diffDistance =
        currentDiff !== null && diff !== null
          ? Math.abs(currentDiff - diff)
          : Number.MAX_SAFE_INTEGER;
      return { article: a, score: overlap, tokenCount: tokens.length, diffDistance };
    });

  scored.sort((x, y) => {
    if (y.score !== x.score) return y.score - x.score;
    // No topic overlap: prefer articles at a similar difficulty so beginners
    // get beginner-friendly neighbours, advanced get advanced, etc.
    if (x.diffDistance !== y.diffDistance) return x.diffDistance - y.diffDistance;
    if (y.tokenCount !== x.tokenCount) return y.tokenCount - x.tokenCount;
    return String(x.article.title || "").localeCompare(String(y.article.title || ""));
  });

  return scored.slice(0, limit).map((s) => s.article);
}

const RelatedArticles = ({
  articleType,
  currentArticleId,
  currentBodyId,
  currentTitle,
  currentDifficulty,
  limit = 4,
}) => {
  const dispatch = useDispatch();
  const allArticles = useSelector((state) => state.categoryArticles?.[articleType]);
  const hasArticles = Array.isArray(allArticles) && allArticles.length > 0;

  useEffect(() => {
    if (!articleType) return;
    if (hasArticles) return;
    dispatch(getArticles(articleType));
  }, [articleType, hasArticles, dispatch]);

  const listPath = getListPathForArticleType(articleType);
  const practicePath = getPracticePathForArticleType(articleType);
  const categoryLabel = getCategoryLabelForArticleType(articleType);
  const practiceLabel = getPracticeLabelForArticleType(articleType);

  const related = useMemo(
    () =>
      pickRelatedArticles({
        allArticles: hasArticles ? allArticles : [],
        currentBodyId,
        currentSummaryId: currentArticleId,
        currentTitle,
        currentDifficulty,
        limit,
      }),
    [
      allArticles,
      hasArticles,
      currentBodyId,
      currentArticleId,
      currentTitle,
      currentDifficulty,
      limit,
    ]
  );

  if (!hasArticles) return null;
  if (related.length === 0) return null;

  return (
    <aside
      className="DisplayArticle-related"
      aria-label="Related articles and practice"
    >
      <h2 className="DisplayArticle-relatedHeading">Read next</h2>
      <ul className="DisplayArticle-relatedList">
        {related.map((a) => {
          const bodyId = a.body || a.id;
          // Prefer the readable slug; old body-id links still resolve.
          const href = `${listPath}/${a.slug || bodyId}`;
          const title = a.title || "Untitled article";
          const teaser = a.teaser ? String(a.teaser).trim() : "";
          return (
            <li key={bodyId} className="DisplayArticle-relatedItem">
              <a className="DisplayArticle-relatedLink" href={href}>
                <span className="DisplayArticle-relatedLinkTitle">{title}</span>
                {teaser && (
                  <span className="DisplayArticle-relatedLinkTeaser">
                    {teaser.length > 160 ? `${teaser.slice(0, 157)}…` : teaser}
                  </span>
                )}
              </a>
            </li>
          );
        })}
      </ul>
      <div className="DisplayArticle-relatedFooter">
        <a
          className="DisplayArticle-relatedSecondary"
          href={String(articleType).startsWith("beginner") ? listPath : "/learn"}
        >
          See all {categoryLabel} →
        </a>
        <a
          className="DisplayArticle-relatedSecondary"
          href={practicePath}
        >
          {practiceLabel} →
        </a>
      </div>
    </aside>
  );
};

export default RelatedArticles;
