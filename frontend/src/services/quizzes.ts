import { AxiosResponse } from "axios";

import http from "utils/http";

import { Quiz } from "interfaces/services/models/Quiz";
import { QuizzesCreateDto } from "interfaces/services/quizzes/quizzes.create.dto";

export const getQuizzes = (): Promise<AxiosResponse<Quiz[]>> => {
  return http.get("quizzes/@me");
};

export const getQuizById = (id: number): Promise<AxiosResponse<Quiz>> => {
  return http.get(`quizzes/${id}`);
};

export const createQuiz = (
  dto: QuizzesCreateDto
): Promise<AxiosResponse<Quiz>> => {
  return http.post("quizzes", dto);
};

export const updateQuiz = (
  id: number,
  dto: QuizzesCreateDto
): Promise<AxiosResponse<Quiz>> => {
  return http.patch(`quizzes/${id}`, dto);
};

export const deleteQuiz = (id: number): Promise<AxiosResponse<Quiz>> => {
  return http.delete(`quizzes/${id}`);
};
