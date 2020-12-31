import React from "react";
import PropTypes from "prop-types";
import {
  Form,
  Input,
  Button,
  Result,
  Card,
  Select,
  Row,
  Col,
  Switch,
} from "antd";
import { Redirect } from "react-router-dom";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";
import {
  titleProps,
  descriptionProps,
  locationProps,
  categoryProps,
  featuresProps,
  askingPriceProps,
  visibleProps,
  highPriorityProps,
  underOfferProps,
} from "../../core/utilities/propertiesFormProps";

import "./PropertyCreate.css";

const { Option } = Select;

/**
 * Stateful component
 * @class Property
 * @extends {React.Component}
 */
class Property extends React.Component {
  constructor(props) {
    super(props);
    /**
     * @type {Object}
     * @property {Boolean} loading
     */
    this.state = {
      loading: false,
    };
    this.loadFeatures = this.loadFeatures.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
  }

  /**
   * Makes API requests for features and categories then
   * loads them into the component
   * @memberof Property
   */
  componentDidMount() {
    this.loadFeatures();
    this.loadCategories();
  }

  /**
   * Checks if a property was successfully created, and if so
   * sets a timer for 1 second and then redirects the user back to
   * their 'My Properties' page
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
   * Clears the timeout created by 'componentDidUpdate'
   */
  componentWillUnmount() {
    clearTimeout(this.redir);
  }

