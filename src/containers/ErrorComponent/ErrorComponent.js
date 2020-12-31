import React from "react";
import PropTypes from "prop-types";
import { Result } from "antd";
import { withRouter } from "react-router-dom";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";

/**
 * Error Boundary Component
 * Catches an error in any component and shows an error page
 * before redirecting the user back to 'Home' and refreshing the page
 * @class ErrorComponent
 * @extends {React.Component}
 */
class ErrorComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null, redirect: false };
  }

  /**
   * If an error is found, set a timer for 1.5s and then redirect
   * the user back to 'Home'
   */
  componentDidUpdate() {
    const { error } = this.state;
    if (error) {
      this.redir = setTimeout(() => this.setState({ redirect: true }), 1500);
    }
  }

  /**
   * Catches an error and loads its info into state
   */
  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo,
    });
  }

  /**
   * Clear the timeout created by 'componentDidUpdate'
   */
  componentWillUnmount() {
    clearTimeout(this.redir);
  }

  /**
   * Renders the 'ErrorComponent'
   * @memberof ErrorComponent
   */
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
