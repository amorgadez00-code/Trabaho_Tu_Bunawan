import { useState, useEffect, useCallback } from 'react';
import { fetchPhilippineHolidays } from '../services/api';
import { loadData, saveData, KEYS } from '../services/storage';

// Holidays that fall on the same date every year. Used when the API is unreachable, for years the
// API has not loaded yet, and to fill gaps in the API data (for example All Souls' Day).
// Movable holidays (Holy Week, Eid) only come from the API.
const FIXED = {
  '01-01': "New Year's Day",
  '04-09': 'Araw ng Kagitingan',
  '05-01': 'Labor Day',
  '06-12': 'Independence Day',
  '08-21': 'Ninoy Aquino Day',
  '11-01': "All Saints' Day",
  '11-02': "All Souls' Day",
  '11-30': 'Bonifacio Day',
  '12-08': 'Feast of the Immaculate Conception',
  '12-24': 'Christmas Eve',
  '12-25': 'Christmas Day',
  '12-30': 'Rizal Day',
  '12-31': 'Last Day of the Year',
};

const MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000; // holidays rarely change: refresh a saved year after 30 days

// Cache shape in AsyncStorage: { '2026': { fetchedAt: 1760000000000, list: [{ date, name }] } }
const toMap = (cache) => {
  const map = {};
  Object.values(cache).forEach((entry) => (entry.list || []).forEach((h) => { map[h.date] = h.name; }));
  return map;
};

// Gives screens a getHoliday('2026-12-25') -> 'Christmas Day' | null.
// Order: saved copy (AsyncStorage) -> API (only for missing or old years) -> built-in fixed list.
// source: 'default' | 'saved' | 'online'
export default function useHolidays() {
  const [byDate, setByDate] = useState({});
  const [source, setSource] = useState('default');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const year = new Date().getFullYear();
      const wanted = [year, year + 1]; // a deadline can fall in next year
      const cache = (await loadData(KEYS.holidays, null)) || {};
      if (!alive) return;
      if (Object.keys(cache).length) { setByDate(toMap(cache)); setSource('saved'); }

      const stale = wanted.filter((y) => !cache[y] || Date.now() - cache[y].fetchedAt > MAX_AGE_MS);
      if (stale.length === 0) { setLoading(false); return; }

      let fetchedAny = false;
      for (const y of stale) {
        try {
          const list = await fetchPhilippineHolidays(y);
          cache[y] = { fetchedAt: Date.now(), list };
          fetchedAny = true;
        } catch (e) {
          if (alive) setError(e.message);
        }
      }
      if (fetchedAny) {
        await saveData(KEYS.holidays, cache);
        if (alive) { setByDate(toMap(cache)); setSource('online'); }
      }
      if (alive) setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  const getHoliday = useCallback(
    (iso) => (iso && (byDate[iso] || FIXED[String(iso).slice(5)])) || null,
    [byDate]
  );

  return { getHoliday, source, loading, error };
}
