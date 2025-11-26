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
  articles: articlesRef,
  article: articleRef,
  biddingSummary: biddingSummaryRef,
  biddingBody: biddingBodyRef,
  cardPlaySummary: cardPlaySummaryRef,
  cardPlayBody: cardPlayBodyRef,
  defenceSummary: defenceSummaryRef,
  defenceBody: defenceBodyRef,
};

export const setCurrentArticle = (article) => ({
  type: actions.SET_CURRENT_ARTICLE,
  currentArticle: article,
});

export const setCurrentCategoryArticle = (article) => ({
  type: actions.SET_CURRENT_CATEGORY_ARTICLE,
  currentArticle: article,
});

export const getArticleMetadata = (id) => {
  return (dispatch) => {
    articlesRef
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
  type: actions.SET_COUNTS,
  articlesCount,
  quizCount,
});

export const articleError = (error) => ({
  type: actions.ARTICLE_ERROR,
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
export const startAddArticle = (article, articleBody) => {
  return (dispatch) => {
    const batch = database.batch();
    const newArticleRef = articleRef.doc();
    const newArticlesRef = articlesRef.doc();
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
        // dispatch(addArticle(article, articleBody, newArticleRef.id));
      })
      .catch((err) => dispatch(articleError(err)));
  };
};

// export const startAddArticle = (article, articleBody) => {
//     return (dispatch) => {
//         articlesRef.push({
//             ...article,
//             createdAt: database.ServerValue.TIMESTAMP
//         })
//             .then(res => {
//                 articleRef.child(res.getKey()).set({
//                     text: articleBody,
//                     createdAt: database.ServerValue.TIMESTAMP
//             })
//                 .then((snapshot) => {
//                     dispatch(addArticle({
//                          id: snapshot.key,
//                          ...article
//                         }, articleBody));
//                 });
//             });
//     }
// };

export const addArticle = (article, articleBody, id) => ({
  type: actions.ADD_ARTICLE,
  article,
  articleBody,
  articleId: id,
});

// READ: DOWNLOAD the list of articles of /articles:
// - 1. fetch all articles data once
// - 2. parse data into an array
// - 3. dispatch setArticles with the returned & shaped data.
// - pagination limited fetching ??

export const getArticle = (id, router) => {
  return (dispatch) => {
    return articleRef
      .doc(id)
      .get()
      .then((snapshot) => {
        const article = snapshot.data();
        const id = snapshot.id;
        dispatch(setArticle(article, id));
      })
      .catch((err) => {
        // console.log(err);
        localStorage.setItem("contentRedirectId", id);
        localStorage.setItem("contentRedirectType", "article");
        router.push("/membership");
      });
  };
};
export const setArticle = (article, id) => ({
  type: actions.FETCH_ONE_ARTICLE,
  article,
  id,
});

// BASIC VERSION:
export const fetchArticlesByCategory = (category) => {
  return (dispatch) => {
    articlesRef
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
        // console.log("---- JUST FETCHED ARTICLES! ----");
        // console.log(articles);
        dispatch(setArticles(articles, true));
      });
  };
};

export const getArticles = () => {
  return (dispatch) => {
    articlesRef
      .orderBy("createdAt", "desc")
      .get()
      .then((snapshot) => {
        const articles = [];
        snapshot.forEach((childSnapshot) => {
          articles.push({
            id: childSnapshot.id,
            ...childSnapshot.data(),
          });
        });
        // console.log("JUST FETCHED ARTICLES!");
        // console.log(articles);
        dispatch(setArticles(articles));
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

export const setArticles = (articles, fetchedByCategory = false) => ({
  type: actions.SET_ARTICLES,
  articles,
  fetchedByCategory,
});

export const setTopTen = (topTen, topTenQuizzes) => ({
  type: actions.SET_TOP_TEN,
  topTen,
  topTenQuizzes,
});

export const setFreeDailies = (article, quiz) => ({
  type: actions.SET_FREE_DAILIES,
  article,
  quiz,
});

// UPDATE

// DELETE
// const startRemoveArticle = (id) => {
//     return (dispatch) => {
//         // database.ref(`articles/${id}`).remove()
//         articlesRef.child(id).remove()
//             .then(() => {
//                 dispatch(removeArticle(id));
//             });
//     };
// };

// EDIT
// - check whether the article body stored in /article has been edited or not
// - check whether the article headers info stored in /articles has been edited or not
export const startEditArticle = (article, articleBody) => {
  return (dispatch) => {
    // console.log("STARTING AN EDIT OF")
    // console.log("metadata", article.id)
    // console.log("article body", article.body);
    // console.log("ABOUT TO EDIT THEM: ", article.title);
    const batch = database.batch();
    const articleBodyRef = articleRef.doc(article.body);
    const articlesMetadataRef = articlesRef.doc(article.id);
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
        //dispatch(editArticle(article, articleBody, article.id));
        console.log("Edit successful");
      })
      .catch((err) => {
        dispatch(articleError(err));
        console.log(err);
      });
  };
};

const editArticle = (article, articleBody, id) => ({
  type: actions.EDIT_ARTICLE,
  id,
  article,
  articleBody,
});

export const startDeleteArticle = (articleId, bodyId) => {
  return (dispatch) => {
    const batch = database.batch();
    const articleBodyRef = articleRef.doc(bodyId);
    const articlesMetadataRef = articlesRef.doc(articleId);
    batch.delete(articlesMetadataRef);
    batch.delete(articleBodyRef);
    batch
      .commit()
      .then(() => {
        // console.log("Article deleted");
        // dispatch(deleteArticle(articleId, bodyId));
      })
      .catch((err) => {
        dispatch(articleError(err));
        console.log(err);
      });
  };
};

const deleteArticle = (articleId, bodyId) => ({
  type: actions.DELETE_ARTICLE,
  articleId,
  bodyId,
});

// ## DOWNLOAD one article for /articles/:id -- if logged in && member:
// export const getArticlesByCategory = category => {
//     return dispatch => {
//         articlesRef.where("category", "==", category)
//             .get()
//             .then(snapshot => {
//                 let articles = {};
//                 snapshot.forEach(childSnapshot => {
//                     let childData = childSnapshot.data();
//                     // console.log(" I HAVE CHILD DATA HERE");
//                     // console.log(childData.subcategory);
//
//                     if (articles[childData.subcategory]) {
//                         articles[childData.subcategory].push(childData);
//                     }
//                     else {
//                         articles[childData.subcategory] = [childData];
//                     }
//                 });
//                 dispatch(setTournamentsData(tournamentArticles))
//             });
//     };
// }

export const getTournamentArticles = () => {
  return (dispatch) => {
    articlesRef
      .where("category", "==", "Tournament")
      .get()
      .then((snapshot) => {
        let tournamentArticles = {};
        snapshot.forEach((childSnapshot) => {
          let childData = childSnapshot.data();
          // console.log(" I HAVE CHILD DATA HERE");
          // console.log(childData.subcategory);

          if (tournamentArticles[childData.subcategory]) {
            tournamentArticles[childData.subcategory].push(childData);
          } else {
            tournamentArticles[childData.subcategory] = [childData];
          }
        });
        dispatch(setTournamentsData(tournamentArticles));
      });
  };
};

const setTournamentsData = (tournamentArticles) => ({
  type: actions.SET_TOURNAMENT_ARTICLES,
  tournamentArticles,
});

export const setCurrentTournament = (tournament) => {};
