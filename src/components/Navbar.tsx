"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp, getLevelInfo } from "../lib/db";
import { Terminal, Flame, User, Cpu, Zap, LogOut, Sparkles } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, setRole, logout, loading } = useApp();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navLinks = [
    { name: "Catalog", href: "/catalog" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
  ];

  const isAdmin = mounted && !loading && role === "admin";
  const levelInfo = mounted && !loading && user ? getLevelInfo(user.xp) : { level: 1, progressPercentage: 0 };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-indigo-100/60 px-4 py-2.5 md:px-8 shadow-sm shadow-indigo-500/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-slate-800 hover:opacity-90 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/25">
            <Terminal className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="hidden sm:inline">
            LearnCode<span className="text-gradient-primary">Academy</span>
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden items-center gap-0.5 md:flex bg-slate-50/80 rounded-xl p-1 border border-indigo-100/50">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                  isActive 
                    ? "bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-md shadow-indigo-500/20" 
                    : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all ${
                pathname.startsWith("/admin")
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20"
                  : "text-slate-500 hover:text-amber-600 hover:bg-amber-50/50"
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          
          {/* Streak + Level (desktop) */}
          {mounted && !loading && user && (
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                <Flame className="h-3.5 w-3.5 fill-amber-500" />
                {user.streak}d
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-bold text-indigo-600">
                  <Zap className="h-3 w-3" />
                  Lv.{levelInfo.level}
                </div>
                <div className="h-1.5 w-14 rounded-full bg-indigo-100 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 transition-all duration-500"
                    style={{ width: `${levelInfo.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}



          {/* Avatar / Actions */}
          {!mounted || loading ? (
            <div className="h-8 w-8 rounded-full bg-indigo-50 border border-indigo-100/50 animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-2">
              <Link 
                href="/profile" 
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 via-violet-500 to-fuchsia-500 text-white hover:scale-110 transition-all overflow-hidden font-bold text-xs shadow-lg shadow-indigo-500/20 border-2 border-white"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.name} className="h-full w-full object-cover" />
                ) : (
                  user.name[0].toUpperCase()
                )}
              </Link>
              <button
                onClick={logout}
                title="Sign Out"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/signin"
              className="btn-gradient rounded-xl px-4 py-1.5 text-xs shadow-lg shadow-indigo-500/15 cursor-pointer"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile row */}
      <div className="mt-2 flex items-center justify-center gap-5 border-t border-indigo-100/40 pt-2 md:hidden">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-semibold transition-all ${
                isActive ? "text-indigo-600" : "text-slate-400 hover:text-indigo-500"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
        {isAdmin && (
          <Link
            href="/admin"
            className={`text-xs font-semibold transition-all ${
              pathname.startsWith("/admin") ? "text-amber-500" : "text-slate-400 hover:text-amber-500"
            }`}
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
