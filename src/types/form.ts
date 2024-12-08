// Question type enum
export enum QuestionType {
  SHORT_ANSWER = 'short',
  LONG_ANSWER = 'long',
  SINGLE_SELECT = 'single',
  NUMBER = 'number',
  URL = 'url',
}

// Base question interface
export interface BaseQuestion {
  id: string;
  type: QuestionType;
  title: string;
  required: boolean;
  order: number;
}

// Type-specific question interfaces
export interface ShortAnswerQuestion extends BaseQuestion {
  type: QuestionType.SHORT_ANSWER;
  maxLength?: number;
}

export interface LongAnswerQuestion extends BaseQuestion {
  type: QuestionType.LONG_ANSWER;
  maxLength?: number;
}

export interface SingleSelectQuestion extends BaseQuestion {
  type: QuestionType.SINGLE_SELECT;
  options: string[];
}

export interface NumberQuestion extends BaseQuestion {
  type: QuestionType.NUMBER;
  min?: number;
  max?: number;
}

export interface URLQuestion extends BaseQuestion {
  type: QuestionType.URL;
  urlPattern?: string;
}

// Union type for all question types
export type Question =
  | ShortAnswerQuestion
  | LongAnswerQuestion
  | SingleSelectQuestion
  | NumberQuestion
  | URLQuestion;

// Form interface
export interface Form {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  createdAt: Date;
  updatedAt: Date;
  isPublished: boolean;
  publishedAt: Date | null;
}

// Form response interfaces
export type QuestionResponse = {
  questionId: string;
  value: string | number;
};

export interface FormResponse {
  id: string;
  formId: string;
  responses: QuestionResponse[];
  submittedAt: Date;
}

// Form validation state
export interface FormValidationState {
  isValid: boolean;
  completionPercentage: number;
  errors: Record<string, string>;
}
