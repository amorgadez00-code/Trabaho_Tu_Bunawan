import { useState, useEffect, useCallback } from 'react';
import { barangays as defaultBarangays } from '../data/mockData';
import { fetchBunawanBarangays } from '../services/api';
import { loadData, saveData, KEYS } from '../services/storage';

// Compare two barangay names even if one has extras like "(Pob.)"
const norm = (s = '') => s.toLowerCase().replace(/\(.*?\)/g, '').trim();
export const sameBarangay = (a, b) => {
  const x = norm(a), y = norm(b);
  return !!x && !!y && (x === y || x.includes(y) || y.includes(x));
};

// Gives screens the barangay list. Order: saved copy (AsyncStorage) -> API -> built-in list.
// source: 'default' | 'saved' | 'online'
export default function useBarangays() {
  const [barangays, setBarangays] = useState(defaultBarangays);
  const [source, setSource] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchBunawanBarangays();
      setBarangays(list);
      setSource('online');
      await saveData(KEYS.barangays, list);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const cached = await loadData(KEYS.barangays, null);
      if (cached && cached.length) {
        setBarangays(cached);
        setSource('saved');
      }
      load();
    })();
  }, [load]);

  return { barangays, source, loading, error, reload: load };
}
