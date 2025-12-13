// NET4001 specific question types for simulation & networking course

export interface MultiStepSubpart {
  id: string;
  text: string;
  answer: string;
  explanation: string;
}

export interface NET4001Question {
  id: string;
  module: string;
  question_type: 'multiple_choice' | 'multiple_answer' | 'multi_step';
  question: string;
  options: string[];
  correct_answers: string[];
  points: number;
  explanation?: string;
  subparts?: MultiStepSubpart[];
}

export interface MultiStepUserAnswers {
  [subpartId: string]: string;
}

export interface MultiStepResult {
  subpartId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

// Check if a question is multi-step type
export const isMultiStepQuestion = (question: any): boolean => {
  return question.question_type === 'multi_step' && Array.isArray(question.subparts);
};
