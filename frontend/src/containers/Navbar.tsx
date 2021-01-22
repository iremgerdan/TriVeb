import React, { useEffect, useState } from "react";
import { Avatar, Button } from "@geist-ui/react";
import { LogOut } from "@geist-ui/react-icons";

import "./Navbar.scss";
import { Link, useHistory } from "react-router-dom";

import { loggedUser } from "store/auth/auth";
import { useRecoilValue } from "recoil";

const Navbar: React.FC<{}> = () => {
  const user = useRecoilValue(loggedUser);
  const [showLogoutButton, setShowLogoutButton] = useState(false);
  const history = useHistory();

  useEffect(() => {
    if (user) {
      setShowLogoutButton(true);
    } else {
      setShowLogoutButton(false);
    }
  }, [user]);

  const handleLogoutClick = () => {
    localStorage.removeItem("access-token");
    setShowLogoutButton(false);
    history.replace("/");
  };

  return (
    <div className="navbar">
      <Link to="/">
        <Avatar
          src={`${process.env.PUBLIC_URL}/logo.png`}
          size="medium"
          isSquare
        />
      </Link>
      {showLogoutButton && (
        <Button
          icon={<LogOut />}
          auto
          type="secondary"
          onClick={handleLogoutClick}
        ></Button>
      )}
    </div>
  );
};

export default Navbar;
