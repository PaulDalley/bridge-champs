/**
 * Quiz Category Service
 * Manages category names for quiz groupings
 */

import { firebase } from '../firebase/config';

const quizCategoriesRef = firebase.firestore().collection('quizCategories');

/**
 * Get category name for a quiz category
 * Creates default if it doesn't exist
 * @param {string} categoryName - The category identifier
 * @returns {Promise<string>}
 */
export const getCategoryName = async (categoryName) => {
  try {
    const doc = await quizCategoriesRef.doc(categoryName).get();
    
    if (doc.exists) {
      return doc.data().name || categoryName;
    } else {
      // Create default category name
      const defaultName = categoryName || 'Uncategorized';
      await createCategory(categoryName, defaultName);
      return defaultName;
    }
  } catch (error) {
    console.error('Error fetching category name:', error);
    return categoryName || 'Uncategorized';
  }
};

/**
 * Create a category document
 * @param {string} categoryId - The category identifier
 * @param {string} categoryName - The display name
 * @returns {Promise<void>}
 */
const createCategory = async (categoryId, categoryName) => {
  try {
    await quizCategoriesRef.doc(categoryId).set({
      id: categoryId,
      name: categoryName,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

/**
 * Update category name
 * @param {string} categoryId - The category identifier
 * @param {string} categoryName - The new display name
 * @returns {Promise<void>}
 */
export const updateCategoryName = async (categoryId, categoryName) => {
  try {
    const doc = await quizCategoriesRef.doc(categoryId).get();
    
    if (doc.exists) {
      await quizCategoriesRef.doc(categoryId).update({
        name: categoryName,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      await createCategory(categoryId, categoryName);
    }
  } catch (error) {
    console.error('Error updating category name:', error);
    throw error;
  }
};

/**
 * Get all categories
 * @returns {Promise<Array<{id: string, name: string}>>}
 */
export const getAllCategories = async () => {
  try {
    const snapshot = await quizCategoriesRef.get();
    const categories = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      categories.push({
        id: data.id || doc.id,
        name: data.name || doc.id,
      });
    });
    return categories.sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return [];
  }
};



