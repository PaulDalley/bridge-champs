/**
 * Category Banner Service
 * Manages banner text for article level groupings
 */

import { categoryBannersRef, firebase } from '../firebase/config';

/**
 * Get default banner text for a level
 * @param {string} category - 'cardPlay', 'bidding', or 'defence'
 * @param {string} level - '1', '2', '3', etc.
 * @returns {string}
 */
const getDefaultBannerText = (category, level) => {
  if (level === '1') {
    return 'Start here - Learn the patterns';
  }
  return `Level ${level}`;
};

/**
 * Get banner text for a category and level
 * Creates default if it doesn't exist
 * @param {string} category - 'cardPlay', 'bidding', or 'defence'
 * @param {string} level - '1', '2', '3', etc.
 * @returns {Promise<string>}
 */
export const getBannerText = async (category, level) => {
  try {
    // Query for banner by category and level
    const query = categoryBannersRef
      .where('category', '==', category)
      .where('level', '==', level)
      .limit(1);

    const snapshot = await query.get();

    if (!snapshot.empty) {
      // Banner exists, return its text
      const doc = snapshot.docs[0];
      return doc.data().text || getDefaultBannerText(category, level);
    } else {
      // Banner doesn't exist, create default
      const defaultText = getDefaultBannerText(category, level);
      await createBanner(category, level, defaultText);
      return defaultText;
    }
  } catch (error) {
    console.error('Error fetching banner text:', error);
    // Return default on error
    return getDefaultBannerText(category, level);
  }
};

/**
 * Create a banner document
 * @param {string} category
 * @param {string} level
 * @param {string} text
 * @returns {Promise<void>}
 */
const createBanner = async (category, level, text) => {
  try {
    await categoryBannersRef.add({
      category,
      level,
      text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating banner:', error);
    throw error;
  }
};

/**
 * Update banner text
 * @param {string} category
 * @param {string} level
 * @param {string} text
 * @returns {Promise<void>}
 */
export const updateBannerText = async (category, level, text) => {
  try {
    const query = categoryBannersRef
      .where('category', '==', category)
      .where('level', '==', level)
      .limit(1);

    const snapshot = await query.get();

    if (!snapshot.empty) {
      // Update existing
      const docId = snapshot.docs[0].id;
      await categoryBannersRef.doc(docId).update({
        text,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Create new if doesn't exist
      await createBanner(category, level, text);
    }
  } catch (error) {
    console.error('Error updating banner text:', error);
    throw error;
  }
};

/**
 * Get all banners for a category
 * @param {string} category
 * @returns {Promise<Array<{level: string, text: string}>>}
 */
export const getAllBannersForCategory = async (category) => {
  try {
    const snapshot = await categoryBannersRef
      .where('category', '==', category)
      .get();

    const banners = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      banners.push({
        level: data.level,
        text: data.text,
      });
    });

    return banners;
  } catch (error) {
    console.error('Error fetching all banners:', error);
    return [];
  }
};

