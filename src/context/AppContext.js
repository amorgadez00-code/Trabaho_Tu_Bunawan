import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialApplications, jobs as sampleJobs, employers as sampleEmployers, DEMO_ACCOUNTS } from '../data/mockData';
import { KEYS, loadData, saveData, removeData } from '../services/storage';
import { hashPassword } from '../utils/hash';

const AppContext = createContext(null);
const SEED_VERSION = 2;   // bump when the sample data changes so older installs receive the new samples

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);          // true after data is loaded from AsyncStorage
  const [user, setUserState] = useState(null);        // logged-in user: role is 'jobseeker' or 'employer'
  const [profiles, setProfiles] = useState({});       // email -> profile (keeps edits after logout)
  const [credentials, setCredentials] = useState({}); // email -> password hash (registered accounts only)
  const [savedIds, setSavedIds] = useState([1]);      // saved job ids
  const [applications, setApplications] = useState(initialApplications);
  const [jobs, setJobs] = useState(sampleJobs);       // sample jobs + jobs posted by employers
  const [reports, setReports] = useState([]);         // applicant reports filed by employers
  const [seenWelcome, setSeenWelcome] = useState(false);

  // READ: load everything saved on the device when the app starts
  useEffect(() => {
    let alive = true;
    (async () => {
      const [u, pr, cr, s, a, jb, oldPosts, rp, sw, sv] = await Promise.all([
        loadData(KEYS.user, null),
        loadData(KEYS.profiles, {}),
        loadData(KEYS.credentials, {}),
        loadData(KEYS.savedIds, [1]),
        loadData(KEYS.applications, initialApplications),
        loadData(KEYS.jobs, null),
        loadData(KEYS.postedJobs, []),     // older versions saved employer posts here
        loadData(KEYS.reports, []),
        loadData(KEYS.seenWelcome, false),
        loadData(KEYS.seedVersion, 0),
      ]);
      if (!alive) return;
      // older installs: add the new sample applicants once, and move old employer posts into the jobs list
      const apps = sv < SEED_VERSION ? [...a, ...initialApplications.filter((x) => !a.some((y) => y.id === x.id))] : a;
      setUserState(u); setProfiles(pr); setCredentials(cr); setSavedIds(s); setApplications(apps);
      setJobs(jb || [...oldPosts, ...sampleJobs]); setReports(rp); setSeenWelcome(sw);
      setReady(true);
    })();
    return () => { alive = false; };
  }, []);

  // CREATE / UPDATE / DELETE: every change is saved automatically
  useEffect(() => { if (ready) saveData(KEYS.user, user); }, [user, ready]);
  useEffect(() => { if (ready) saveData(KEYS.profiles, profiles); }, [profiles, ready]);
  useEffect(() => { if (ready) saveData(KEYS.credentials, credentials); }, [credentials, ready]);
  useEffect(() => { if (ready) saveData(KEYS.savedIds, savedIds); }, [savedIds, ready]);
  useEffect(() => { if (ready) saveData(KEYS.applications, applications); }, [applications, ready]);
  useEffect(() => { if (ready) saveData(KEYS.jobs, jobs); }, [jobs, ready]);
  useEffect(() => { if (ready) saveData(KEYS.reports, reports); }, [reports, ready]);
  useEffect(() => { if (ready) saveData(KEYS.seenWelcome, seenWelcome); }, [seenWelcome, ready]);
  useEffect(() => { if (ready) saveData(KEYS.seedVersion, SEED_VERSION); }, [ready]);

  // ---- auth: the account decides the role, so login sends you to the job seeker or employer side ----
  const keyOf = (email) => email.trim().toLowerCase();

  const login = (email, password) => {
    const key = keyOf(email);
    const demo = DEMO_ACCOUNTS.find((d) => d.profile.email === key);
    if (demo) {
      if (demo.password !== password) return { ok: false, error: 'Wrong email or password' };
      setUserState(profiles[key] || demo.profile);
      return { ok: true };
    }
    if (!credentials[key] || credentials[key] !== hashPassword(password)) {
      return { ok: false, error: 'Wrong email or password' };
    }
    setUserState(profiles[key]);
    return { ok: true };
  };

  const register = ({ password, ...fields }) => {
    const key = keyOf(fields.email);
    if (DEMO_ACCOUNTS.some((d) => d.profile.email === key) || credentials[key]) {
      return { ok: false, error: 'This email is already registered. Log in instead.' };
    }
    const profile = { ...fields, email: fields.email.trim() };
    setCredentials((c) => ({ ...c, [key]: hashPassword(password) }));
    setProfiles((p) => ({ ...p, [key]: profile }));
    setUserState(profile);
    return { ok: true };
  };

  const setUser = (u) => setUserState(u);   // setUser(null) = log out
  const updateUser = (patch) => {
    const next = { ...user, ...patch };
    setUserState(next);
    setProfiles((p) => ({ ...p, [keyOf(next.email)]: next }));
  };
  const isEmployer = user?.role === 'employer';
  // the demo employer owns a sample employer (employerId); new employers get their own id
  const myEmployerId = user ? (user.employerId ?? `own-${user.email}`) : null;

  // ---- jobs ----
  const allJobs = jobs.filter((j) => !j.closed);           // what job seekers can see and apply to
  const findJob = (id) => jobs.find((j) => j.id === id);   // also finds closed jobs (old applications)
  const findEmployer = (id) => {
    const found = sampleEmployers.find((e) => e.id === id) || jobs.find((j) => j.employerId === id)?.employer;
    if (found) return { ...found, id };
    if (user && id === myEmployerId) {
      return { id, name: user.name, type: 'Local Employer', verified: 'Local Employer', about: `${user.name} posts jobs in Bunawan, Agusan del Sur.`, address: 'Bunawan, Agusan del Sur', barangay: user.barangay, landmark: '', contact: user.name, position: 'Employer', phone: user.phone };
    }
    return undefined;
  };

  // ---- saved jobs ----
  const toggleSaved = (jobId) =>
    setSavedIds((cur) => (cur.includes(jobId) ? cur.filter((i) => i !== jobId) : [...cur, jobId]));
  const clearSaved = () => setSavedIds([]);

  // ---- employer job posts (CRUD) ----
  const addPost = (job) => setJobs((cur) => [job, ...cur]);
  const updatePost = (id, patch) => setJobs((cur) => cur.map((j) => (j.id === id ? { ...j, ...patch } : j)));
  const deletePost = (id) => {
    setJobs((cur) => cur.filter((j) => j.id !== id));
    setSavedIds((cur) => cur.filter((i) => i !== id));
  };
  const toggleJobClosed = (id) => setJobs((cur) => cur.map((j) => (j.id === id ? { ...j, closed: !j.closed } : j)));
  const duplicatePost = (id) => {
    const src = jobs.find((j) => j.id === id);
    if (!src) return;
    setJobs((cur) => [{ ...src, id: 'p' + Date.now(), title: `${src.title} (copy)`, closed: false, featured: false, posted: true }, ...cur]);
  };

  // ---- applications ----
  const mine = (a) => !a.applicantEmail || a.applicantEmail.toLowerCase() === user?.email?.toLowerCase();
  const myApplications = user ? applications.filter(mine) : [];   // job seeker: only my own
  const hasApplied = (jobId) => myApplications.some((a) => a.jobId === jobId && a.status !== 'withdrawn');
  const addApplication = ({ jobId, name, phone, message }) => {
    const id = Date.now();
    setApplications((cur) => [{ id, jobId, name, phone, message, applicantEmail: user?.email, status: 'pending', appliedAt: new Date().toISOString().slice(0, 10) }, ...cur]);
    return id;
  };
  const updateApplication = (id, patch) =>
    setApplications((cur) => cur.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  const withdrawApplication = (id) => updateApplication(id, { status: 'withdrawn' });
  const deleteApplication = (id) => setApplications((cur) => cur.filter((a) => a.id !== id));

  // ---- employer side: my jobs and the applicants of my jobs ----
  const myJobs = isEmployer ? jobs.filter((j) => j.employerId === myEmployerId) : [];
  const myJobIds = myJobs.map((j) => j.id);
  const employerApplications = applications
    .filter((a) => myJobIds.includes(a.jobId))
    .sort((a, b) => (b.appliedAt || '').localeCompare(a.appliedAt || '') || b.id - a.id);
  const setApplicationStatus = (id, status) => updateApplication(id, { status });

  // ---- employer reports an applicant (the admin side of the website reviews these later) ----
  const hasReported = (applicationId) => reports.some((r) => r.applicationId === applicationId && r.reporterEmail === user?.email);
  const addReport = ({ applicationId, reason, note }) => {
    const app = applications.find((a) => a.id === applicationId);
    setReports((cur) => [{ id: Date.now(), applicationId, jobId: app?.jobId, applicantName: app?.name, applicantEmail: app?.applicantEmail, reason, note, reporterEmail: user?.email, status: 'open', createdAt: new Date().toISOString().slice(0, 10) }, ...cur]);
  };

  // ---- downloaded data (API cache) ----
  const clearCache = () => removeData(KEYS.barangays);

  return (
    <AppContext.Provider
      value={{
        ready, seenWelcome, setSeenWelcome, user, setUser, updateUser, login, register, isEmployer, myEmployerId,
        jobs, allJobs, findJob, findEmployer, addPost, updatePost, deletePost, toggleJobClosed, duplicatePost,
        savedIds, toggleSaved, clearSaved, clearCache,
        applications, myApplications, hasApplied, addApplication, updateApplication, withdrawApplication, deleteApplication,
        myJobs, employerApplications, setApplicationStatus, reports, hasReported, addReport,
      }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
