import React from "react";
import { Button, Grid, Spacer, Text } from "@geist-ui/react";
import { Link, Redirect, useLocation } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { player as playerState } from "store/game/player";

import { Game } from "interfaces/services/models/Game";

import "./GameFinished.scss";

const GameFinished = () => {
  const { state: routerState } = useLocation();
  const player = useRecoilValue(playerState);

  if (!routerState) {
    return <Redirect to="/" />;
  }

  const { game } = routerState as { game: Game };

  const [currentPlayer] = game.players.filter(
    (item) => item.playerName === player!.playerName
  );

  return (
    <div className="player-game-finished">
      <Spacer y={2} />

      <Text h1>Game finished</Text>

      <Spacer y={1} />

      <Text h3>Total Points</Text>
      <Text h3 type="secondary">
        {currentPlayer.totalPoints}
      </Text>

      <Spacer y={4} />

      <Link to="/">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
};

export default GameFinished;
