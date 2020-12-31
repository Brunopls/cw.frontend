import React from "react";
import PropTypes from "prop-types";
import { Result } from "antd";
import { withRouter } from "react-router-dom";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";

class ErrorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null, redirect: false };
  }

  componentDidUpdate() {
    const { error } = this.state;
    if (error) {
      this.redir = setTimeout(() => this.setState({ redirect: true }), 1500);
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.redir);
  }

  render() {
    const { errorInfo, redirect } = this.state;
    if (redirect) {
      const { history } = this.props;
      history.push("/");
      window.location.reload();
    }

    if (errorInfo) {
      return (
        <Result
          status="500"
          title="Something went wrong!"
          subTitle="Sorry for the inconvenience. We're redirecting you to the Home page."
          extra={<StyledSpin />}
        />
      );
    }
    const { children } = this.props;
    return children;
  }
}

ErrorComponent.propTypes = {
  children: PropTypes.arrayOf(PropTypes.instanceOf(Object)).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
};

export default withRouter(ErrorComponent);
