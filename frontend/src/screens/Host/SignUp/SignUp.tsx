import React, { useState } from "react";
import { Button, Grid, Input, Spacer, Text, useToasts } from "@geist-ui/react";
import { Mail, User } from "@geist-ui/react-icons";
import { Link, useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import * as validator from "class-validator";

import * as services from "services";

import { loggedUser } from "store/auth/auth";

import "./SignUp.scss";

const SignUp = () => {
  const [, setUser] = useRecoilState(loggedUser);
  const history = useHistory();
  const [, setToast] = useToasts();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUpPressed = async () => {
    try {
      setLoading(true);

      const { data } = await services.signUp({
        email,
        fullname,
        password,
        passwordConfirmation,
      });

      if (data.token) {
        localStorage.setItem("access-token", data.token);

        setUser(data.user);

        history.replace("/host");

        return;
      }
    } catch (error) {
      setToast({
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  };

  const handleFullnameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFullname(event.currentTarget.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  };

  const handlePasswordConfirmationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setPasswordConfirmation(event.currentTarget.value);
  };

  const canSubmit =
    validator.isEmail(email) &&
    validator.length(fullname, 1, 256) &&
    validator.equals(password, passwordConfirmation) &&
    validator.length(password, 8, 128) &&
    validator.length(passwordConfirmation, 8, 128) &&
    validator.matches(
      password,
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/
    ) &&
    validator.matches(
      passwordConfirmation,
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,128}$/
    );

  return (
    <div className="sign-up">
      <Text h1>Sign Up</Text>

      <Spacer y={1} />

      <Input
        className="input"
        icon={<User />}
        placeholder="Full Name"
        onChange={handleFullnameChange}
      />

      <Spacer y={0.5} />

      <Input
        className="input"
        icon={<Mail />}
        placeholder="Email"
        onChange={handleEmailChange}
      />

      <Spacer y={0.5} />

      <Input.Password
        className="input"
        placeholder="Password"
        onChange={handlePasswordChange}
      />

      <Spacer y={0.5} />

      <Input.Password
        className="input"
        placeholder="Confirm Password"
        onChange={handlePasswordConfirmationChange}
      />

      <Spacer y={1} />

      <Button
        type="secondary"
        disabled={!canSubmit}
        loading={loading}
        onClick={handleSignUpPressed}
      >
        Sign Up
      </Button>

      <Spacer y={1} />

      <Link to="login">
        <Text type="secondary" b>
          Already have an account? Log in
        </Text>
      </Link>
    </div>
  );
};

export default SignUp;
