import * as actions from "./actionTypes";
import database, {
  countsRef,
  firebase,
  articlesRef,
  articleRef,
  biddingSummaryRef,
  biddingBodyRef,
  biddingBasicsSummaryRef,
  biddingBasicsBodyRef,
  biddingAdvancedSummaryRef,
  biddingAdvancedBodyRef,
  cardPlaySummaryRef,
  cardPlayBodyRef,
  defenceSummaryRef,
  defenceBodyRef,
  cardPlayBodyBackupsRef,
  defenceBodyBackupsRef,
  biddingBodyBackupsRef,
  biddingBasicsBodyBackupsRef,
  biddingAdvancedBodyBackupsRef,
  cardPlayBasicsSummaryRef,
  cardPlayBasicsBodyRef,
  cardPlayBasicsBodyBackupsRef,
  defenceBasicsSummaryRef,
  defenceBasicsBodyRef,
  defenceBasicsBodyBackupsRef,
  countingSummaryRef,
  countingBodyRef,
  countingBodyBackupsRef,
  beginnerCardPlaySummaryRef,
  beginnerCardPlayBodyRef,
  beginnerDefenceSummaryRef,
  beginnerDefenceBodyRef,
  beginnerBiddingSummaryRef,
  beginnerBiddingBodyRef,
} from "../../firebase/config";
/*const articlesRef = database.ref('articles');
 const articleRef = database.ref('article');*/

const matchTypeToRef = {
  bidding: biddingSummaryRef,
  biddingBody: biddingBodyRef,
  biddingBasics: biddingBasicsSummaryRef,
  biddingBasicsBody: biddingBasicsBodyRef,
  biddingAdvanced: biddingAdvancedSummaryRef,
  biddingAdvancedBody: biddingAdvancedBodyRef,
  cardPlay: cardPlaySummaryRef,
  cardPlayBody: cardPlayBodyRef,
  cardPlayBasics: cardPlayBasicsSummaryRef,
  cardPlayBasicsBody: cardPlayBasicsBodyRef,
  defence: defenceSummaryRef,
  defenceBody: defenceBodyRef,
  defenceBasics: defenceBasicsSummaryRef,
  defenceBasicsBody: defenceBasicsBodyRef,
  counting: countingSummaryRef,
  countingBody: countingBodyRef,
  beginnerCardPlay: beginnerCardPlaySummaryRef,
  beginnerCardPlayBody: beginnerCardPlayBodyRef,
  beginnerDefence: beginnerDefenceSummaryRef,
  beginnerDefenceBody: beginnerDefenceBodyRef,
  beginnerBidding: beginnerBiddingSummaryRef,
  beginnerBiddingBody: beginnerBiddingBodyRef,
};

const matchBodyRefToBackupRef = {
  biddingBody: biddingBodyBackupsRef,
  biddingBasicsBody: biddingBasicsBodyBackupsRef,
  biddingAdvancedBody: biddingAdvancedBodyBackupsRef,
  cardPlayBody: cardPlayBodyBackupsRef,
  cardPlayBasicsBody: cardPlayBasicsBodyBackupsRef,
  defenceBody: defenceBodyBackupsRef,
  defenceBasicsBody: defenceBasicsBodyBackupsRef,
  countingBody: countingBodyBackupsRef,
};

const matchBodyRefToSummaryRef = {
  biddingBody: biddingSummaryRef,
  biddingBasicsBody: biddingBasicsSummaryRef,
  biddingAdvancedBody: biddingAdvancedSummaryRef,
  cardPlayBody: cardPlaySummaryRef,
  cardPlayBasicsBody: cardPlayBasicsSummaryRef,
  defenceBody: defenceSummaryRef,
  defenceBasicsBody: defenceBasicsSummaryRef,
  countingBody: countingSummaryRef,
  beginnerCardPlayBody: beginnerCardPlaySummaryRef,
  beginnerDefenceBody: beginnerDefenceSummaryRef,
  beginnerBiddingBody: beginnerBiddingSummaryRef,
};

