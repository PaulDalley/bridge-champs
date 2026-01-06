/**
 * Article Service
 * 
 * Modern Firebase v9 API for article operations
 * Works with both old and new content formats
 */

import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../../firebase/modernConfig';

/**
 * Get article metadata
 */
export const getArticleMetadata = async (articleId, articleType) => {
  const collectionMap = {
    bidding: 'bidding',
    cardPlay: 'cardPlay',
    defence: 'defence',
    articles: 'articles',
  };

  const collectionName = collectionMap[articleType] || 'articles';
  const articleRef = doc(db, collectionName, articleId);
  const snapshot = await getDoc(articleRef);
  
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() };
  }
  
  return null;
};

/**
 * Get article body
 */
export const getArticleBody = async (bodyId, articleType) => {
  const collectionMap = {
    bidding: 'biddingBody',
    cardPlay: 'cardPlayBody',
    defence: 'defenceBody',
    articles: 'article',
  };

  const collectionName = collectionMap[articleType] || 'article';
  const bodyRef = doc(db, collectionName, bodyId);
  const snapshot = await getDoc(bodyRef);
  
  if (snapshot.exists()) {
    return snapshot.data();
  }
  
  return null;
};

/**
 * Save article (creates or updates)
 */
export const saveArticle = async (article, articleBody, articleType, isEdit = false) => {
  const collectionMap = {
    bidding: { summary: 'bidding', body: 'biddingBody' },
    cardPlay: { summary: 'cardPlay', body: 'cardPlayBody' },
    defence: { summary: 'defence', body: 'defenceBody' },
    articles: { summary: 'articles', body: 'article' },
  };

  const collections = collectionMap[articleType] || collectionMap.articles;

  if (isEdit && article.id && article.body) {
    // Update existing article
    const summaryRef = doc(db, collections.summary, article.id);
    const bodyRef = doc(db, collections.body, article.body);

    await updateDoc(summaryRef, {
      ...article,
      updatedAt: serverTimestamp(),
    });

    await updateDoc(bodyRef, articleBody);

    return { id: article.id, body: article.body };
  } else {
    // Create new article
    const bodyRef = doc(collection(db, collections.body));
    const summaryRef = doc(collection(db, collections.summary));

    await setDoc(bodyRef, articleBody);
    await setDoc(summaryRef, {
      ...article,
      id: summaryRef.id,
      body: bodyRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return { id: summaryRef.id, body: bodyRef.id };
  }
};

/**
 * Create backup before editing
 */
export const createBackup = async (bodyId, articleType, currentContent) => {
  const backupCollectionMap = {
    bidding: 'biddingBodyBackups',
    cardPlay: 'cardPlayBodyBackups',
    defence: 'defenceBodyBackups',
  };

  const backupCollection = backupCollectionMap[articleType];
  if (!backupCollection) return;

  const backupRef = collection(db, backupCollection);
  await addDoc(backupRef, {
    bodyId,
    previousContent: currentContent,
    backedUpAt: serverTimestamp(),
  });
};




