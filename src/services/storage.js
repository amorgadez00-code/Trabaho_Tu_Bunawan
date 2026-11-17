// Local data storage helpers (AsyncStorage). Everything is saved as JSON text.
import AsyncStorage from '@react-native-async-storage/async-storage';

export const KEYS = {
  user: 'tb:user',
  profile: 'tb:profile',
  savedIds: 'tb:savedIds',
  applications: 'tb:applications',
  postedJobs: 'tb:postedJobs',
  barangays: 'tb:barangays',
  holidays: 'tb:holidays',
  seenWelcome: 'tb:seenWelcome',
};

// CREATE / UPDATE: write a value
export async function saveData(key, value) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.warn('saveData failed', key, e);
    return false;
  }
}

// READ: get a value (returns fallback if nothing is stored yet)
export async function loadData(key, fallback = null) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (e) {
    console.warn('loadData failed', key, e);
    return fallback;
  }
}

// DELETE: remove a value
export async function removeData(key) {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.warn('removeData failed', key, e);
  }
}
