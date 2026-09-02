import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User,
  browserLocalPersistence,
  setPersistence,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, ResumeAnalysis, FinalInterviewReport, PracticeTestReport } from '../types';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // Always prompt user to pick their Gmail/Google account (essential for multi-user system)
});

// Set local persistence so user stays logged in
try {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn("Firebase persistence error:", err);
  });
} catch (e) {
  // Ignore in SSR/unsupported envs
}

// -------------------------------------------------------------
// Google / Gmail Sign In
// -------------------------------------------------------------
export async function signInWithGoogle(): Promise<UserProfile> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const userProfile: UserProfile = {
      id: user.uid,
      name: user.displayName || user.email?.split('@')[0] || 'Candidate',
      email: user.email || 'user@gmail.com',
      avatarUrl: user.photoURL || undefined,
      collegeOrCompany: 'Computer Science & Engineering',
      experienceLevel: 'Entry Level / Fresher',
      roleTitle: 'Software Engineer',
    };

    // Store/merge user profile document in Firestore
    await saveUserProfileToFirestore(userProfile);
    saveAccountToRecentList(userProfile);

    return userProfile;
  } catch (error: any) {
    if (error?.code === 'auth/popup-closed-by-user' || error?.code === 'auth/cancelled-popup-request') {
      console.warn("Google Sign-In popup was dismissed by user.");
    } else {
      console.error("Google Sign-In Error:", error);
    }
    throw error;
  }
}

// Sign out
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

// -------------------------------------------------------------
// Multi-User Accounts Local Cache (for fast account switching)
// -------------------------------------------------------------
const RECENT_ACCOUNTS_KEY = 'ai_mock_coach_recent_accounts';

export function getRecentAccounts(): UserProfile[] {
  try {
    const raw = localStorage.getItem(RECENT_ACCOUNTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAccountToRecentList(profile: UserProfile): void {
  try {
    const existing = getRecentAccounts().filter(a => a.email !== profile.email);
    const updated = [profile, ...existing].slice(0, 6);
    localStorage.setItem(RECENT_ACCOUNTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to update recent accounts:", e);
  }
}

export function removeAccountFromRecentList(email: string): void {
  try {
    const updated = getRecentAccounts().filter(a => a.email !== email);
    localStorage.setItem(RECENT_ACCOUNTS_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("Failed to remove account:", e);
  }
}

// -------------------------------------------------------------
// Firestore Helpers for User Profile
// -------------------------------------------------------------
export async function saveUserProfileToFirestore(profile: UserProfile): Promise<void> {
  try {
    if (!profile.id) return;
    const userRef = doc(db, 'users', profile.id);
    await setDoc(userRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (err) {
    console.warn("Firestore saveUserProfile error (offline fallback active):", err);
  }
}

export async function getUserProfileFromFirestore(userId: string): Promise<UserProfile | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.warn("Firestore getUserProfile error:", err);
    return null;
  }
}

// -------------------------------------------------------------
// Firestore Helpers for Resume Analysis Persistence
// -------------------------------------------------------------
export async function saveResumeAnalysisToFirestore(userId: string, analysis: ResumeAnalysis): Promise<void> {
  try {
    if (!userId) return;
    // Save to user sub-collection
    const resumeRef = doc(db, 'users', userId, 'resumes', 'latest');
    await setDoc(resumeRef, {
      ...analysis,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Firestore saveResumeAnalysis error:", err);
  }
}

export async function getLatestResumeAnalysisFromFirestore(userId: string): Promise<ResumeAnalysis | null> {
  try {
    if (!userId) return null;
    const resumeRef = doc(db, 'users', userId, 'resumes', 'latest');
    const snap = await getDoc(resumeRef);
    if (snap.exists()) {
      return snap.data() as ResumeAnalysis;
    }
    return null;
  } catch (err) {
    console.warn("Firestore getLatestResumeAnalysis error:", err);
    return null;
  }
}

// -------------------------------------------------------------
// Firestore Helpers for Mock Interview Reports Persistence
// -------------------------------------------------------------
export async function saveInterviewReportToFirestore(userId: string, report: FinalInterviewReport): Promise<void> {
  try {
    if (!userId || !report?.id) return;
    const reportRef = doc(db, 'users', userId, 'interview_reports', report.id);
    await setDoc(reportRef, {
      ...report,
      savedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Firestore saveInterviewReport error:", err);
  }
}

export async function getUserInterviewReportsFromFirestore(userId: string): Promise<FinalInterviewReport[]> {
  try {
    if (!userId) return [];
    const reportsCol = collection(db, 'users', userId, 'interview_reports');
    const q = query(reportsCol, limit(20));
    const snap = await getDocs(q);
    const reports: FinalInterviewReport[] = [];
    snap.forEach((doc) => {
      reports.push(doc.data() as FinalInterviewReport);
    });
    // Sort newest first
    return reports.sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());
  } catch (err) {
    console.warn("Firestore getUserInterviewReports error:", err);
    return [];
  }
}

// -------------------------------------------------------------
// Firestore Helpers for Practice Test Reports Persistence
// -------------------------------------------------------------
export async function savePracticeReportToFirestore(userId: string, report: PracticeTestReport): Promise<void> {
  try {
    if (!userId || !report?.id) return;
    const reportRef = doc(db, 'users', userId, 'practice_reports', report.id);
    await setDoc(reportRef, {
      ...report,
      savedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Firestore savePracticeReport error:", err);
  }
}

export async function getUserPracticeReportsFromFirestore(userId: string): Promise<PracticeTestReport[]> {
  try {
    if (!userId) return [];
    const reportsCol = collection(db, 'users', userId, 'practice_reports');
    const q = query(reportsCol, limit(20));
    const snap = await getDocs(q);
    const reports: PracticeTestReport[] = [];
    snap.forEach((doc) => {
      reports.push(doc.data() as PracticeTestReport);
    });
    return reports.sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime());
  } catch (err) {
    console.warn("Firestore getUserPracticeReports error:", err);
    return [];
  }
}
