"use client";

import { useState } from "react";
import { useApp } from "../lib/db";
import { Quiz as QuizType } from "../data/coursesData";
import { CheckCircle2, AlertCircle, RefreshCw, ChevronRight, Award } from "lucide-react";
import confetti from "canvas-confetti";

interface QuizProps {
  courseId: string;
  lessonId: string;
  quizData: QuizType;
  onPass: () => void;
}

export default function Quiz({ courseId, lessonId, quizData, onPass }: QuizProps) {
  const { completeQuiz } = useApp();
  const { questions } = quizData;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [hasPassed, setHasPassed] = useState(false);

  const currentQuestion = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOpt === null || isAnswered) return;

    const correct = selectedOpt === currentQuestion.correctOption;
    if (correct) {
      setCorrectCount(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = async () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOpt(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      const scorePercentage = Math.round((correctCount / questions.length) * 100);
      const passed = await completeQuiz(courseId, lessonId, scorePercentage);

      setHasPassed(passed);
      setQuizFinished(true);

      if (passed) {
        // Trigger confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        onPass();
      }
    }
  };

  const handleRetry = () => {
    setCurrentIdx(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setQuizFinished(false);
    setHasPassed(false);
  };

  if (quizFinished) {
    return (
      <div className="glass-panel p-6 rounded-xl border border-white/10 space-y-4 text-center mt-8">
        <Award className={`h-12 w-12 mx-auto ${hasPassed ? "text-amber-400" : "text-slate-500"}`} />
        <h3 className="text-xl font-bold text-white">Quiz Results</h3>
        <p className="text-sm text-slate-300">
          You answered <span className="font-extrabold text-blue-400">{correctCount}</span> out of{" "}
          <span className="font-extrabold text-white">{questions.length}</span> questions correctly.
        </p>

        {hasPassed ? (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-1.5 text-xs font-bold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" /> Pass (100% Score)
            </div>
            <p className="text-xs text-slate-400">
              Congratulations! You earned +50 Quiz XP and marked this lesson as fully verified.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 px-4 py-1.5 text-xs font-bold text-rose-400">
              <AlertCircle className="h-4 w-4" /> Try Again (Passing Score is 100%)
            </div>
            <button
              onClick={handleRetry}
              className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white transition-all cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-panel p-6 rounded-xl border border-white/10 space-y-6 mt-8">
      
      {/* Quiz Progress header */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Lesson Quiz Check</span>
        <span className="text-xs text-slate-400">
          Question {currentIdx + 1} of {questions.length}
        </span>
      </div>

      {/* Question Text */}
      <h4 className="text-sm font-bold leading-relaxed text-white">{currentQuestion.question}</h4>

      {/* Options Stack */}
      <div className="space-y-2.5">
        {currentQuestion.options.map((opt, idx) => {
          const isSelected = selectedOpt === idx;
          const isCorrect = idx === currentQuestion.correctOption;
          
          let btnStyle = "bg-slate-900/40 border-white/5 text-slate-300 hover:bg-white/5";
          if (isSelected) btnStyle = "bg-blue-600/10 border-blue-500/50 text-blue-400";
          
          if (isAnswered) {
            if (isCorrect) {
              btnStyle = "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 font-medium";
            } else if (isSelected) {
              btnStyle = "bg-rose-500/10 border-rose-500/50 text-rose-400";
            } else {
              btnStyle = "bg-slate-900/20 border-white/5 text-slate-600 opacity-60";
            }
          }

          return (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left rounded-lg border p-3.5 text-xs transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
            >
              <span>{opt}</span>
              {isAnswered && isCorrect && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-400 shrink-0" />}
              {isAnswered && isSelected && !isCorrect && <AlertCircle className="h-4.5 w-4.5 text-rose-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Explanations and CTA Actions */}
      <div className="space-y-4">
        {isAnswered && (
          <div className={`p-4 rounded-lg text-xs leading-relaxed border ${
            selectedOpt === currentQuestion.correctOption
              ? "bg-emerald-500/5 border-emerald-500/10 text-slate-300"
              : "bg-rose-500/5 border-rose-500/10 text-slate-300"
          }`}>
            <span className="font-bold block mb-1">
              {selectedOpt === currentQuestion.correctOption ? "Correct!" : "Incorrect."}
            </span>
            {currentQuestion.explanation}
          </div>
        )}

        {!isAnswered ? (
          <button
            disabled={selectedOpt === null}
            onClick={handleSubmitAnswer}
            className={`w-full rounded-lg py-2.5 text-xs font-semibold text-white transition-all text-center cursor-pointer ${
              selectedOpt === null 
                ? "bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed" 
                : "bg-blue-600 hover:bg-blue-500"
            }`}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center justify-center gap-1 w-full rounded-lg bg-blue-600 hover:bg-blue-500 py-2.5 text-xs font-semibold text-white transition-all text-center cursor-pointer"
          >
            <span>{currentIdx < questions.length - 1 ? "Next Question" : "Finish Quiz"}</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        )}
      </div>

    </div>
  );
}
