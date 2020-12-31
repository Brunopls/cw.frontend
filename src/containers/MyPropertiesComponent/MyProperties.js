/* eslint-disable no-void */
import React from "react";
import PropTypes from "prop-types";
import Home from "../HomeComponent/Home";

/**
 * Stateless component
 * Returns a 'Home' component
 * I created this because, at the time, I hadn't found a way to reutilise the Home component
 * for both the "Home" and "MyProperties" pages
 * @param {Object} user
 */
const MyProperties = ({ user }) => <Home ownProperties user={user} />;

MyProperties.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    login: PropTypes.func,
    loggout: PropTypes.func,
  }),
};

MyProperties.defaultProps = {
  user: {
    id: "",
    token: "",
    loggedIn: false,
    login: undefined,
    loggout: undefined,
  },
};

export default MyProperties;
