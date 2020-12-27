import React from "react";
import { useContext } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import UserContext from "../../core/contexts/user";

import { HomeFilled } from "@ant-design/icons";

function Nav(props) {
  const context = useContext(UserContext);
  const loggedIn = context.user.loggedIn;
  console.log(context);
  let LoginNav;
  if (!loggedIn) {
    LoginNav = (
      <>
        <Menu.Item key="2">
          <Link to="/register">Register</Link>
        </Menu.Item>
        <Menu.Item key="3">
          <Link to="/login">Log In</Link>
        </Menu.Item>
      </>
    );
  } else {
    LoginNav = (
      <>
        <Menu.Item key="2">
          <Link to="/properties/own">My Properties</Link>
        </Menu.Item>
        <Menu.Item key="3" onClick={context.logout}>
          <Link to="/">Log Out</Link>
        </Menu.Item>
      </>
    );
  }
  return (
    <>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item disabled key="0">
          <HomeFilled />
        </Menu.Item>
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        {LoginNav}
      </Menu>
    </>
  );
}

export default Nav;
