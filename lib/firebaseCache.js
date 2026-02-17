import { db } from "./firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Get cached data from Firestore. Returns null if expired or not found.
 */
export async function getCachedData(collection, docId) {
  try {
    const ref = doc(db, collection, docId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const data = snap.data();
    const age = Date.now() - (data._cachedAt || 0);

    if (age > CACHE_TTL_MS) {
      return null; // expired
    }

    return data;
  } catch (err) {
    console.error("Cache read error:", err);
    return null;
  }
}

/**
 * Save data to Firestore cache with timestamp.
 */
export async function setCachedData(collection, docId, data) {
  try {
    const ref = doc(db, collection, docId);
    await setDoc(ref, {
      ...data,
      _cachedAt: Date.now(),
    });
  } catch (err) {
    console.error("Cache write error:", err);
  }
}
