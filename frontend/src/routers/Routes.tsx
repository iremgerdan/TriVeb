import { Grid } from "@geist-ui/react";
import Navbar from "containers/Navbar";
import React from "react";
import { Switch, Route } from "react-router-dom";

import AuthProvider from "../containers/AuthProvider";

import Game from "../screens/Player/Game/Game";
import GameFinished from "../screens/Player/GameFinished/GameFinished";
import Home from "../screens/Player/Home/Home";
import Lobby from "../screens/Player/Lobby/Lobby";

import Host from "./Host";

const Routes = () => {
  return (
    <Grid.Container gap={2} alignItems="center" justify="center">
      <Grid xs={20} md={18} lg={12} xl={12}>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />

          <Route path="/lobby" component={Lobby} />
          <Route path="/game" component={Game} />
          <Route path="/finished" component={GameFinished} />

          <AuthProvider>
            <Route path="/host" component={Host} />
          </AuthProvider>
        </Switch>
      </Grid>
    </Grid.Container>
  );
};

export default Routes;
