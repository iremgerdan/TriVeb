import React from "react";
import { Button, Grid, Spacer, Table, Text } from "@geist-ui/react";
import { Link, Redirect, useLocation } from "react-router-dom";
import _ from "lodash";

import { Game } from "interfaces/services/models/Game";

import "./GameFinished.scss";

const GameFinished = () => {
  const { state: routerState } = useLocation<{
    game: Game;
  }>();

  if (!routerState) {
    return <Redirect to="/host" />;
  }

  const { game } = routerState;
  game.players = _.sortBy(game.players, (player) => -player.totalPoints);

  const winnerPlayer = _.maxBy(game.players, (player) => player.totalPoints)!;

  const playersWithSameScore = game.players.filter(
    (player) => player.totalPoints === winnerPlayer.totalPoints
  );

  const isHavePlayerSamePoint = playersWithSameScore.length > 1;

  const winnersTitle = isHavePlayerSamePoint ? "Winners" : "Winner";

  const winners = isHavePlayerSamePoint
    ? playersWithSameScore.map((player) => player.playerName).join(", ")
    : winnerPlayer.playerName;

  return (
    <div className="host-game-finished">
      <Spacer y={2} />

      <Text h1>Game finished</Text>

      <Spacer y={1} />

      <Text h3>{winnersTitle}</Text>
      <Text h3 type="secondary">
        {winners}
      </Text>

      <Spacer y={1} />

      <Text h3>Total Points</Text>
      <Text h3 type="secondary">
        {winnerPlayer.totalPoints}
      </Text>

      <Spacer y={4} />

      <Table className="table" data={game.players} emptyText="0">
        <Table.Column prop="playerName" label="Player Name" />
        <Table.Column prop="totalPoints" label="Points" />
        <Table.Column prop="numberOfCorrectAnswers" label="Correct" />
        <Table.Column prop="numberOfIncorrectAnswers" label="Incorrect" />
        <Table.Column prop="numberOfEmptyAnswers" label="Empty" />
      </Table>

      <Spacer y={4} />

      <Link to="/host">
        <Button>Back to home</Button>
      </Link>
    </div>
  );
};

export default GameFinished;
