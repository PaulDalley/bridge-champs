/**
 * Article Service - V2
 * Firebase data layer for articles (compatible with existing structure)
 */

import database, { 
  firebase,
  cardPlaySummaryRef, 
  cardPlayBodyRef,
  biddingSummaryRef,
  biddingBodyRef,
  defenceSummaryRef,
  defenceBodyRef
} from '../../firebase/config';
import { ARTICLE_CATEGORIES } from '../config';

// Use the database directly from config (it's already a Firestore instance)
const getDatabase = () => database;

// Use the same refs as old system for compatibility
const getSummaryRef = (category) => {
  const refMap = {
    cardPlay: cardPlaySummaryRef,
    bidding: biddingSummaryRef,
    defence: defenceSummaryRef,
  };
  return refMap[category];
};

const getBodyRef = (category) => {
  const refMap = {
    cardPlay: cardPlayBodyRef,
    bidding: biddingBodyRef,
    defence: defenceBodyRef,
  };
  return refMap[category];
};

/**
 * Get article summary (metadata)
 * @param {string} articleId - Summary document ID
 * @param {string} category - 'bidding', 'cardPlay', or 'defence'
 * @returns {Promise<Object>}
 */
export const getArticleSummary = async (articleId, category) => {
  const config = ARTICLE_CATEGORIES[category];
  if (!config) {
    throw new Error(`Invalid category: ${category}`);
  }

  const doc = await getDatabase().collection(config.summaryCollection).doc(articleId).get();
  
  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
};

/**
 * Get article body (content)
 * @param {string} bodyId - Body document ID
 * @param {string} category - 'bidding', 'cardPlay', or 'defence'
 * @returns {Promise<Object>}
 */
export const getArticleBody = async (bodyId, category) => {
  const config = ARTICLE_CATEGORIES[category];
  if (!config) {
    throw new Error(`Invalid category: ${category}`);
  }

  const doc = await getDatabase().collection(config.bodyCollection).doc(bodyId).get();
  
  if (!doc.exists) {
    return null;
  }

  const data = doc.data();
  
  // Handle both formats: { text: "..." } and { body: "..." } or just string
  // The old system sometimes stores as { body: articleBody } where articleBody can be string or { text: "..." }
  let bodyContent = data.text || data.body || '';
  
  // If body is an object with text property, extract it
  if (typeof bodyContent === 'object' && bodyContent.text) {
    bodyContent = bodyContent.text;
  }
  
  return {
    id: doc.id,
    text: bodyContent,
    ...data, // Keep all other fields
  };
};

/**
 * Get full article (summary + body)
 * @param {string} articleId - Can be either summary document ID or body document ID
 * @param {string} category
 * @returns {Promise<Object>}
 */
export const getArticle = async (articleId, category) => {
  console.log('=== getArticle START ===');
  console.log('articleId:', articleId);
  console.log('category:', category);
  
  try {
    const summaryRef = getSummaryRef(category);
    const bodyRef = getBodyRef(category);
    
    console.log('summaryRef exists?', !!summaryRef);
    console.log('bodyRef exists?', !!bodyRef);
    
    if (!summaryRef || !bodyRef) {
      const error = new Error(`Invalid category: ${category}`);
      console.error('ERROR: Invalid category', error);
      throw error;
    }

    // EXACTLY like old system: query summary where body == articleId
    console.log('Querying summary collection...');
    const summaryQuery = await summaryRef.where('body', '==', articleId).get();
    console.log('Summary query results:', summaryQuery.size);
    
    if (summaryQuery.empty) {
      console.log('No summary found by body ID, trying as summary ID...');
      // Try as summary ID
      const summaryDoc = await summaryRef.doc(articleId).get();
      console.log('Summary doc exists?', summaryDoc.exists);
      
      if (!summaryDoc.exists) {
        console.error('ERROR: Summary document does not exist');
        return null;
      }
      
      const summary = { id: summaryDoc.id, ...summaryDoc.data() };
      console.log('Summary found:', summary.id);
      
      if (!summary.body) {
        console.error('ERROR: Summary has no body field');
        return null;
      }
      
      console.log('Fetching body document:', summary.body);
      const bodyDoc = await bodyRef.doc(summary.body).get();
      console.log('Body doc exists?', bodyDoc.exists);
      
      if (!bodyDoc.exists) {
        console.error('ERROR: Body document does not exist');
        return null;
      }
      
      const bodyData = bodyDoc.data();
      console.log('Body data keys:', Object.keys(bodyData || {}));
      
      // Handle both formats: { text: "..." } and { body: "..." } or just string
      // The old system sometimes stores as { body: articleBody } where articleBody can be string or { text: "..." }
      let bodyContent = bodyData?.text || bodyData?.body || '';
      
      // If body is an object with text property, extract it
      if (typeof bodyContent === 'object' && bodyContent !== null && bodyContent.text) {
        bodyContent = bodyContent.text;
      }
      
      // Ensure it's a string
      bodyContent = typeof bodyContent === 'string' ? bodyContent : '';
      
      console.log('Body text length:', bodyContent.length);
      
      const result = {
        ...summary,
        bodyContent: {
          id: bodyDoc.id,
          text: bodyContent,
        },
      };
      
      console.log('=== getArticle SUCCESS (summary ID) ===');
      return result;
    }
    
    // Found by body ID
    console.log('Summary found by body ID');
    const summary = {
      id: summaryQuery.docs[0].id,
      ...summaryQuery.docs[0].data(),
    };
    console.log('Summary ID:', summary.id);

    // Get body using articleId (body ID from URL)
    console.log('Fetching body document:', articleId);
    const bodyDoc = await bodyRef.doc(articleId).get();
    console.log('Body doc exists?', bodyDoc.exists);
    
    if (!bodyDoc.exists) {
      console.error('ERROR: Body document does not exist');
      return null;
    }

    const bodyData = bodyDoc.data();
    console.log('Body data keys:', Object.keys(bodyData || {}));
    
    // Handle both formats: { text: "..." } and { body: "..." } or just string
    // The old system sometimes stores as { body: articleBody } where articleBody can be string or { text: "..." }
    let bodyContent = bodyData?.text || bodyData?.body || '';
    
    // If body is an object with text property, extract it
    if (typeof bodyContent === 'object' && bodyContent !== null && bodyContent.text) {
      bodyContent = bodyContent.text;
    }
    
    // Ensure it's a string
    bodyContent = typeof bodyContent === 'string' ? bodyContent : '';
    
    console.log('Body text length:', bodyContent.length);
    
    const result = {
      ...summary,
      bodyContent: {
        id: bodyDoc.id,
        text: bodyContent,
      },
    };
    
    console.log('=== getArticle SUCCESS (body ID) ===');
    return result;
  } catch (error) {
    console.error('=== getArticle ERROR ===');
    console.error('Error type:', error?.constructor?.name || typeof error);
    console.error('Error message:', error?.message || String(error));
    console.error('Error stack:', error?.stack);
    console.error('Error name:', error?.name);
    console.error('Full error object:', error);
    throw error;
  }
};

