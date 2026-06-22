"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "../../lib/db";
import { Course } from "../../data/coursesData";
import { Search, Globe, Cpu, Terminal, Smartphone, Server, BookOpen, Clock, ChevronRight, Check } from "lucide-react";
import Link from "next/link";

function CatalogContent() {
  const searchParams = useSearchParams();
  const initialTrack = searchParams.get("track") || "all";

  const { courses, tracks, user, enrollInCourse } = useApp();
  
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
    return user?.enrolledCourses.includes(courseId) || false;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:px-8 w-full space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Course Catalog</h1>
        <p className="text-slate-400 text-sm">
          Browse through {courses.length} courses across 5 tech tracks. Learn in-demand engineering skills.
        </p>
      </div>

      {/* Control panel: Search, filter, and sort triggers */}
      <div className="grid gap-4 md:grid-cols-12 items-center">
        {/* Search */}
        <div className="relative md:col-span-5 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses, tools, languages..."
            className="glass-input pl-9 pr-4 py-2 w-full text-sm"
          />
        </div>

        {/* Difficulty */}
        <div className="md:col-span-3 w-full">
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="glass-input px-3 py-2 w-full text-sm cursor-pointer"
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
            className="glass-input px-3 py-2 w-full text-sm cursor-pointer"
          >
            <option value="popularity">Sort by Popularity</option>
            <option value="newest">Sort by Newest</option>
          </select>
        </div>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="md:col-span-1 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-2"
        >
          Reset
        </button>
      </div>

      {/* Tracks Selection Pills */}
      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto">
        <button
          onClick={() => setSelectedTrack("all")}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold border transition-all ${
            selectedTrack === "all"
              ? "bg-blue-600 border-blue-500 text-white"
              : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200"
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
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold border transition-all ${
                isSelected
                  ? "bg-blue-600 border-blue-500 text-white"
                  : "bg-slate-900/40 border-white/5 text-slate-400 hover:text-slate-200"
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
        <div className="glass-panel p-16 text-center rounded-xl">
          <p className="text-slate-400 text-md font-medium mb-2">No courses match your active filters.</p>
          <button 
            onClick={handleReset}
            className="text-xs font-semibold text-blue-400 hover:underline"
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
                className="glass-panel glass-panel-hover flex flex-col justify-between rounded-xl overflow-hidden"
              >
                {/* Course Header/Visual block */}
                <div className={`h-3 bg-gradient-to-r ${track?.gradient || "from-blue-500 to-indigo-500"}`} />
                
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`rounded-full px-2 py-0.5 text-3xs font-bold tracking-wide uppercase border ${
                        course.difficulty === "Beginner" 
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20" 
                          : course.difficulty === "Intermediate" 
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      }`}>
                        {course.difficulty}
                      </span>
                      {course.newest && (
                        <span className="rounded-full bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 text-3xs font-bold text-amber-500 uppercase">
                          New
                        </span>
                      )}
                    </div>

                    <h3 className="text-md font-extrabold text-white line-clamp-1">{course.title}</h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">{course.description}</p>
                  </div>

                  <div className="flex items-center justify-between text-slate-400 text-xs border-t border-white/5 pt-3">
                    <span className="flex items-center gap-1 font-semibold">
                      <Clock className="h-3.5 w-3.5 text-blue-400" />
                      {course.duration}
                    </span>
                    <span className="font-semibold text-slate-500">
                      {track?.title}
                    </span>
                  </div>
                </div>

                {/* Course CTA Footer */}
                <div className="bg-slate-950/40 p-4 border-t border-white/5 flex gap-2 items-center justify-between">
                  <Link
                    href={`/courses/${course.id}`}
                    className="text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-0.5"
                  >
                    View Details
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Link>

                  {enrolled ? (
                    <Link
                      href="/dashboard"
                      className="inline-flex items-center gap-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 text-xs font-bold hover:bg-emerald-500/20 transition-all"
                    >
                      <Check className="h-3.5 w-3.5" />
                      Enrolled
                    </Link>
                  ) : (
                    <button
                      onClick={() => enrollInCourse(course.id)}
                      className="rounded bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 text-xs font-bold transition-all hover:scale-103"
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
      <div className="flex flex-1 items-center justify-center p-12 bg-background">
        <span className="text-slate-400 text-sm font-semibold animate-pulse">Loading catalog configurations...</span>
      </div>
    }>
      <CatalogContent />
    </Suspense>
  );
}
