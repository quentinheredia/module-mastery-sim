import { Question, MatchingPairs } from "@/types/quiz";

// NET4009 course data
import additional1 from "@/assets/data/additional1.json";
import additional2 from "@/assets/data/additional2.json";
import additional3 from "@/assets/data/additional3.json";
import additional4 from "@/assets/data/additional4.json";
import module1 from "@/assets/data/module1.json";
import module2 from "@/assets/data/module2.json";
import module3 from "@/assets/data/module3.json";
import module4 from "@/assets/data/module4.json";
import module5 from "@/assets/data/module5.json";

// NET4005 course data
import cloudData from "@/assets/data/net4005/cloud.json";
import cryptoData from "@/assets/data/net4005/crypto.json";
import sdnData from "@/assets/data/net4005/sdn.json";
import appData from "@/assets/data/net4005/app.json";

// Organize data by course
const courseData: Record<string, Question[]> = {
  net4009: [
    ...additional1,
    ...additional2,
    ...additional3,
    ...additional4,
    ...module1,
    ...module2,
    ...module3,
    ...module4,
    ...module5,
  ] as Question[],
  net4005: [
    ...cloudData,
    ...cryptoData,
    ...sdnData,
    ...appData,
  ] as Question[],
};

// Standardized module names for NET4009
const NET4009_MODULE_NAMES: Record<string, string> = {
  "1": "Module 1 - Basic Forwarding & Troubleshooting",
  "2": "Module 2 - Troubleshooting EIGRPv4/v6",
  "3": "Module 3 - Troubleshooting OSPFv3",
  "4": "Module 4 - Troubleshooting BGP",
  "5": "Module 5 - Conditional Forwarding and Redistribution",
};

// Normalize module name to standard format
const normalizeModuleName = (moduleName: string, courseId: string): string => {
  if (courseId === "net4009") {
    const match = moduleName.match(/Module (\d+)/i);
    if (match) {
      const moduleNumber = match[1];
      return NET4009_MODULE_NAMES[moduleNumber] || moduleName;
    }
  }
  return moduleName;
};

// Load questions for a specific course
export const loadQuestions = (courseId: string = "net4009"): Question[] => {
  const data = courseData[courseId] || [];
  return data
    .filter((q: Question) => !q.module.toLowerCase().includes("module 6"))
    .map((q: Question) => ({
      ...q,
      module: normalizeModuleName(q.module, courseId),
    })) as Question[];
};

// Get unique modules for a specific course
export const getAvailableModules = (courseId: string = "net4009"): string[] => {
  const questions = loadQuestions(courseId);
  const modules = new Set(questions.map(q => q.module));
  return Array.from(modules).sort();
};

// Filter questions by module within a course
export const filterByModule = (courseId: string, module: string): Question[] => {
  const questions = loadQuestions(courseId);
  return questions.filter(q => q.module === module);
};

// Shuffle array using Fisher-Yates algorithm
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Get random questions for exam (40 questions) from a specific course
export const getRandomQuestions = (courseId: string = "net4009", count: number = 40): Question[] => {
  const allQuestions = loadQuestions(courseId);
  const shuffled = shuffleArray(allQuestions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Check if answer is correct (handles both regular and matching questions)
export const checkAnswer = (
  question: Question,
  selectedAnswers: string[],
  matchingAnswers?: MatchingPairs
): boolean => {
  if (question.question_type === "matching") {
    if (!matchingAnswers || !question.correct_answers) return false;
    
    const correctAnswers = question.correct_answers as MatchingPairs;
    const pairs = Object.keys(correctAnswers);
    
    // All pairs must be answered correctly
    return pairs.every(key => matchingAnswers[key] === correctAnswers[key]);
  }
  
  // Regular question types
  const correctAnswers = question.correct_answers as string[];
  if (correctAnswers.length !== selectedAnswers.length) {
    return false;
  }
  
  const sortedCorrect = [...correctAnswers].sort();
  const sortedSelected = [...selectedAnswers].sort();
  
  return sortedCorrect.every((ans, idx) => ans === sortedSelected[idx]);
};