/**
 * Create new article
 * @param {Object} articleData - Article metadata
 * @param {string} articleData.title
 * @param {string} articleData.category
 * @param {string} articleData.teaser
 * @param {string} articleData.videoUrl
 * @param {string} articleData.difficulty
 * @param {string} articleData.articleNumber
 * @param {string} articleData.subcategory
 * @param {string} content - Article body content (HTML)
 * @param {string} category - 'bidding', 'cardPlay', or 'defence'
 * @returns {Promise<{summaryId: string, bodyId: string}>}
 */
export const createArticle = async (articleData, content, category) => {
  const config = ARTICLE_CATEGORIES[category];
  if (!config) {
    throw new Error(`Invalid category: ${category}`);
  }

  const db = getDatabase();
  const batch = db.batch();
  
  // Create body document
  const bodyRef = db.collection(config.bodyCollection).doc();
  batch.set(bodyRef, {
    text: content,
  });

  // Create summary document
  const summaryRef = db.collection(config.summaryCollection).doc();
  batch.set(summaryRef, {
    ...articleData,
    body: bodyRef.id,
    articleType: category,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  await batch.commit();

  return {
    summaryId: summaryRef.id,
    bodyId: bodyRef.id,
  };
};

/**
 * Update existing article
 * @param {string} summaryId - Summary document ID
 * @param {Object} articleData - Updated metadata
 * @param {string} content - Updated body content
 * @param {string} category
 * @returns {Promise<void>}
 */
export const updateArticle = async (summaryId, articleData, content, category) => {
  const config = ARTICLE_CATEGORIES[category];
  if (!config) {
    throw new Error(`Invalid category: ${category}`);
  }

  // Get existing article to find body ID
  const summary = await getArticleSummary(summaryId, category);
  if (!summary || !summary.body) {
    throw new Error('Article not found');
  }

  const db = getDatabase();
  if (!db) {
    throw new Error('Database not available');
  }
  const batch = db.batch();
  
  // Update summary
  const summaryRef = db.collection(config.summaryCollection).doc(summaryId);
  batch.update(summaryRef, {
    ...articleData,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  // Update body
  const bodyRef = db.collection(config.bodyCollection).doc(summary.body);
  
  console.log('=== UPDATE ARTICLE DEBUG ===');
  console.log('summaryId:', summaryId);
  console.log('bodyId:', summary.body);
  console.log('content length:', content.length);
  console.log('content preview:', content.substring(0, 200));
  console.log('content ends with:', content.slice(-300));
  
  try {
    batch.update(bodyRef, {
      text: content,
    });
    console.log('Batch update prepared');

    console.log('Committing batch...');
    await batch.commit();
    console.log('=== UPDATE ARTICLE SUCCESS ===');
  } catch (commitError) {
    console.error('=== BATCH COMMIT ERROR ===');
    console.error('Error type:', commitError?.constructor?.name || typeof commitError);
    console.error('Error message:', commitError?.message || String(commitError));
    console.error('Error stack:', commitError?.stack);
    console.error('Error code:', commitError?.code);
    console.error('Full error object:', commitError);
    throw commitError;
  }
};

