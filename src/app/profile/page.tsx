"use client";

import { useState } from "react";
import { useApp, getLevelInfo, achievementsList, Certificate } from "../../lib/db";
import { 
  Award, Flame, Calendar, BookOpen, Printer, 
  X, CheckCircle, ShieldCheck, Mail, ShieldAlert, AwardIcon 
} from "lucide-react";

export default function Profile() {
  const { user, courses, updateProfileName } = useApp();
  
  // Profile name update states
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [updating, setUpdating] = useState(false);

  // Certificate Modal states
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  if (!user) {
    return (
      <div className="flex flex-1 items-center justify-center p-8 bg-background">
        <span className="text-slate-400 text-sm animate-pulse">Loading profile credentials...</span>
      </div>
    );
  }

  const levelInfo = getLevelInfo(user.xp);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || newName === user.name) {
      setEditing(false);
      return;
    }

    setUpdating(true);
    try {
      await updateProfileName(newName.trim());
      setEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 md:px-8 w-full space-y-8 no-print">
      
      {/* Page header title */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Student Profile</h1>
        <p className="text-slate-400 text-sm">
          Manage your credentials, explore digital achievements, and view generated course certificates.
        </p>
      </div>

      {/* Grid: Profile editor and active statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Profile Card & Editor */}
        <div className="glass-panel p-6 rounded-xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg border-2 border-white/10 select-none">
            {user.name.split(" ").map(w => w[0]).join("").substring(0, 2).toUpperCase()}
          </div>
          
          <div className="space-y-1 w-full">
            {editing ? (
              <form onSubmit={handleUpdateName} className="flex gap-2 max-w-xs mx-auto">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="glass-input px-3 py-1.5 text-xs w-full text-center"
                  placeholder="Change Name"
                  disabled={updating}
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={updating}
                  className="rounded bg-blue-600 px-3 py-1.5 text-3xs font-bold text-white transition-all hover:bg-blue-500 cursor-pointer"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded bg-slate-800 px-3 py-1.5 text-3xs font-bold text-slate-300 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <h2 className="text-lg font-bold text-white">{user.name}</h2>
                <button 
                  onClick={() => { setNewName(user.name); setEditing(true); }}
                  className="text-3xs font-bold text-blue-400 hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
            
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {user.email}
            </p>
          </div>

          <div className="w-full border-t border-white/5 pt-4 flex justify-around text-center">
            <div>
              <span className="text-3xs font-semibold text-slate-500 block uppercase">Role</span>
              <span className="text-xs font-bold text-blue-400 capitalize">{user.role}</span>
            </div>
            <div>
              <span className="text-3xs font-semibold text-slate-500 block uppercase">Level</span>
              <span className="text-xs font-bold text-white">{levelInfo.level}</span>
            </div>
            <div>
              <span className="text-3xs font-semibold text-slate-500 block uppercase">Streak</span>
              <span className="text-xs font-bold text-orange-500 flex items-center gap-0.5 justify-center">
                <Flame className="h-3.5 w-3.5 fill-orange-500" /> {user.streak}d
              </span>
            </div>
          </div>
        </div>

        {/* Level details & XP stats */}
        <div className="md:col-span-2 glass-panel p-6 rounded-xl flex flex-col justify-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-md font-bold text-white flex items-center gap-1.5">
              <Award className="h-5 w-5 text-indigo-400" />
              XP Progression & Level Limits
            </h3>
            <p className="text-xs text-slate-400">
              Each course lesson complete awards between 100-220 XP. Completing lesson quizzes yields an additional 50 XP. Level thresholds scale at 500 XP intervals.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-indigo-300">Level {levelInfo.level} Progress</span>
              <span className="text-slate-300">{levelInfo.xpInCurrentLevel} / {levelInfo.xpNeededForNextLevel} XP</span>
            </div>
            <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600"
                style={{ width: `${levelInfo.progressPercentage}%` }}
              />
            </div>
            <span className="text-3xs text-slate-500 block">
              Cumulative XP: {user.xp} points. You need {levelInfo.xpNeededForNextLevel - levelInfo.xpInCurrentLevel} more XP to reach level {levelInfo.level + 1}.
            </span>
          </div>
        </div>

      </div>

      {/* Grid: Achievements grid & Certificates list */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Achievements Card */}
        <div className="md:col-span-2 glass-panel p-6 rounded-xl space-y-4">
          <h3 className="text-md font-bold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
            <Award className="h-5 w-5 text-amber-500" />
            Digital Badges & Achievements
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            {achievementsList.map((ach) => {
              const isUnlocked = user.achievements.includes(ach.id);
              return (
                <div 
                  key={ach.id}
                  className={`p-3.5 rounded-lg border flex gap-3.5 items-start transition-all ${
                    isUnlocked 
                      ? "bg-amber-500/5 border-amber-500/20 text-slate-200" 
                      : "bg-slate-900/20 border-white/5 text-slate-500 opacity-60"
                  }`}
                >
                  <div className={`rounded p-2 border shrink-0 ${
                    isUnlocked ? "bg-amber-500/10 border-amber-500/25 text-amber-400" : "bg-slate-950 border-white/5 text-slate-700"
                  }`}>
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                      {isUnlocked && (
                        <span className="text-4xs font-bold text-emerald-400 uppercase">Unlocked</span>
                      )}
                    </div>
                    <p className="text-3xs text-slate-400 leading-relaxed">{ach.description}</p>
                    <span className="text-3xs font-semibold text-amber-500 block">+{ach.xpReward} XP Reward</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Certificates Portal list */}
        <div className="glass-panel p-6 rounded-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-md font-bold text-white flex items-center gap-1.5 border-b border-white/5 pb-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              Issued Certificates
            </h3>

            {user.certificates.length === 0 ? (
              <div className="text-center p-8">
                <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  No certificates generated yet. Complete all lessons and quizzes of any course to issue a credential.
                </p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {user.certificates.map((cert) => (
                  <button
                    key={cert.id}
                    onClick={() => setActiveCert(cert)}
                    className="w-full flex items-center justify-between p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-all text-left cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white line-clamp-1">{cert.courseName}</span>
                      <span className="text-3xs text-slate-500">Hash: {cert.id}</span>
                    </div>
                    <Printer className="h-4 w-4 text-emerald-400" />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="text-3xs text-slate-500 leading-normal border-t border-white/5 pt-3">
            Certificates generated utilize a SHA-256 verifiable hash algorithm linked to your student credentials.
          </div>
        </div>

      </div>

      {/* ================= PRINTABLE CERTIFICATE MODAL INTERFACE ================= */}
      {activeCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto no-print">
          <div className="relative max-w-4xl w-full bg-slate-950 border border-white/10 rounded-2xl p-6 md:p-10 space-y-6">
            
            {/* Modal Controls Banner (no-print) */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <span className="text-xs font-bold text-slate-400">Verifiable Student Credential</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded transition-all cursor-pointer"
                >
                  <Printer className="h-4 w-4" /> Print / Save PDF
                </button>
                <button
                  onClick={() => setActiveCert(null)}
                  className="rounded p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* ================= ACTUAL PHYSICAL CERTIFICATE SHEET FOR PRINT ================= */}
            {/* This block is formatted separately and fits standard letter sizes when printing */}
            <div className="print-certificate bg-white border-[14px] border-double border-slate-900 text-slate-900 p-8 md:p-16 text-center space-y-8 relative overflow-hidden rounded shadow-2xl flex flex-col justify-between min-h-[500px]">
              
              {/* Subtle watermarks and designs */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-slate-900/5 rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-slate-900/5 rounded-tr-full" />
              
              {/* School branding */}
              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-slate-900 font-extrabold text-xl tracking-tight uppercase">
                  <span>LearnCode Academy</span>
                </div>
                <span className="text-3xs font-extrabold text-slate-500 uppercase tracking-widest block">
                  Interactive Programming Institute
                </span>
              </div>

              {/* Central Certifier headers */}
              <div className="space-y-4">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-900 block border-b border-slate-200 pb-1.5 max-w-[280px] mx-auto">
                  Certificate of Graduation
                </span>
                
                <p className="text-xs italic text-slate-500">This is proudly presented to</p>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 border-b-2 border-slate-900/10 pb-2 max-w-md mx-auto">
                  {activeCert.studentName}
                </h2>
                
                <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
                  who has successfully completed the curriculum, code execution sandboxes, and quiz modules required to graduate from the course:
                </p>
                
                <h3 className="text-xl md:text-2xl font-black text-indigo-900 tracking-wide">
                  {activeCert.courseName}
                </h3>
              </div>

              {/* Footer signatures and unique cryptographic verification hashes */}
              <div className="grid grid-cols-3 items-end gap-4 border-t border-slate-200 pt-8">
                {/* Date */}
                <div className="text-left text-3xs space-y-1">
                  <span className="text-slate-400 block font-bold uppercase">Date Issued</span>
                  <span className="font-extrabold text-slate-800">{activeCert.date}</span>
                </div>

                {/* Seal */}
                <div className="flex justify-center relative">
                  <div className="h-16 w-16 rounded-full border-4 border-double border-indigo-900 flex items-center justify-center font-black text-[9px] uppercase tracking-tighter text-indigo-900 select-none bg-indigo-50 shadow-inner">
                    Verified
                  </div>
                </div>

                {/* Signatures */}
                <div className="text-right text-3xs space-y-1">
                  <span className="text-slate-400 block font-bold uppercase">Academic Dean</span>
                  <span className="font-semibold text-slate-800 font-mono italic">Adnan Rahoof</span>
                </div>
              </div>

              <div className="text-center text-4xs font-semibold font-mono text-slate-400 mt-4 leading-none">
                VERIFICATION HASH: {activeCert.hash.toUpperCase()} &bull; ID: {activeCert.id}
              </div>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}