const getRouteTypeFromBodyRef = (bodyRef) =>
  typeof bodyRef === "string" && bodyRef.endsWith("Body")
    ? bodyRef.replace("Body", "")
    : "article";

/** Summary may store body in another collection (shared Learn + Beginner article). */
export const resolveBodyRefForSummary = (summary, routeBodyRef) => {
  const key = summary?.bodyCollection;
  if (typeof key === "string" && key.trim() && matchTypeToRef[key.trim()]) {
    return key.trim();
  }
  return routeBodyRef;
};

const getArticlePathFromBodyRef = (bodyRef, bodyId) => {
  const routeType = getRouteTypeFromBodyRef(bodyRef);
  if (routeType === "counting") return `/counting/articles/${bodyId}`;
  if (routeType === "cardPlay") return `/declarer/articles/${bodyId}`;
  if (routeType === "beginnerCardPlay") return `/beginner/articles/declarer/${bodyId}`;
  if (routeType === "beginnerDefence") return `/beginner/articles/defence/${bodyId}`;
  if (routeType === "beginnerBidding") return `/beginner/articles/bidding/${bodyId}`;
  if (routeType === "defence") return `/defence/articles/${bodyId}`;
  if (routeType === "biddingBasics") return `/bidding/basics/${bodyId}`;
  if (routeType === "biddingAdvanced") return `/bidding/advanced/${bodyId}`;
  if (routeType === "cardPlayBasics") return `/declarer/basics/${bodyId}`;
  if (routeType === "defenceBasics") return `/defence/basics/${bodyId}`;
  if (routeType === "bidding") return `/bidding/advanced/${bodyId}`;
  return `/${routeType}/${bodyId}`;
};

export const setCurrentArticle = (article) => ({
  type: actions.SET_CURRENT_CATEGORY_ARTICLE,
  currentArticle: article,
});

export const getArticleMetadata = (id, summaryRef = "articles") => {
  const useSummaryRef = matchTypeToRef[summaryRef];
  return (dispatch) => {
    const handle = (snapshot) => {
      if (snapshot && snapshot.docs[0]) {
        dispatch(setCurrentArticle(snapshot.docs[0].data()));
        return true;
      }
      return false;
    };
    // `id` may be a slug (new canonical URL) or a body doc id (legacy URL).
    useSummaryRef
      .where("slug", "==", id)
      .limit(1)
      .get()
      .then((bySlug) => {
        if (handle(bySlug)) return;
        useSummaryRef
          .where("body", "==", id)
          .limit(1)
          .get()
          .then(handle)
          .catch(() => {});
      })
      .catch(() => {
        useSummaryRef
          .where("body", "==", id)
          .limit(1)
          .get()
          .then(handle)
          .catch(() => {});
      });
  };
};

export const getArticleCount = () => {
  return (dispatch) => {
    countsRef.get().then((snapshot) => {
      let counts = snapshot.data();
      // console.log(counts);
      dispatch(setCounts(counts));
    });
  };
};

export const setCounts = ({ articlesCount, quizCount }) => ({
  type: actions.SET_CATEGORY_COUNTS,
  articlesCount,
  quizCount,
});

export const articleError = (error) => ({
  type: actions.CATEGORY_ARTICLE_ERROR,
  error,
});

// export const addCategory = (category) => {
//     return (dispatch) => {
//         categoriesRef.set({ category })
//     };
// };

// export const getCategories = () => {
//   return (dispatch) => {
//         categoriesRef.get()
//           .then(snapshot => {
//             if (snapshot && snapshot.exists) {
//                 const data = snapshot.data();
//                 dispatch(setCategories(data));
//             }
//           })
//           .catch(err => console.log(error));
//   };
// };

