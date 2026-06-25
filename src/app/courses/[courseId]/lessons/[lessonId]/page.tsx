"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, useMemo } from "react";
import { useApp } from "../../../../../lib/db";
import Link from "next/link";
import { 
  Play, Check, Terminal as ConsoleIcon, ArrowLeft, ArrowRight, 
  Cpu, RotateCcw, ShieldCheck, Loader2, BookOpen, Lock, 
  CheckCircle2, AlertCircle, RefreshCw, XCircle, Award, LayoutList, ChevronRight, Languages
} from "lucide-react";
import Editor from "@monaco-editor/react";
import confetti from "canvas-confetti";
import { db, auth } from "../../../../../lib/firebase";
import { doc, updateDoc } from "firebase/firestore";
import { TAMIL_COURSES } from "../../../../../data/lessons/translated";
import { ENGLISH_COURSES } from "../../../../../data/lessons/english";
import { HandcraftedLesson, TamilLesson } from "../../../../../data/lessons/types";
// ================= HANDCRAFTED COURSE CONTENT DATABASE =================
// ================= DYNAMIC FALLBACK LESSON DATA GENERATOR =================
const getFallbackLessonData = (lessonId: string, title: string, courseId: string): HandcraftedLesson => {
  const language = courseId === "html" || courseId === "css" || courseId === "javascript" || courseId === "python" ? courseId : "javascript";
  return {
    title: title,
    content: [
      `Welcome to the lesson on "${title}". In this topic, we will explore the core concepts and standard architectural designs that form the foundation of this engineering discipline.`,
      `Understanding how to compile, build, and debug files in this runtime environment is critical for building production-grade services. Follow along with the code patterns and check the parameters carefully.`,
      `By completing the quiz and writing the syntax rules in the Monaco sandbox below, you will reinforce your comprehension and progress closer to earning your official course graduation certificate.`
    ],
    quiz: [
      {
        question: `Which of the following describes the key concept of "${title}"?`,
        options: [
          "It represents the base compilation element.",
          "It defines variables dynamically in global scope.",
          "It coordinates core layouts and processes data flows.",
          "All of the above."
        ],
        correctOption: 3,
        explanation: "This concept represents the standard architectural practice within this environment."
      },
      {
        question: `What is a common best practice when writing code for "${title}"?`,
        options: [
          "Avoid using placeholders and focus on semantic structure.",
          "Always handle error exceptions with try/catch blocks or proper logging.",
          "Optimize resource allocation by separating concerns.",
          "All of the above."
        ],
        correctOption: 3,
        explanation: "All of these choices are professional engineering standards."
      },
      {
        question: `How does completing the quiz and task affect course progress?`,
        options: [
          "It unlocks the coding sandbox and next topic.",
          "It stores scores and task completion in Firestore.",
          "It updates the course progress bar percentage at the top.",
          "All of the above."
        ],
        correctOption: 3,
        explanation: "All these actions occur as you complete the requirements."
      }
    ],
    task: {
      description: `Write a snippet of code in ${language.toUpperCase()} to demonstrate basic familiarity with "${title}". For JavaScript/Python, write a function named \`initChallenge()\` that returns the number \`42\`. For HTML, create a \`<div id="sandbox">42</div>\`. For CSS, define a style \`#sandbox { width: 42px; }\`.`,
      starterCode: language === "html" 
        ? `<!-- Create div with id "sandbox" -->\n<div id="sandbox"></div>`
        : language === "css"
        ? `/* Style div with width 42px */\n#sandbox {\n}`
        : language === "python"
        ? `def initChallenge():\n    # Return 42\n    pass`
        : `function initChallenge() {\n  // Return 42\n}`,
      language: language,
      expectedOutput: "42",
      expectedOutputDisplay: `1. Structure returning value 42.\n2. Uses correct syntactical bindings for ${language.toUpperCase()}.`,
      validate: (code: string) => {
        const clean = (s: string) => s.replace(/\s+/g, "").toLowerCase();
        let isPassed = false;
        const logs = ["Running fallback validation assertions..."];
        if (language === "html") {
          isPassed = clean(code).includes(clean('<divid="sandbox">42</div>'));
          logs.push(`Assert: <div id="sandbox">42</div> element present -> ${isPassed ? "PASSED" : "FAILED"}`);
        } else if (language === "css") {
          isPassed = clean(code).includes(clean("width:42px"));
          logs.push(`Assert: selector with width: 42px; -> ${isPassed ? "PASSED" : "FAILED"}`);
        } else if (language === "python") {
          isPassed = /def initChallenge\s*\(\s*\)\s*:/i.test(code) && /return\s+42/i.test(code);
          logs.push(`Assert: python function initChallenge returns 42 -> ${isPassed ? "PASSED" : "FAILED"}`);
        } else {
          try {
            const userFn = new Function(`${code}\nreturn initChallenge;`)();
            const res = userFn();
            isPassed = res === 42;
            logs.push(`Assert: initChallenge() returns 42 -> ${isPassed ? "PASSED" : "FAILED"}`);
          } catch (err: any) {
            logs.push(`Error running JavaScript code: ${err.message}`);
          }
        }
        return { isPassed, logs };
      }
    }
  };
};

