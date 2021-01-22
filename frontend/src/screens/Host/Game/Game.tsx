/* eslint-disable react-hooks/rules-of-hooks */

import React, { useEffect, useState } from "react";
import { Card, Grid, Progress, Spacer, Text } from "@geist-ui/react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { Player } from "interfaces/services/game/player";
import { Quiz } from "interfaces/services/models/Quiz";
import { Game as GameType } from "interfaces/services/models/Game";

import { loggedUser } from "store/auth/auth";

import { delay } from "utils/helpers";

import "./Game.scss";

const Game = () => {
  const history = useHistory();
  const { state: routerState } = useLocation<{
    quiz: Quiz;
    players: Player[];
    pin: string[];
  }>();
  const user = useRecoilValue(loggedUser);

  const [questionOrder, setQuestionOrder] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [answersCount, setAnswersCount] = useState(0);

  if (!routerState) {
    return <Redirect to="/host" />;
  }

  const { quiz, players, pin } = routerState;

  const isLastQuestion = quiz.questions.length === questionOrder + 1;

  const currentQuestion = quiz.questions[questionOrder];

  useEffect(() => {
    setCountdown(currentQuestion.durationInSeconds);
    socketEventListeners();

    return () => {
      window.socket.off("question-answered");
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

          const nextQuestion = quiz.questions[questionOrder + 1];

          setCountdown(nextQuestion.durationInSeconds);

          setAnswersCount(0);

          return currentState;
        }

        return currentState - 1;
      });
    }, 1000);
  }, [questionOrder]);

  useEffect(() => {
    (async () => {
      if (isLastQuestion && countdown === 1) {
        await delay(1000);

        finishGame();
      }
    })();
  }, [isLastQuestion, countdown]);

  const socketEventListeners = () => {
    window.socket.on("question-answered", (data: any) => {
      setAnswersCount((currentState) => {
        return currentState + 1;
      });
    });

    window.socket.on("game-finished", (game: GameType) => {
      history.replace("/host/finished", {
        quiz,
        players,
        game,
      });
    });
  };

  const getColor = (index: number) => {
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

  const finishGame = () => {
    window.socket.emit("finish-game", {
      playerName: user!.fullname,
      pin,
    });
  };

  return (
    <div className="host-game">
      <Spacer y={2} />

      <div className="header">
        <Text h3 type="secondary">
          {quiz.name}
        </Text>

        <Text h3>{countdown}</Text>
      </div>

      <Text h1>{currentQuestion.question}</Text>

      <Spacer y={1} />

      <Grid.Container gap={2}>
        {currentQuestion.answers.map((item, index) => (
          <Grid xs={12} alignItems="center">
            <Card className="answer" type={getColor(index)}>
              <Text>{item.answer}</Text>
            </Card>
          </Grid>
        ))}
      </Grid.Container>

      <Spacer y={2} />

      <Text h4>Remaining time</Text>
      <Progress value={100 * (countdown / currentQuestion.durationInSeconds)} />

      <Spacer y={1} />

      <Text h4>Players answered</Text>
      <Progress value={100 * (answersCount / players.length)} />
    </div>
  );
};

export default Game;