// CREATE: ADD a new article:
export const startAddArticle = (article, articleBody, summaryRef, bodyRef) => {
  return (dispatch) => {
    const useSummaryRef = matchTypeToRef[summaryRef];
    const useBodyRef = matchTypeToRef[bodyRef];
    const batch = database.batch();
    const newArticleRef = useBodyRef.doc();
    const newArticlesRef = useSummaryRef.doc();
    // console.log("I AM SUBMITTING A NEW ARTICLE TO FIRESTORE:");
    // console.log(newArticleRef);
    // console.log(newArticleRef.id);
    // console.log(newArticlesRef);
    // console.log(newArticlesRef.id);
    batch.set(newArticlesRef, {
      ...article,
      body: newArticleRef.id,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    batch.set(newArticleRef, {
      body: articleBody,
    });
    batch
      .commit()
      .then(() => {
        article["createdAt"] = new Date();
        article["id"] = newArticlesRef.id;
        article["body"] = newArticleRef.id;
        // dispatch(addArticle(article, articleBody, newArticleRef.id, summaryRef, bodyRef));
      })
      .catch((err) => dispatch(articleError(err)));
  };
};

export const addArticle = (article, articleBody, id, summaryRef, bodyRef) => ({
  type: actions.CATEGORY_ADD_ARTICLE,
  article,
  articleBody,
  articleId: id,
  summaryRef,
  bodyRef,
});

// READ: DOWNLOAD the list of articles of /articles:
// - 1. fetch all articles data once
// - 2. parse data into an array
// - 3. dispatch setArticles with the returned & shaped data.
// - pagination limited fetching ??

export const getArticle = (id, router, bodyRef) => {
  return (dispatch) => {
    const routeBodyRef = bodyRef;
    const routeUseBodyRef = matchTypeToRef[bodyRef];
    const routeUseSummaryRef = matchBodyRefToSummaryRef[bodyRef];

    // Store the body keyed by the current route param (`id`). This is what the
    // page reads (`article[articleId]`). For legacy body-ID URLs `id` equals
    // the body doc id; for slug URLs `id` is the slug — either way the page
    // finds its content.
    const dispatchBodySnapshot = (snapshot) => {
      const article = snapshot.data();
      if (article === undefined) return false;
      dispatch(setArticle(article, id));
      return true;
    };

    const fetchBodyDoc = (collectionKey, bodyId) => {
      const ref = matchTypeToRef[collectionKey];
      if (!ref || !bodyId) return Promise.resolve(false);
      return ref.doc(bodyId).get().then((bodySnapshot) => {
        if (!bodySnapshot.exists) return false;
        return dispatchBodySnapshot(bodySnapshot);
      });
    };

    const replaceToPath = (nextPath) => {
      if (!nextPath) return;
      if (router?.replace) router.replace(nextPath);
      else if (router?.push) router.push(nextPath);
    };

    // NEW canonical path: `:id` is a human-readable slug. Look the summary up by
    // slug, then load its body. We're already on the canonical URL, so no
    // redirect is needed. Never rejects — falls through to legacy resolution.
    const resolveSlugToBody = () => {
      if (!routeUseSummaryRef) return Promise.resolve(false);
      return routeUseSummaryRef
        .where("slug", "==", id)
        .limit(1)
        .get()
        .then((snap) => {
          if (snap.empty) return false;
          const summary = snap.docs[0].data() || {};
          const bodyId = summary.body;
          if (!bodyId || typeof bodyId !== "string") return false;
          const collectionKey = resolveBodyRefForSummary(summary, routeBodyRef);
          return fetchBodyDoc(collectionKey, bodyId);
        })
        .catch(() => false);
    };

    // Legacy body-ID URL hit: soft-redirect to the slug URL when one exists so
    // old links keep working but resolve to the readable canonical URL.
    const maybeReplaceBodyIdToSlug = (bodyId) => {
      if (!routeUseSummaryRef) return;
      routeUseSummaryRef
        .where("body", "==", bodyId)
        .limit(1)
        .get()
        .then((snap) => {
          if (snap.empty) return;
          const slug = snap.docs[0].data()?.slug;
          if (slug && slug !== id) {
            replaceToPath(getArticlePathFromBodyRef(bodyRef, slug));
          }
        })
        .catch(() => {});
    };

    const loadViaSummaryForBodyId = (bodyId) => {
      if (!routeUseSummaryRef) return Promise.resolve(false);

      return routeUseSummaryRef
        .where("body", "==", bodyId)
        .limit(1)
        .get()
        .then((snap) => {
          if (snap.empty) return Promise.resolve(false);
          const summary = snap.docs[0].data() || {};
          const collectionKey = resolveBodyRefForSummary(summary, routeBodyRef);
          const canonicalBodyId = summary.body || bodyId;
          if (collectionKey === routeBodyRef) return Promise.resolve(false);
          return fetchBodyDoc(collectionKey, canonicalBodyId);
        });
    };

    const resolveSummaryIdToBody = () => {
      if (!routeUseSummaryRef) return Promise.resolve(false);

      return routeUseSummaryRef
        .doc(id)
        .get()
        .then((summarySnapshot) => {
          if (!summarySnapshot.exists) return false;

          const summary = summarySnapshot.data() || {};
          const bodyId = summary.body;
          if (!bodyId || typeof bodyId !== "string") return false;

          const collectionKey = resolveBodyRefForSummary(summary, routeBodyRef);
          return fetchBodyDoc(collectionKey, bodyId).then((loaded) => {
            if (!loaded) return false;
            // Prefer the readable slug URL; fall back to the body id.
            const nextPath = getArticlePathFromBodyRef(bodyRef, summary.slug || bodyId);
            replaceToPath(nextPath);
            return true;
          });
        });
    };

    const redirectToMembership = () => {
      localStorage.setItem("contentRedirectId", id);
      localStorage.setItem("contentRedirectType", getRouteTypeFromBodyRef(bodyRef));
      localStorage.setItem("contentRedirectAt", String(Date.now()));
      router.push("/membership");
    };

    return resolveSlugToBody().then((viaSlug) => {
      if (viaSlug) return undefined;

      return routeUseBodyRef
        .doc(id)
        .get()
        .then((snapshot) => {
          if (dispatchBodySnapshot(snapshot)) {
            maybeReplaceBodyIdToSlug(id);
            return undefined;
          }

          return loadViaSummaryForBodyId(id).then((viaSummary) => {
            if (viaSummary) return undefined;
            return resolveSummaryIdToBody().then((resolved) => {
              if (resolved) return undefined;
              return { body: { text: "<p>Article body text was blank</p>" } };
            });
          });
        })
        .catch((err) => {
          return loadViaSummaryForBodyId(id)
            .then((viaSummary) => {
              if (viaSummary) return undefined;
              return resolveSummaryIdToBody();
            })
            .then((resolved) => {
              if (!resolved) redirectToMembership();
            })
            .catch(() => {
              redirectToMembership();
            });
        });
    });
  };
};
export const setArticle = (article, id) => ({
  type: actions.CATEGORY_FETCH_ONE_ARTICLE,
  article,
  id,
});

// BASIC VERSION:
export const fetchArticlesByCategory = (category, summaryRef) => {
  return (dispatch) => {
    const useSummaryRef = matchTypeToRef[summaryRef];
    const useBodyRef = matchTypeToRef[summaryRef + 'Body'];
    
    useSummaryRef
      .where("category", "==", category)
      .get()
      .then((snapshot) => {
        const articles = [];
        const bodyPromises = [];
        
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.data();
          articles.push({
            id: childSnapshot.id,
            ...data,
          });
          
          // Fetch body content to check for videos
          if (data.body && useBodyRef) {
            bodyPromises.push(
              useBodyRef.doc(data.body).get().then((bodySnapshot) => {
                if (bodySnapshot.exists) {
                  const bodyData = bodySnapshot.data();
                  // Try multiple formats to get body text
                  let bodyText = '';
                  if (typeof bodyData === 'string') {
                    bodyText = bodyData;
                  } else if (bodyData?.text) {
                    bodyText = typeof bodyData.text === 'string' ? bodyData.text : '';
                  } else if (bodyData?.body) {
                    bodyText = typeof bodyData.body === 'string' ? bodyData.body : '';
                  }
                  return { articleId: childSnapshot.id, bodyId: data.body, bodyText };
                }
                return null;
              }).catch((err) => {
                console.warn('Failed to fetch body for article:', data.body, err);
                return null;
              })
            );
          }
        });
        
        // Wait for all body fetches to complete
        Promise.all(bodyPromises).then((bodyResults) => {
          // Dispatch articles with body content
          dispatch(setArticlesWithBodies(articles, bodyResults, true));
        });
      });
  };
};

