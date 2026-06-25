"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useApp } from "../../lib/db";
import { Course } from "../../data/coursesData";
import { Search, Globe, Cpu, Terminal, Smartphone, Server, BookOpen, Clock, ChevronRight, Check, Sparkles } from "lucide-react";
import Link from "next/link";

function CatalogContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialTrack = searchParams.get("track") || "all";

  const { courses, tracks, user, enrollInCourse, loading } = useApp();
  
  // States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTrack, setSelectedTrack] = useState(initialTrack);
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("popularity"); // 'popularity' | 'newest'

  // Reset Filters
  const handleReset = () => {
    setSearchQuery("");
    setSelectedTrack("all");
    setSelectedDifficulty("all");
    setSortBy("popularity");
  };

  // Filter & Sort Logic
  const filteredCourses = courses
    .filter((course) => {
      // 1. Search Query
      const matchesSearch = 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Track Filter
      const matchesTrack = selectedTrack === "all" || course.trackId === selectedTrack;

      // 3. Difficulty Filter
      const matchesDifficulty = selectedDifficulty === "all" || course.difficulty.toLowerCase() === selectedDifficulty.toLowerCase();

      return matchesSearch && matchesTrack && matchesDifficulty;
    })
    .sort((a, b) => {
      if (sortBy === "popularity") {
        return b.popularity - a.popularity;
      } else if (sortBy === "newest") {
        // Sort true first, false second
        return (b.newest ? 1 : 0) - (a.newest ? 1 : 0);
      }
      return 0;
    });

  // Track icons mapper
  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case "Globe": return Globe;
      case "Cpu": return Cpu;
      case "Terminal": return Terminal;
      case "Smartphone": return Smartphone;
      case "Server": return Server;
      default: return BookOpen;
    }
  };

  // Check enrollment status
  const isEnrolled = (courseId: string) => {
    return user?.enrolledCourses?.includes(courseId) || false;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 w-full space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Course Catalog</h1>
        <p className="text-slate-400 text-sm">
          Browse through {courses.length} courses across 5 tech tracks. Learn in-demand engineering skills.
        </p>
      </div>

      {/* Control panel: Search, filter, and sort triggers */}
      <div className="grid gap-4 md:grid-cols-12 items-center">
        {/* Search */}
        <div className="relative md:col-span-5 w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-300" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, tools, languages..."
            className="glass-input pl-10 pr-4 py-2.5 w-full text-sm"
          />
        </div>

        {/* Difficulty */}
        <div className="md:col-span-3 w-full">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="glass-input px-3.5 py-2.5 w-full text-sm cursor-pointer"
          >
            <option value="all">All Difficulties</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Sort */}
        <div className="md:col-span-3 w-full">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-input px-3.5 py-2.5 w-full text-sm cursor-pointer"
          >
            <option value="popularity">Sort by Popularity</option>
            <option value="newest">Sort by Newest</option>
          </select>
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="md:col-span-1 text-xs font-semibold text-slate-400 hover:text-indigo-500 transition-colors py-2"
        >
          Reset
        </button>
      </div>

      {/* Tracks Selection Pills */}
      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto">
        <button
          onClick={() => setSelectedTrack("all")}
          className={`rounded-full px-5 py-2 text-xs font-bold border transition-all ${
            selectedTrack === "all"
              ? "bg-gradient-to-r from-indigo-500 to-violet-600 border-transparent text-white shadow-md shadow-indigo-500/20"
              : "bg-white border-indigo-100/60 text-slate-400 hover:text-indigo-600 hover:border-indigo-200"
          }`}
        >
          All Tracks
        </button>
        {tracks.map((track) => {
          const TrackIcon = getTrackIcon(track.icon);
          const isSelected = selectedTrack === track.id;
          return (
            <button
              key={track.id}
              onClick={() => setSelectedTrack(track.id)}
              className={`flex items-center gap-1.5 rounded-full px-5 py-2 text-xs font-bold border transition-all ${
                isSelected
                  ? "bg-gradient-to-r from-indigo-500 to-violet-600 border-transparent text-white shadow-md shadow-indigo-500/20"
                  : "bg-white border-indigo-100/60 text-slate-400 hover:text-indigo-600 hover:border-indigo-200"
              }`}
            >
              <TrackIcon className="h-3.5 w-3.5" />
              {track.title}
            </button>
          );
        })}
      </div>

      {/* Main Grid display */}
      {filteredCourses.length === 0 ? (
        <div className="glass-panel p-16 text-center rounded-2xl">
          <p className="text-slate-400 text-md font-medium mb-2">No courses match your active filters.</p>
          <button 
            onClick={handleReset}
            className="text-xs font-semibold text-indigo-500 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const enrolled = isEnrolled(course.id);
            const track = tracks.find(t => t.id === course.trackId);
            
            return (
              <div 
                key={course.id}
                className="premium-card flex flex-col justify-between overflow-hidden"
              >
                {/* Course Header/Visual block */}
                <div className={`h-2 bg-gradient-to-r ${track?.gradient || "from-indigo-500 to-violet-500"}`} />
                
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`rounded-full px-2.5 py-1 text-3xs font-bold tracking-wide uppercase border ${
                        course.difficulty === "Beginner" 
                          ? "bg-indigo-50 text-indigo-600 border-indigo-200/50" 
                          : course.difficulty === "Intermediate" 
                          ? "bg-violet-50 text-violet-600 border-violet-200/50"
                          : "bg-rose-50 text-rose-600 border-rose-200/50"
                      }`}>
                        {course.difficulty}
                      </span>
                      {course.newest && (
                        <span className="rounded-full bg-amber-50 border border-amber-200/50 px-2.5 py-1 text-3xs font-bold text-amber-600 uppercase flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          New
                        </span>
                      )}
                    </div>

                    <h3 className="text-md font-extrabold text-slate-800 line-clamp-1">{course.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{course.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-xs border-t border-indigo-100/40 pt-3">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="h-3.5 w-3.5 text-indigo-400" />
                      {course.duration}
                    </span>
                    <span className="font-semibold text-slate-300">
                      {track?.title}
                    </span>
                  </div>
                </div>

                {/* Course CTA Footer */}
                <div className="bg-slate-50/60 p-4 border-t border-indigo-100/30 flex gap-2 items-center justify-between">
                  <Link
                    href={`/courses/${course.id}`}
                    className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-all flex items-center gap-0.5"
                  >
                    View Details
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>

                  {loading ? (
                    <div className="h-8 w-24 bg-indigo-50/50 border border-indigo-100/30 animate-pulse rounded-xl" />
                  ) : enrolled ? (
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200/50 px-3.5 py-2 text-xs font-bold hover:bg-emerald-100 transition-all"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Enrolled
                    </Link>
                  ) : (
                    <button
                      onClick={async () => {
                        if (!user) {
                          router.push("/signin");
                        } else {
                          await enrollInCourse(course.id);
                          const totalLessons = course.modules.flatMap(m => m.lessons);
                          const nextLesson = totalLessons.find(l => !user?.completedLessons?.includes(l.id));
                          const targetId = nextLesson ? nextLesson.id : totalLessons[0]?.id;
                          if (targetId) {
                            router.push(`/courses/${course.id}/lessons/${targetId}`);
                          } else {
                            router.push(`/courses/${course.id}`);
                          }
                        }
                      }}
                      className="rounded-xl btn-gradient px-4 py-2 text-xs shadow-md shadow-indigo-500/15 hover:scale-103"
                    >
                      Quick Enroll
                    </button>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Catalog() {
  return (
    <Suspense fallback={
      <div className="flex flex-1 items-center justify-center p-12">
        <span className="text-indigo-400 text-sm font-semibold animate-pulse">Loading catalog configurations...</span>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
