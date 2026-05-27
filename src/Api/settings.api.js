// src/Api/settings.api.js

/**
 * Fake API for Settings page
 * Stores data in localStorage to persist across page refreshes
 * Simulates network delay with setTimeout
 */

// Storage keys for localStorage
const STORAGE_KEYS = {
  CATEGORIES: 'settings_categories',
  NOTIFICATIONS: 'settings_notifications',
  COLOR_THEME: 'settings_color_theme',
  SYSTEM_INFO: 'settings_system_info',
};

// ============= DEFAULT DATA =============

// Default material categories
const DEFAULT_CATEGORIES = [
  { id: 1, name: 'Electronics', icon: 'Cpu' },
  { id: 2, name: 'Laboratory Tools', icon: 'Scissors' },
  { id: 3, name: 'Safety Equipment', icon: 'Shield' },
  { id: 4, name: 'Measurement Devices', icon: 'Activity' },
  { id: 5, name: 'Chemical Equipment', icon: 'FlaskConical' },
  { id: 6, name: 'Computer Equipment', icon: 'Monitor' },
];

// Default notification preferences
const DEFAULT_NOTIFICATIONS = {
  lowStock: true,
  maintenance: true,
  requests: true,
};

// Default color theme
const DEFAULT_COLOR_THEME = {
  primaryColor: '#2B4C9F',
  accentColor: '#6366F1',
  accentColorsList: ['#22c55e', '#f59e0b', '#ef4444', '#6366f1', '#a855f7'],
};

// Default system information
const DEFAULT_SYSTEM_INFO = {
  platformVersion: 'ESI-GM v1.0.0',
  lastBackup: 'February 24, 2026',
  databaseStatus: 'connected',
  storageUsed: 2.4,
  storageTotal: 10,
};

// ============= HELPER FUNCTIONS =============

/**
 * Get stored data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if no data exists
 * @returns {any} Stored or default data
 */
const getStoredData = (key, defaultValue) => {
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return defaultValue;
    }
  }
  return defaultValue;
};

/**
 * Store data in localStorage
 * @param {string} key - Storage key
 * @param {any} data - Data to store
 */
const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

/**
 * Simulate network delay
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} Promise that resolves after delay
 */
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// ============= CATEGORIES API =============

/**
 * Fetch all material categories
 * @returns {Promise<Array>} List of categories
 */
export const fetchCategories = async () => {
  await delay();
  const categories = getStoredData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  return [...categories];
};

/**
 * Add a new category
 * @param {Object} category - Category object { name, icon }
 * @returns {Promise<Object>} Newly created category
 */
export const addCategory = async (category) => {
  await delay();
  
  const categories = getStoredData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  
  // Check for duplicate name (case insensitive)
  if (categories.some(c => c.name.toLowerCase() === category.name.toLowerCase())) {
    throw new Error('Category already exists');
  }
  
  const newCategory = {
    id: Date.now(),
    name: category.name,
    icon: category.icon,
  };
  
  const updatedCategories = [...categories, newCategory];
  setStoredData(STORAGE_KEYS.CATEGORIES, updatedCategories);
  return newCategory;
};

/**
 * Delete a category by ID
 * @param {number} categoryId - Category ID to delete
 * @returns {Promise<Object>} Success response
 */
export const deleteCategory = async (categoryId) => {
  await delay();
  
  let categories = getStoredData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  const categoryExists = categories.some(c => c.id === categoryId);
  
  if (!categoryExists) {
    throw new Error('Category not found');
  }
  
  categories = categories.filter(c => c.id !== categoryId);
  setStoredData(STORAGE_KEYS.CATEGORIES, categories);
  return { success: true, message: 'Category deleted successfully' };
};

/**
 * Update an existing category
 * @param {number} categoryId - Category ID to update
 * @param {Object} updates - Updates { name, icon }
 * @returns {Promise<Object>} Updated category
 */
