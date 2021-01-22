import React from "react";
import { Switch, Route, RouteComponentProps, Redirect } from "react-router-dom";

import useLocalStorage from "../hooks/use-local-storage";

import Lobby from "../screens/Host/Lobby/Lobby";
import NewQuiz from "../screens/Host/NewQuiz/NewQuiz";
import Login from "../screens/Host/Login/Login";
import SignUp from "../screens/Host/SignUp/SignUp";
import Home from "../screens/Host/Home/Home";
import Game from "../screens/Host/Game/Game";
import GameFinished from "../screens/Host/GameFinished/GameFinished";
import Quiz from "screens/Host/Quiz/Quiz";

const AuthRoute = ({ match }: RouteComponentProps) => {
  const [accessToken] = useLocalStorage("access-token");

  if (accessToken) {
    return <Redirect to={match.url + "/"} />;
  }

  return (
    <Switch>
      <Route path={match.url + "/login"} component={Login} />
      <Route path={match.url + "/signup"} component={SignUp} />
    </Switch>
  );
};

const Host = ({ match }: RouteComponentProps) => {
  return (
    <Switch>
      <Route path={match.url + "/"} exact component={Home} />
      <Route path={match.url + "/new-quiz"} exact component={NewQuiz} />
      <Route path={match.url + "/quiz/:id"} exact component={Quiz} />
      <Route path={match.url + "/lobby"} exact component={Lobby} />
      <Route path={match.url + "/game"} component={Game} />
      <Route path={match.url + "/finished"} component={GameFinished} />

      <Route path={match.url + "/auth"} component={AuthRoute} />
    </Switch>
  );
};

export default Host;
