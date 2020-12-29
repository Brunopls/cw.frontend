import React from "react";
import PropTypes from "prop-types";
import {
  Form,
  Input,
  Button,
  Result,
  List,
  Card,
  Badge,
  Space,
  Row,
  Col,
} from "antd";
import HomeOutlined from "@ant-design/icons";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";

class Property extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      property: {
        propertyCategory: {},
        propertyFeatures: [],
      },
      loading: false,
      sendingMessage: false,
      messageSentSuccessfully: false,
      showMessageForm: true,
    };
    this.loadProperty = this.loadProperty.bind(this);
  }

  componentDidMount() {
    this.loadProperty();
  }

  componentDidUpdate() {
    const { messageSentSuccessfully } = this.state;
    if (messageSentSuccessfully)
      this.timeout = setTimeout(
        () =>
          this.setState({
            messageSentSuccessfully: false,
            showMessageForm: true,
          }),
        2000
      );
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  sendMessage = (values) => {
    let { ...data } = values;
    const {
      property: {
        user: { _id: userID },
        _id: propertyID,
      },
    } = this.state;
    data = {
      ...data,
      user: userID,
      property: propertyID,
    };
    this.setState({ sendingMessage: true, showMessageForm: false });
    fetch(`${config.BACK_END_URL}/api/properties/message`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(status)
      .then(json)
      .then(() => {
        this.setState({
          sendingMessage: false,
          showMessageForm: false,
          messageSentSuccessfully: true,
        });
      })
      .catch(() => {});
  };

  loadProperty() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    this.setState({ loading: true });
    fetch(`${config.BACK_END_URL}/api/properties/get/${id}`, {
      method: "GET",
    })
      .then(status)
      .then(json)
      .then((response) => {
        const { _id } = response;
        if (_id) {
          this.setState({
            property: response,
            loading: false,
          });
        } else this.setState({ loading: false, failed: true });
      })
      .catch(() => {
        this.setState({ loading: false, failed: true });
      });
  }

  render() {
    const {
      property: {
        propertyFeatures,
        title,
        description,
        highPriority,
        underOffer,
        askingPrice,
        location,
        user: { fullName = "John Doe" },
        propertyCategory: { title: propertyCategoryTitle },
      },
      loading,
      failed,
      messageSentSuccessfully,
      sendingMessage,
      showMessageForm,
    } = this.state;

    const features = [];
    if (propertyFeatures) {
      propertyFeatures.map((feature) => features.push(feature));
    }
    if (loading) {
      return <StyledSpin />;
    }

    if (failed) {
      return (
        <Result
          status="warning"
          title="No property found."
          subTitle="We couldn't find a property that matches your search query."
        />
      );
    }

    return (
      <>
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
              title={title}
              extra={
                <Space>
                  {highPriority ? (
                    <Badge dot text="High Priority" status="success" />
                  ) : null}
                  {underOffer ? (
                    <Badge dot text="Under Offer" status="processing" />
                  ) : null}
                </Space>
              }
            >
              <Card type="inner" style={{ marginBottom: 10 }} title="Title">
                {title}
              </Card>
              <Card
                type="inner"
                style={{ marginBottom: 10 }}
                title="Description"
              >
                {description}
              </Card>
              <Card type="inner" style={{ marginBottom: 10 }} title="Location">
                {location}
              </Card>
              <Card
                type="inner"
                style={{ marginBottom: 10 }}
                title="Asking Price"
              >
                £{askingPrice}
              </Card>
              <Card type="inner" style={{ marginBottom: 10 }} title="Agent">
                {fullName}
              </Card>
              <Card type="inner" style={{ marginBottom: 10 }} title="Category">
                {propertyCategoryTitle}
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
            <Card title="Features">
              <List
                itemLayout="horizontal"
                dataSource={features}
                renderItem={(feature) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<HomeOutlined />}
                      title={feature.title}
                    />
                  </List.Item>
                )}
              />
            </Card>
            <Card title="Message Agent">
              {messageSentSuccessfully ? (
                <Result
                  status="success"
                  title="Message sent successfully!"
                  subTitle="The agent will contact you shortly."
                  extra={[<StyledSpin />]}
                />
              ) : null}
              {sendingMessage ? <StyledSpin size="small" /> : null}
              {showMessageForm ? (
                <Form
                  name="message"
                  onFinish={this.sendMessage}
                  scrollToFirstError
                >
                  <Card type="inner" title="Your E-mail">
                    <Form.Item name="inquirerEmail">
                      <Input placeholder="Your e-mail address" />
                    </Form.Item>
                  </Card>
                  <Card type="inner" title="Message">
                    <Form.Item name="text">
                      <Input.TextArea placeholder="Write your message here..." />
                    </Form.Item>
                  </Card>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                      Send Message
                    </Button>
                  </Form.Item>
                </Form>
              ) : null}
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}

Property.propTypes = {
  match: {
    params: {
      id: PropTypes.string.isRequired,
    },
  },
};

export default Property;