export const updateCategory = async (categoryId, updates) => {
  await delay();
  
  const categories = getStoredData(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
  const categoryIndex = categories.findIndex(c => c.id === categoryId);
  
  if (categoryIndex === -1) {
    throw new Error('Category not found');
  }
  
  // Check for duplicate name with other categories
  if (updates.name) {
    const duplicate = categories.some(
      c => c.id !== categoryId && c.name.toLowerCase() === updates.name.toLowerCase()
    );
    if (duplicate) {
      throw new Error('Category name already exists');
    }
  }
  
  categories[categoryIndex] = { ...categories[categoryIndex], ...updates };
  setStoredData(STORAGE_KEYS.CATEGORIES, categories);
  return categories[categoryIndex];
};

// ============= NOTIFICATION PREFERENCES API =============

/**
 * Fetch user notification preferences
 * @returns {Promise<Object>} Notification preferences
 */
export const fetchNotificationPreferences = async () => {
  await delay();
  const preferences = getStoredData(STORAGE_KEYS.NOTIFICATIONS, DEFAULT_NOTIFICATIONS);
  return { ...preferences };
};

/**
 * Update notification preferences
 * @param {Object} preferences - Preferences { lowStock, maintenance, requests }
 * @returns {Promise<Object>} Updated preferences
 */
export const updateNotificationPreferences = async (preferences) => {
  await delay();
  
  const updated = {
    lowStock: preferences.lowStock ?? true,
    maintenance: preferences.maintenance ?? true,
    requests: preferences.requests ?? true,
  };
  
  setStoredData(STORAGE_KEYS.NOTIFICATIONS, updated);
  return updated;
};

// ============= COLOR THEME API =============

/**
 * Fetch color theme settings
 * @returns {Promise<Object>} Color theme object
 */
export const fetchColorTheme = async () => {
  await delay();
  const theme = getStoredData(STORAGE_KEYS.COLOR_THEME, DEFAULT_COLOR_THEME);
  return { ...theme };
};

/**
 * Update primary color
 * @param {string} color - Hex color code
 * @returns {Promise<Object>} Updated theme
 */
export const updatePrimaryColor = async (color) => {
  await delay();
  
  const theme = getStoredData(STORAGE_KEYS.COLOR_THEME, DEFAULT_COLOR_THEME);
  theme.primaryColor = color;
  setStoredData(STORAGE_KEYS.COLOR_THEME, theme);
  return theme;
};

/**
 * Update accent color
 * @param {string} color - Hex color code
 * @returns {Promise<Object>} Updated theme
 */
export const updateAccentColor = async (color) => {
  await delay();
  
  const theme = getStoredData(STORAGE_KEYS.COLOR_THEME, DEFAULT_COLOR_THEME);
  theme.accentColor = color;
  setStoredData(STORAGE_KEYS.COLOR_THEME, theme);
  return theme;
};

/**
 * Add a new accent color to the list
 * @param {string} color - Hex color code
 * @returns {Promise<Array>} Updated accent colors list
 */
export const addAccentColor = async (color) => {
  await delay();
  
  const theme = getStoredData(STORAGE_KEYS.COLOR_THEME, DEFAULT_COLOR_THEME);
  
  if (theme.accentColorsList.includes(color)) {
    throw new Error('Color already exists');
  }
  
  theme.accentColorsList.push(color);
  setStoredData(STORAGE_KEYS.COLOR_THEME, theme);
  return theme.accentColorsList;
};

/**
 * Remove an accent color from the list
 * @param {string} color - Hex color code to remove
 * @returns {Promise<Array>} Updated accent colors list
 */
export const removeAccentColor = async (color) => {
  await delay();
  
  const theme = getStoredData(STORAGE_KEYS.COLOR_THEME, DEFAULT_COLOR_THEME);
  theme.accentColorsList = theme.accentColorsList.filter(c => c !== color);
  setStoredData(STORAGE_KEYS.COLOR_THEME, theme);
  return theme.accentColorsList;
};

// ============= SYSTEM INFORMATION API =============

/**
 * Fetch system information
 * @returns {Promise<Object>} System info object
 */
export const fetchSystemInfo = async () => {
  await delay();
  const info = getStoredData(STORAGE_KEYS.SYSTEM_INFO, DEFAULT_SYSTEM_INFO);
  return { ...info };
};

/**
 * Update system information (admin only)
 * @param {Object} updates - Updates to apply
 * @returns {Promise<Object>} Updated system info
 */
export const updateSystemInfo = async (updates) => {
  await delay();
  
  const info = getStoredData(STORAGE_KEYS.SYSTEM_INFO, DEFAULT_SYSTEM_INFO);
  const updated = { ...info, ...updates };
  setStoredData(STORAGE_KEYS.SYSTEM_INFO, updated);
  return updated;
};

// ============= RESET API =============

/**
 * Reset all settings to default values
 * @returns {Promise<Object>} Success response
 */
export const resetAllSettings = async () => {
  await delay(500);
  
  localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
  localStorage.removeItem(STORAGE_KEYS.NOTIFICATIONS);
  localStorage.removeItem(STORAGE_KEYS.COLOR_THEME);
  localStorage.removeItem(STORAGE_KEYS.SYSTEM_INFO);
  
  return { success: true, message: 'All settings reset to default' };
};

// Export all APIs as a single object
const settingsApi = {
  // Categories
  fetchCategories,
  addCategory,
  deleteCategory,
  updateCategory,
  
  // Notifications
  fetchNotificationPreferences,
  updateNotificationPreferences,
  
  // Color Theme
  fetchColorTheme,
  updatePrimaryColor,
  updateAccentColor,
  addAccentColor,
  removeAccentColor,
  
  // System Info
  fetchSystemInfo,
  updateSystemInfo,
  
  // Reset
  resetAllSettings,
};

export default settingsApi;