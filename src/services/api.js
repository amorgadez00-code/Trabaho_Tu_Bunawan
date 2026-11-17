// All API requests are kept in this one file. Screens call the small functions below.
// PSGC (Philippine Standard Geographic Code) - official barangays of Bunawan
//   https://psgc.gitlab.io/api
// Nager.Date - public holidays (the Philippines is country code PH)
//   https://date.nager.at/api/v3/PublicHolidays/{year}/PH

const PSGC_URL = 'https://psgc.gitlab.io/api';
const NAGER_URL = 'https://date.nager.at/api/v3';

// fetch() wrapper: timeout + readable error messages
async function getJson(url, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error(`Server error (${res.status}). Please try again later.`);
    return await res.json();
  } catch (e) {
    if (e.name === 'AbortError') throw new Error('The request took too long. Please try again.');
    if (e instanceof SyntaxError) throw new Error('The server sent an unexpected response.');
    if (e instanceof TypeError) throw new Error('No internet connection.');
    throw e;
  } finally {
    clearTimeout(timer);
  }
}

// Finds the municipality of Bunawan, then returns the names of its barangays (sorted).
export async function fetchBunawanBarangays() {
  const towns = await getJson(`${PSGC_URL}/municipalities/`);
  const bunawan = Array.isArray(towns) && towns.find((t) => String(t.name).toLowerCase() === 'bunawan');
  if (!bunawan) throw new Error('Bunawan was not found in the PSGC data.');
  const list = await getJson(`${PSGC_URL}/municipalities/${bunawan.code}/barangays/`);
  if (!Array.isArray(list) || list.length === 0) throw new Error('No barangays were returned.');
  return list.map((b) => b.name).sort();
}

// Public holidays of the Philippines for one year -> [{ date: '2026-12-25', name: 'Christmas Day' }]
export async function fetchPhilippineHolidays(year) {
  const list = await getJson(`${NAGER_URL}/PublicHolidays/${year}/PH`);
  if (!Array.isArray(list)) throw new Error('The holiday service sent an unexpected response.');
  return list
    .filter((h) => /^\d{4}-\d{2}-\d{2}$/.test(h.date))
    .map((h) => ({ date: h.date, name: h.name || h.localName || 'Holiday' }));
}