export const getArticles = (summaryRef) => {
  return (dispatch) => {
    const useSummaryRef = matchTypeToRef[summaryRef];
    if (!useSummaryRef) {
      console.error(`Unknown summaryRef '${summaryRef}' in getArticles`);
      dispatch(setArticles([], false, summaryRef));
      return;
    }
    useSummaryRef
      .orderBy("difficulty", "asc") // ("createdAt", "desc")
      .get()
      .then((snapshot) => {
        const articles = [];
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.data();
          articles.push({
            id: childSnapshot.id,
            ...data,
          });
        });
        dispatch(setArticles(articles, false, summaryRef));
      })
      .catch((err) => {
        console.error(`Failed to fetch articles for ${summaryRef}:`, err);
        dispatch(setArticles([], false, summaryRef));
        dispatch(articleError(err));
      });
  };
};

// PAGINATION VERSION:
export const getArticlesChunk = (start, end) => {
  return (dispatch) => {};
};

// export const startSetArticles = () => {
//     return (dispatch) => {
//         return articlesRef.once('value')
//             .then(snapshot => {
//                 const articles = [];
//                 snapshot.forEach(child => {
//                    articles.push({
//                        id: child.key,
//                        ...child.val()
//                    });
//                 });
//                 dispatch(setArticles(articles));
//             });
//     };
// };

