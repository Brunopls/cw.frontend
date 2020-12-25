import React from "react";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";
import {
  Form,
  Input,
  Button,
  Result,
  List,
  Card,
  Divider,
  PageHeader,
  Badge,
  Space,
} from "antd";

import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";

class Property extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  render() {
    if (this.state.loading) {
      return <StyledSpin />;
    }

    if (this.props.mode === "read") {
      return <Card title={this.props.property.name}>Test</Card>;
    }
  }
}

export default Property;
