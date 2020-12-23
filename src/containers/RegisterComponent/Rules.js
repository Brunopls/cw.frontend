// define validation rules for the form fields
exports.emailRules = [
  { type: "email", message: "The input is not valid E-mail!" },
  { required: true, message: "Please input your E-mail!" },
];

exports.passwordRules = [
  { required: true, min: 6,  message: "Please input your password!" },
];

exports.signUpCodeRules = [
  { required: true, message: "Please provide a sign-up code!" },
];

exports.confirmRules = [
  { required: true, message: "Please confirm your password!" },
  ({ getFieldValue }) => ({
    validator(rule, value) {
      if (!value || getFieldValue("password") === value) {
        return Promise.resolve();
      }
      return Promise.reject("The two passwords that you entered do not match!");
    },
  }),
];

exports.usernameRules = [
  { required: true, message: "Please input your username!", whitespace: true },
];
