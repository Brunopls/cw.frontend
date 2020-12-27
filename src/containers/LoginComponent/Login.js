import React from "react";
import { Form, Input, Button, Result, message } from "antd";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";

import { emailRules, passwordRules } from "./LoginRules";
import { formItemLayout, tailFormItemLayout } from "./LoginStyles";
import { Redirect } from "react-router-dom";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";

import UserContext from "../../core/contexts/user";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      successful: false,
      failed: false,
      loading: false,
      redirect: false,
    };
    this.onFinish = this.onFinish.bind(this);
  }

  static contextType = UserContext;

  onFinish = (values) => {
    this.setState({ loading: true });
    const { ...data } = values;
    fetch(`${config.BACK_END_URL}/api/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(data.email + ":" + data.password),
      },
    })
      .then(status)
      .then(json)
      .then((data) => {
        this.context.login(data);
        this.setState({ loading: false, successful: true });
      })
      .catch((err) => {
        this.setState({ loading: false, failed: true });
      });
  };

  componentDidMount() {
    if (this.props.location.state) {
      if (this.props.location.state.unauthorisedAccess) {
        message.error("You have to be logged in to access that feature.");
      }
    }
  }

  componentDidUpdate() {
    if (this.state.successful)
      this.redir = setTimeout(
        () => this.setState({ successful: false, redirect: true }),
        1000
      );
  }

  componentWillUnmount() {
    clearTimeout(this.redir);
  }

  render() {
    if (this.state.loading) {
      return <StyledSpin />;
    }

    if (this.state.successful) {
      return (
        <Result
          status="success"
          title="Successfully logged in!"
          subTitle="We're redirecting you to the Home page..."
          extra={[<StyledSpin key={Math.random()} />]}
        />
      );
    }

    if (this.state.redirect) {
      return <Redirect to="/properties/own" />;
    }

    if (this.state.failed) {
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
        {...formItemLayout}
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

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Log In
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default LoginForm;
