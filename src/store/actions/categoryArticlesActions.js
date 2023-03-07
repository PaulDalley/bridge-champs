import * as actions from "./actionTypes";
import database, {
  countsRef,
  firebase,
  articlesRef,
  articleRef,
  biddingSummaryRef,
  biddingBodyRef,
  cardPlaySummaryRef,
  cardPlayBodyRef,
  defenceSummaryRef,
  defenceBodyRef,
} from "../../firebase/config";
/*const articlesRef = database.ref('articles');
 const articleRef = database.ref('article');*/

const matchTypeToRef = {
  bidding: biddingSummaryRef,
  biddingBody: biddingBodyRef,
  cardPlay: cardPlaySummaryRef,
  cardPlayBody: cardPlayBodyRef,
  defence: defenceSummaryRef,
  defenceBody: defenceBodyRef,
};

export const setCurrentArticle = (article) => ({
  type: actions.SET_CURRENT_CATEGORY_ARTICLE,
  currentArticle: article,
});

export const getArticleMetadata = (id, summaryRef = "articles") => {
  const useSummaryRef = matchTypeToRef[summaryRef];
  return (dispatch) => {
    useSummaryRef
      .where("body", "==", id)
      .get()
      .then((snapshot) => {
        // console.log(snapshot.docs);
        // snapshot.forEach(doc => console.log(doc.data()));
        if (snapshot && snapshot.docs[0]) {
          const articleMetadata = snapshot.docs[0].data();
          dispatch(setCurrentArticle(articleMetadata));
        }
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
    const useBodyRef = matchTypeToRef[bodyRef];
    console.log(`--- in getArticle with id: ${id} and bodyRef: ${bodyRef} ---`);
    console.log("attempting to use");
    console.log(useBodyRef);

    return useBodyRef
      .doc(id)
      .get()
      .then((snapshot) => {
        const article = snapshot.data();
        const id = snapshot.id;
        if (article === undefined)
          return { body: { text: "<p>Article body text was blank</p>" } };
        dispatch(setArticle(article, id));
      })
      .catch((err) => {
        console.log(
          `--- There was an error fetching Category Article with ${bodyRef} ---`
        );
        console.log(err);
        localStorage.setItem("contentRedirectId", id);
        localStorage.setItem("contentRedirectType", "article");
        router.push("/membership");
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
    useSummaryRef
      .where("category", "==", category)
      .get()
      .then((snapshot) => {
        const articles = [];
        snapshot.forEach((childSnapshot) => {
          articles.push({
            id: childSnapshot.id,
            ...childSnapshot.data(),
          });
        });
        console.log("---- JUST FETCHED ARTICLES! ----");
        console.log(articles);
        dispatch(setArticles(articles, true));
      });
  };
};

export const getArticles = (summaryRef) => {
  return (dispatch) => {
    const useSummaryRef = matchTypeToRef[summaryRef];
    useSummaryRef
      .orderBy("difficulty", "asc") // ("createdAt", "desc")
      .get()
      .then((snapshot) => {
        console.log(snapshot);
        const articles = [];
        snapshot.forEach((childSnapshot) => {
          articles.push({
            id: childSnapshot.id,
            ...childSnapshot.data(),
          });
        });
        console.log(`--- JUST FETCHED categoryArticles for ${summaryRef} ---`);
        console.log(articles);
        dispatch(setArticles(articles, false, summaryRef));
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
    const batch = database.batch();
    const useSummaryRef = matchTypeToRef[summaryRef];
    const useBodyRef = matchTypeToRef[bodyRef];
    const articleBodyRef = useBodyRef.doc(article.body);
    const articlesMetadataRef = useSummaryRef.doc(article.id);
    batch.update(articlesMetadataRef, {
      ...article,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    batch.update(articleBodyRef, {
      body: articleBody,
    });
    batch
      .commit()
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

export const startDeleteArticle = (articleId, bodyId, summaryRef, bodyRef) => {
  return (dispatch) => {
    const batch = database.batch();
    const useSummaryRef = matchTypeToRef[summaryRef];
    const useBodyRef = matchTypeToRef[bodyRef];
    const articleBodyRef = useBodyRef.doc(bodyId);
    const articlesMetadataRef = useSummaryRef.doc(articleId);
    batch.delete(articlesMetadataRef);
    batch.delete(articleBodyRef);
    batch
      .commit()
      .then(() => {
        // console.log("Article deleted");
        dispatch(deleteArticle(articleId, bodyId, summaryRef, bodyRef));
      })
      .catch((err) => {
        dispatch(articleError(err));
        console.log(err);
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
