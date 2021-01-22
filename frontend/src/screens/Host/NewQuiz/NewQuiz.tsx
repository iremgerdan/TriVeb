import React, { useState } from "react";
import {
  Button,
  Card,
  Grid,
  Input,
  Select,
  Spacer,
  Text,
  Textarea,
  useToasts,
} from "@geist-ui/react";
import { Check, Plus, Trash } from "@geist-ui/react-icons";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import _ from "lodash";

import * as services from "services";

import { editingQuiz } from "store/quiz/quiz";

import { QuizzesCreateAnswerDto } from "interfaces/services/quizzes/quizzes.create-answer.dto";
import { QuizzesCreateQuestionDto } from "interfaces/services/quizzes/quizzes.create-question.dto";

import "./NewQuiz.scss";

const NewQuiz = () => {
  const history = useHistory();

  const [, setToast] = useToasts();

  const [quiz, setQuiz] = useRecoilState(editingQuiz);
  const [loading, setLoading] = useState(false);

  const getCorrectAnswer = (answers: QuizzesCreateAnswerDto[]) => {
    const correctAnswer = answers.findIndex((item) => item.isCorrectAnswer);

    return String(correctAnswer);
  };

  const createQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        {
          question: "",
          answers: [
            { answer: "", isCorrectAnswer: true },
            { answer: "", isCorrectAnswer: false },
          ],
          durationInSeconds: 0,
        },
      ],
    });
  };

  const createAnswer = (question: QuizzesCreateQuestionDto) => {
    const newQuestions = quiz.questions.map((item) => {
      if (item === question) {
        return {
          ...item,
          answers: [
            ...item.answers,
            {
              answer: "",
              isCorrectAnswer: true,
            },
          ],
        };
      }

      return item;
    });

    setQuiz({
      ...quiz,
      questions: newQuestions,
    });
  };

  const deleteAnswer = (
    question: QuizzesCreateQuestionDto,
    answer: QuizzesCreateAnswerDto
  ) => {
    const newQuestions = quiz.questions.map((item) => {
      if (item === question) {
        const newAnswers = item.answers.filter((a) => a !== answer);

        return {
          ...item,
          answers: newAnswers,
        };
      }

      return item;
    });

    setQuiz({
      ...quiz,
      questions: newQuestions,
    });
  };

  const deleteQuestion = (question: QuizzesCreateQuestionDto) => {
    const newQuestions = quiz.questions.filter((item) => item !== question);

    setQuiz({
      ...quiz,
      questions: newQuestions,
    });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    setQuiz({
      ...quiz!,
      name: value || "",
    });
  };

  const handleChangeQuestion = (
    question: QuizzesCreateQuestionDto,
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newQuestions = quiz.questions.map((item) => {
      if (item === question) {
        return {
          ...item,
          question: event.currentTarget.value || "",
        };
      }

      return item;
    });

    setQuiz({
      ...quiz,
      questions: newQuestions,
    });
  };

  const handleChangeAnswer = (
    question: QuizzesCreateQuestionDto,
    answer: QuizzesCreateAnswerDto,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = quiz.questions.map((item) => {
      if (item === question) {
        const updatedAnswers = item.answers.map((a) => {
          if (a === answer) {
            return {
              ...a,
              answer: event.currentTarget.value || "",
            };
          }

          return a;
        });

        return {
          ...item,
          answers: updatedAnswers,
        };
      }

      return item;
    });

    setQuiz({
      ...quiz,
      questions: newQuestions,
    });
  };

  const handleChangeDuration = (
    question: QuizzesCreateQuestionDto,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const newQuestions = quiz.questions.map((item) => {
      if (item === question) {
        return {
          ...item,
          durationInSeconds: +event.currentTarget.value,
        };
      }

      return item;
    });

    setQuiz({
      ...quiz,
      questions: newQuestions,
    });
  };

  const handleChangeCorrectAnswer = (
    question: QuizzesCreateQuestionDto,
    value: string
  ) => {
    const newQuestions = quiz.questions.map((item) => {
      if (item === question) {
        const updatedAnswers = item.answers.map((answer, i) => {
          if (i === +value) {
            return {
              ...answer,
              isCorrectAnswer: true,
            };
          }

          return {
            ...answer,
            isCorrectAnswer: false,
          };
        });

        return {
          ...item,
          answers: updatedAnswers,
        };
      }

      return item;
    });

    setQuiz({
      ...quiz,
      questions: newQuestions,
    });
  };

  const handleCreateQuizPress = async () => {
    try {
      setLoading(true);

      await services.createQuiz(quiz);

      setToast({
        text: "Quiz was created.",
        type: "success",
      });

      history.push("/host");
    } catch (error) {
      setToast({
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="new-quiz">
      <Spacer y={2} />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Input
          className="quiz-name"
          inputMode="text"
          placeholder="Quiz name"
          value={quiz.name}
          onInput={handleNameChange}
        ></Input>

        <Link to="new-quiz">
          <Button
            icon={<Check />}
            type="secondary"
            auto
            loading={loading}
            onClick={handleCreateQuizPress}
          />
        </Link>
      </div>

      <Spacer y={2} />

      <div>
        {quiz.questions.map((item) => (
          <>
            <Card className="form">
              <Textarea
                placeholder="Question"
                width="100%"
                value={item.question}
                onChange={(e) => handleChangeQuestion(item, e)}
              />
              <Spacer y={1} />

              {item.answers.map((answer, index) => (
                <>
                  <Input
                    placeholder={`Answer ${index + 1}`}
                    width="100%"
                    value={answer.answer}
                    onChange={(e) => handleChangeAnswer(item, answer, e)}
                    iconRight={item.answers.length > 2 && <Trash />}
                    iconClickable
                    onIconClick={() => deleteAnswer(item, answer)}
                  />

                  <Spacer y={0.5} />
                </>
              ))}

              {item.answers.length < 4 && (
                <Input
                  readOnly
                  placeholder="Add answer"
                  width="100%"
                  onClick={() => createAnswer(item)}
                  iconRight={<Plus />}
                  iconClickable
                  onIconClick={() => createAnswer(item)}
                />
              )}

              <Spacer y={1} />

              <Input
                placeholder="Duration (second)"
                width="100%"
                onChange={(e) => handleChangeDuration(item, e)}
                value={
                  item.durationInSeconds ? String(item.durationInSeconds) : ""
                }
              />

              <Spacer y={1} />

              <Select
                placeholder="Correct answer"
                value={getCorrectAnswer(item.answers)}
                onChange={(e) => handleChangeCorrectAnswer(item, e as string)}
              >
                {item.answers.map((answer, i) => (
                  <Select.Option value={String(i)}>
                    Answer {i + 1}
                  </Select.Option>
                ))}
              </Select>

              <Card.Footer className="footer">
                <Button
                  icon={<Trash />}
                  type="error"
                  auto
                  onClick={() => deleteQuestion(item)}
                >
                  Delete
                </Button>
              </Card.Footer>
            </Card>

            <Spacer y={1} />
          </>
        ))}

        {quiz.questions.length <= 50 && (
          <Card className="add" hoverable onClick={createQuestion}>
            <Text>Add Question</Text>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NewQuiz;
