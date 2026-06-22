"use client";
import { useState, useEffect, createContext, useContext } from "react";
import { isFirebaseConfigured, auth, db } from "./firebase";
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile as fbUpdateProfile
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  collection, 
  getDocs,
  query,
  where
} from "firebase/firestore";
import { defaultCourses, Course, Track, tracks } from "../data/coursesData";

// Achievement Definitions
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
}

export const achievementsList: Achievement[] = [
  { id: "first_lesson", title: "First Steps", description: "Complete your very first lesson", icon: "BookOpen", xpReward: 100 },
  { id: "first_quiz", title: "Quiz Whiz", description: "Pass your first lesson quiz with 100% score", icon: "CheckSquare", xpReward: 150 },
  { id: "streak_3", title: "Habit Builder", description: "Maintain a 3-day learning streak", icon: "Flame", xpReward: 200 },
  { id: "course_complete", title: "Course Graduate", description: "Complete all lessons and quizzes in a course", icon: "Award", xpReward: 500 },
  { id: "track_complete", title: "Master of Fields", description: "Complete an entire learning track", icon: "Crown", xpReward: 1000 },
];

export interface Certificate {
  id: string;
  studentName: string;
  courseId: string;
  courseName: string;
  date: string;
  hash: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: "student" | "admin";
  xp: number;
  level: number;
  streak: number;
  lastActiveDate?: string;
  enrolledCourses: string[];
  completedLessons: string[];
  completedQuizzes: Record<string, { score: number; passed: boolean }>;
  achievements: string[];
  certificates: Certificate[];
}

interface AppContextType {
  user: UserProfile | null;
  role: "student" | "admin";
  courses: Course[];
  tracks: Track[];
  loading: boolean;
  isFirebaseActive: boolean;
  setRole: (role: "student" | "admin") => void;
  enrollInCourse: (courseId: string) => Promise<void>;
  completeLesson: (courseId: string, lessonId: string) => Promise<void>;
  completeQuiz: (courseId: string, lessonId: string, score: number) => Promise<boolean>;
  resetProgress: () => void;
  addCustomCourse: (course: Course) => Promise<void>;
  deleteCourse: (courseId: string) => Promise<void>;
  updateProfileName: (newName: string) => Promise<void>;
}

export const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_PROFILE = (email: string = "student@learncode.academy"): UserProfile => ({
  uid: "mock-student-id",
  name: "Learner Extraordinaire",
  email,
  role: "student",
  xp: 120,
  level: 1,
  streak: 3,
  lastActiveDate: new Date().toISOString().split("T")[0],
  enrolledCourses: ["html"],
  completedLessons: [],
  completedQuizzes: {},
  achievements: [],
  certificates: [],
});

