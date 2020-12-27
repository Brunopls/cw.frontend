import React from "react";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";
import {
  Form,
  Input,
  Button,
  Result,
  Card,
  Badge,
  Space,
  Row,
  Col,
  Select,
  Switch,
} from "antd";
import { Redirect } from "react-router-dom";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";
const { Option } = Select;
class PropertyUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.match.params.id,
      successful: false,
      failed: false,
    };
    this.loadProperty = this.loadProperty.bind(this);
    this.loadFeatures = this.loadFeatures.bind(this);
    this.loadCategories = this.loadCategories.bind(this);
  }

  componentDidMount() {
    this.loadProperty();
    this.loadFeatures();
    this.loadCategories();
  }

  loadProperty() {
    fetch(`${config.BACK_END_URL}/api/properties/get/${this.state.id}`, {
      method: "GET",
    })
      .then(status)
      .then(json)
      .then((response) => {
        if (response._id) {
          this.setState({
            property: response,
          });
        } else this.setState({ failed: true });
      })
      .catch((error) => {
        this.setState({ failed: true });
      });
  }

  loadFeatures() {
    fetch(`${config.BACK_END_URL}/api/properties/features/`, {
      method: "GET",
    })
      .then(status)
      .then(json)
      .then((response) => {
        this.setState({
          features: response,
          redirect: false,
        });
      })
      .catch((error) => {
        this.setState({ failed: true });
      });
  }

  loadCategories() {
    fetch(`${config.BACK_END_URL}/api/properties/categories/`, {
      method: "GET",
    })
      .then(status)
      .then(json)
      .then((response) => {
        this.setState({
          categories: response,
        });
      })
      .catch((error) => {
        this.setState({ failed: true });
      });
  }

  onFinish = (values) => {
    let { ...data } = values;
    data = {
      ...data,
      askingPrice: parseInt(data.askingPrice),
      dateUpdated: Date.now(),
    };
    fetch(`${config.BACK_END_URL}/api/properties/${this.state.id}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        Authorization: `Bearer ${this.props.user.token}`,
        "Content-Type": "application/json",
      },
    })
      .then(status)
      .then(() => {
        this.setState({ successful: true });
      })
      .catch((err) => {
        this.setState({ failed: true });
      });
  };

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

    if (this.state.successful) {
      return (
        <Result
          status="success"
          title="You successfully updated your property!"
          subTitle="We're redirecting you to the My Properties page..."
          extra={[<StyledSpin key={Math.random()} />]}
        />
      );
    }

    if (this.state.redirect) {
      return <Redirect to="/properties/own" />;
    }

    if (this.state.property) {
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

      let selectedFeatures = [];
      if (this.state.property.propertyFeatures) {
        this.state.property.propertyFeatures.map((feature) => {
          return selectedFeatures.push(feature._id);
        });
      }

      let selectedCategory = [];
      if (this.state.property.propertyCategory) {
        selectedCategory.push(this.state.property.propertyCategory._id);
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

      return (
        <>
          <Form name="updateProperty" onFinish={this.onFinish}>
            <Row>
              <Col
                span={18}
                lg={{ span: 24 }}
                xl={{ span: 18 }}
                md={{ span: 24 }}
                sm={{ span: 24 }}
                xs={{ span: 24 }}
              >
                <Card
                  title={this.state.property.title}
                  extra={
                    <Space>
                      {this.state.property.highPriority ? (
                        <Badge dot text="High Priority" status="success" />
                      ) : null}
                      {this.state.property.underOffer ? (
                        <Badge dot text="Under Offer" status="processing" />
                      ) : null}
                    </Space>
                  }
                >
                  <Card type="inner" style={{ marginBottom: 10 }} title="Title">
                    <Form.Item
                      initialValue={this.state.property.title}
                      name="title"
                    >
                      <Input defaultValue={this.state.property.title} />
                    </Form.Item>
                  </Card>
                  <Card
                    type="inner"
                    style={{ marginBottom: 10 }}
                    title="Description"
                  >
                    <Form.Item
                      initialValue={this.state.property.description}
                      name="description"
                    >
                      <Input defaultValue={this.state.property.description} />
                    </Form.Item>
                  </Card>
                  <Card
                    type="inner"
                    style={{ marginBottom: 10 }}
                    title="Location"
                  >
                    <Form.Item
                      initialValue={this.state.property.location}
                      name="location"
                    >
                      <Input defaultValue={this.state.property.location} />
                    </Form.Item>
                  </Card>
                  <Card
                    type="inner"
                    style={{ marginBottom: 10 }}
                    title="Asking Price"
                  >
                    <Form.Item
                      initialValue={this.state.property.askingPrice}
                      name="askingPrice"
                    >
                      <Input defaultValue={this.state.property.askingPrice} />
                    </Form.Item>
                  </Card>
                  <Card
                    type="inner"
                    style={{ marginBottom: 10 }}
                    title="Category"
                  >
                    <Form.Item
                      initialValue={selectedCategory}
                      name="propertyCategory"
                    >
                      <Select
                        placeholder="Property Category"
                        defaultValue={selectedCategory}
                      >
                        {categories}
                      </Select>
                    </Form.Item>
                  </Card>
                </Card>
              </Col>
              <Col
                span={6}
                lg={{ span: 24 }}
                xl={{ span: 6 }}
                md={{ span: 24 }}
                sm={{ span: 24 }}
                xs={{ span: 24 }}
              >
                <Card id="sideCard" title="Features">
                  <Form.Item
                    initialValue={selectedFeatures}
                    name="propertyFeatures"
                  >
                    <Select
                      mode="multiple"
                      placeholder="Property features"
                      defaultValue={selectedFeatures}
                    >
                      {features}
                    </Select>
                  </Form.Item>
                </Card>
                <Card id="sideCard" title="Options">
                  <Card
                    type="inner"
                    style={{ marginBottom: 10 }}
                    title="Visible"
                  >
                    <Form.Item
                      initialValue={this.state.property.visible}
                      name="visible"
                    >
                      <Switch defaultChecked={this.state.property.visible} />
                    </Form.Item>
                  </Card>
                  <Card
                    type="inner"
                    style={{ marginBottom: 10 }}
                    title="High Priority"
                  >
                    <Form.Item
                      initialValue={this.state.property.highPriority}
                      name="highPriority"
                    >
                      <Switch
                        defaultChecked={this.state.property.highPriority}
                      />
                    </Form.Item>
                  </Card>
                  <Card
                    type="inner"
                    style={{ marginBottom: 10 }}
                    title="Under Offer"
                  >
                    <Form.Item
                      initialValue={this.state.property.underOffer}
                      name="underOffer"
                    >
                      <Switch defaultChecked={this.state.property.underOffer} />
                    </Form.Item>
                  </Card>
                </Card>
                <Card id="sideCard">
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      Update
                    </Button>
                  </Form.Item>
                </Card>
              </Col>
            </Row>
          </Form>
        </>
      );
    }

    return <StyledSpin />;
  }
}

export default PropertyUpdate;
