import React, { useEffect, useState } from "react";
import { Button, Grid, Input, Spacer, Text, useToasts } from "@geist-ui/react";
import { Mail } from "@geist-ui/react-icons";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import * as validator from "class-validator";

import * as services from "services";

import { loggedUser } from "store/auth/auth";

import "./Login.scss";

const Login = () => {
  const [, setUser] = useRecoilState(loggedUser);
  const history = useHistory();
  const [, setToast] = useToasts();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginPressed = async () => {
    try {
      setLoading(true);

      const { data } = await services.login({
        email,
        password,
      });

      if (data.token) {
        localStorage.setItem("access-token", data.token);

        setUser(data.user);

        history.replace("/host");

        return;
      }
    } catch (error) {
      setToast({
        text: "Login failed, please check your credentials",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const canSubmit =
    validator.isEmail(email) &&
    validator.length(password, 8, 128) &&
    validator.matches(
      password,
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/
    );

  return (
    <div className="login">
      <Text h1>Login</Text>

      <Spacer y={1} />

      <Input
        className="input"
        icon={<Mail />}
        placeholder="Email"
        onChange={handleEmailChange}
        value={email}
      />

      <Spacer y={0.5} />

      <Input.Password
        className="input"
        placeholder="Password"
        onChange={handlePasswordChange}
        value={password}
      />

      <Spacer y={1} />

      <Button
        type="secondary"
        disabled={!canSubmit}
        loading={loading}
        onClick={handleLoginPressed}
      >
        Login
      </Button>

      <Spacer y={1} />

      <Link to="signup">
        <Text type="secondary" b>
          Don't have an account? Sign Up
        </Text>
      </Link>
    </div>
  );
};

export default Login;