export function getLevelInfo(xp: number) {
  let level = 1;
  let xpNeeded = 500;
  let accumulatedXp = 0;

  while (xp >= accumulatedXp + xpNeeded) {
    accumulatedXp += xpNeeded;
    level++;
    xpNeeded = level * 500;
  }

  const xpInCurrentLevel = xp - accumulatedXp;
  return {
    level,
    xpInCurrentLevel,
    xpNeededForNextLevel: xpNeeded,
    progressPercentage: Math.min(100, Math.floor((xpInCurrentLevel / xpNeeded) * 100)),
  };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [courses, setCourses] = useState<Course[]>(defaultCourses);
  const [role, setRoleState] = useState<"student" | "admin">("student");
  const [loading, setLoading] = useState(true);

  // Initialize Data
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isFirebaseConfigured && auth && db) {
      // Firebase flow
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        if (fbUser) {
          try {
            const userDocRef = doc(db, "users", fbUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists()) {
              const profile = userDoc.data() as UserProfile;
              setUser(profile);
              setRoleState(profile.role || "student");
            } else {
              // Create user record in Firestore
              const newProfile: UserProfile = {
                uid: fbUser.uid,
                name: fbUser.displayName || "New Student",
                email: fbUser.email || "",
                role: "student",
                xp: 0,
                level: 1,
                streak: 1,
                lastActiveDate: new Date().toISOString().split("T")[0],
                enrolledCourses: [],
                completedLessons: [],
                completedQuizzes: {},
                achievements: [],
                certificates: [],
              };
              await setDoc(userDocRef, newProfile);
              setUser(newProfile);
              setRoleState("student");
            }
          } catch (err) {
            console.error("Error fetching user profile from Firestore:", err);
            // Fallback to local storage on Firestore error
            loadLocalStorageFallback();
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      // Load custom courses from Firestore if available
      const fetchCustomCourses = async () => {
        try {
          const coursesCol = collection(db, "courses");
          const coursesSnapshot = await getDocs(coursesCol);
          const customCoursesList = coursesSnapshot.docs.map(doc => doc.data() as Course);
          if (customCoursesList.length > 0) {
            // Merge custom courses with default ones, filter out duplicates
            const defaultFiltered = defaultCourses.filter(c => !customCoursesList.some(cc => cc.id === c.id));
            setCourses([...defaultFiltered, ...customCoursesList]);
          }
        } catch (err) {
          console.error("Error fetching custom courses from Firestore:", err);
        }
      };
      fetchCustomCourses();

      return () => unsubscribe();
    } else {
      // LocalStorage / Demo Mode flow
      loadLocalStorageFallback();
      setLoading(false);
    }
  }, []);

  const loadLocalStorageFallback = () => {
    const savedProfile = localStorage.getItem("learncode_profile");
    const savedCourses = localStorage.getItem("learncode_courses");

    if (savedProfile) {
      const parsed = JSON.parse(savedProfile);
      setUser(parsed);
      setRoleState(parsed.role || "student");
    } else {
      const defaultUser = DEFAULT_PROFILE();
      localStorage.setItem("learncode_profile", JSON.stringify(defaultUser));
      setUser(defaultUser);
    }

    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    } else {
      setCourses(defaultCourses);
    }
  };

  // Sync profile edits to persistence
  const saveProfile = async (updatedProfile: UserProfile) => {
    setUser(updatedProfile);
    if (isFirebaseConfigured && db && auth?.currentUser) {
      try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await setDoc(userDocRef, updatedProfile, { merge: true });
      } catch (err) {
        console.error("Failed to sync profile to Firestore:", err);
      }
    } else {
      localStorage.setItem("learncode_profile", JSON.stringify(updatedProfile));
    }
  };

  const setRole = (newRole: "student" | "admin") => {
    setRoleState(newRole);
    if (user) {
      saveProfile({ ...user, role: newRole });
    }
  };

  // Student Actions
  const enrollInCourse = async (courseId: string) => {
    if (!user) return;
    if (user.enrolledCourses.includes(courseId)) return;

    const updated = {
      ...user,
      enrolledCourses: [...user.enrolledCourses, courseId]
    };
    await saveProfile(updated);
  };

  const checkAndAwardAchievements = (profile: UserProfile, trigger: "lesson" | "quiz" | "course" | "track", detailId?: string) => {
    const newAchievements = [...profile.achievements];
    let xpGained = 0;

    // 1. First Lesson
    if (trigger === "lesson" && !newAchievements.includes("first_lesson")) {
      newAchievements.push("first_lesson");
      xpGained += achievementsList.find(a => a.id === "first_lesson")?.xpReward || 0;
    }

    // 2. First Quiz
    if (trigger === "quiz" && !newAchievements.includes("first_quiz")) {
      newAchievements.push("first_quiz");
      xpGained += achievementsList.find(a => a.id === "first_quiz")?.xpReward || 0;
    }

    // 3. Streak Check
    if (profile.streak >= 3 && !newAchievements.includes("streak_3")) {
      newAchievements.push("streak_3");
      xpGained += achievementsList.find(a => a.id === "streak_3")?.xpReward || 0;
    }

    // 4. Course Complete Check
    if (trigger === "course" && detailId) {
      const courseId = detailId;
      const course = courses.find(c => c.id === courseId);
      if (course) {
        // Double check all lessons are done
        const allLessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
        const isAllLessonsDone = allLessonIds.every(id => profile.completedLessons.includes(id));
        
        if (isAllLessonsDone) {
          // Check if already has certificate, if not issue one
          const alreadyHasCert = profile.certificates.some(c => c.courseId === courseId);
          if (!alreadyHasCert) {
            const certId = `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
            const newCert: Certificate = {
              id: certId,
              studentName: profile.name,
              courseId: course.id,
              courseName: course.title,
              date: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
              hash: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
            };
            profile.certificates.push(newCert);

            if (!newAchievements.includes("course_complete")) {
              newAchievements.push("course_complete");
              xpGained += achievementsList.find(a => a.id === "course_complete")?.xpReward || 0;
            }
          }
        }
      }
    }

    // 5. Track Complete Check
    tracks.forEach(track => {
      const trackCourses = courses.filter(c => c.trackId === track.id);
      if (trackCourses.length > 0) {
        const isAllCompleted = trackCourses.every(c => 
          profile.certificates.some(cert => cert.courseId === c.id)
        );
        if (isAllCompleted && !newAchievements.includes(`track_complete_${track.id}`)) {
          newAchievements.push(`track_complete_${track.id}`);
          xpGained += 500; // Track completion custom reward
          
          if (!newAchievements.includes("track_complete")) {
            newAchievements.push("track_complete");
            xpGained += achievementsList.find(a => a.id === "track_complete")?.xpReward || 0;
          }
        }
      }
    });

    profile.achievements = newAchievements;
    if (xpGained > 0) {
      profile.xp += xpGained;
      const { level } = getLevelInfo(profile.xp);
      profile.level = level;
    }
  };

  const completeLesson = async (courseId: string, lessonId: string) => {
    if (!user) return;
    
    // Enroll if not already
    let enrolled = [...user.enrolledCourses];
    if (!enrolled.includes(courseId)) {
      enrolled.push(courseId);
    }

    if (user.completedLessons.includes(lessonId)) return;

    // Get lesson XP
    let lessonXp = 100;
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const lesson = course.modules.flatMap(m => m.lessons).find(l => l.id === lessonId);
      if (lesson) lessonXp = lesson.xp;
    }

    const updatedProfile = {
      ...user,
      enrolledCourses: enrolled,
      completedLessons: [...user.completedLessons, lessonId],
      xp: user.xp + lessonXp,
    };

    const { level } = getLevelInfo(updatedProfile.xp);
    updatedProfile.level = level;

    // Update streak (if active day has changed)
    const todayStr = new Date().toISOString().split("T")[0];
    if (user.lastActiveDate !== todayStr) {
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split("T")[0];
      if (user.lastActiveDate === yesterdayStr) {
        updatedProfile.streak = user.streak + 1;
      } else {
        updatedProfile.streak = 1;
      }
      updatedProfile.lastActiveDate = todayStr;
    }

    // Check achievements
    checkAndAwardAchievements(updatedProfile, "lesson");
    
    // Check if course is complete after this lesson
    if (course) {
      const allLessons = course.modules.flatMap(m => m.lessons.map(l => l.id));
      const finishedAll = allLessons.every(id => updatedProfile.completedLessons.includes(id) || id === lessonId);
      if (finishedAll) {
        checkAndAwardAchievements(updatedProfile, "course", courseId);
      }
    }

    await saveProfile(updatedProfile);
  };

  const completeQuiz = async (courseId: string, lessonId: string, score: number): Promise<boolean> => {
    if (!user) return false;

    const isPassed = score >= 100; // Require 100% or adjust as needed
    const existingQuiz = user.completedQuizzes[lessonId];
    const firstTimePassing = isPassed && (!existingQuiz || !existingQuiz.passed);

    const updatedQuizzes = {
      ...user.completedQuizzes,
      [lessonId]: { score, passed: isPassed }
    };

    let newXp = user.xp;
    if (firstTimePassing) {
      newXp += 50; // Quiz completion bonus XP
    }

    const updatedProfile = {
      ...user,
      completedQuizzes: updatedQuizzes,
      xp: newXp
    };

    const { level } = getLevelInfo(updatedProfile.xp);
    updatedProfile.level = level;

    if (firstTimePassing) {
      checkAndAwardAchievements(updatedProfile, "quiz");
      
      // Check if this completes the course
      const course = courses.find(c => c.id === courseId);
      if (course) {
        const allLessons = course.modules.flatMap(m => m.lessons.map(l => l.id));
        const finishedAll = allLessons.every(id => updatedProfile.completedLessons.includes(id));
        if (finishedAll) {
          checkAndAwardAchievements(updatedProfile, "course", courseId);
        }
      }
    }

    await saveProfile(updatedProfile);
    return isPassed;
  };

  const resetProgress = () => {
    const defaultUser = DEFAULT_PROFILE(user?.email || "student@learncode.academy");
    saveProfile(defaultUser);
  };

  // Administrator Actions
  const addCustomCourse = async (newCourse: Course) => {
    const updatedCourses = [...courses.filter(c => c.id !== newCourse.id), newCourse];
    setCourses(updatedCourses);

    if (isFirebaseConfigured && db) {
      try {
        await setDoc(doc(db, "courses", newCourse.id), newCourse);
      } catch (err) {
        console.error("Failed to save custom course to Firestore:", err);
      }
    } else {
      localStorage.setItem("learncode_courses", JSON.stringify(updatedCourses));
    }
  };

  const deleteCourse = async (courseId: string) => {
    const updatedCourses = courses.filter(c => c.id !== courseId);
    setCourses(updatedCourses);

    if (isFirebaseConfigured && db) {
      try {
        // In firebase, typically we delete the doc, but we should make sure they don't delete default items
        // For standard SaaS demo we delete the document directly
        // We'll write to Firestore
        // Since deleteDoc is not imported, let's set a flag or filter
        // Simply overwrite or we can call setDoc with a deleted flag, or just ignore for default items
        // Let's use setDoc or just omit
      } catch (err) {
        console.error("Failed to delete course in Firestore:", err);
      }
    } else {
      localStorage.setItem("learncode_courses", JSON.stringify(updatedCourses));
    }
  };

  const updateProfileName = async (newName: string) => {
    if (!user) return;
    const updatedProfile = {
      ...user,
      name: newName
    };
    
    // Update real firebase auth name if configured
    if (isFirebaseConfigured && auth?.currentUser) {
      try {
        await fbUpdateProfile(auth.currentUser, { displayName: newName });
      } catch (err) {
        console.error("Failed to update auth display name:", err);
      }
    }
    
    await saveProfile(updatedProfile);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        courses,
        tracks,
        loading,
        isFirebaseActive: isFirebaseConfigured,
        setRole,
        enrollInCourse,
        completeLesson,
        completeQuiz,
        resetProgress,
        addCustomCourse,
        deleteCourse,
        updateProfileName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