export const setArticles = (
  articles,
  fetchedByCategory = false,
  summaryRef
) => ({
  type: actions.CATEGORY_SET_ARTICLES,
  articles,
  fetchedByCategory,
  summaryRef,
});

// EDIT/UPDATE:
// - check whether the article body stored in /article has been edited or not
// - check whether the article headers info stored in /articles has been edited or not
export const startEditArticle = (article, articleBody, summaryRef, bodyRef) => {
  return (dispatch) => {
    // console.log("STARTING AN EDIT OF")
    // console.log("metadata", article.id)
    // console.log("article body", article.body);
    // console.log("ABOUT TO EDIT THEM: ", article.title);
    
    const resolvedBodyRef = resolveBodyRefForSummary(article, bodyRef);
    const useSummaryRef = matchTypeToRef[summaryRef];
    const useBodyRef = matchTypeToRef[resolvedBodyRef];
    const useBackupRef = matchBodyRefToBackupRef[resolvedBodyRef];
    const articleBodyRef = useBodyRef.doc(article.body);
    const articlesMetadataRef = useSummaryRef.doc(article.id);
    
    // First, get the current article body to backup
    articleBodyRef
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          const currentBodyData = snapshot.data();
          const currentBodyText = currentBodyData?.text || currentBodyData?.body || "";
          
          // Create backup before editing
          if (useBackupRef && currentBodyText) {
            const backupData = {
              articleId: article.id,
              bodyId: article.body,
              title: article.title || "Untitled",
              previousContent: currentBodyText,
              backedUpAt: firebase.firestore.FieldValue.serverTimestamp(),
              backedUpBy: firebase.auth().currentUser?.uid || "system",
            };
            
            // Add backup to backup collection
            useBackupRef.add(backupData).catch((backupErr) => {
              console.error("Failed to create backup:", backupErr);
              // Don't fail the edit if backup fails, but log it
            });
          }
        }
        
        // Now proceed with the edit
        const batch = database.batch();
        batch.update(articlesMetadataRef, {
          ...article,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        // articleBody is either { text: "..." } or just the string
        const bodyUpdate = typeof articleBody === 'object' && articleBody.text 
          ? { text: articleBody.text }
          : { text: articleBody };
        batch.update(articleBodyRef, bodyUpdate);
        
        return batch.commit();
      })
      .then(() => {
        //dispatch(editArticle(article, articleBody, article.id, summaryRef, bodyRef));
        console.log("Edit successful");
      })
      .catch((err) => {
        dispatch(articleError(err));
        console.log(err);
      });
  };
};

