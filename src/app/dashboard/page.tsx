"use client";

import Link from "next/link";
import { useApp, getLevelInfo, achievementsList } from "../../lib/db";
import { 
  Flame, Award, BookOpen, Clock, Play, 
  ChevronRight, Calendar, Bookmark, FileText, CheckCircle 
} from "lucide-react";
import { Course } from "../../data/coursesData";

export default function Dashboard() {
  const { user, courses, resetProgress } = useApp();

  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-background">
        <div className="glass-panel p-8 text-center rounded-xl max-w-md w-full border border-zinc-800 shadow-xl">
          <BookOpen className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Active Session</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Please make sure you are running in Demo Mode or authenticated.
          </p>
          <Link
            href="/"
            className="inline-flex w-full justify-center rounded-lg bg-cyan-500 px-4 py-2.5 font-semibold text-zinc-950 hover:bg-cyan-400 transition-all"
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
              <h1 className="text-3xl font-extrabold tracking-tight text-white">
                Welcome back, <span className="text-gradient-primary">{user.name}</span>
              </h1>
              <p className="text-zinc-400 text-sm">
                Track your active courses, complete exercises, and earn tech credentials.
              </p>
            </div>
            <button
              onClick={() => {
                if (confirm("Are you sure you want to reset all progress, XP, and certificates?")) {
                  resetProgress();
                }
              }}
              className="mt-4 md:mt-0 self-start text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 rounded-md px-3 py-1.5 transition-all"
            >
              Reset Progress
            </button>
          </div>

          {/* Active Courses grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Bookmark className="h-5 w-5 text-cyan-400" />
                Active Enrollments ({enrolledCourses.length})
              </h2>
              <Link href="/catalog" className="text-xs font-semibold text-cyan-400 hover:underline flex items-center">
                Explore Catalog <ChevronRight className="h-3 w-3" />
              </Link>
            </div>

            {enrolledCourses.length === 0 ? (
              <div className="glass-panel p-8 rounded-xl text-center">
                <p className="text-zinc-400 text-sm mb-4">You are not enrolled in any courses yet.</p>
                <Link
                  href="/catalog"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-2 font-semibold text-zinc-950 hover:bg-cyan-400 transition-all text-xs"
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
                      className="glass-panel p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold border ${
                            course.difficulty === "Beginner" 
                              ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" 
                              : course.difficulty === "Intermediate" 
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                          }`}>
                            {course.difficulty}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {course.duration}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white">{course.title}</h3>
                        
                        {/* Progress bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-zinc-400">Course Progress</span>
                            <span className="text-cyan-400">{progress}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href={`/courses/${course.id}`}
                          className="rounded-lg bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-xs font-semibold text-white border border-zinc-700/50 transition-all text-center"
                        >
                          Course Syllabus
                        </Link>
                        
                        {progress === 100 ? (
                          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-xs rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2">
                            <CheckCircle className="h-4 w-4 fill-emerald-500/10" />
                            Completed
                          </div>
                        ) : (
                          <Link
                            href={resumeLink}
                            className="flex items-center justify-center gap-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 px-4.5 py-2 text-xs font-bold text-zinc-950 transition-all shadow-md shadow-cyan-500/15"
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
            <div className="glass-panel p-4 rounded-xl text-center">
              <span className="text-xs font-semibold text-zinc-400 block mb-1">Enrolled</span>
              <span className="text-2xl font-extrabold text-white">{user.enrolledCourses.length}</span>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <span className="text-xs font-semibold text-zinc-400 block mb-1">XP Earned</span>
              <span className="text-2xl font-extrabold text-cyan-400">{user.xp}</span>
            </div>
            <div className="glass-panel p-4 rounded-xl text-center">
              <span className="text-xs font-semibold text-zinc-400 block mb-1">Certificates</span>
              <span className="text-2xl font-extrabold text-emerald-400">{user.certificates.length}</span>
            </div>
          </div>
        </div>

        {/* ================= RIGHT 1 COLUMN: GAMIFICATION (LEVEL, STREAK, ACHIEVEMENTS, CERTIFICATES) ================= */}
        <div className="space-y-8">
          
          {/* Level Tracker Card */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-1.5">
              <Award className="h-5 w-5 text-cyan-400" />
              Level Progression
            </h3>
            
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-cyan-400 font-extrabold text-xl text-zinc-950 shadow-lg border border-white/10">
                {levelInfo.level}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-cyan-300">Level {levelInfo.level}</span>
                  <span className="font-semibold text-zinc-400">{levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel} XP</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden border border-zinc-700/50">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
                    style={{ width: `${levelInfo.progressPercentage}%` }}
                  />
                </div>
                <span className="text-2xs text-zinc-500 block">
                  {levelInfo.xpNeededForNextLevel - levelInfo.xpInCurrentLevel} XP required to level up.
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/80 text-sm">
              <span className="text-zinc-400 flex items-center gap-1.5">
                <Flame className="h-4.5 w-4.5 text-orange-500" /> Current Streak:
              </span>
              <span className="font-extrabold text-orange-500">{user.streak} Days</span>
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-1.5">
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
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg border transition-all ${
                      isUnlocked 
                        ? "bg-amber-500/10 border-amber-500/25 text-amber-400" 
                        : "bg-slate-900/30 border-white/5 text-slate-600 opacity-60"
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
              <Link href="/profile" className="text-xs font-semibold text-cyan-400 hover:underline">
                View All Achievements
              </Link>
            </div>
          </div>

          {/* Certificates Hub Summary */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-1.5">
              <FileText className="h-5 w-5 text-emerald-400" />
              Certificates Portal ({user.certificates.length})
            </h3>

            {user.certificates.length === 0 ? (
              <p className="text-xs text-zinc-500 leading-relaxed">
                Graduate from any course by completing all lessons and scoring 100% on the quizzes to issue a digital certificate.
              </p>
            ) : (
              <div className="space-y-2">
                {user.certificates.map((cert) => (
                  <Link 
                    key={cert.id}
                    href="/profile"
                    className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white line-clamp-1">{cert.courseName}</span>
                      <span className="text-3xs text-zinc-400">ID: {cert.id}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-emerald-400" />
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
