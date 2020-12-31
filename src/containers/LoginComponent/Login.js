import React from "react";
import PropTypes from "prop-types";
import { Form, Input, Button, Result, message } from "antd";
import { Redirect } from "react-router-dom";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";

import { emailRules, passwordRules } from "../../core/utilities/authRules";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";

import UserContext from "../../core/contexts/user";

/**
 * Stateful component
 * @class LoginForm
 * @extends {React.Component}
 */
class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    /**
     * @type {Object}
     * @property {Boolean} successful
     * @property {Boolean} failed
     * @property {Boolean} loading
     * @property {Boolean} false
     */
    this.state = {
      successful: false,
      failed: false,
      loading: false,
      redirect: false,
    };
    this.onFinish = this.onFinish.bind(this);
  }

  /**
   * Checks if the router has sent 'unauthorisedAccess' property in state
   * This happens because, when a user tries to access a page they're not allowed to
   * see, they'll be redirected back to the Login page, and this message will be shown
   */
  componentDidMount() {
    const { location } = this.props;
    const { state } = location;
    if (state) {
      const { unauthorisedAccess } = state;
      if (unauthorisedAccess) {
        message.error("You have to be logged in to access that feature.");
      }
    }
  }

  /**
   * Checks if the login was successful, and if so, sets a timer for one second
   * and then redirects the user to the 'My Properties' page
   */
  componentDidUpdate() {
    const { successful } = this.state;
    if (successful)
      this.redir = setTimeout(
        () => this.setState({ successful: false, redirect: true }),
        1000
      );
  }

  /**
   * Clear the timeout created by 'componentDidUpdate'
   */
  componentWillUnmount() {
    clearTimeout(this.redir);
  }

  /**
   * Form submission function
   * Takes data from the 'login' form and from the
   * state and uses it to make an API POST request
   * @param {Object} values
   * @memberof LoginForm
   */
  onFinish(values) {
    const { login } = this.context;
    this.setState({ loading: true });
    const { ...data } = values;
    fetch(`${config.BACK_END_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${btoa(`${data.email}:${data.password}`)}`,
      },
    })
      .then(status)
      .then(json)
      .then((response) => {
        login(response);
        this.setState({ loading: false, successful: true });
      })
      .catch(() => {
        this.setState({ loading: false, failed: true });
      });
  }

  /**
   * Renders the 'LoginForm' component.
   * Whilst the API call is being made and the response is being validated, show a spinning circle
   * If the call succeeds, show a 'success' message and redirect the user back to their 'My Properties' page
   * If the call fails, show an 'error' message
   * @memberof LoginForm
   */
  render() {
    const { loading, successful, redirect, failed } = this.state;

    if (loading) {
      return <StyledSpin />;
    }

    if (successful) {
      return (
        <Result
          status="success"
          title="Successfully logged in!"
          subTitle="We're redirecting you to the Home page..."
          extra={[<StyledSpin key={Math.random()} />]}
        />
      );
    }

    if (redirect) {
      return <Redirect to="/properties/own" />;
    }

    if (failed) {
      return (
        <Result
          status="error"
          title="Login failed."
          subTitle="There was an error validating your credentials."
          extra={
            <>
              <Button
                onClick={() => this.setState({ failed: false })}
                key="login"
              >
                Back
              </Button>
            </>
          }
        />
      );
    }
    return (
      <Form
        labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 12 } }}
        name="login"
        onFinish={this.onFinish}
        scrollToFirstError
      >
        <Form.Item name="email" label="Email" rules={emailRules}>
          <Input />
        </Form.Item>

        <Form.Item name="password" label="Password" rules={passwordRules}>
          <Input.Password />
        </Form.Item>

        <Form.Item
          wrapperCol={{
            xs: { span: 24, offset: 0 },
            sm: { span: 16, offset: 6 },
          }}
        >
          <Button type="primary" htmlType="submit">
            Log In
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

LoginForm.contextType = UserContext;

LoginForm.propTypes = {
  location: PropTypes.shape({
    state: PropTypes.shape({
      unauthorisedAccess: PropTypes.bool,
    }),
  }),
};

LoginForm.defaultProps = {
  location: {
    state: {
      unauthorisedAccess: false,
    },
  },
};

export default LoginForm;