const editArticle = (article, articleBody, id, summaryRef, bodyRef) => ({
  type: actions.CATEGORY_EDIT_ARTICLE,
  id,
  article,
  articleBody,
  summaryRef,
  bodyRef,
});

// RESTORE: Restore article from backup
export const restoreArticleFromBackup = (backupId, bodyRef) => {
  return (dispatch) => {
    const useBackupRef = matchBodyRefToBackupRef[bodyRef];
    const useBodyRef = matchTypeToRef[bodyRef];
    
    if (!useBackupRef || !useBodyRef) {
      return Promise.reject(new Error("Invalid bodyRef for restore"));
    }
    
    return useBackupRef
      .doc(backupId)
      .get()
      .then((backupSnapshot) => {
        if (!backupSnapshot.exists) {
          throw new Error("Backup not found");
        }
        
        const backupData = backupSnapshot.data();
        const bodyId = backupData.bodyId;
        
        // Restore the article body
        return useBodyRef.doc(bodyId).update({
          text: backupData.previousContent,
        });
      })
      .then(() => {
        console.log("Article restored from backup successfully");
        return { success: true };
      })
      .catch((err) => {
        dispatch(articleError(err));
        console.error("Failed to restore from backup:", err);
        throw err;
      });
  };
};

// GET BACKUPS: Get all backups for an article
export const getArticleBackups = (bodyId, bodyRef) => {
  return (dispatch) => {
    const useBackupRef = matchBodyRefToBackupRef[bodyRef];
    
    if (!useBackupRef) {
      return Promise.resolve([]);
    }
    
    return useBackupRef
      .where("bodyId", "==", bodyId)
      .orderBy("backedUpAt", "desc")
      .get()
      .then((snapshot) => {
        const backups = [];
        snapshot.forEach((doc) => {
          backups.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        return backups;
      })
      .catch((err) => {
        console.error("Failed to get backups:", err);
        return [];
      });
  };
};

export const startDeleteArticle = (articleId, bodyId, summaryRef, bodyRef) => {
  return (dispatch) => {
    const batch = database.batch();
    const useSummaryRef = matchTypeToRef[summaryRef];
    const useBodyRef = matchTypeToRef[bodyRef];
    if (!useSummaryRef || !useBodyRef) {
      const err = new Error(`Invalid refs for delete: summaryRef='${summaryRef}', bodyRef='${bodyRef}'`);
      dispatch(articleError(err));
      return Promise.reject(err);
    }
    const articleBodyRef = useBodyRef.doc(bodyId);
    const articlesMetadataRef = useSummaryRef.doc(articleId);
    batch.delete(articlesMetadataRef);
    batch.delete(articleBodyRef);
    return batch
      .commit()
      .then(() => {
        // console.log("Article deleted");
        dispatch(deleteArticle(articleId, bodyId, summaryRef, bodyRef));
        return true;
      })
      .catch((err) => {
        dispatch(articleError(err));
        console.log(err);
        throw err;
      });
  };
};

const deleteArticle = (articleId, bodyId, summaryRef, bodyRef) => ({
  type: actions.CATEGORY_DELETE_ARTICLE,
  articleId,
  bodyId,
  summaryRef,
  bodyRef,
});
