import React from "react";
import Home from "../HomeComponent/Home";

class MyProperties extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <Home ownProperties={true} user={this.props.user} />;
  }
}
export default MyProperties;
