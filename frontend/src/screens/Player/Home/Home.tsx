import React, { useEffect, useState } from "react";
import { Button, Display, Grid, Image, Input, Spacer, Text } from "@geist-ui/react";
import { Key, User } from "@geist-ui/react-icons";
import { Link, useHistory } from "react-router-dom";
import * as validator from "class-validator";
import { useRecoilState } from "recoil";

import { player as playerStore } from "store/game/player";

import { Player } from "interfaces/services/game/player";

import "./Home.scss";

const Home = () => {
  const [pin, setPin] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [, setPlayer] = useRecoilState(playerStore);
  const history = useHistory();

  useEffect(() => {
    socketEventListeners();

    return () => {
      window.socket.off("player-joined");
    };
  }, []);

  const socketEventListeners = () => {
    window.socket.on("player-joined", (data: Player) => {
      setPlayer(data);

      setPin((currentValue) => {
        history.push(`/lobby`, {
          pin: currentValue,
        });

        return currentValue;
      });
    });
  };

  const handlePinChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPin(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerName(event.target.value);
  };

  const handleJoinGamePress = () => {
    window.socket.emit("join-game", {
      pin,
      playerName,
    });
  };

  const canSubmit =
    validator.length(pin, 6, 6) && validator.minLength(playerName, 1);

  return (
    <div className="player-home">
      <Display shadow>
        <Image width={200} height={200} src={`${process.env.PUBLIC_URL}/logo.png`} />
      </Display>

      <Text h1>Join a game</Text>

      <div>
        <Spacer y={1} />

        <Input
          className="input"
          icon={<User />}
          placeholder="Player name"
          value={playerName}
          onChange={handleNameChange}
        />

        <Spacer y={0.5} />

        <Input
          className="input"
          icon={<Key />}
          placeholder="PIN"
          value={pin}
          onChange={handlePinChange}
          maxLength={6}
        />

        <Spacer y={1} />

        <Button
          type="secondary"
          onClick={handleJoinGamePress}
          disabled={!canSubmit}
        >
          Join
        </Button>
      </div>

      <Spacer y={1} />

      <Link to="/host">
        <Text type="secondary" b>
          Host a game!
        </Text>
      </Link>
    </div>
  );
};

export default Home;
