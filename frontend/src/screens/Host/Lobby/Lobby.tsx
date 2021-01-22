/* eslint-disable react-hooks/rules-of-hooks */

import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Grid,
  Spacer,
  Text,
  Note,
  useToasts,
} from "@geist-ui/react";
import { Redirect, useHistory, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";
import * as validator from "class-validator";

import { loggedUser } from "store/auth/auth";

import { delay } from "utils/helpers";

import { Player } from "interfaces/services/game/player";

import "./Lobby.scss";

const Lobby = () => {
  const { state: routerState } = useLocation<{ pin: string }>();
  const history = useHistory();
  const user = useRecoilValue(loggedUser);
  const [players, setPlayers] = useState<Player[]>([]);
  const [started, setStarted] = useState(false);
  const [, setToast] = useToasts();

  if (!routerState) {
    return <Redirect to="/host" />;
  }

  const { pin } = routerState;

  useEffect(() => {
    socketEventListeners();

    return () => {
      window.socket.off("player-joined");
      window.socket.off("game-started");
    };
  }, []);

  const handleStartPress = () => {
    window.socket.emit("start-game", {
      playerName: user!.fullname,
      pin,
    });
  };

  const socketEventListeners = () => {
    window.socket.on("player-joined", (player: Player) => {
      setPlayers((currentState) => {
        return [...currentState, player];
      });

      setToast({
        text: `${player.playerName} is joined.`,
        type: "success",
      });
    });

    window.socket.on("game-started", async (data: any) => {
      setStarted(true);

      setToast({
        text: "Game starting soon be ready!",
        type: "success",
        delay: 5000,
      });

      await delay(5000);

      setPlayers((currentState) => {
        history.replace(`/host/game`, {
          quiz: data,
          players: currentState,
          pin,
        });

        return currentState;
      });
    });
  };

  const canSubmit = validator.arrayMinSize(players, 1) && !started;

  return (
    <div className="host-lobby">
      <Spacer y={2} />

      <Text h1>Join this game using the game PIN</Text>
      <Text h2 type="default">
        {pin}
      </Text>

      <Spacer y={2} />

      <div>
        {players.length < 1 && (
          <>
            <Note label={false}>Waiting players!</Note>
            <Spacer y={2} />
          </>
        )}

        {players.map((item) => (
          <>
            <Card>{item.playerName}</Card>

            <Spacer y={1} />
          </>
        ))}

        <Spacer y={1} />

        <Button
          type="secondary"
          size="large"
          disabled={!canSubmit}
          onClick={handleStartPress}
        >
          Start Game
        </Button>
      </div>
    </div>
  );
};

export default Lobby;
