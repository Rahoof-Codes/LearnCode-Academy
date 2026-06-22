"use client";

import { useParams, useRouter } from "next/navigation";
import { useApp } from "../../../lib/db";
import { 
  Clock, Award, CheckCircle2, Circle, ChevronDown, 
  ChevronUp, BookOpen, List, Target, Play 
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function CourseDetail() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.courseId as string;

  const { courses, user, enrollInCourse } = useApp();
  const course = courses.find((c) => c.id === courseId);

  // Accordion state (open all modules by default)
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({
    "html-intro": true,
    "html-forms": true,
    "css-box-model": true,
    "css-layouts": true,
    "js-fundamentals": true,
    "js-async": true,
  });

  const toggleModule = (moduleId: string) => {
    setOpenModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  if (!course) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-background text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Course Not Found</h2>
        <p className="text-slate-400 mb-6">The course you are looking for does not exist or has been removed.</p>
        <Link href="/catalog" className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const enrolled = user?.enrolledCourses.includes(course.id) || false;

  // Calculate stats
  const totalLessons = course.modules.flatMap(m => m.lessons);
  const totalLessonsCount = totalLessons.length;
  const completedLessons = totalLessons.filter(l => user?.completedLessons.includes(l.id)).length;
  const progressPercent = totalLessonsCount > 0 ? Math.round((completedLessons / totalLessonsCount) * 100) : 0;

  // Find first incomplete lesson to start/resume
  const getNextLessonLink = () => {
    const nextLesson = totalLessons.find(l => !user?.completedLessons.includes(l.id));
    const targetId = nextLesson ? nextLesson.id : totalLessons[0]?.id;
    return `/courses/${course.id}/lessons/${targetId}`;
  };

  const handleEnroll = async () => {
    await enrollInCourse(course.id);
    // Push directly into the first lesson
    const targetLink = getNextLessonLink();
    router.push(targetLink);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 w-full space-y-8">
      
      {/* Back to catalog */}
      <Link href="/catalog" className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1">
        &larr; Back to Catalog
      </Link>

      {/* Course Banner Block */}
      <div className="glass-panel relative overflow-hidden rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-indigo-500/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5 -z-10" />
        
        <div className="space-y-4 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold border uppercase tracking-wider ${
              course.difficulty === "Beginner" 
                ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                : course.difficulty === "Intermediate" 
                ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
            }`}>
              {course.difficulty}
            </span>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {course.duration}
            </span>
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {totalLessonsCount} lessons
            </span>
          </div>

          <h1 className="text-3xl font-extrabold text-white">{course.title}</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="w-full md:w-auto flex flex-col items-center gap-3">
          {enrolled ? (
            <div className="w-full space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-400">Course Progress</span>
                  <span className="text-indigo-400">{progressPercent}%</span>
                </div>
                <div className="h-2 w-full md:w-48 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
              <Link
                href={getNextLessonLink()}
                className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-blue-600 hover:bg-blue-500 px-6 py-3 font-bold text-white transition-all text-sm"
              >
                <Play className="h-4 w-4 fill-white" />
                Resume Learning
              </Link>
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              className="flex items-center justify-center w-full md:w-auto rounded-lg bg-blue-600 hover:bg-blue-500 px-8 py-3.5 font-bold text-white transition-all hover:scale-103 shadow-lg shadow-blue-500/20 text-sm cursor-pointer"
            >
              Enroll in Course
            </button>
          )}
        </div>
      </div>

      {/* Course Overview & Syllabus grid */}
      <div className="grid gap-8 md:grid-cols-3">
        
        {/* Left 2 Cols: Curriculum / Syllabus */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
            <List className="h-5.5 w-5.5 text-blue-400" />
            Course Curriculum
          </h2>

          <div className="space-y-4">
            {course.modules.map((module) => {
              const isOpen = openModules[module.id] ?? true;
              return (
                <div key={module.id} className="glass-panel rounded-xl overflow-hidden">
                  {/* Module header */}
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="w-full flex items-center justify-between p-4 bg-slate-900/40 border-b border-white/5 text-left font-bold text-sm text-white"
                  >
                    <span>{module.title}</span>
                    {isOpen ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
                  </button>

                  {/* Module Lessons list */}
                  {isOpen && (
                    <div className="divide-y divide-white/5">
                      {module.lessons.map((lesson) => {
                        const isDone = user?.completedLessons.includes(lesson.id) || false;
                        return (
                          <div 
                            key={lesson.id}
                            className="p-4 flex items-center justify-between gap-4 text-xs"
                          >
                            <div className="flex items-center gap-3">
                              {isDone ? (
                                <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />
                              ) : (
                                <Circle className="h-4.5 w-4.5 text-slate-600 shrink-0" />
                              )}
                              <div className="space-y-0.5">
                                {enrolled ? (
                                  <Link
                                    href={`/courses/${course.id}/lessons/${lesson.id}`}
                                    className="font-bold text-slate-200 hover:text-blue-400 hover:underline transition-colors block text-sm"
                                  >
                                    {lesson.title}
                                  </Link>
                                ) : (
                                  <span className="font-bold text-slate-400 text-sm">
                                    {lesson.title}
                                  </span>
                                )}
                                <div className="flex items-center gap-2 text-slate-500 font-medium">
                                  <span>{lesson.duration}</span>
                                  <span>&bull;</span>
                                  <span className="text-blue-400 font-semibold">+{lesson.xp} XP</span>
                                </div>
                              </div>
                            </div>

                            {enrolled && (
                              <Link
                                href={`/courses/${course.id}/lessons/${lesson.id}`}
                                className="rounded bg-slate-900 hover:bg-slate-800 p-2 border border-white/5 transition-all text-slate-300 hover:text-white"
                              >
                                <Play className="h-3 w-3 fill-slate-300" />
                              </Link>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Learning Objectives / Info */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <Target className="h-5 w-5 text-indigo-400" />
              What you will learn
            </h3>
            
            <ul className="space-y-3">
              {course.objectives.map((obj, i) => (
                <li key={i} className="flex gap-2.5 items-start text-xs text-slate-300 leading-relaxed">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-xl space-y-4 text-xs text-slate-400">
            <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-white/5 pb-2">
              <Award className="h-5 w-5 text-amber-500" />
              Certificate Requirements
            </h3>
            <p className="leading-relaxed">
              Complete every text reading and scoring 100% on the lesson quizzes to successfully graduate from the course.
            </p>
            <p className="leading-relaxed">
              Once complete, a unique cryptographic certificate hash will be generated under your student profile which you can download and print.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
