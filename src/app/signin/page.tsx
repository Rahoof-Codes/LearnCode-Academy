"use client";

import { useApp } from "../../lib/db";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Terminal, Shield, Sparkles, AlertTriangle, User, Lock, Mail, Eye, EyeOff } from "lucide-react";

export default function SignIn() {
  const { user, isFirebaseActive, signInWithGoogle, signInWithEmail, signUpWithEmail } = useApp();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  // Clear errors when toggling tabs
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [activeTab]);

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Common validations
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      if (activeTab === "signin") {
        await signInWithEmail(email.trim(), password);
        router.push("/dashboard");
      } else {
        if (!name.trim()) {
          setError("Please enter your name.");
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        await signUpWithEmail(email.trim(), password, name.trim());
        setSuccess("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      }
    } catch (err: any) {
      console.error("Auth action failed:", err);
      setError(err?.message || "Authentication action failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await signInWithGoogle();
      router.push("/dashboard");
    } catch (err: any) {
      console.error("Google Sign-In failed:", err);
      setError(err?.message || "Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient floating orbs */}
      <div className="orb orb-indigo h-[400px] w-[400px] top-[10%] left-[10%]" style={{ animation: 'float 8s ease-in-out infinite' }} />
      <div className="orb orb-rose h-[300px] w-[300px] bottom-[10%] right-[10%]" style={{ animation: 'float 6s ease-in-out infinite reverse' }} />
      <div className="orb orb-amber h-[200px] w-[200px] top-[50%] right-[30%]" style={{ animation: 'float 10s ease-in-out infinite' }} />

      <div className="glass-panel-heavy max-w-md w-full rounded-3xl p-8 shadow-2xl shadow-indigo-500/10 relative border-gradient">
        
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-xl shadow-indigo-500/25 mb-4">
            <Terminal className="h-7 w-7" strokeWidth={2.5} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            LearnCode<span className="text-gradient-primary">Academy</span>
          </h2>
          <p className="text-slate-400 text-xs mt-1.5 max-w-[280px]">
            Master programming and secure your verifiable certificates.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="grid grid-cols-2 gap-1 bg-slate-100/80 p-1 rounded-xl border border-indigo-100/50 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab("signin")}
            className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "signin"
                ? "bg-white text-indigo-600 shadow-md border border-indigo-100/50"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("signup")}
            className={`py-2.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              activeTab === "signup"
                ? "bg-white text-indigo-600 shadow-md border border-indigo-100/50"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Firebase Config Warnings if in Demo Mode */}
        {!isFirebaseActive && (
          <div className="mb-5 rounded-xl border border-amber-200/60 bg-amber-50/80 p-3.5 space-y-2">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[11px] font-bold text-amber-600">Demo Mode Active</span>
                <p className="text-[10px] leading-relaxed text-slate-500">
                  Running locally without live Firebase connection. Accounts registered will be saved in your simulated session.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error notification */}
        {error && (
          <div className="mb-5 rounded-xl border border-rose-200/60 bg-rose-50/80 p-3.5 flex items-center gap-2 text-xs font-semibold text-rose-600 animate-shake">
            <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 animate-pulse" />
            {error}
          </div>
        )}

        {/* Success notification */}
        {success && (
          <div className="mb-5 rounded-xl border border-emerald-200/60 bg-emerald-50/80 p-3.5 flex items-center gap-2 text-xs font-semibold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0 animate-ping" />
            {success}
          </div>
        )}

        {/* Custom Email/Password Forms */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {activeTab === "signup" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-300" />
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-white/80 border border-indigo-200/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 text-slate-800 placeholder-slate-300 text-xs px-4 py-3.5 transition-all outline-none pl-10"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-300" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-white/80 border border-indigo-200/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 text-slate-800 placeholder-slate-300 text-xs px-4 py-3.5 transition-all outline-none pl-10"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-300" />
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-white/80 border border-indigo-200/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 text-slate-800 placeholder-slate-300 text-xs px-4 py-3.5 transition-all outline-none pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 p-1 cursor-pointer transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {activeTab === "signup" && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-indigo-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl bg-white/80 border border-indigo-200/50 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/15 text-slate-800 placeholder-slate-300 text-xs px-4 py-3.5 transition-all outline-none pl-10 pr-10"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gradient flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-xs shadow-lg shadow-indigo-500/20 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : activeTab === "signin" ? (
              "Sign In with Email"
            ) : (
              "Register & Continue"
            )}
          </button>
        </form>

        {/* Separator / Social Header */}
        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t border-indigo-100/60"></div>
          <span className="flex-shrink mx-4 text-slate-300 text-[10px] font-bold uppercase tracking-widest">or</span>
          <div className="flex-grow border-t border-indigo-100/60"></div>
        </div>

        {/* Social Authentication button */}
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-white hover:bg-slate-50 border-2 border-slate-200/80 disabled:opacity-50 px-6 py-3.5 text-xs font-bold text-slate-700 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-sm"
          >
            {loading ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            ) : (
              <>
                <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                {isFirebaseActive ? "Continue with Google" : "Launch Demo Session"}
              </>
            )}
          </button>
          
          <div className="flex items-center justify-center gap-2 text-[10px] font-semibold text-slate-300 select-none pt-4 border-t border-indigo-100/40">
            <Shield className="h-3.5 w-3.5 text-emerald-500" />
            <span>Secure SSL authentication &bull; GDPR Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );
}
