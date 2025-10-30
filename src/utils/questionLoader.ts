import { Question } from "@/types/quiz";
import additional1 from "@/assets/data/additional1.json";
import additional2 from "@/assets/data/additional2.json";
import additional3 from "@/assets/data/additional3.json";
import additional4 from "@/assets/data/additional4.json";
import module1 from "@/assets/data/module1.json";
import module2 from "@/assets/data/module2.json";
import module3 from "@/assets/data/module3.json";
import module4 from "@/assets/data/module4.json";
import module5 from "@/assets/data/module5.json";

const allDataSources = [
  ...additional1,
  ...additional2,
  ...additional3,
  ...additional4,
  ...module1,
  ...module2,
  ...module3,
  ...module4,
  ...module5,
];

// Standardized module names
const MODULE_NAMES: Record<string, string> = {
  "1": "Module 1 - Basic Forwarding & Troubleshooting",
  "2": "Module 2 - Troubleshooting EIGRPv4/v6",
  "3": "Module 3 - Troubleshooting OSPFv3",
  "4": "Module 4 - Troubleshooting BGP",
  "5": "Module 5 - Conditional Forwarding and Redistribution",
};

// Normalize module name to standard format
const normalizeModuleName = (moduleName: string): string => {
  const match = moduleName.match(/Module (\d+)/i);
  if (match) {
    const moduleNumber = match[1];
    return MODULE_NAMES[moduleNumber] || moduleName;
  }
  return moduleName;
};

// Filter out Module 6 questions and normalize module names
export const loadQuestions = (): Question[] => {
  return allDataSources
    .filter((q: Question) => !q.module.toLowerCase().includes("module 6"))
    .map((q: Question) => ({
      ...q,
      module: normalizeModuleName(q.module),
    })) as Question[];
};

// Get unique modules
export const getAvailableModules = (): string[] => {
  const questions = loadQuestions();
  const modules = new Set(questions.map(q => q.module));
  return Array.from(modules).sort();
};

// Filter questions by module
export const filterByModule = (module: string): Question[] => {
  const questions = loadQuestions();
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

// Get random questions for exam (40 questions)
export const getRandomQuestions = (count: number = 40): Question[] => {
  const allQuestions = loadQuestions();
  const shuffled = shuffleArray(allQuestions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

// Check if answer is correct
export const checkAnswer = (
  question: Question,
  selectedAnswers: string[]
): boolean => {
  if (question.correct_answers.length !== selectedAnswers.length) {
    return false;
  }
  
  const sortedCorrect = [...question.correct_answers].sort();
  const sortedSelected = [...selectedAnswers].sort();
  
  return sortedCorrect.every((ans, idx) => ans === sortedSelected[idx]);
};
