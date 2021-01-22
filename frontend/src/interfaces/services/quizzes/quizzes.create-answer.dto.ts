export interface QuizzesCreateAnswerDto {
  questionId?: number;
  answer: string;
  isCorrectAnswer: boolean;
}
