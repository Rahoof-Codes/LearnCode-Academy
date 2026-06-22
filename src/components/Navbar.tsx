"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp, getLevelInfo } from "../lib/db";
import { Terminal, Flame, User, Cpu, Zap } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, role, setRole, isFirebaseActive } = useApp();

  const navLinks = [
    { name: "Catalog", href: "/catalog" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Profile", href: "/profile" },
  ];

  const isAdmin = role === "admin";
  const levelInfo = user ? getLevelInfo(user.xp) : { level: 1, progressPercentage: 0 };

  return (
    <nav className="sticky top-0 z-50 w-full bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/60 px-4 py-2.5 md:px-8">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-white hover:opacity-90 transition-opacity">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500 text-zinc-950">
            <Terminal className="h-4 w-4" strokeWidth={2.5} />
          </div>
          <span className="hidden sm:inline">
            LearnCode<span className="text-cyan-400">Academy</span>
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden items-center gap-0.5 md:flex bg-zinc-900/50 rounded-lg p-1 border border-zinc-800/60">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  isActive 
                    ? "bg-zinc-800 text-white shadow-sm" 
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          {isAdmin && (
            <Link
              href="/admin"
              className={`rounded-md px-3.5 py-1.5 text-xs font-semibold transition-all ${
                pathname.startsWith("/admin")
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          
          {/* Streak + Level (desktop) */}
          {user && (
            <div className="hidden items-center gap-3 sm:flex">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <Flame className="h-3.5 w-3.5 fill-amber-400" />
                {user.streak}d
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-xs font-bold text-cyan-400">
                  <Zap className="h-3 w-3" />
                  Lv.{levelInfo.level}
                </div>
                <div className="h-1 w-14 rounded-full bg-zinc-800 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500"
                    style={{ width: `${levelInfo.progressPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Connection status */}
          <div 
            title={isFirebaseActive ? "Firebase connected" : "Demo mode — local storage"}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider select-none border ${
              isFirebaseActive 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : "bg-amber-500/8 text-amber-400 border-amber-500/15"
            }`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${isFirebaseActive ? "bg-emerald-400" : "bg-amber-400"}`} />
            {isFirebaseActive ? "Live" : "Demo"}
          </div>

          {/* Role switch */}
          <div className="flex items-center rounded-lg bg-zinc-900 p-0.5 border border-zinc-800/60">
            <button
              onClick={() => setRole("student")}
              className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                role === "student"
                  ? "bg-cyan-500 text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Student
            </button>
            <button
              onClick={() => setRole("admin")}
              className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all ${
                role === "admin"
                  ? "bg-amber-500 text-zinc-950 shadow-sm"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              Admin
            </button>
          </div>

          {/* Avatar */}
          {user && (
            <Link 
              href="/profile" 
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 text-zinc-950 hover:scale-110 transition-transform font-bold text-xs"
            >
              {user.name[0]}
            </Link>
          )}
        </div>
      </div>
      
      {/* Mobile row */}
      <div className="mt-2 flex items-center justify-center gap-5 border-t border-zinc-800/40 pt-2 md:hidden">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`text-xs font-semibold transition-all ${
                isActive ? "text-cyan-400" : "text-zinc-500 hover:text-white"
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
              pathname.startsWith("/admin") ? "text-amber-400" : "text-zinc-500 hover:text-white"
            }`}
          >
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
