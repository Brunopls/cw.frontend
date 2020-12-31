import React from "react";
import { Form, Input, Button, Result } from "antd";
import { Link } from "react-router-dom";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";
import {
  emailRules,
  passwordRules,
  confirmRules,
  usernameRules,
  signUpCodeRules,
} from "../../core/utilities/authRules";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";

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
      .then(() => {
        this.setState({ loading: false, successful: true });
      })
      .catch(() => {
        this.setState({ loading: false, failed: true });
      });
  };

  render() {
    const { loading, successful, failed } = this.state;
    if (loading) {
      return <StyledSpin />;
    }
    if (successful) {
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

    if (failed) {
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
        labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
        wrapperCol={{ xs: { span: 24 }, sm: { span: 12 } }}
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

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default RegisterForm;
