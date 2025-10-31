import React, { createContext, useContext, useState, useEffect } from "react";
import { QuizState, QuizAttempt, UserAnswer, Question, ModulePerformance } from "@/types/quiz";
import { getRandomQuestions, loadQuestions, checkAnswer } from "@/utils/questionLoader";

interface QuizContextType {
  quizState: QuizState;
  startQuiz: (mode: "practice" | "exam", selectedModule?: string) => void;
  answerQuestion: (questionIndex: number, selectedAnswers: string[]) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  goToQuestion: (index: number) => void;
  submitQuiz: () => void;
  resetQuiz: () => void;
  setQuestionsPerPage: (count: 1 | 5 | 10) => void;
  getAttemptHistory: () => QuizAttempt[];
  currentAttempt: QuizAttempt | null;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

const EXAM_TIME = 30 * 60; // 30 minutes in seconds
const STORAGE_KEY = "quiz_attempts";

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    questions: [],
    userAnswers: [],
    mode: "practice",
    isStarted: false,
    isCompleted: false,
    timeRemaining: EXAM_TIME,
    questionsPerPage: 1,
  });

  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);

  // Timer effect for exam mode
  useEffect(() => {
    if (quizState.mode === "exam" && quizState.isStarted && !quizState.isCompleted && quizState.timeRemaining > 0) {
      const timer = setInterval(() => {
        setQuizState(prev => ({
          ...prev,
          timeRemaining: Math.max(0, prev.timeRemaining - 1),
        }));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quizState.mode, quizState.isStarted, quizState.isCompleted, quizState.timeRemaining]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (quizState.mode === "exam" && quizState.timeRemaining === 0 && quizState.isStarted && !quizState.isCompleted) {
      submitQuiz();
    }
  }, [quizState.timeRemaining]);

  const startQuiz = (mode: "practice" | "exam", selectedModule?: string) => {
    let questions: Question[] = [];
    
    if (mode === "practice" && selectedModule) {
      questions = loadQuestions().filter(q => q.module === selectedModule);
    } else if (mode === "exam") {
      questions = getRandomQuestions(40);
    } else {
      questions = getRandomQuestions(40);
    }

    setQuizState({
      currentQuestionIndex: 0,
      questions,
      userAnswers: new Array(questions.length).fill(null).map((_, idx) => ({
        questionId: idx,
        selectedAnswers: [],
        isCorrect: false,
      })),
      mode,
      isStarted: true,
      isCompleted: false,
      timeRemaining: EXAM_TIME,
      selectedModule,
      questionsPerPage: mode === "exam" ? 1 : 1,
    });
  };

  const answerQuestion = (questionIndex: number, selectedAnswers: string[]) => {
    setQuizState(prev => {
      const newAnswers = [...prev.userAnswers];
      const question = prev.questions[questionIndex];
      const isCorrect = checkAnswer(question, selectedAnswers);
      
      newAnswers[questionIndex] = {
        questionId: questionIndex,
        selectedAnswers,
        isCorrect,
      };

      return {
        ...prev,
        userAnswers: newAnswers,
      };
    });
  };

  const nextQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.min(prev.currentQuestionIndex + 1, prev.questions.length - 1),
    }));
  };

  const previousQuestion = () => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(prev.currentQuestionIndex - 1, 0),
    }));
  };

  const goToQuestion = (index: number) => {
    setQuizState(prev => ({
      ...prev,
      currentQuestionIndex: Math.max(0, Math.min(index, prev.questions.length - 1)),
    }));
  };

  const calculateModuleBreakdown = (questions: Question[], userAnswers: UserAnswer[]): ModulePerformance[] => {
    const moduleStats: Record<string, { correct: number; total: number }> = {};

    questions.forEach((question, idx) => {
      const module = question.module;
      if (!moduleStats[module]) {
        moduleStats[module] = { correct: 0, total: 0 };
      }
      moduleStats[module].total++;
      if (userAnswers[idx]?.isCorrect) {
        moduleStats[module].correct++;
      }
    });

    return Object.entries(moduleStats).map(([module, stats]) => ({
      module,
      correct: stats.correct,
      total: stats.total,
      percentage: (stats.correct / stats.total) * 100,
    }));
  };

  const submitQuiz = () => {
    const correctAnswers = quizState.userAnswers.filter(a => a.isCorrect).length;
    const score = (correctAnswers / quizState.questions.length) * 100;
    const timeSpent = EXAM_TIME - quizState.timeRemaining;
    const moduleBreakdown = calculateModuleBreakdown(quizState.questions, quizState.userAnswers);

    const attempt: QuizAttempt = {
      id: Date.now().toString(),
      mode: quizState.mode,
      date: new Date(),
      score,
      totalQuestions: quizState.questions.length,
      answers: quizState.userAnswers,
      questions: quizState.questions,
      timeSpent,
      moduleBreakdown,
    };

    // Save to localStorage
    const existing = localStorage.getItem(STORAGE_KEY);
    const attempts = existing ? JSON.parse(existing) : [];
    attempts.push(attempt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));

    setCurrentAttempt(attempt);
    setQuizState(prev => ({ ...prev, isCompleted: true }));
  };

  const resetQuiz = () => {
    setQuizState({
      currentQuestionIndex: 0,
      questions: [],
      userAnswers: [],
      mode: "practice",
      isStarted: false,
      isCompleted: false,
      timeRemaining: EXAM_TIME,
      questionsPerPage: 1,
    });
    setCurrentAttempt(null);
  };

  const setQuestionsPerPage = (count: 1 | 5 | 10) => {
    setQuizState(prev => ({ ...prev, questionsPerPage: count }));
  };

  const getAttemptHistory = (): QuizAttempt[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  };

  return (
    <QuizContext.Provider
      value={{
        quizState,
        startQuiz,
        answerQuestion,
        nextQuestion,
        previousQuestion,
        goToQuestion,
        submitQuiz,
        resetQuiz,
        setQuestionsPerPage,
        getAttemptHistory,
        currentAttempt,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within QuizProvider");
  }
  return context;
};
