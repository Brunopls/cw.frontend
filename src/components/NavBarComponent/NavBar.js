import React, { useContext } from "react";
import { Menu } from "antd";
import { Link } from "react-router-dom";
import UserContext from "../../core/contexts/user";

/**
 * Stateless component
 * Shows a NavBar
 */
const Nav = () => {
  // Uses our UserContext context to check if a user is authenticated
  const context = useContext(UserContext);
  const { user } = context;
  const { loggedIn } = user;
  let LoginNav;
  /**
   * Renders the items in the NavBar based on whether a used is authenticated or not
   */
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
        <Menu.Item key="3">
          <Link to="/messages/">My Messages</Link>
        </Menu.Item>
        <Menu.Item key="4" onClick={context.logout}>
          <Link to="/">Log Out</Link>
        </Menu.Item>
      </>
    );
  }
  return (
    <>
      <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
        <Menu.Item key="1">
          <Link to="/">Home</Link>
        </Menu.Item>
        {LoginNav}
      </Menu>
    </>
  );
};

export default Nav;
