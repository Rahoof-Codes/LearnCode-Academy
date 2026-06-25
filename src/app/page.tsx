"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { 
  Terminal, Globe, Cpu, Smartphone, Server, 
  Award, BookOpen, Flame, CheckCircle, Code, 
  ArrowRight, Star, Sparkles, Zap, Trophy, Shield
} from "lucide-react";
import { tracks } from "../data/coursesData";

export default function Home() {
  const fadeUp = {
    hidden: { y: 30, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: { delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const }
    })
  };

  const scaleIn = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: { delay: i * 0.1, duration: 0.5, type: "spring" as const, stiffness: 200 }
    })
  };

  const stats = [
    { label: "Learning Tracks", value: "5", icon: Globe, accent: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "Courses", value: "30+", icon: Code, accent: "text-amber-500", bg: "bg-amber-50" },
    { label: "Lessons", value: "34+", icon: BookOpen, accent: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Students", value: "12,840+", icon: Flame, accent: "text-rose-500", bg: "bg-rose-50" },
  ];

  const features = [
    {
      title: "Live Code Sandboxes",
      description: "Write and run code directly in your browser with multi-language support. No setup, no installs — just open and code.",
      icon: Terminal,
      accent: "from-indigo-500 to-violet-500",
      iconBg: "bg-indigo-50 border-indigo-200/50 text-indigo-600",
    },
    {
      title: "Smart Quiz Engine",
      description: "Test your knowledge with intelligent MCQ quizzes after every lesson. Get instant feedback, explanations, and XP rewards.",
      icon: Zap,
      accent: "from-amber-500 to-orange-500",
      iconBg: "bg-amber-50 border-amber-200/50 text-amber-600",
    },
    {
      title: "Gamified Progression",
      description: "Earn XP, level up, maintain learning streaks, and unlock achievement badges. Turn learning into an adventure.",
      icon: Trophy,
      accent: "from-emerald-500 to-teal-500",
      iconBg: "bg-emerald-50 border-emerald-200/50 text-emerald-600",
    },
    {
      title: "Verified Certificates",
      description: "Complete courses to receive digitally signed certificates with unique verification hashes. Showcase your skills professionally.",
      icon: Shield,
      accent: "from-rose-500 to-pink-500",
      iconBg: "bg-rose-50 border-rose-200/50 text-rose-600",
    },
  ];

  const testimonials = [
    {
      name: "Alexander Mercer",
      role: "Junior Web Developer",
      quote: "LearnCode Academy helped me go from complete beginner to landing my first React developer role in 8 months. The structured tracks are unbeatable.",
      rating: 5,
      gradient: "from-indigo-500 to-violet-500",
    },
    {
      name: "Sofia Rodriguez",
      role: "Data Analyst",
      quote: "The PyTorch and Pandas courses are incredibly well organized. The bite-sized lessons make it easy to study machine learning between work hours.",
      rating: 5,
      gradient: "from-rose-500 to-pink-500",
    },
    {
      name: "Ethan Chen",
      role: "CS Student",
      quote: "Writing Rust and C++ exercises in the sandbox was pure joy. Having compilers run immediately in the browser saved so much setup time.",
      rating: 5,
      gradient: "from-emerald-500 to-teal-500",
    }
  ];

  const getTrackIcon = (iconName: string) => {
    switch (iconName) {
      case "Globe": return Globe;
      case "Cpu": return Cpu;
      case "Terminal": return Terminal;
      case "Smartphone": return Smartphone;
      case "Server": return Server;
      default: return Code;
    }
  };

  return (
    <div className="flex flex-col">
      
      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden px-4 pt-24 pb-20 md:px-8 md:pt-40 md:pb-32">
        {/* Animated floating orbs */}
        <div className="orb orb-indigo h-[500px] w-[600px] top-[-100px] left-[10%] animate-float" />
        <div className="orb orb-rose h-[400px] w-[400px] top-[50px] right-[5%]" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
        <div className="orb orb-amber h-[300px] w-[350px] bottom-[-50px] left-[40%]" style={{ animation: 'float 10s ease-in-out infinite' }} />
        <div className="orb orb-emerald h-[250px] w-[300px] top-[200px] left-[60%]" style={{ animation: 'float 7s ease-in-out infinite reverse' }} />
        
        <div className="mx-auto max-w-6xl relative">
          {/* Centered layout */}
          <div className="flex flex-col items-center text-center">
            
            {/* Status badge */}
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-5 py-2 text-xs font-bold text-indigo-600 border border-indigo-200/50 mb-8 shadow-sm">
                <Sparkles className="h-3.5 w-3.5 animate-bounce-gentle" />
                30+ Interactive Courses Available
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-5xl font-black tracking-tight leading-[1.1] sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl text-slate-900"
            >
              Learn to code.
              <br />
              <span className="text-gradient-hero">Build anything.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 max-w-2xl text-lg text-slate-500 leading-relaxed md:text-xl"
            >
              Master programming through interactive lessons, quizzes, coding sandboxes, 
              and real-world projects. Earn certificates. No setup needed.
            </motion.p>

            {/* CTA buttons */}
            <motion.div
              custom={3}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-12 flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/catalog"
                className="group btn-gradient flex items-center gap-2.5 rounded-2xl px-9 py-4 text-sm shadow-xl shadow-indigo-500/25"
              >
                Start Learning Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/catalog"
                className="rounded-2xl bg-white border-2 border-indigo-200/60 px-9 py-4 text-sm font-bold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-300 transition-all shadow-sm"
              >
                Browse Courses
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              custom={4}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400 font-semibold"
            >
              <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Free to start</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Browser-based IDE</span>
              <span className="flex items-center gap-1.5"><CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> Verified certificates</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================== STATS BAR ============================== */}
      <section className="border-y border-indigo-100/80 py-6 px-4 md:px-8 bg-white/60 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-indigo-100/80">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={scaleIn}
                  className="flex items-center justify-center gap-3 py-4 px-2"
                >
                  <div className={`p-2 rounded-xl ${stat.bg}`}>
                    <StatIcon className={`h-5 w-5 ${stat.accent}`} />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-slate-800">{stat.value}</span>
                    <span className="ml-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">{stat.label}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================== LEARNING TRACKS ============================== */}
      <section className="py-28 px-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
            <div>
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3 block">Curated Pathways</span>
              <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Learning Tracks</h2>
              <p className="mt-3 text-slate-500 max-w-lg text-sm leading-relaxed">
                Follow structured roadmaps designed by industry professionals. Each track takes you from fundamentals to advanced mastery.
              </p>
            </div>
            <Link
              href="/catalog"
              className="self-start md:self-auto inline-flex items-center gap-1.5 text-sm font-bold text-indigo-500 hover:text-indigo-700 transition-colors"
            >
              View all courses <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tracks.map((track, i) => {
              const TrackIcon = getTrackIcon(track.icon);
              return (
                <motion.div
                  key={track.id}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                >
                  <Link href={`/catalog?track=${track.id}`} className="block">
                    <div className="premium-card p-6 h-full">
                      <div className={`inline-flex rounded-xl bg-gradient-to-br ${track.gradient} p-3 text-white shadow-lg`}>
                        <TrackIcon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-slate-800">{track.title}</h3>
                      <p className="mt-2 text-sm text-slate-500 leading-relaxed line-clamp-2">{track.description}</p>
                      <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-indigo-500">
                        Explore courses <ArrowRight className="h-3 w-3" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================== FEATURES ============================== */}
      <section className="py-28 px-4 md:px-8 border-t border-indigo-100/60 bg-gradient-to-b from-indigo-50/30 to-transparent">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3 block">Platform Features</span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Everything you need to succeed</h2>
            <p className="mt-4 text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
              A complete learning ecosystem built for developers, by developers.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {features.map((feature, i) => {
              const FeatIcon = feature.icon;
              return (
                <motion.div
                  key={i}
                  custom={i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeUp}
                  className="premium-card p-8 flex gap-5 items-start group"
                >
                  <div className={`shrink-0 rounded-xl p-3.5 border ${feature.iconBg}`}>
                    <FeatIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">{feature.title}</h3>
                    <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================== TESTIMONIALS ============================== */}
      <section className="py-28 px-4 md:px-8 border-t border-indigo-100/60">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3 block">Student Reviews</span>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">Loved by developers</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((test, i) => (
              <motion.div
                key={i}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
                className="premium-card p-7 flex flex-col justify-between relative overflow-hidden"
              >
                {/* Gradient accent stripe */}
                <div className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${test.gradient} rounded-l-xl`} />
                
                <div className="pl-3">
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(test.rating)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>
                
                <div className="mt-6 flex items-center gap-3 border-t border-indigo-100/60 pt-5 pl-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${test.gradient} font-bold text-xs text-white shadow-md`}>
                    {test.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{test.name}</h4>
                    <span className="text-xs text-slate-400">{test.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== CTA + FOOTER ============================== */}
      <footer className="border-t border-indigo-100/60 pt-20 pb-12 px-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          
          {/* CTA Banner */}
          <div className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center mb-20 bg-gradient-to-br from-indigo-500 via-violet-600 to-fuchsia-500">
            {/* Decorative orbs */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl" />
            
            <h3 className="text-3xl font-black text-white md:text-4xl relative z-10 drop-shadow-lg">
              Ready to start building?
            </h3>
            <p className="mt-4 text-sm text-indigo-100 max-w-md mx-auto relative z-10">
              Join thousands of developers learning to code with interactive lessons, quizzes, and real projects.
            </p>
            <div className="mt-8 relative z-10">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-9 py-4 text-sm font-bold text-indigo-600 shadow-xl shadow-black/10 hover:bg-indigo-50 transition-all hover:scale-[1.03] active:scale-[0.98]"
              >
                Get Started — It&apos;s Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Footer nav */}
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-white">
                <Terminal className="h-4 w-4" />
              </div>
              <span>LearnCode<span className="text-gradient-primary">Academy</span></span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-slate-400 font-medium">
              <Link href="/catalog" className="hover:text-indigo-600 transition-colors">Courses</Link>
              <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
              <Link href="/profile" className="hover:text-indigo-600 transition-colors">Profile</Link>
              <a href="mailto:support@learncode.academy" className="hover:text-indigo-600 transition-colors">Contact</a>
            </div>

            <span className="text-xs text-slate-300 font-medium">
              &copy; {new Date().getFullYear()} LearnCode Academy
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
