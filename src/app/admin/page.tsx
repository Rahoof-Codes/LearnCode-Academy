"use client";

import { useState } from "react";
import { useApp } from "../../lib/db";
import { Course } from "../../data/coursesData";
import { 
  BarChart, Users, BookOpen, GraduationCap, CheckCircle, 
  Trash2, Plus, ArrowRight, ShieldCheck, AlertCircle 
} from "lucide-react";

export default function AdminDashboard() {
  const { role, courses, tracks, addCustomCourse, deleteCourse } = useApp();

  // CRUD Course Form States
  const [courseId, setCourseId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("web-dev");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [duration, setDuration] = useState("");
  const [objectives, setObjectives] = useState("");
  
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState("");

  if (role !== "admin") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-background text-center">
        <div className="glass-panel p-8 text-center rounded-xl max-w-md w-full border border-white/10 shadow-xl space-y-4">
          <AlertCircle className="h-12 w-12 text-rose-400 mx-auto" />
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-slate-400 text-sm">
            Administrator privileges required. Use the **Role Switcher** in the top navigation header to toggle Admin privileges.
          </p>
        </div>
      </div>
    );
  }

  // Mock analytics data
  const stats = [
    { label: "Total Registrants", value: "12,840", icon: Users, color: "text-blue-400" },
    { label: "Active Students", value: "3,120", icon: BookOpen, color: "text-purple-400" },
    { label: "Total Enrollments", value: "45,210", icon: GraduationCap, color: "text-emerald-400" },
    { label: "Course Completions", value: "8,940", icon: CheckCircle, color: "text-orange-400" },
  ];

  const mockUsers = [
    { name: "Alexander Mercer", email: "alex@mercer.dev", level: 6, xp: 2750, enrolled: 4, streak: 8 },
    { name: "Sofia Rodriguez", email: "sofia.r@data.io", level: 4, xp: 1820, enrolled: 3, streak: 5 },
    { name: "Ethan Chen", email: "echen@systems.org", level: 3, xp: 1400, enrolled: 2, streak: 12 },
    { name: "Aria Sterling", email: "aria@devops.cloud", level: 1, xp: 240, enrolled: 1, streak: 2 },
  ];

  // Submit Course Creator Form
  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess(false);

    if (!courseId.trim() || !title.trim() || !description.trim() || !duration.trim() || !objectives.trim()) {
      setFormError("All form inputs are required.");
      return;
    }

    // Check for duplicate courseId
    if (courses.some(c => c.id === courseId.trim().toLowerCase())) {
      setFormError("A course with this ID already exists. Please choose a unique URL parameter identifier.");
      return;
    }

    // Format objectives from lines
    const objectivesArray = objectives
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Build course structure with boilerplate module, lesson, and quiz
    const newCourse: Course = {
      id: courseId.trim().toLowerCase().replace(/\s+/g, "-"),
      title: title.trim(),
      description: description.trim(),
      trackId: selectedTrack,
      difficulty,
      duration: duration.trim(),
      popularity: 50, // default popularity starting score
      newest: true,
      image: "/images/courses/custom.jpg",
      objectives: objectivesArray,
      modules: [
        {
          id: `${courseId}-module-1`,
          title: "Introduction Module",
          lessons: [
            {
              id: `${courseId}-lesson-1`,
              title: `Introduction to ${title}`,
              duration: "20 mins",
              xp: 100,
              contentFile: "html-basics.md", // redirect to sample lesson content file
              quiz: {
                passingScore: 100,
                questions: [
                  {
                    question: `What is the primary purpose of ${title}?`,
                    options: ["To execute instructions", "To design graphics", "To query networks", "To store static files"],
                    correctOption: 0,
                    explanation: `${title} is standard tooling designed to run instructions and process calculations.`
                  }
                ]
              }
            }
          ]
        }
      ]
    };

    try {
      await addCustomCourse(newCourse);
      setFormSuccess(true);
      
      // Clear inputs
      setCourseId("");
      setTitle("");
      setDescription("");
      setDuration("");
      setObjectives("");
    } catch (err) {
      setFormError("An error occurred publishing the course to the database.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 w-full space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
          <BarChart className="h-8 w-8 text-purple-400" />
          Admin Analytics & Control Panel
        </h1>
        <p className="text-slate-400 text-sm">
          Monitor user enrollments, check statistical distributions, and publish new learning modules.
        </p>
      </div>

      {/* Analytics stats metrics grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const StatIcon = stat.icon;
          return (
            <div key={i} className="glass-panel p-5 rounded-xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-3xs font-semibold text-slate-500 block uppercase tracking-wider">{stat.label}</span>
                <span className="text-2xl font-extrabold text-white">{stat.value}</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-white/5">
                <StatIcon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Operations Content Row */}
      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* ================= LEFT 2 COLUMNS: COURSE MANAGER & CREATOR ================= */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Custom Course CRUD Creator form */}
          <div className="glass-panel p-6 rounded-xl space-y-5">
            <h3 className="text-md font-bold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Plus className="h-5 w-5 text-blue-400" />
              Publish Custom Course
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-4 text-xs">
              
              {/* ID & Title */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Course URL Identifier (lowercase slug)</label>
                  <input
                    type="text"
                    value={courseId}
                    onChange={(e) => setCourseId(e.target.value)}
                    placeholder="e.g. csharp-basics"
                    className="glass-input px-3 py-2 w-full"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Course Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. C# Programming Fundamentals"
                    className="glass-input px-3 py-2 w-full"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Course Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide a short description highlighting learning objectives..."
                  className="glass-input px-3 py-2 w-full h-16 resize-none"
                />
              </div>

              {/* Track, Difficulty & Duration */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Learning Track</label>
                  <select
                    value={selectedTrack}
                    onChange={(e) => setSelectedTrack(e.target.value)}
                    className="glass-input px-3 py-2 w-full cursor-pointer"
                  >
                    {tracks.map(t => (
                      <option key={t.id} value={t.id}>{t.title}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Difficulty Level</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="glass-input px-3 py-2 w-full cursor-pointer"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-300">Duration (e.g. "8 hours")</label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 6 hours"
                    className="glass-input px-3 py-2 w-full"
                  />
                </div>
              </div>

              {/* Objectives */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-300">Learning Objectives (One objective statement per line)</label>
                <textarea
                  value={objectives}
                  onChange={(e) => setObjectives(e.target.value)}
                  placeholder="Master logical structures&#10;Write static classes&#10;Optimize execution times"
                  className="glass-input px-3 py-2 w-full h-20"
                />
              </div>

              {formError && (
                <div className="flex items-center gap-1.5 text-rose-400 font-semibold bg-rose-500/10 border border-rose-500/20 p-2.5 rounded">
                  <AlertCircle className="h-4 w-4" /> {formError}
                </div>
              )}

              {formSuccess && (
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded">
                  <ShieldCheck className="h-4 w-4" /> Course created successfully! It is now fully active in the Course Catalog.
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-500 font-bold py-2.5 text-xs text-white rounded transition-all cursor-pointer"
              >
                Publish Course <ArrowRight className="h-4 w-4" />
              </button>

            </form>
          </div>

          {/* List of active courses with Delete option */}
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
              <BookOpen className="h-5 w-5 text-indigo-400" />
              Active Course Curriculum list ({courses.length})
            </h3>
            
            <div className="divide-y divide-white/5 max-h-[300px] overflow-y-auto pr-1 space-y-1 text-xs">
              {courses.map((course) => (
                <div key={course.id} className="flex justify-between items-center py-2.5">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white block text-sm">{course.title}</span>
                    <span className="text-3xs text-slate-500 font-semibold uppercase">{course.difficulty} &bull; ID: {course.id}</span>
                  </div>
                  
                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${course.title}?`)) {
                        deleteCourse(course.id);
                      }
                    }}
                    className="p-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 rounded transition-all cursor-pointer"
                    title="Delete Course"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ================= RIGHT 1 COLUMN: MOCK USER MANAGER ================= */}
        <div className="space-y-8">
          
          <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
              <Users className="h-5 w-5 text-blue-400" />
              Registered Student Accounts
            </h3>

            <div className="space-y-3.5 text-xs">
              {mockUsers.map((u, i) => (
                <div key={i} className="flex items-start justify-between bg-slate-900/40 p-3 rounded-lg border border-white/5">
                  <div className="space-y-1">
                    <span className="font-bold text-white block">{u.name}</span>
                    <span className="text-slate-500 text-3xs font-medium block leading-none">{u.email}</span>
                    <div className="flex items-center gap-2 mt-2 text-3xs text-slate-400 font-bold">
                      <span className="text-blue-400">Level {u.level}</span>
                      <span>&bull;</span>
                      <span>{u.xp} XP</span>
                    </div>
                  </div>
                  
                  <div className="text-right text-3xs space-y-1 font-semibold text-slate-400">
                    <span className="block">{u.enrolled} courses</span>
                    <span className="block text-orange-500">{u.streak}d streak</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-6 rounded-xl space-y-3 text-xs text-slate-500 leading-normal">
            <h4 className="font-bold text-white flex items-center gap-1.5 uppercase border-b border-white/5 pb-1">
              <ShieldCheck className="h-4 w-4 text-purple-400" />
              Admin Capabilities
            </h4>
            <p>
              As an Administrator, any courses you publish instantly compile and populate the dynamic catalog database.
            </p>
            <p>
              Adding courses injects an automated introduction module and lesson equipped with structured compiler assertions, which is immediately executable.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
