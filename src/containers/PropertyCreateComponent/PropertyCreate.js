import React from "react";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";
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
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";
import "./PropertyCreate.css";

const { Option } = Select;

class Property extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      property: {},
      loading: false,
    };
    this.loadFeatures = this.loadFeatures.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
  }

  async componentDidMount() {
    this.loadFeatures();
    this.loadCategories();
  }

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
      .catch((error) => {
        this.setState({ loading: false, failed: true });
      });
  }

  loadCategories() {
    this.setState({ loading: true });
    fetch(`${config.BACK_END_URL}/api/properties/categories/`, {
      method: "GET",
    })
      .then(status)
      .then(json)
      .then((response) => {
        console.dir(response);
        this.setState({
          categories: response,
          loading: false,
        });
      })
      .catch((error) => {
        this.setState({ loading: false, failed: true });
      });
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

  onFinish = (values) => {
    this.setState({ loading: true });
    let { ...data } = values;
    data = {
      ...data,
      user: this.props.user.id,
      askingPrice: parseInt(data.askingPrice),
      dateCreated: Date.now(),
      dateUpdated: Date.now(),
    };
    fetch(`${config.BACK_END_URL}/api/properties/`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
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
    let features = [];
    if (this.state.features) {
      this.state.features.map((feature) => {
        return features.push(
          <Option key={feature._id} value={feature._id}>
            {feature.title}
          </Option>
        );
      });
    }

    let categories = [];
    if (this.state.categories) {
      this.state.categories.map((category) => {
        return categories.push(
          <Option key={category._id} value={category._id}>
            {category.title}
          </Option>
        );
      });
    }

    if (this.state.loading) {
      return <StyledSpin />;
    }

    if (this.state.successful) {
      return (
        <Result
          status="success"
          title="Successfully created a new listing!"
          subTitle="We're redirecting you to the Home page..."
          extra={[<StyledSpin />]}
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
          title="Failed to create new property."
          subTitle="We couldn't create a new property, please try again."
        />
      );
    }

    return (
      <>
        <Form name="createProperty" onFinish={this.onFinish}>
          <Row>
            <Col span={18}>
              <Card title="Add New Property">
                <Card type="inner" style={{ marginBottom: 10 }} title="Title">
                  <Form.Item name="title">
                    <Input />
                  </Form.Item>
                </Card>
                <Card
                  type="inner"
                  style={{ marginBottom: 10 }}
                  title="Description"
                >
                  <Form.Item name="description">
                    <Input />
                  </Form.Item>
                </Card>
                <Card
                  type="inner"
                  style={{ marginBottom: 10 }}
                  title="Location"
                >
                  <Form.Item name="location">
                    <Input />
                  </Form.Item>
                </Card>
                <Card
                  type="inner"
                  style={{ marginBottom: 10 }}
                  title="Asking Price"
                >
                  <Form.Item name="askingPrice">
                    <Input />
                  </Form.Item>
                </Card>
                <Card
                  type="inner"
                  style={{ marginBottom: 10 }}
                  title="Category"
                >
                  <Form.Item name="propertyCategory">
                    <Select placeholder="Property Category">
                      {categories}
                    </Select>
                  </Form.Item>
                </Card>
              </Card>
            </Col>
            <Col span={4}>
              <Card id="sideCard" title="Features">
                <Form.Item name="propertyFeatures">
                  <Select mode="multiple" placeholder="Property features">
                    {features}
                  </Select>
                </Form.Item>
              </Card>
              <Card id="sideCard" title="Options">
                <Card type="inner" style={{ marginBottom: 10 }} title="Visible">
                  <Form.Item name="visible">
                    <Switch defaultChecked={true} />
                  </Form.Item>
                </Card>
                <Card
                  type="inner"
                  style={{ marginBottom: 10 }}
                  title="High Priority"
                >
                  <Form.Item name="highPriority">
                    <Switch />
                  </Form.Item>
                </Card>
                <Card
                  type="inner"
                  style={{ marginBottom: 10 }}
                  title="Under Offer"
                >
                  <Form.Item name="underOffer">
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

export default Property;
