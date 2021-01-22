/* eslint-disable react-hooks/rules-of-hooks */

import React, { useEffect, useState } from "react";
import { Card, Grid, Progress, Spacer, Text, useToasts } from "@geist-ui/react";
import { Toast } from "@geist-ui/react/dist/use-toasts/use-toast";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { player as playerState } from "store/game/player";

import { delay } from "utils/helpers";

import { Quiz } from "interfaces/services/models/Quiz";
import { Game as GameType } from "interfaces/services/models/Game";
import { QuestionAnswer } from "interfaces/services/models/QuestionAnswer";

import "./Game.scss";

const Game = () => {
  const { state: routerState } = useLocation<{ quiz: Quiz; pin: string }>();
  const history = useHistory();
  const player = useRecoilValue(playerState);
  const [, setToast] = useToasts();

  const [init, setInit] = useState(false);
  const [questionOrder, setQuestionOrder] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [currentQuestionAnswered, setCurrentQuestionAnswered] = useState(false);
  const [answerable, setAnswerable] = useState(true);
  const [currentQuestionResult, setCurrentQuestionResult] = useState(false);

  if (!routerState) {
    return <Redirect to="/" />;
  }

  const { quiz, pin } = routerState;

  const isLastQuestion = quiz.questions.length === questionOrder + 1;

  const currentQuestion = quiz.questions[questionOrder];

  const socketEventListeners = () => {
    window.socket.on("answer-result", (data: { isCorrect: boolean }) => {
      setCurrentQuestionResult(data.isCorrect);
    });

    window.socket.on("game-finished", (game: GameType) => {
      history.replace("/finished", {
        game,
      });
    });
  };

  useEffect(() => {
    if (!routerState) {
      return;
    }

    setCountdown(currentQuestion.durationInSeconds);
    setInit(true);
    socketEventListeners();

    return () => {
      window.socket.off("answer-result");
      window.socket.off("game-finished");
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((currentState) => {
        if (currentState === 0) {
          clearInterval(intervalId);

          if (isLastQuestion) {
            return currentState;
          }

          setQuestionOrder(questionOrder + 1);

          const nextQuestion = routerState.quiz.questions[questionOrder + 1];

          setCountdown(nextQuestion.durationInSeconds);

          setCurrentQuestionAnswered(false);

          setCurrentQuestionResult(false);

          setAnswerable(true);

          return currentState;
        }

        return currentState - 1;
      });
    }, 1000);
  }, [questionOrder]);

  useEffect(() => {
    (async () => {
      if (countdown !== 0 || !answerable || !init) {
        return;
      }

      setAnswerable(false);

      await delay(200);

      setToast(getAnswerResultToast());
    })();
  }, [
    countdown,
    currentQuestionResult,
    currentQuestionAnswered,
    answerable,
    init,
  ]);

  const getAnswerResultToast = (): Toast => {
    if (!currentQuestionAnswered) {
      return {
        text: "You are not answered",
        type: "error",
      };
    } else if (currentQuestionResult) {
      return {
        text: "Correct answer",
        type: "success",
      };
    } else {
      return {
        text: "Incorrect answer",
        type: "error",
      };
    }
  };

  const getColor = (index: number) => {
    if (currentQuestionAnswered) {
      return "dark";
    }

    switch (index) {
      case 0:
        return "success";
      case 1:
        return "error";
      case 2:
        return "violet";
      case 3:
        return "alert";
      default:
        return "success";
    }
  };

  const handleAnswerPress = (answer: QuestionAnswer) => {
    if (countdown < 0.1 || currentQuestionAnswered || !answerable) {
      return;
    }

    window.socket.emit("answer-question", {
      pin,
      playerId: player!.id,
      questionId: currentQuestion.id,
      answerId: answer.id,
      answerTime: currentQuestion.durationInSeconds - countdown,
    });

    setCurrentQuestionAnswered(true);
  };

  return (
    <div className="player-game">
      <Spacer y={2} />

      <Progress value={100 * (countdown / currentQuestion.durationInSeconds)} />

      <Spacer y={1} />

      <Grid.Container gap={2}>
        {currentQuestionAnswered ? (
          <div className="answered">
            <Spacer y={1} />

            <Text h3 type="secondary">
              Waiting next question
            </Text>
          </div>
        ) : (
          <>
            {currentQuestion.answers.map((item, index) => (
              <Grid xs={12} alignItems="center">
                <Card
                  className="answer"
                  type={getColor(index)}
                  hoverable
                  onClick={() => handleAnswerPress(item)}
                />
              </Grid>
            ))}
          </>
        )}
      </Grid.Container>
    </div>
  );
};

export default Game;
