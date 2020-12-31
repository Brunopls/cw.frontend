import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";
import { centeredSpin } from "./StyledSpinStyles";

/**
 * Stateless component
 * Returns a centered div containing a spinning circle
 */
const StyledSpin = ({ size }) => (
  <div style={centeredSpin}>
    <Spin size={size} />
  </div>
);

StyledSpin.propTypes = {
  size: PropTypes.string,
};

StyledSpin.defaultProps = {
  size: undefined,
};

export default StyledSpin;
