import React from "react";
import PropTypes from "prop-types";
import { Spin } from "antd";
import { centeredSpin } from "./StyledSpinStyles";

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
