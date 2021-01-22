import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Grid,
  Spacer,
  Text,
  Note,
  useToasts,
  Loading,
} from "@geist-ui/react";
import { Link, useHistory } from "react-router-dom";
import { Plus, Trash } from "@geist-ui/react-icons";
import useLocalStorage from "hooks/use-local-storage";

import * as services from "services";

import { Quiz } from "interfaces/services/models/Quiz";

import "./Home.scss";

const Home = () => {
  const history = useHistory();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setToast] = useToasts();
  const [accessToken] = useLocalStorage("access-token");

  useEffect(() => {
    const getData = async () => {
      if (!accessToken) {
        return;
      }

      try {
        const { data } = await services.getQuizzes();

        setQuizzes(data);
      } catch (error) {
        setToast({
          text: "Internal server error",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    getData();
    socketEventListeners();

    return () => {
      window.socket.off("game-created");
    };
  }, []);

  const handleQuizPress = (quiz: Quiz) => {
    history.push(`/host/quiz/${quiz.id}`);
    // window.socket.emit("create-game", {
    //   quizId: quiz.id,
    // });
  };

  const socketEventListeners = () => {
    window.socket.on("game-created", (data: { pin: string }) => {
      history.push(`/host/lobby`, {
        pin: data.pin,
      });
    });
  };

  return (
    <div className="host-home">
      <Spacer y={2} />

      <div className="header">
        <Text h1>Quizzes</Text>

        <Link to="/host/new-quiz">
          <Button auto type="secondary" icon={<Plus />}>
            New Quiz
          </Button>
        </Link>
      </div>

      <Spacer y={2} />

      <div>
        {loading ? (
          <Loading size="large" />
        ) : (
          <>
            {quizzes.length < 1 && (
              <>
                <Note filled>No quizzes found!</Note>
              </>
            )}

            {quizzes.map((item) => (
              <>
                <Card className="quiz" onClick={() => handleQuizPress(item)}>
                  <Card.Content className="quizContent">
                    {item.name}
                  </Card.Content>
                </Card>

                <Spacer y={1} />
              </>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
