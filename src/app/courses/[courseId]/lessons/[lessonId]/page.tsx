"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "../../../../../lib/db";
import Link from "next/link";
import Quiz from "../../../../../components/Quiz";
import { 
  Play, Check, Terminal as ConsoleIcon, ArrowLeft, ArrowRight, 
  Cpu, RotateCcw, ShieldCheck, Loader2, BookOpen
} from "lucide-react";

// Mock starter templates for coding editor
const CODE_TEMPLATES: Record<string, string> = {
  html: `<!-- Create an HTML heading and a description paragraph -->\n<div class="card">\n  <h1>Welcome to LearnCode</h1>\n  <p>Modify this markup to start your learning sandbox.</p>\n</div>`,
  css: `/* Add background gradients and rounded borders to your cards */\n.card {\n  background: linear-gradient(135deg, #1e293b, #0f172a);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  border-radius: 12px;\n  padding: 24px;\n  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);\n}`,
  javascript: `// Write a function to check if a number is prime\nfunction isPrime(num) {\n  if (num <= 1) return false;\n  for (let i = 2; i <= Math.sqrt(num); i++) {\n    if (num % i === 0) return false;\n  }\n  return true;\n}\n\nconsole.log("Is 17 prime?:", isPrime(17));\nconsole.log("Is 42 prime?:", isPrime(42));`,
  python: `# Compute the fibonacci sequence up to N terms\ndef fibonacci(n):\n    sequence = [0, 1]\n    while len(sequence) < n:\n        sequence.append(sequence[-1] + sequence[-2])\n    return sequence[:n]\n\nprint("Fibonacci(10):", fibonacci(10))`,
  typescript: `// Declare typings for a custom developer profile\ninterface Developer {\n  name: string;\n  languages: string[];\n  isSenior: boolean;\n}\n\nconst dev: Developer = {\n  name: "Learner",\n  languages: ["TypeScript", "Rust"],\n  isSenior: false\n};\n\nconsole.log(\`Developer profile created for \${dev.name}\`);`,
  cpp: `// Standard C++ program printing execution headers\n#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<std::string> tools = {"Git", "Docker", "K8s"};\n    std::cout << "DevOps deployment sandbox initialized." << std::endl;\n    return 0;\n}`,
  rust: `// Rust variables binding ownership print\nfn main() {\n    let name = String::from("Rustacean");\n    let greeting = &name;\n    println!("Greetings, {}!", greeting);\n}`,
  go: `// Go concurrency channels initialization\npackage main\n\nimport "fmt"\n\nfunc main() {\n    messages := make(chan string)\n    go func() { messages <- "ping" }()\n    fmt.Println("Channel received:", <-messages)\n}`
};

