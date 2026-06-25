"use client";

import Link from "next/link";
import { useApp, getLevelInfo, achievementsList } from "../../lib/db";
import { 
  Flame, Award, BookOpen, Clock, Play, 
  ChevronRight, Calendar, Bookmark, FileText, CheckCircle 
} from "lucide-react";
import { Course } from "../../data/coursesData";

export default function Dashboard() {
  const { user, courses, resetProgress, loading } = useApp();

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <span className="text-indigo-400 text-sm font-semibold animate-pulse">Loading dashboard...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8">
        <div className="glass-panel-heavy p-8 text-center rounded-2xl max-w-md w-full shadow-xl">
          <BookOpen className="h-12 w-12 text-indigo-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-800 mb-2">No Active Session</h2>
          <p className="text-slate-400 text-sm mb-6">
            Please make sure you are authenticated.
          </p>
          <Link
            href="/"
            className="inline-flex w-full justify-center rounded-xl btn-gradient px-4 py-3 font-semibold text-sm shadow-lg shadow-indigo-500/15"
          >
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const levelInfo = getLevelInfo(user.xp);

  // Enrolled courses list
  const enrolledCourses = courses.filter((c) => user.enrolledCourses.includes(c.id));

  // Compute course progress stats
  const getCourseProgress = (course: Course) => {
    const totalLessons = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    if (totalLessons.length === 0) return 0;
    const completed = totalLessons.filter((id) => user.completedLessons.includes(id)).length;
    return Math.round((completed / totalLessons.length) * 100);
  };

  // Find recent incomplete lesson to "Resume"
  const getResumeLink = (course: Course) => {
    const lessons = course.modules.flatMap((m) => m.lessons);
    const firstIncomplete = lessons.find((l) => !user.completedLessons.includes(l.id));
    const targetLessonId = firstIncomplete ? firstIncomplete.id : lessons[0]?.id;
    return `/courses/${course.id}/lessons/${targetLessonId}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 w-full">
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* ================= LEFT 2 COLUMNS: COURSE ENROLLMENTS & STATS ================= */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Greeting */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back, <span className="text-gradient-primary">{user.name}</span>
              </h1>
              <p className="text-slate-400 text-sm">
                Track your active courses, complete exercises, and earn tech credentials.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to reset all progress, XP, and certificates?")) {
                  resetProgress();
                }
              }}
              className="mt-4 md:mt-0 self-start text-xs font-semibold text-rose-500 bg-rose-50 hover:bg-rose-100 border border-rose-200/60 rounded-lg px-3 py-1.5 transition-all"
            >
              Reset Progress
            </button>
          </div>

          {/* Active Courses grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-indigo-100/60 pb-2">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-indigo-500" />
                Active Enrollments ({enrolledCourses.length})
              </h2>
              <Link href="/catalog" className="text-xs font-semibold text-indigo-500 hover:underline flex items-center">
                Explore Catalog <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="glass-panel p-8 rounded-2xl text-center">
                <p className="text-slate-400 text-sm mb-4">You are not enrolled in any courses yet.</p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1.5 rounded-xl btn-gradient px-5 py-2.5 text-xs shadow-md shadow-indigo-500/15"
                >
                  Browse Course Catalog
                  <ChevronRight className="h-4.5 w-4.5" />
                </Link>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-1">
                {enrolledCourses.map((course) => {
                  const progress = getCourseProgress(course);
                  const resumeLink = getResumeLink(course);
                  return (
                    <div 
                      key={course.id}
                      className="glass-panel p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-lg hover:shadow-indigo-500/5 transition-all"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                            course.difficulty === "Beginner" 
                              ? "bg-indigo-50 text-indigo-600 border-indigo-200/50" 
                              : course.difficulty === "Intermediate" 
                              ? "bg-amber-50 text-amber-600 border-amber-200/50"
                              : "bg-rose-50 text-rose-600 border-rose-200/50"
                          }`}>
                            {course.difficulty}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {course.duration}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-800">{course.title}</h3>
                        
                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-400">Course Progress</span>
                            <span className="text-indigo-600 font-bold">{progress}%</span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-indigo-100 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-500"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/courses/${course.id}`}
                          className="rounded-xl bg-white hover:bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-600 border border-slate-200/80 transition-all text-center shadow-sm"
                        >
                          Course Syllabus
                        </Link>
                        
                        {progress === 100 ? (
                          <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs rounded-xl bg-emerald-50 border border-emerald-200/50 px-4 py-2.5">
                            <CheckCircle className="h-4 w-4" />
                            Completed
                          </div>
                        ) : (
                          <Link
                            href={resumeLink}
                            className="flex items-center justify-center gap-1 rounded-xl btn-gradient px-5 py-2.5 text-xs shadow-md shadow-indigo-500/15"
                          >
                            <Play className="h-3.5 w-3.5 fill-white" />
                            {progress > 0 ? "Resume" : "Start"}
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Stats Grid */}
          <div className="grid gap-4 grid-cols-3">
            <div className="glass-panel p-5 rounded-2xl text-center hover:shadow-lg hover:shadow-indigo-500/5 transition-all">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Enrolled</span>
              <span className="text-2xl font-extrabold text-slate-800">{user.enrolledCourses.length}</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl text-center hover:shadow-lg hover:shadow-violet-500/5 transition-all">
              <span className="text-xs font-semibold text-slate-400 block mb-1">XP Earned</span>
              <span className="text-2xl font-extrabold text-gradient-primary">{user.xp}</span>
            </div>
            <div className="glass-panel p-5 rounded-2xl text-center hover:shadow-lg hover:shadow-emerald-500/5 transition-all">
              <span className="text-xs font-semibold text-slate-400 block mb-1">Certificates</span>
              <span className="text-2xl font-extrabold text-emerald-500">{user.certificates.length}</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT 1 COLUMN: GAMIFICATION ================= */}
        <div className="space-y-8">
          
          {/* Level Tracker Card */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="h-5 w-5 text-indigo-500" />
              Level Progression
            </h3>
            
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 font-extrabold text-xl text-white shadow-xl shadow-indigo-500/20 border-3 border-white relative">
                {levelInfo.level}
                {/* Pulse ring */}
                <div className="absolute inset-0 rounded-full border-2 border-indigo-400 animate-pulse-ring" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-indigo-600">Level {levelInfo.level}</span>
                  <span className="font-semibold text-slate-400">{levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel} XP</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-indigo-100 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-all duration-500"
                    style={{ width: `${levelInfo.progressPercentage}%` }}
                  />
                </div>
                <span className="text-2xs text-slate-400 block">
                  {levelInfo.xpNeededForNextLevel - levelInfo.xpInCurrentLevel} XP required to level up.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-amber-50 p-3.5 rounded-xl border border-amber-200/50 text-sm">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Flame className="h-4.5 w-4.5 text-orange-500 fill-orange-500" /> Current Streak:
              </span>
              <span className="font-extrabold text-orange-500">{user.streak} Days 🔥</span>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="h-5 w-5 text-amber-500" />
              Earned Achievements ({user.achievements.length})
            </h3>
            
            <div className="grid grid-cols-4 gap-2">
              {achievementsList.map((ach) => {
                const isUnlocked = user.achievements.includes(ach.id);
                return (
                  <div 
                    key={ach.id} 
                    title={`${ach.title}: ${ach.description} (${ach.xpReward} XP)`}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all ${
                      isUnlocked 
                        ? "bg-amber-50 border-amber-200/50 text-amber-500 shadow-sm" 
                        : "bg-slate-50/50 border-slate-200/30 text-slate-300 opacity-50"
                    }`}
                  >
                    <Award className="h-6 w-6" />
                    <span className="text-3xs text-center font-bold tracking-tight mt-1 leading-none line-clamp-1">
                      {ach.title}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="text-center pt-2">
              <Link href="/profile" className="text-xs font-semibold text-indigo-500 hover:underline">
                View All Achievements
              </Link>
            </div>
          </div>

          {/* Certificates Hub Summary */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-md font-bold text-slate-800 flex items-center gap-1.5">
              <FileText className="h-5 w-5 text-emerald-500" />
              Certificates Portal ({user.certificates.length})
            </h3>

            {user.certificates.length === 0 ? (
              <p className="text-xs text-slate-400 leading-relaxed">
                Graduate from any course by completing all lessons and scoring 100% on the quizzes to issue a digital certificate.
              </p>
            ) : (
              <div className="space-y-2">
                {user.certificates.map((cert) => (
                  <Link 
                    key={cert.id}
                    href="/profile"
                    className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200/50 hover:bg-emerald-100/80 transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-800 line-clamp-1">{cert.courseName}</span>
                      <span className="text-3xs text-slate-400">ID: {cert.id}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-emerald-500" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
