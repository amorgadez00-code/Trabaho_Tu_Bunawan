import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialApplications, jobs as sampleJobs, employers as sampleEmployers } from '../data/mockData';
import { KEYS, loadData, saveData, removeData } from '../services/storage';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);          // true after data is loaded from AsyncStorage
  const [user, setUserState] = useState(null);        // logged-in user: role is 'jobseeker' or 'employer' (no password stored)
  const [profile, setProfile] = useState(null);       // last known profile (used at next login)
  const [savedIds, setSavedIds] = useState([1]);      // saved job ids
  const [applications, setApplications] = useState(initialApplications);
  const [postedJobs, setPostedJobs] = useState([]);   // jobs created by employers on this device
  const [seenWelcome, setSeenWelcome] = useState(false); // welcome slides are shown only on first launch

  // READ: load everything saved on the device when the app starts
  useEffect(() => {
    let alive = true;
    (async () => {
      const [u, p, s, a, pj, sw] = await Promise.all([
        loadData(KEYS.user, null),
        loadData(KEYS.profile, null),
        loadData(KEYS.savedIds, [1]),
        loadData(KEYS.applications, initialApplications),
        loadData(KEYS.postedJobs, []),
        loadData(KEYS.seenWelcome, false),
      ]);
      if (!alive) return;
      setUserState(u); setProfile(p); setSavedIds(s); setApplications(a); setPostedJobs(pj); setSeenWelcome(sw);
      setReady(true);
    })();
    return () => { alive = false; };
  }, []);

  // CREATE / UPDATE / DELETE: every change is saved automatically
  useEffect(() => { if (ready) saveData(KEYS.user, user); }, [user, ready]);
  useEffect(() => { if (ready) saveData(KEYS.profile, profile); }, [profile, ready]);
  useEffect(() => { if (ready) saveData(KEYS.savedIds, savedIds); }, [savedIds, ready]);
  useEffect(() => { if (ready) saveData(KEYS.applications, applications); }, [applications, ready]);
  useEffect(() => { if (ready) saveData(KEYS.postedJobs, postedJobs); }, [postedJobs, ready]);
  useEffect(() => { if (ready) saveData(KEYS.seenWelcome, seenWelcome); }, [seenWelcome, ready]);

  // ---- jobs: sample jobs + jobs posted by employers ----
  const allJobs = [...postedJobs, ...sampleJobs];
  const findJob = (id) => allJobs.find((j) => j.id === id);
  const findEmployer = (id) =>
    sampleEmployers.find((e) => e.id === id) || postedJobs.find((j) => j.employerId === id)?.employer;

  // ---- user ----
  const setUser = (u) => { setUserState(u); if (u) setProfile(u); };
  const updateUser = (patch) => {
    const next = { ...user, ...patch };
    setUserState(next);
    setProfile(next);
  };
  const isEmployer = user?.role === 'employer';
  const myEmployerId = user ? `own-${user.email}` : null;

  // ---- saved jobs ----
  const toggleSaved = (jobId) =>
    setSavedIds((cur) => (cur.includes(jobId) ? cur.filter((i) => i !== jobId) : [...cur, jobId]));
  const clearSaved = () => setSavedIds([]);

  // ---- employer job posts (CRUD) ----
  const addPost = (job) => setPostedJobs((cur) => [job, ...cur]);
  const updatePost = (id, patch) => setPostedJobs((cur) => cur.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  const deletePost = (id) => {
    setPostedJobs((cur) => cur.filter((j) => j.id !== id));
    setSavedIds((cur) => cur.filter((i) => i !== id));
  };

  // ---- downloaded data (API cache) ----
  const clearCache = () => removeData(KEYS.barangays);

  // ---- applications ----
  const hasApplied = (jobId) => applications.some((a) => a.jobId === jobId && a.status !== 'withdrawn');
  const addApplication = ({ jobId, name, phone, message }) => {
    const id = Date.now();
    setApplications((cur) => [{ id, jobId, name, phone, message, status: 'pending', appliedAt: new Date().toISOString().slice(0, 10) }, ...cur]);
    return id;
  };
  const updateApplication = (id, patch) =>
    setApplications((cur) => cur.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const withdrawApplication = (id) => updateApplication(id, { status: 'withdrawn' });
  const deleteApplication = (id) => setApplications((cur) => cur.filter((a) => a.id !== id));

  return (
    <AppContext.Provider
      value={{
        ready, seenWelcome, setSeenWelcome, user, profile, setUser, updateUser, isEmployer, myEmployerId,
        allJobs, postedJobs, findJob, findEmployer, addPost, updatePost, deletePost,
        savedIds, toggleSaved, clearSaved, clearCache,
        applications, hasApplied, addApplication, updateApplication, withdrawApplication, deleteApplication,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
