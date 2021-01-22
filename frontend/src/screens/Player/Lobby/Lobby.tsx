import React, { useEffect, useState } from "react";
import { Grid, Spacer, Spinner, Text, useToasts } from "@geist-ui/react";
import { Redirect, useHistory, useLocation } from "react-router-dom";

import { delay } from "utils/helpers";

import "./Lobby.scss";

const Lobby = () => {
  const { state: routerState } = useLocation();
  const history = useHistory();
  const [, setToast] = useToasts();

  const [started, setStarted] = useState(false);
  const [counter, setCounter] = useState(5);

  const socketEventListeners = () => {
    window.socket.on("game-started", async (data: any) => {
      setStarted(true);

      setToast({
        text: "Game starting soon be ready!",
        type: "success",
        delay: 5000,
      });

      const intervalId = setInterval(() => {
        setCounter((currentState) => {
          if (currentState === 1) {
            clearInterval(intervalId);

            return 0;
          }

          return currentState - 1;
        });
      }, 1000);

      await delay(5000);

      history.replace(`/game`, {
        pin,
        quiz: data,
      });
    });
  };

  useEffect(() => {
    socketEventListeners();

    return () => {
      window.socket.off("game-started");
    };
  }, []);

  if (!routerState) {
    return <Redirect to="/" />;
  }

  const { pin } = routerState as { pin: string };

  return (
    <div className="player-lobby">
      <Spacer y={2} />

      <Text h1>Waiting on host start the game</Text>

      <Spacer y={1} />

      <Text h3>Do you see your name on the screen</Text>
    </div>
  );
};

export default Lobby;