  /**
   * Form submission function
   * Takes data from the 'createProperty' form and from
   * props and uses it to make an API POST request
   * @param {Object} values
   * @memberof Property
   */
  onFinish = (values) => {
    this.setState({ loading: true });
    const {
      user: { id: userID, token },
    } = this.props;
    let { ...data } = values;
    data = {
      ...data,
      user: userID,
      askingPrice: parseInt(data.askingPrice, 10),
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    };
    fetch(`${config.BACK_END_URL}/api/properties/`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${token}`,
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

  /**
   * Makes a request to the API for all property features
   * @memberof Property
   */
  loadFeatures() {
    this.setState({ loading: true });
    fetch(`${config.BACK_END_URL}/api/properties/features/`, {
      method: "GET",
    })
      .then(status)
      .then(json)
      .then((response) => {
        this.setState({
          features: response,
          loading: false,
          redirect: false,
        });
      })
      .catch(() => {
        this.setState({ loading: false, failed: true });
      });
  }

  /**
   * Makes a request to the API for all property categories
   * @memberof Property
   */
  loadCategories() {
    this.setState({ loading: true });
    fetch(`${config.BACK_END_URL}/api/properties/categories/`, {
      method: "GET",
    })
      .then(status)
      .then(json)
      .then((response) => {
        this.setState({
          categories: response,
          loading: false,
        });
      })
      .catch(() => {
        this.setState({ loading: false, failed: true });
      });
  }

  /**
   * Renders the 'PropertyCreate' component.
   * Whilst the API call is being made and the response is being validated, show a spinning circle
   * If the call succeeds, show a 'success' message and redirect the user back to their 'My Properties' page
   * If the call fails, show an 'error' message
   * @memberof Property
   */
  render() {
    // Destructuring assignment for variables stored in state
    const {
      features,
      categories,
      loading,
      successful,
      redirect,
      failed,
    } = this.state;

    // Populates an array with feature objects so they can be used in the form
    const featureOptions = [];
    if (features) {
      features.map(({ _id, title }) =>
        featureOptions.push(
          <Option key={_id} value={_id}>
            {title}
          </Option>
        )
      );
    }

    // Populates an array with category objects so they can be used in the form
    const categoryOptions = [];
    if (categories) {
      categories.map(({ _id, title }) =>
        categoryOptions.push(
          <Option key={_id} value={_id}>
            {title}
          </Option>
        )
      );
    }

    // If the page is loading, show a StyledSpin component
    if (loading) {
      return <StyledSpin />;
    }

    // If the property was created successfully, show success message
    if (successful) {
      return (
        <Result
          status="success"
          title="Successfully created a new listing!"
          subTitle="We're redirecting you to the Home page..."
          extra={[<StyledSpin />]}
        />
      );
    }

    // Redirect back to 'My Properties' page
    if (redirect) {
      return <Redirect to="/properties/own" />;
    }

    // If the property couldn't be created, show error message
    if (failed) {
      return (
        <Result
          status="error"
          title="Failed to create new property."
          subTitle="We couldn't create a new property, please try again."
        />
      );
    }

    // Destructuring assignment for variables stored in 'propertiesFormProps.js'
    const { rules: titleRules, tooltip: titleTooltip } = titleProps;
    const {
      rules: descriptionRules,
      tooltip: descriptionTooltip,
    } = descriptionProps;
    const { rules: locationRules, tooltip: locationTooltip } = locationProps;
    const {
      rules: askingPriceRules,
      tooltip: askingPriceTooltip,
    } = askingPriceProps;
    const { rules: categoryRules, tooltip: categoryTooltip } = categoryProps;
    const { rules: featuresRules, tooltip: featuresTooltip } = featuresProps;
    const {
      rules: visibleRules,
      tooltip: { title: visibleTooltip },
    } = visibleProps;
    const {
      rules: underOfferRules,
      tooltip: underOfferTooltip,
    } = underOfferProps;
    const {
      rules: highPriorityRules,
      tooltip: highPriorityTooltip,
    } = highPriorityProps;
    return (
      <>
        <Form name="createProperty" onFinish={this.onFinish} colon={false}>
          <Row>
            <Col span={18}>
              <Card title="Add New Property">
                <Card type="inner" style={{ marginBottom: 10 }} title="Title">
                  <Form.Item
                    name="title"
                    rules={titleRules}
                    tooltip={titleTooltip}
                    label={" "}
                  >
                    <Input />
                  </Form.Item>
                </Card>
                <Card
                  type="inner"
                  style={{ marginBottom: 10 }}
                  title="Description"
                >
                  <Form.Item
                    name="description"
                    rules={descriptionRules}
                    tooltip={descriptionTooltip}
                    label={" "}
                  >
                    <Input />
                  </Form.Item>
                </Card>
                <Card
                  type="inner"
                  style={{ marginBottom: 10 }}
                  title="Location"
                >
                  <Form.Item
                    name="location"
                    rules={locationRules}
                    tooltip={locationTooltip}
                    label={" "}
                  >
                    <Input />
                  </Form.Item>
                </Card>
                <Card
                  type="inner"
                  style={{ marginBottom: 10 }}
                  title="Asking Price"
                >
                  <Form.Item
                    name="askingPrice"
                    rules={askingPriceRules}
                    tooltip={askingPriceTooltip}
                    label={" "}
                  >
                    <Input prefix="£" />
                  </Form.Item>
                </Card>
                <Card
                  type="inner"
                  style={{ marginBottom: 10 }}
                  title="Category"
                >
                  <Form.Item
                    name="propertyCategory"
                    rules={categoryRules}
                    tooltip={categoryTooltip}
                    label={" "}
                  >
                    <Select placeholder="Property Category">
                      {categoryOptions}
                    </Select>
                  </Form.Item>
                </Card>
              </Card>
            </Col>
            <Col span={4}>
              <Card id="sideCard" title="Features">
                <Form.Item
                  name="propertyFeatures"
                  rules={featuresRules}
                  tooltip={featuresTooltip}
                  label={" "}
                >
                  <Select mode="multiple" placeholder="Property features">
                    {featureOptions}
                  </Select>
                </Form.Item>
              </Card>
              <Card id="sideCard" title="Options">
                <Card type="inner" style={{ marginBottom: 10 }} title="Visible">
                  <Form.Item
                    name="visible"
                    rules={visibleRules}
                    tooltip={visibleTooltip}
                    label={" "}
                  >
                    <Switch defaultChecked />
                  </Form.Item>
                </Card>
                <Card
                  type="inner"
                  style={{ marginBottom: 10 }}
                  title="High Priority"
                  label={" "}
                >
                  <Form.Item
                    name="highPriority"
                    rules={highPriorityRules}
                    tooltip={highPriorityTooltip}
                    label={" "}
                  >
                    <Switch />
                  </Form.Item>
                </Card>
                <Card
                  type="inner"
                  style={{ marginBottom: 10 }}
                  title="Under Offer"
                >
                  <Form.Item
                    name="underOffer"
                    rules={underOfferRules}
                    tooltip={underOfferTooltip}
                    label={" "}
                  >
                    <Switch />
                  </Form.Item>
                </Card>
              </Card>
              <Card id="sideCard">
                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Create
                  </Button>
                </Form.Item>
              </Card>
            </Col>
          </Row>
        </Form>
      </>
    );
  }
}

Property.propTypes = {
  user: {
    id: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
  },
};

export default Property;