export default function LessonWorkspace() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const { courses, user, completeLesson, completeQuiz, isFirebaseActive, loading } = useApp();

  // Redirect guest users to sign-in page
  useEffect(() => {
    if (!loading && !user) {
      router.push("/signin");
    }
  }, [user, loading, router]);
  const course = courses.find((c) => c.id === courseId);

  // Dynamic syllabus modules injection specifically for html course
  let courseModules = course ? [...course.modules] : [];
  if (courseId === "html" && courseModules.length > 0) {
    courseModules = [
      {
        id: "html-intro",
        title: "Introduction to HTML",
        lessons: [
          {
            id: "html-basics",
            title: "HTML Syntax and Structure",
            duration: "20 mins",
            xp: 100,
            contentFile: "html-basics.md"
          },
          {
            id: "semantic-html",
            title: "Semantic Markup and Accessibility",
            duration: "25 mins",
            xp: 120,
            contentFile: "semantic-html.md"
          },
          {
            id: "html-doc-structure",
            title: "HTML Document Structure",
            duration: "20 mins",
            xp: 110,
            contentFile: "html-doc-structure.md"
          },
          {
            id: "html-attributes",
            title: "HTML Attributes & Global Attributes",
            duration: "20 mins",
            xp: 110,
            contentFile: "html-attributes.md"
          }
        ]
      },
      {
        id: "html-media-lists",
        title: "Links, Images and Lists",
        lessons: [
          {
            id: "html-links-images",
            title: "Hyperlinks and Images",
            duration: "20 mins",
            xp: 110,
            contentFile: "html-links-images.md"
          },
          {
            id: "html-lists",
            title: "Lists (Ordered & Unordered)",
            duration: "15 mins",
            xp: 100,
            contentFile: "html-lists.md"
          },
          {
            id: "html-block-inline",
            title: "Block vs Inline Elements",
            duration: "20 mins",
            xp: 110,
            contentFile: "html-block-inline.md"
          },
          {
            id: "html-meta-head",
            title: "Meta Tags & Head Elements",
            duration: "25 mins",
            xp: 120,
            contentFile: "html-meta-head.md"
          }
        ]
      },
      {
        id: "html-advanced-elements",
        title: "Tables and Forms",
        lessons: [
          {
            id: "html-tables",
            title: "HTML Tabular Data",
            duration: "25 mins",
            xp: 120,
            contentFile: "html-tables.md"
          },
          {
            id: "html-form-elements",
            title: "Building Forms and Input Types",
            duration: "30 mins",
            xp: 150,
            contentFile: "html-form-elements.md"
          },
          {
            id: "html-entities",
            title: "HTML Entities & Special Characters",
            duration: "15 mins",
            xp: 100,
            contentFile: "html-entities.md"
          }
        ]
      },
      {
        id: "html-embedding-apis",
        title: "Multimedia & Embedding",
        lessons: [
          {
            id: "html-multimedia",
            title: "Multimedia Audio and Video",
            duration: "20 mins",
            xp: 110,
            contentFile: "html-multimedia.md"
          },
          {
            id: "html-iframes",
            title: "Iframes & Embedding Content",
            duration: "20 mins",
            xp: 120,
            contentFile: "html-iframes.md"
          },
          {
            id: "html5-apis",
            title: "HTML5 APIs (Storage & Drag/Drop)",
            duration: "25 mins",
            xp: 130,
            contentFile: "html5-apis.md"
          }
        ]
      }
    ];
  }

  // Lesson list navigation
  const allLessons = courseId === "html" 
    ? courseModules.flatMap(m => m.lessons)
    : (course ? course.modules.flatMap(m => m.lessons) : []);

  const currentLessonIdx = allLessons.findIndex(l => l.id === lessonId);
  const currentLesson = allLessons[currentLessonIdx];

  // Handcrafted or dynamic lesson details
  const activeLessonData: HandcraftedLesson = useMemo(() => {
    return ENGLISH_COURSES[lessonId] || 
      getFallbackLessonData(lessonId, currentLesson?.title || "Lesson Topic", courseId);
  }, [lessonId, currentLesson?.title, courseId]);

  // Language state (persisted to localStorage)
  const [courseLang, setCourseLang] = useState<"en" | "ta">("en");

  // Load saved language preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("learncode_lang") as "en" | "ta" | null;
      if (saved === "ta" || saved === "en") setCourseLang(saved);
    }
  }, []);

  const toggleLanguage = (lang: "en" | "ta") => {
    setCourseLang(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("learncode_lang", lang);
    }
  };

  // Get Tamil translation for the current lesson (if HTML/CSS course and Tamil selected)
  const tamilData: TamilLesson | null = ((courseId === "html" || courseId === "css" || courseId === "javascript") && courseLang === "ta") ? (TAMIL_COURSES[lessonId] || null) : null;

  // States
  const [activeTab, setActiveTab] = useState<"content" | "quiz" | "task">("content");
  const [contentRead, setContentRead] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [isLessonCompleted, setIsLessonCompleted] = useState(false);

  // Quiz States
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Code Sandbox States
  const [editorCode, setEditorCode] = useState("");
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  
  // Console Tab Controller: "logs" | "preview"
  const [consoleTab, setConsoleTab] = useState<"logs" | "preview">("logs");

  const containerRef = useRef<HTMLDivElement>(null);

  // Synchronize completion and pass states from context user profile
  useEffect(() => {
    if (user) {
      const isCompleted = user.completedLessons.includes(lessonId);
      setIsLessonCompleted(isCompleted);
      
      const hasPassedQuiz = user.completedQuizzes[lessonId]?.score >= 60 || user.completedQuizzes[lessonId]?.passed || isCompleted;
      setQuizPassed(!!hasPassedQuiz);
      
      if (isCompleted || hasPassedQuiz) {
        setContentRead(true);
      }
    }
  }, [lessonId, user]);

  // Set default starter code template
  useEffect(() => {
    setEditorCode(activeLessonData.task.starterCode);
    setConsoleLogs([]);
    setConsoleTab("logs");
    
    // Reset quiz state when switching lessons
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
    
    // Automatically open to appropriate tab
    if (user?.completedLessons?.includes(lessonId)) {
      setActiveTab("task");
    } else {
      setActiveTab("content");
    }
  }, [lessonId, activeLessonData]);

  // Check if content fits in container without scrolling
  useEffect(() => {
    if (containerRef.current && activeTab === "content") {
      const { scrollHeight, clientHeight } = containerRef.current;
      if (scrollHeight <= clientHeight) {
        setContentRead(true);
      }
    }
  }, [lessonId, activeTab, activeLessonData]);

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

  // Calculate Course Progress Bar
  const completedInCourseCount = allLessons.filter(l => user?.completedLessons?.includes(l.id) || false).length;
  const overallProgress = allLessons.length > 0 ? Math.round((completedInCourseCount / allLessons.length) * 100) : 0;

  // Next/Previous navigation
  const prevLesson = currentLessonIdx > 0 ? allLessons[currentLessonIdx - 1] : null;
  const nextLesson = currentLessonIdx < allLessons.length - 1 ? allLessons[currentLessonIdx + 1] : null;

  const getTopicStatus = (lesId: string) => {
    if (user?.completedLessons?.includes(lesId)) {
      return "completed";
    }
    const idx = allLessons.findIndex(l => l.id === lesId);
    if (idx === -1) return "locked";
    if (idx === 0) return "unlocked";
    
    // Unlocked if previous is completed
    const prevLes = allLessons[idx - 1];
    if (user?.completedLessons?.includes(prevLes.id)) {
      return "unlocked";
    }
    return "locked";
  };

  // Scroll detection to unlock "Take Quiz" button
  const handleScroll = () => {
    if (!containerRef.current || contentRead || activeTab !== "content") return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 30) {
      setContentRead(true);
    }
  };

  // Quiz Handling
  const handleQuizOptionClick = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null || isAnswered) return;
    const isCorrect = selectedOption === activeLessonData.quiz[currentQuestionIdx].correctOption;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleQuizNext = async () => {
    if (currentQuestionIdx < activeLessonData.quiz.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz completed - calculate score
      const finalScore = Math.round((correctCount / activeLessonData.quiz.length) * 100);
      const passed = finalScore >= 60;
      
      // Save quiz progress in Firestore/database
      await completeQuiz(courseId, lessonId, finalScore);
      
      setQuizPassed(passed);
      setQuizFinished(true);

      if (passed) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      }
    }
  };

  const handleQuizRetry = () => {
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  // Safe client-side async script evaluator
  const runAsyncCode = async (code: string) => {
    return new Promise<{ isPassed: boolean; logs: string[] }>(async (resolve) => {
      const logs = ["Evaluating JS Promise script in runtime sandbox...", "Awaiting resolution of promise..."];
      try {
        const userFn = new Function(`${code}\nreturn fetchData;`)();
        const start = Date.now();
        const res = await userFn();
        const elapsed = Date.now() - start;
        logs.push(`Promise resolved to: "${res}" in ${elapsed}ms`);
        
        const correct = res === "Success!";
        const hasDelay = elapsed >= 80;
        
        logs.push(`Assert: promise returned "Success!" -> ${correct ? "PASSED" : "FAILED"}`);
        logs.push(`Assert: promise executed asynchronously -> ${hasDelay ? "PASSED" : "FAILED"}`);
        
        resolve({ isPassed: correct && hasDelay, logs });
      } catch (err: any) {
        logs.push(`Runtime error: ${err.message}`);
        resolve({ isPassed: false, logs });
      }
    });
  };

  // Run & Verify Code logic
  const handleRunAndVerifyCode = async () => {
    setIsRunning(true);
    setConsoleLogs([
      "Initializing compilation sandbox...",
      `Setting runtime: ${activeLessonData.task.language.toUpperCase()} environment`,
      "Running compiler assertions & executing code..."
    ]);
    setConsoleTab("logs");
    
    setTimeout(async () => {
      let validationResult;
      if (lessonId === "js-promises") {
        validationResult = await runAsyncCode(editorCode);
      } else {
        validationResult = activeLessonData.task.validate(editorCode);
      }
      
      const newLogs = [
        "Compilation successful.",
        "Code executed successfully.",
        ...validationResult.logs
      ];

      if (validationResult.isPassed) {
        newLogs.push(
          "",
          "STATUS: ALL ASSERTIONS PASSED! 🎉",
          `Earned: +${currentLesson.xp} Lesson Completion XP!`
        );
        setConsoleLogs(newLogs);
        
        // Trigger Confetti
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 }
        });
        
        // Mark lesson completed in Firestore & context state
        await completeLesson(courseId, lessonId);
        setIsLessonCompleted(true);

        // Track task status in Firestore explicitly if logged in
        if (isFirebaseActive && auth?.currentUser && db) {
          try {
            const userDocRef = doc(db, "users", auth.currentUser.uid);
            await updateDoc(userDocRef, {
              [`completedTasks.${lessonId}`]: true
            });
          } catch (err) {
            console.error("Firestore sync task status failed:", err);
          }
        }
        
        // Swap tab to visual output when run HTML/CSS to show what they built
        if (activeLessonData.task.language === "html" || activeLessonData.task.language === "css") {
          setTimeout(() => {
            setConsoleTab("preview");
          }, 1500);
        }
      } else {
        newLogs.push(
          "",
          "STATUS: ASSERTIONS FAILED. ❌ Please review expected output logic and correct rules."
        );
        setConsoleLogs(newLogs);
      }
      setIsRunning(false);
    }, 1200);
  };

  // Format markdown helper
  const renderMD = (paragraphs: string[]) => {
    return paragraphs.map((para, i) => (
      <p key={i} className="text-slate-600 text-sm leading-relaxed mb-4">{para}</p>
    ));
  };

  // Modules selector list rendering
  const modulesToRender = courseId === "html" ? courseModules : (course ? course.modules : []);

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-62px)] overflow-hidden bg-slate-50/50">
      
      {/* Top Header / Completion Bar */}
      <div className="glass-panel border-b border-indigo-100/60 px-6 py-3 flex flex-wrap gap-4 items-center justify-between bg-white/90 z-20">
        <div className="flex items-center gap-4">
          <Link 
            href={`/courses/${courseId}`} 
            className="text-xs font-bold text-slate-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Syllabus
          </Link>
          <span className="text-slate-300 font-medium">|</span>
          <div className="flex flex-col">
            <span className="text-2xs font-extrabold text-slate-400 uppercase tracking-wider">Active Lesson</span>
            <span className="text-xs font-bold text-slate-800 truncate max-w-[250px]">{currentLesson.title}</span>
          </div>
        </div>

        {/* Progress bar centered */}
        <div className="flex items-center gap-3 flex-1 max-w-md mx-auto justify-center">
          <span className="text-2xs font-bold text-slate-500 whitespace-nowrap">Course Progress:</span>
          <div className="w-full bg-indigo-50 h-2.5 rounded-full overflow-hidden relative border border-indigo-100/50">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full transition-all duration-500 rounded-full"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="text-xs font-extrabold text-indigo-600 whitespace-nowrap">{overallProgress}%</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Toggle — for HTML & CSS courses */}
          {(courseId === "html" || courseId === "css" || courseId === "javascript") && (
            <div className="flex items-center gap-1 rounded-lg bg-slate-100 border border-indigo-100/50 p-0.5">
              <button
                onClick={() => toggleLanguage("en")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-2xs font-extrabold transition-all cursor-pointer ${
                  courseLang === "en"
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
                }`}
              >
                <span>🇬🇧</span> English
              </button>
              <button
                onClick={() => toggleLanguage("ta")}
                className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-2xs font-extrabold transition-all cursor-pointer ${
                  courseLang === "ta"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "text-slate-500 hover:text-orange-600 hover:bg-slate-50"
                }`}
              >
                <span>🇮🇳</span> தமிழ்
              </button>
            </div>
          )}

          {prevLesson && (
            <button
              onClick={() => router.push(`/courses/${courseId}/lessons/${prevLesson.id}`)}
              title="Previous Lesson"
              className="rounded bg-white hover:bg-indigo-50 border border-indigo-100/60 p-1.5 text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}
          {nextLesson && (
            <button
              onClick={() => router.push(`/courses/${courseId}/lessons/${nextLesson.id}`)}
              title="Next Lesson"
              className="rounded bg-white hover:bg-indigo-50 border border-indigo-100/60 p-1.5 text-slate-500 hover:text-indigo-600 transition-all cursor-pointer"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden relative">
        
        {/* ================= LEFT COLUMN: TOPIC SELECTOR SIDEBAR ================= */}
        <div className="w-64 border-r border-indigo-100/60 bg-white/50 flex flex-col h-full shrink-0 hidden md:flex">
          <div className="p-4 border-b border-indigo-100/50 flex items-center justify-between bg-slate-50/50">
            <span className="text-2xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
              <LayoutList className="h-3.5 w-3.5 text-indigo-500" /> Curriculum
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {modulesToRender.map((mod) => (
              <div key={mod.id} className="space-y-1.5">
                <h3 className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest pl-2">
                  {mod.title}
                </h3>
                
                <div className="space-y-1">
                  {mod.lessons.map((les) => {
                    const status = getTopicStatus(les.id);
                    const isActive = les.id === lessonId;
                    
                    let statusIcon = <Lock className="h-3.5 w-3.5 text-slate-300 shrink-0" />;
                    if (status === "completed") {
                      statusIcon = <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />;
                    } else if (status === "unlocked") {
                      statusIcon = <div className="h-3 w-3 rounded-full border border-slate-400 shrink-0" />;
                    }

                    return (
                      <button
                        key={les.id}
                        disabled={status === "locked"}
                        onClick={() => router.push(`/courses/${courseId}/lessons/${les.id}`)}
                        className={`w-full flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-2.5 text-xs transition-all text-left ${
                          isActive
                            ? "bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold"
                            : status === "locked"
                            ? "text-slate-400 cursor-not-allowed opacity-50"
                            : "text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600"
                        }`}
                      >
                        <span className="truncate flex-1">{les.title}</span>
                        {statusIcon}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= MIDDLE COLUMN: LESSON / QUIZ / TASK TABS ================= */}
        <div className="w-full lg:w-1/2 flex flex-col border-r border-indigo-100/60 bg-white overflow-hidden">
          
          {/* Tab Switcher Headers */}
          <div className="flex border-b border-indigo-100/50 bg-slate-50 p-1.5 gap-1.5 shrink-0">
            <button
              onClick={() => setActiveTab("content")}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === "content"
                  ? "bg-white text-indigo-600 border border-indigo-100/60 shadow-sm"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-white/50"
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Lesson Content
            </button>

            <button
              disabled={!contentRead}
              onClick={() => setActiveTab("quiz")}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                !contentRead ? "opacity-40 cursor-not-allowed text-slate-400" : ""
              } ${
                activeTab === "quiz"
                  ? "bg-white text-indigo-600 border border-indigo-100/60 shadow-sm"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-white/50"
              }`}
            >
              {quizPassed ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Award className="h-3.5 w-3.5" />
              )}
              Lesson Quiz
            </button>

            <button
              disabled={!quizPassed}
              onClick={() => setActiveTab("task")}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                !quizPassed ? "opacity-40 cursor-not-allowed text-slate-400" : ""
              } ${
                activeTab === "task"
                  ? "bg-white text-indigo-600 border border-indigo-100/60 shadow-sm"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-white/50"
              }`}
            >
              {!quizPassed ? (
                <Lock className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <Cpu className="h-3.5 w-3.5 text-indigo-500" />
              )}
              Coding Task
            </button>
          </div>

          {/* Dynamic Tab Body */}
          <div 
            id="lesson-content-container"
            ref={containerRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 select-text"
          >
            
            {/* TABS CONTAINER: CONTENT VIEW */}
            {activeTab === "content" && (
              <div className="space-y-6 max-w-2xl mx-auto w-full">
                <div className="space-y-2">
                  <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">{tamilData ? tamilData.title : activeLessonData.title}</h1>
                  <div className="h-1 w-20 bg-indigo-600 rounded-full" />
                  {tamilData && (
                    <span className="inline-flex items-center gap-1 text-2xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-full">
                      <Languages className="h-3 w-3" /> தமிழில் படிக்கிறீர்கள்
                    </span>
                  )}
                </div>
                
                <article className="prose max-w-none text-slate-600 animate-fade-in">
                  {renderMD(tamilData ? tamilData.content : activeLessonData.content)}
                </article>

                {/* Sticky scroll instructions / Take Quiz CTA */}
                <div className="pt-8 border-t border-indigo-100/50 flex flex-col items-center">
                  {!contentRead ? (
                    <div className="text-xs text-slate-500 font-semibold animate-pulse text-center">
                      Please read through all paragraphs to unlock the quiz...
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveTab("quiz")}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-3 transition-all hover:scale-103 shadow-md shadow-indigo-600/10 cursor-pointer"
                    >
                      Take Lesson Quiz <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* TABS CONTAINER: QUIZ SECTION */}
            {activeTab === "quiz" && (
              <div className="max-w-xl mx-auto w-full">
                {quizFinished ? (
                  <div className="glass-panel p-6 rounded-xl border border-indigo-100/50 space-y-5 text-center mt-4">
                    <Award className={`h-16 w-16 mx-auto ${quizPassed ? "text-amber-400" : "text-slate-400"}`} />
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-800">Quiz Completed</h3>
                      <p className="text-slate-600 text-sm">
                        You scored <span className="font-extrabold text-indigo-600">{correctCount}</span> out of{" "}
                        <span className="font-extrabold text-slate-800">{activeLessonData.quiz.length}</span> (
                        <span className="font-extrabold text-indigo-600">
                          {Math.round((correctCount / activeLessonData.quiz.length) * 100)}%
                        </span>).
                      </p>
                    </div>

                    {quizPassed ? (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-xs font-bold text-emerald-600">
                          <CheckCircle2 className="h-4 w-4" /> Passed (Requires ≥ 60%)
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto">
                          Awesome job! You have passed the quiz and unlocked the coding sandbox task.
                        </p>
                        <button
                          onClick={() => setActiveTab("task")}
                          className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 py-3 text-xs font-bold text-white transition-all shadow-md cursor-pointer"
                        >
                          Start Coding Task
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-4 py-1.5 text-xs font-bold text-rose-600">
                          <XCircle className="h-4 w-4" /> Failed (Requires ≥ 60%)
                        </div>
                        <button
                          onClick={handleQuizRetry}
                          className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-slate-100 hover:bg-slate-200 py-3 text-xs font-bold text-slate-700 transition-all cursor-pointer border border-slate-200"
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Retry Quiz
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="glass-panel p-6 rounded-xl border border-indigo-100/50 space-y-6">
                    
                    {/* Quiz Progress */}
                    <div className="flex items-center justify-between border-b border-indigo-100/50 pb-3">
                      <span className="text-2xs font-extrabold text-indigo-600 uppercase tracking-widest">Lesson Quiz Assessment</span>
                      <span className="text-xs text-slate-400">
                        Question {currentQuestionIdx + 1} of {activeLessonData.quiz.length}
                      </span>
                    </div>

                    {/* Question Text */}
                    <h4 className="text-sm font-bold text-slate-800 leading-relaxed">
                      {tamilData ? tamilData.quiz[currentQuestionIdx]?.question : activeLessonData.quiz[currentQuestionIdx].question}
                    </h4>

                    {/* Options Stack */}
                    <div className="space-y-2.5">
                      {(tamilData?.quiz[currentQuestionIdx]?.options || activeLessonData.quiz[currentQuestionIdx].options).map((opt: string, idx: number) => {
                        const isSelected = selectedOption === idx;
                        const isCorrect = idx === activeLessonData.quiz[currentQuestionIdx].correctOption;
                        
                        let btnStyle = "bg-slate-50 border-indigo-100/60 text-slate-700 hover:bg-indigo-50/50 hover:text-indigo-600";
                        if (isSelected) btnStyle = "bg-indigo-50 border-indigo-500/50 text-indigo-600 font-bold";
                        
                        if (isAnswered) {
                          if (isCorrect) {
                            btnStyle = "bg-emerald-50 border-emerald-500/30 text-emerald-700 font-bold";
                          } else if (isSelected) {
                            btnStyle = "bg-rose-50 border-rose-500/30 text-rose-700 font-semibold";
                          } else {
                            btnStyle = "bg-slate-50 border-indigo-100/30 text-slate-400 opacity-60";
                          }
                        }

                        const optionLetters = ["A", "B", "C", "D"];

                        return (
                          <button
                            key={idx}
                            disabled={isAnswered}
                            onClick={() => handleQuizOptionClick(idx)}
                            className={`w-full text-left rounded-lg border p-3.5 text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className={`h-5 w-5 rounded-full flex items-center justify-center text-3xs font-extrabold border ${
                                isSelected ? "bg-indigo-100 border-indigo-500 text-indigo-700" : "bg-white border-slate-200 text-slate-500"
                              }`}>
                                {optionLetters[idx]}
                              </span>
                              <span>{tamilData ? (tamilData.quiz[currentQuestionIdx]?.options[idx] || opt) : opt}</span>
                            </div>
                            {isAnswered && isCorrect && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />}
                            {isAnswered && isSelected && !isCorrect && <AlertCircle className="h-4.5 w-4.5 text-rose-500 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanations & CTAs */}
                    <div className="space-y-4">
                      {isAnswered && (
                        <div className={`p-4 rounded-lg text-xs leading-relaxed border ${
                          selectedOption === activeLessonData.quiz[currentQuestionIdx].correctOption
                            ? "bg-emerald-50/50 border-emerald-250 text-slate-600"
                            : "bg-rose-50/50 border-rose-250 text-slate-600"
                        }`}>
                          <span className="font-bold block mb-1">
                            {selectedOption === activeLessonData.quiz[currentQuestionIdx].correctOption ? "Correct!" : "Incorrect."}
                          </span>
                          {tamilData ? (tamilData.quiz[currentQuestionIdx]?.explanation || activeLessonData.quiz[currentQuestionIdx].explanation) : activeLessonData.quiz[currentQuestionIdx].explanation}
                        </div>
                      )}

                      {!isAnswered ? (
                        <button
                          disabled={selectedOption === null}
                          onClick={handleQuizSubmit}
                          className={`w-full rounded-lg py-2.5 text-xs font-bold text-white transition-all text-center cursor-pointer ${
                            selectedOption === null 
                              ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed" 
                              : "bg-indigo-600 hover:bg-indigo-500"
                          }`}
                        >
                          Submit Answer
                        </button>
                      ) : (
                        <button
                          onClick={handleQuizNext}
                          className="flex items-center justify-center gap-1 w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 py-2.5 text-xs font-bold text-white transition-all text-center cursor-pointer"
                        >
                          <span>{currentQuestionIdx < activeLessonData.quiz.length - 1 ? "Next Question" : "Finish Quiz"}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                  </div>
                )}
              </div>
            )}

            {/* TABS CONTAINER: CODING TASK */}
            {activeTab === "task" && (
              <div className="space-y-6 max-w-2xl mx-auto w-full animate-fade-in">
                <div className="space-y-2">
                  <span className="text-3xs font-extrabold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Coding Challenge
                  </span>
                  <h2 className="text-xl font-bold text-slate-800">Task Instructions</h2>
                </div>

                <div className="glass-panel p-5 rounded-lg border border-indigo-100/50 space-y-4">
                  <p className="text-slate-600 text-sm leading-relaxed font-medium">
                    {tamilData ? tamilData.taskDescription : activeLessonData.task.description}
                  </p>

                  <div className="space-y-1.5">
                    <span className="text-2xs font-extrabold text-slate-500 uppercase tracking-wide block">Expected Structural Result:</span>
                    <div className="p-3 bg-slate-50 rounded text-xs font-mono text-slate-600 overflow-x-auto border border-slate-200 select-text whitespace-pre-line leading-relaxed">
                      {activeLessonData.task.expectedOutputDisplay}
                    </div>
                  </div>
                </div>

                {isLessonCompleted ? (
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-600">Task Completed & Verified!</span>
                    </div>
                    {nextLesson && (
                      <button
                        onClick={() => router.push(`/courses/${courseId}/lessons/${nextLesson.id}`)}
                        className="w-full md:w-auto inline-flex items-center gap-1 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold text-xs px-5 py-2 rounded-lg transition-all cursor-pointer"
                      >
                        Next Lesson <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="text-center p-4 bg-slate-50 border border-dashed border-indigo-150 rounded-lg">
                    <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                      Use the code sandbox on the right to implement your solution, then click "Run & Verify Code".
                    </p>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* ================= RIGHT COLUMN: INTERACTIVE CODE SANDBOX ================= */}
        <div className="w-full lg:w-1/2 flex flex-col bg-slate-950 overflow-hidden border-l border-slate-800">
          
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900 text-slate-200 shrink-0 select-none">
            <div className="flex items-center gap-2">
              <ConsoleIcon className="h-4.5 w-4.5 text-indigo-400" />
              <span className="text-xs font-bold text-slate-200 tracking-wide uppercase">Workspace Editor</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xs font-extrabold text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 px-2.5 py-1 rounded tracking-wider uppercase">
                {activeLessonData.task.language}
              </span>

              {/* Unified Run & Verify Code Button */}
              <button
                onClick={handleRunAndVerifyCode}
                disabled={isRunning}
                className="relative flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 disabled:opacity-50 text-2xs font-extrabold px-4 py-2 text-white transition-all duration-300 shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Compiling...</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3 w-3 fill-white text-white" />
                    <span>Run & Verify Code</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Monaco Editor Pane */}
          <div className="flex-1 flex overflow-hidden relative">
            <Editor
              height="100%"
              language={activeLessonData.task.language}
              value={editorCode}
              onChange={(val) => setEditorCode(val || "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "var(--font-mono)",
                minimap: { enabled: false },
                lineNumbers: "on",
                roundedSelection: true,
                scrollBeyondLastLine: false,
                readOnly: isLessonCompleted,
                automaticLayout: true,
                padding: { top: 12, bottom: 12 },
                scrollbar: {
                  verticalScrollbarSize: 10,
                  horizontalScrollbarSize: 10
                }
              }}
            />
          </div>

          {/* Console / Output Tabs Console */}
          <div className="h-56 border-t border-slate-800 bg-slate-950 flex flex-col shrink-0">
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-2xs text-slate-400 font-bold select-none uppercase tracking-widest">
              <div className="flex gap-4">
                <button 
                  onClick={() => setConsoleTab("logs")}
                  className={`transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded ${
                    consoleTab === "logs" ? "text-indigo-400 bg-slate-850 font-extrabold border border-indigo-500/20" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <ConsoleIcon className="h-3.5 w-3.5" />
                  Compiler Logs
                </button>
                
                {(activeLessonData.task.language === "html" || activeLessonData.task.language === "css") && (
                  <button 
                    onClick={() => setConsoleTab("preview")}
                    className={`transition-colors flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded ${
                      consoleTab === "preview" ? "text-indigo-400 bg-slate-850 font-extrabold border border-indigo-500/20" : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    <Play className="h-3.5 w-3.5 fill-indigo-400 text-indigo-400" />
                    Output Preview
                  </button>
                )}
              </div>
              
              <button 
                onClick={() => {
                  if (consoleTab === "logs") setConsoleLogs([]);
                }}
                className="hover:text-slate-200 text-slate-500 flex items-center gap-1 transition-colors py-1 px-2 rounded hover:bg-slate-850"
              >
                <RotateCcw className="h-3 w-3" /> Clear
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden relative bg-slate-950">
              {consoleTab === "logs" ? (
                <div className="h-full p-4 font-mono text-2xs overflow-y-auto space-y-1.5 text-slate-300 select-text">
                  {consoleLogs.length === 0 ? (
                    <span className="text-slate-500 font-semibold italic">Console idle. Click "Run & Verify Code" to check results.</span>
                  ) : (
                    consoleLogs.map((log, i) => {
                      let logClass = "text-slate-400";
                      if (log.startsWith("Error") || log.includes("FAILED") || log.includes("Runtime error") || log.includes("failed")) {
                        logClass = "text-rose-400 font-semibold bg-rose-950/20 px-2.5 py-1 rounded border border-rose-900/30";
                      } else if (log.startsWith("Assert") && log.includes("PASSED")) {
                        logClass = "text-emerald-400 font-medium bg-emerald-950/20 px-2.5 py-1 rounded border border-emerald-900/30";
                      } else if (log.includes("STATUS: ALL") || log.includes("PASSED!")) {
                        logClass = "text-emerald-300 font-bold bg-gradient-to-r from-emerald-600/20 to-teal-600/20 px-3.5 py-2 rounded-lg border border-emerald-500/30 shadow-lg shadow-emerald-500/5 animate-pulse mt-2 mb-2 block";
                      } else if (log.startsWith("Assert") || log.startsWith("Analyzing") || log.startsWith("Checking")) {
                        logClass = "text-slate-400";
                      }
                      
                      return (
                        <div key={i} className={`${logClass} py-0.5`}>
                          {log}
                        </div>
                      );
                    })
                  )}
                </div>
              ) : (
                <div className="h-full w-full bg-white text-black p-0.5 overflow-hidden">
                  <iframe
                    title="Sandbox Preview Pane"
                    sandbox="allow-scripts"
                    className="w-full h-full border-none bg-white"
                    srcDoc={
                      activeLessonData.task.language === "html" 
                        ? editorCode 
                        : activeLessonData.task.language === "css" 
                        ? `<html><head><style>${editorCode}</style></head><body style="padding: 12px; font-family: sans-serif;"><div class="navbar" style="margin-bottom: 12px;"><a href="#" style="margin-right: 8px;">Home</a><a href="#">About</a></div><div class="card" id="sandbox" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 8px;">I am styled using selector #sandbox</div><div class="card" style="border: 1px solid #ccc; padding: 10px;">I am standard layout card</div></body></html>` 
                        : `<html><body><script>${editorCode}</script><p>Evaluation Running...</p></body></html>`
                    }
                  />
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
