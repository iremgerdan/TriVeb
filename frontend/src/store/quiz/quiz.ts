import { atom } from 'recoil';

import { QuizzesCreateDto } from 'interfaces/services/quizzes/quizzes.create.dto';

export const editingQuiz = atom<QuizzesCreateDto>({
  key: 'quiz',
  default: {
    name: 'Untitled',
    questions: [
      {
        question: '',
        answers: [
          { answer: '', isCorrectAnswer: true },
          { answer: '', isCorrectAnswer: false },
        ],
        durationInSeconds: 0,
      },
    ],
  },
});
