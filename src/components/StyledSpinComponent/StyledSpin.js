import React from "react";
import { Spin } from "antd";
import { centeredSpin } from "./StyledSpinStyles";

class StyledSpin extends React.Component {
  render() {
    return (
      <div style={centeredSpin}>
        <Spin size="large" />
      </div>
    );
  }
}

export default StyledSpin;
