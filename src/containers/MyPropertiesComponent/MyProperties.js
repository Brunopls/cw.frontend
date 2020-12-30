/* eslint-disable no-void */
import React from "react";
import PropTypes from "prop-types";
import Home from "../HomeComponent/Home";

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
