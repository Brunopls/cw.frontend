import React from 'react';
import { Spin } from 'antd';
import { centeredSpin } from './StyledSpinStyles';

class StyledSpin extends React.Component {
  render() {
    return (
      <div style={centeredSpin}>
        <Spin size={this.props.size} />
      </div>
    );
  }
}

export default StyledSpin;
