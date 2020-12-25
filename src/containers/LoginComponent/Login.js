import React from "react";
import { Form, Input, Button, Result, Spin } from "antd";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";

import { emailRules, passwordRules } from "./LoginRules";
import { formItemLayout, tailFormItemLayout, centeredDiv } from "./LoginStyles";

import UserContext from "../../core/contexts/user";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      successful: false,
      failed: false,
      loading: false,
    };
    this.onFinish = this.onFinish.bind(this);
  }

  state = { redirect: null };

  static contextType = UserContext;

  onFinish = (values) => {
    this.setState({ loading: true });
    const { ...data } = values; // ignore the 'confirm' value in data sent
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

  render() {
    if (this.state.loading) {
      return (
        <div style={centeredDiv}>
          <Spin size="large" />
        </div>
      );
    }
    if (this.state.successful) {
      return (
        <Result
          status="success"
          title="Successfully logged in!"
          subTitle="Welcome."
        />
      );
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
