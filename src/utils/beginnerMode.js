export const BEGINNER_MODE_STORAGE_KEY = "beginnerMode";
export const BEGINNER_ONBOARDING_SEEN_KEY = "beginnerModeOnboardingSeen";

export const isLocalhostBuild = () => {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
};

export const getStoredBeginnerMode = () => {
  if (!isLocalhostBuild()) return false;
  try {
    return window.localStorage.getItem(BEGINNER_MODE_STORAGE_KEY) === "true";
  } catch (error) {
    return false;
  }
};

export const persistBeginnerMode = (enabled) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      BEGINNER_MODE_STORAGE_KEY,
      String(isLocalhostBuild() ? !!enabled : false)
    );
  } catch (error) {
    // ignore storage errors
  }
};

export const getPracticeRootPath = (beginnerModeEnabled) =>
  beginnerModeEnabled ? "/beginner/practice" : "/bidding/practice";

export const getArticlesRootPath = (beginnerModeEnabled) =>
  beginnerModeEnabled ? "/beginner/articles" : "/cardPlay/articles";

export const getRouteAfterToggle = (pathname = "", beginnerModeEnabled) => {
  const inArticleContext =
    pathname.startsWith("/cardPlay") ||
    pathname.startsWith("/defence") ||
    pathname.startsWith("/bidding") ||
    pathname.startsWith("/counting") ||
    pathname.startsWith("/treadmill") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/articles") ||
    pathname.startsWith("/article") ||
    pathname.startsWith("/beginner/articles");

  return inArticleContext
    ? getArticlesRootPath(beginnerModeEnabled)
    : getPracticeRootPath(beginnerModeEnabled);
};
