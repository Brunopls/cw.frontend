import React from "react";
import { Form, Input, Button, Result, Spin } from "antd";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";
import { Link } from "react-router-dom";

import {
  emailRules,
  passwordRules,
  confirmRules,
  usernameRules,
  signUpCodeRules,
} from "./RegisterRules";
import {
  formItemLayout,
  tailFormItemLayout,
  centeredDiv,
} from "./RegisterStyles";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      successful: false,
      failed: false,
      loading: false,
    };
    this.onFinish = this.onFinish.bind(this);
  }

  onFinish = (values) => {
    this.setState({ loading: true });
    const { confirm, ...data } = values; // ignore the 'confirm' value in data sent
    fetch(`${config.BACK_END_URL}/api/users/`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(status)
      .then(json)
      .then((response) => {
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
          title="Successfully registered!"
          subTitle="You may now log in with your credentials."
          extra={
            <>
              <Button type="primary" key="login">
                <Link to="/login">Log In</Link>
              </Button>
            </>
          }
        />
      );
    }

    if (this.state.failed) {
      return (
        <Result
          status="error"
          title="Registration failed."
          subTitle="There was an error registering you."
          extra={
            <>
              <Button
                onClick={() => this.setState({ failed: false })}
                key="register"
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
        name="register"
        onFinish={this.onFinish}
        scrollToFirstError
      >
        <Form.Item
          name="signUpCode"
          label="Sign-up Code"
          rules={signUpCodeRules}
        >
          <Input />
        </Form.Item>

        <Form.Item name="fullName" label="Full Name" rules={usernameRules}>
          <Input />
        </Form.Item>

        <Form.Item name="email" label="E-mail" rules={emailRules}>
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={passwordRules}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={confirmRules}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default RegisterForm;