export default function LessonWorkspace() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const { courses, user, completeLesson } = useApp();
  const course = courses.find((c) => c.id === courseId);

  // Lesson list navigation
  const allLessons = course ? course.modules.flatMap(m => m.lessons) : [];
  const currentLessonIdx = allLessons.findIndex(l => l.id === lessonId);
  const currentLesson = allLessons[currentLessonIdx];

  // States
  const [lessonMarkdown, setLessonMarkdown] = useState("");
  const [isLoadingMarkdown, setIsLoadingMarkdown] = useState(true);
  
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [editorCode, setEditorCode] = useState("");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isCompiling, setIsCompiling] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  // Determine initial language based on course metadata
  useEffect(() => {
    if (!course) return;
    const cid = course.id;
    if (cid === "html" || cid === "css" || cid === "javascript" || cid === "typescript" || cid === "python" || cid === "rust" || cid === "go" || cid === "cpp" || cid === "c-lang") {
      setSelectedLanguage(cid === "c-lang" ? "cpp" : cid);
    } else {
      setSelectedLanguage("javascript");
    }
  }, [course]);

  // Set editor template when language changes
  useEffect(() => {
    setEditorCode(CODE_TEMPLATES[selectedLanguage] || CODE_TEMPLATES.javascript);
  }, [selectedLanguage]);

  // Fetch lesson markdown file
  useEffect(() => {
    const fetchMarkdown = async () => {
      setIsLoadingMarkdown(true);
      try {
        const res = await fetch(`/api/lessons/${lessonId}`);
        if (res.ok) {
          const data = await res.json();
          setLessonMarkdown(data.content);
        } else {
          setLessonMarkdown(`# Error\nFailed to load lesson content. Please verify that this markdown file exists in \`src/data/lessons/${lessonId}.md\``);
        }
      } catch (err) {
        setLessonMarkdown("# Error\nFailed to reach server filesystem.");
      } finally {
        setIsLoadingMarkdown(false);
      }
    };
    fetchMarkdown();
    
    // Check if user already completed this lesson
    if (user && user.completedLessons.includes(lessonId)) {
      setIsLessonCompleted(true);
    } else {
      setIsLessonCompleted(false);
    }
  }, [lessonId, user]);

  if (!course || !currentLesson) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-8 bg-background text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Lesson Not Found</h2>
        <p className="text-slate-400 mb-6">The lesson you are looking for does not exist in this course curriculum.</p>
        <Link href="/dashboard" className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  // Handle Run Code simulation
  const handleRunCode = () => {
    setIsCompiling(true);
    setConsoleLogs(["Initializing compilation sandbox...", `Setting runtime: ${selectedLanguage.toUpperCase()} environment`]);
    
    setTimeout(() => {
      setIsCompiling(false);
      // Simulate stdout based on language
      if (selectedLanguage === "javascript") {
        setConsoleLogs([
          "Compilation successful.",
          "Is 17 prime?: true",
          "Is 42 prime?: false",
          "",
          "Process completed with exit code: 0"
        ]);
      } else if (selectedLanguage === "python") {
        setConsoleLogs([
          "Execution completed in 0.08s.",
          "Fibonacci(10): [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]",
          "",
          "Process completed with exit code: 0"
        ]);
      } else if (selectedLanguage === "rust") {
        setConsoleLogs([
          "cargo build --release ... OK",
          "Running target/release/main",
          "Greetings, Rustacean!",
          "",
          "Process completed with exit code: 0"
        ]);
      } else {
        setConsoleLogs([
          "Loading output logs...",
          "Syntax checked: 0 warnings, 0 errors.",
          "Simulation executed successfully.",
          "Check terminal hooks inside container."
        ]);
      }
    }, 1000);
  };

  // Handle Submit Code Challenge
  const handleSubmitChallenge = async () => {
    setIsSubmitting(true);
    setConsoleLogs([
      "Asserting code blocks...",
      "Running Test Suite 1: Checking variables declaration constraints...",
      "Running Test Suite 2: Validating logical return structures..."
    ]);

    setTimeout(async () => {
      setIsSubmitting(false);
      setConsoleLogs(prev => [
        ...prev,
        "Test Suite 1: PASSED",
        "Test Suite 2: PASSED",
        "STATUS: ALL ASSERTIONS PASSED! 🎉",
        `Earned: +${currentLesson.xp} Lesson Completion XP!`
      ]);
      
      // Call state action to save lesson progress
      await completeLesson(courseId, lessonId);
      setIsLessonCompleted(true);
    }, 1500);
  };

  // Helper to parse boilerplate markdown text safely on client
  const renderMD = (mdText: string) => {
    const lines = mdText.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("# ")) {
        return <h1 key={i} className="text-2xl font-extrabold text-white mt-4 mb-2">{line.substring(2)}</h1>;
      }
      if (line.startsWith("## ")) {
        return <h2 key={i} className="text-xl font-bold text-white mt-6 mb-3 border-b border-white/10 pb-1">{line.substring(3)}</h2>;
      }
      if (line.startsWith("### ")) {
        return <h3 key={i} className="text-md font-bold text-white mt-4 mb-2">{line.substring(4)}</h3>;
      }
      if (line.startsWith("- ")) {
        return <li key={i} className="ml-4 list-disc text-slate-300 text-sm mb-1.5">{line.substring(2)}</li>;
      }
      if (line.trim().startsWith("```")) {
        return null;
      }
      if (line.trim() === "") {
        return <div key={i} className="h-2" />;
      }
      return <p key={i} className="text-slate-300 text-sm leading-relaxed mb-3">{line}</p>;
    });
  };

  // Next/Previous lessons routes
  const prevLesson = currentLessonIdx > 0 ? allLessons[currentLessonIdx - 1] : null;
  const nextLesson = currentLessonIdx < allLessons.length - 1 ? allLessons[currentLessonIdx + 1] : null;

  return (
    <div className="flex flex-1 flex-col lg:flex-row h-[calc(100vh-62px)] overflow-hidden">
      
      {/* ================= LEFT SPLIT PANEL: LESSON TEXT & QUIZ ================= */}
      <div className="w-full lg:w-1/2 flex flex-col border-r border-white/5 bg-background overflow-y-auto">
        
        {/* Navigation header banner */}
        <div className="sticky top-0 z-10 glass-panel flex items-center justify-between px-6 py-3.5 border-b border-white/5">
          <Link href={`/courses/${courseId}`} className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" /> Syllabus
          </Link>
          
          <span className="text-xs font-semibold text-slate-400 truncate max-w-[200px]">
            {currentLesson.title}
          </span>

          <div className="flex items-center gap-2">
            {prevLesson && (
              <button
                onClick={() => router.push(`/courses/${courseId}/lessons/${prevLesson.id}`)}
                title="Previous Lesson"
                className="rounded bg-slate-900 border border-white/5 p-1.5 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            )}
            {nextLesson && (
              <button
                onClick={() => router.push(`/courses/${courseId}/lessons/${nextLesson.id}`)}
                title="Next Lesson"
                className="rounded bg-slate-900 border border-white/5 p-1.5 text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Lesson Material */}
        <div className="p-6 md:p-8 flex-1 space-y-6 max-w-2xl mx-auto w-full">
          {isLoadingMarkdown ? (
            <div className="flex flex-col items-center justify-center p-20 space-y-2">
              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
              <span className="text-xs text-slate-500 font-semibold">Reading markdown files...</span>
            </div>
          ) : (
            <article className="prose prose-invert max-w-none">
              {renderMD(lessonMarkdown)}
            </article>
          )}

          {/* Quiz Injection */}
          {currentLesson.quiz && (
            <Quiz 
              courseId={courseId} 
              lessonId={lessonId} 
              quizData={currentLesson.quiz}
              onPass={() => {
                setConsoleLogs(prev => [
                  ...prev,
                  "Quiz verification passed! XP updated."
                ]);
              }}
            />
          )}

          {/* Bottom Complete State Indicator */}
          <div className="pt-8 border-t border-white/5 flex items-center justify-between gap-4">
            {isLessonCompleted ? (
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2">
                <Check className="h-4 w-4" /> Lesson Verified Complete
              </div>
            ) : (
              <button
                onClick={handleSubmitChallenge}
                className="rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs px-6 py-2.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Mark Lesson as Complete
              </button>
            )}
            
            {nextLesson && isLessonCompleted && (
              <button
                onClick={() => router.push(`/courses/${courseId}/lessons/${nextLesson.id}`)}
                className="flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2.5 transition-all shadow-md"
              >
                Next Lesson <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

      </div>

      {/* ================= RIGHT SPLIT PANEL: INTERACTIVE MOCK IDE ================= */}
      <div className="w-full lg:w-1/2 flex flex-col bg-slate-950/80 overflow-hidden">
        
        {/* Editor controls headers */}
        <div className="glass-panel flex items-center justify-between px-6 py-3.5 border-b border-white/5 bg-slate-900/40">
          <div className="flex items-center gap-2">
            <ConsoleIcon className="h-4.5 w-4.5 text-slate-400" />
            <span className="text-xs font-bold text-slate-300">Code Sandbox</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Select */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="glass-input px-2.5 py-1 text-xs cursor-pointer focus:border-blue-500/50"
            >
              <option value="html">HTML5</option>
              <option value="css">CSS3</option>
              <option value="javascript">JavaScript</option>
              <option value="typescript">TypeScript</option>
              <option value="python">Python 3</option>
              <option value="rust">Rust</option>
              <option value="go">Go Lang</option>
            </select>

            {/* Run Button */}
            <button
              onClick={handleRunCode}
              disabled={isCompiling || isSubmitting}
              className="flex items-center gap-1 rounded bg-slate-900 hover:bg-slate-800 text-xs font-bold px-3 py-1.5 border border-white/10 transition-all text-slate-200 hover:text-white cursor-pointer"
            >
              {isCompiling ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5 fill-slate-300" />
              )}
              Run Code
            </button>

            {/* Submit Button */}
            <button
              onClick={handleSubmitChallenge}
              disabled={isCompiling || isSubmitting}
              className="flex items-center gap-1 rounded bg-blue-600 hover:bg-blue-500 text-xs font-bold px-3.5 py-1.5 text-white transition-all hover:scale-103 shadow shadow-blue-500/10 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShieldCheck className="h-3.5 w-3.5" />
              )}
              Submit Code
            </button>
          </div>
        </div>

        {/* Code Editor Body Panel */}
        <div className="flex-1 flex overflow-hidden relative">
          {/* Simulated Line numbers gutter */}
          <div className="w-11 bg-slate-950 border-r border-white/5 py-4 text-right pr-2 text-slate-700 text-xs select-none font-mono">
            {Array.from({ length: 25 }).map((_, idx) => (
              <div key={idx} className="h-5">{idx + 1}</div>
            ))}
          </div>

          <textarea
            value={editorCode}
            onChange={(e) => setEditorCode(e.target.value)}
            className="flex-1 p-4 bg-slate-950/20 text-slate-300 font-mono text-xs outline-none resize-none overflow-y-auto leading-5"
          />
        </div>

        {/* Bottom Console Panel */}
        <div className="h-44 border-t border-white/5 bg-black flex flex-col">
          <div className="bg-slate-950 px-4 py-2 border-b border-white/5 flex items-center justify-between text-2xs text-slate-500 font-bold select-none uppercase tracking-wide">
            <span>Compiler Output</span>
            <button 
              onClick={() => setConsoleLogs([])}
              className="hover:text-slate-200 flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Clear
            </button>
          </div>
          
          <div className="flex-1 p-3 font-mono text-2xs overflow-y-auto space-y-1 text-indigo-400 select-text">
            {consoleLogs.length === 0 ? (
              <span className="text-slate-700 font-semibold italic">Console idle. Type code and click "Run Code" to view stdout results.</span>
            ) : (
              consoleLogs.map((log, i) => (
                <div 
                  key={i} 
                  className={
                    log.startsWith("Error") || log.startsWith("STATUS: ALL")
                      ? "text-emerald-400 font-semibold"
                      : log.includes("failed") || log.includes("FAILED")
                      ? "text-rose-400 font-semibold"
                      : log.startsWith("Assert") || log.startsWith("cargo")
                      ? "text-slate-500"
                      : "text-slate-300"
                  }
                >
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
