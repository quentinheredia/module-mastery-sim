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
  type: 'multiple-choice' | 'multi-step';
  question: string;
  // For multiple-choice
  options?: string[];
  correct_answers?: string[];
  explanation?: string;
  // For multi-step
  subparts?: MultiStepSubpart[];
  // Metadata
  metadata: {
    source: 'PDF' | 'constructed-model';
    topic: string;
    page?: number;
    randomSeed?: number;
  };
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
