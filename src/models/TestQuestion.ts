// models/TestQuestion.ts

export interface TestQuestionAttributes {
  id?: number;
  testId: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}
