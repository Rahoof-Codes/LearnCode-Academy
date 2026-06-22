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
      transition: { delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }
    })
  };

  const stats = [
    { label: "Learning Tracks", value: "5", icon: Globe, accent: "text-cyan-400" },
    { label: "Courses", value: "30+", icon: Code, accent: "text-amber-400" },
    { label: "Lessons", value: "34+", icon: BookOpen, accent: "text-emerald-400" },
    { label: "Students", value: "12,840+", icon: Flame, accent: "text-rose-400" },
  ];

  const features = [
    {
      title: "Live Code Sandboxes",
      description: "Write and run code directly in your browser with multi-language support. No setup, no installs — just open and code.",
      icon: Terminal,
      accent: "from-cyan-500 to-cyan-400",
      iconBg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Smart Quiz Engine",
      description: "Test your knowledge with intelligent MCQ quizzes after every lesson. Get instant feedback, explanations, and XP rewards.",
      icon: Zap,
      accent: "from-amber-500 to-amber-400",
      iconBg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Gamified Progression",
      description: "Earn XP, level up, maintain learning streaks, and unlock achievement badges. Turn learning into an adventure.",
      icon: Trophy,
      accent: "from-emerald-500 to-emerald-400",
      iconBg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Verified Certificates",
      description: "Complete courses to receive digitally signed certificates with unique verification hashes. Showcase your skills professionally.",
      icon: Shield,
      accent: "from-violet-500 to-violet-400",
      iconBg: "bg-violet-500/10 border-violet-500/20",
    },
  ];

  const testimonials = [
    {
      name: "Alexander Mercer",
      role: "Junior Web Developer",
      quote: "LearnCode Academy helped me go from complete beginner to landing my first React developer role in 8 months. The structured tracks are unbeatable.",
      rating: 5,
    },
    {
      name: "Sofia Rodriguez",
      role: "Data Analyst",
      quote: "The PyTorch and Pandas courses are incredibly well organized. The bite-sized lessons make it easy to study machine learning between work hours.",
      rating: 5,
    },
    {
      name: "Ethan Chen",
      role: "CS Student",
      quote: "Writing Rust and C++ exercises in the sandbox was pure joy. Having compilers run immediately in the browser saved so much setup time.",
      rating: 5,
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
        {/* Ambient glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[600px] w-[800px] rounded-full bg-cyan-500/[0.07] blur-[160px]" />
        <div className="absolute top-40 right-0 -z-10 h-[400px] w-[400px] rounded-full bg-amber-500/[0.04] blur-[120px]" />
        
        <div className="mx-auto max-w-6xl">
          {/* Centered layout */}
          <div className="flex flex-col items-center text-center">
            
            {/* Status badge */}
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
              <span className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20 mb-8">
                <Sparkles className="h-3.5 w-3.5" />
                30+ Interactive Courses Available
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-5xl font-black tracking-tight leading-[1.1] sm:text-6xl md:text-7xl lg:text-8xl max-w-4xl"
            >
              Learn to code.
              <br />
              <span className="text-gradient-primary">Build anything.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="mt-8 max-w-2xl text-lg text-zinc-400 leading-relaxed md:text-xl"
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
                className="group flex items-center gap-2.5 rounded-xl bg-cyan-500 px-8 py-4 text-sm font-bold text-zinc-950 shadow-lg shadow-cyan-500/25 hover:bg-cyan-400 hover:shadow-cyan-400/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Learning Free
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                href="/catalog"
                className="rounded-xl bg-zinc-900 border border-zinc-800 px-8 py-4 text-sm font-bold text-white hover:bg-zinc-800 hover:border-zinc-700 transition-all"
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
              className="mt-16 flex flex-wrap items-center justify-center gap-8 text-xs text-zinc-500 font-medium"
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
      <section className="border-y border-zinc-800/80 py-6 px-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-zinc-800/80">
            {stats.map((stat, i) => {
              const StatIcon = stat.icon;
              return (
                <div key={i} className="flex items-center justify-center gap-3 py-4 px-2">
                  <StatIcon className={`h-5 w-5 ${stat.accent}`} />
                  <div>
                    <span className="text-2xl font-black text-white">{stat.value}</span>
                    <span className="ml-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">{stat.label}</span>
                  </div>
                </div>
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
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3 block">Curated Pathways</span>
              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Learning Tracks</h2>
              <p className="mt-3 text-zinc-400 max-w-lg text-sm leading-relaxed">
                Follow structured roadmaps designed by industry professionals. Each track takes you from fundamentals to advanced mastery.
              </p>
            </div>
            <Link
              href="/catalog"
              className="self-start md:self-auto inline-flex items-center gap-1.5 text-sm font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              View all courses <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                    <div className="glass-panel glass-panel-hover rounded-2xl p-6 h-full">
                      <div className={`inline-flex rounded-xl bg-gradient-to-br ${track.gradient} p-3 text-white shadow-lg`}>
                        <TrackIcon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-white">{track.title}</h3>
                      <p className="mt-2 text-sm text-zinc-400 leading-relaxed line-clamp-2">{track.description}</p>
                      <div className="mt-5 flex items-center gap-1.5 text-xs font-bold text-cyan-400">
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
      <section className="py-28 px-4 md:px-8 border-t border-zinc-800/80">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-20">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 block">Platform Features</span>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Everything you need to succeed</h2>
            <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-sm leading-relaxed">
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
                  className="glass-panel rounded-2xl p-8 flex gap-5 items-start group hover:border-zinc-700/50 transition-all"
                >
                  <div className={`shrink-0 rounded-xl p-3 border ${feature.iconBg}`}>
                    <FeatIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                    <p className="mt-2 text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============================== TESTIMONIALS ============================== */}
      <section className="py-28 px-4 md:px-8 border-t border-zinc-800/80">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 block">Student Reviews</span>
            <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">Loved by developers</h2>
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
                className="glass-panel rounded-2xl p-7 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(test.rating)].map((_, idx) => (
                      <Star key={idx} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-300">
                    &ldquo;{test.quote}&rdquo;
                  </p>
                </div>
                
                <div className="mt-6 flex items-center gap-3 border-t border-zinc-800/80 pt-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 font-bold text-xs text-zinc-950">
                    {test.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{test.name}</h4>
                    <span className="text-xs text-zinc-500">{test.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== CTA + FOOTER ============================== */}
      <footer className="border-t border-zinc-800/80 pt-20 pb-12 px-4 md:px-8">
        <div className="mx-auto max-w-6xl">
          
          {/* CTA Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-zinc-800 p-10 md:p-16 text-center mb-20">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.06] via-transparent to-amber-500/[0.04] pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-40 w-80 bg-cyan-500/[0.08] blur-[100px]" />
            
            <h3 className="text-3xl font-black text-white md:text-4xl relative z-10">
              Ready to start building?
            </h3>
            <p className="mt-4 text-sm text-zinc-400 max-w-md mx-auto relative z-10">
              Join thousands of developers learning to code with interactive lessons, quizzes, and real projects.
            </p>
            <div className="mt-8 relative z-10">
              <Link
                href="/catalog"
                className="inline-flex items-center gap-2.5 rounded-xl bg-cyan-500 px-8 py-4 text-sm font-bold text-zinc-950 shadow-lg shadow-cyan-500/20 hover:bg-cyan-400 transition-all hover:scale-[1.02]"
              >
                Get Started — It&apos;s Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Footer nav */}
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <div className="flex items-center gap-2 font-bold text-white">
              <Terminal className="h-5 w-5 text-cyan-400" />
              <span>LearnCode<span className="text-cyan-400">Academy</span></span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-zinc-500">
              <Link href="/catalog" className="hover:text-white transition-colors">Courses</Link>
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
              <a href="mailto:support@learncode.academy" className="hover:text-white transition-colors">Contact</a>
            </div>

            <span className="text-xs text-zinc-600">
              &copy; {new Date().getFullYear()} LearnCode Academy
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
