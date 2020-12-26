import React from "react";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";
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
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";
import { HomeOutlined } from "@ant-design/icons";

class Property extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
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

  async componentDidMount() {
    const { id } = this.props.match.params;
    await this.setState({ id: id });
    this.loadProperty();
  }

  loadProperty() {
    this.setState({ loading: true });
    fetch(`${config.BACK_END_URL}/api/properties/get/${this.state.id}`, {
      method: "GET",
    })
      .then(status)
      .then(json)
      .then((response) => {
        console.dir(this.response);
        if (response._id) {
          this.setState({
            property: response,
            loading: false,
          });
        } else this.setState({ loading: false, failed: true });
      })
      .catch((error) => {
        this.setState({ loading: false, failed: true });
      });
  }

  sendMessage = (values) => {
    let { ...data } = values;
    data = {
      ...data,
      user: this.state.property.user._id,
      property: this.state.property._id,
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
      .then((response) => {
        this.setState({
          sendingMessage: false,
          showMessageForm: false,
          messageSentSuccessfully: true,
        });
      })
      .catch((error) => {
        this.setState({ failureSendingMessage: true });
      });
  };

  componentDidUpdate() {
    if (this.state.messageSentSuccessfully)
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

  render() {
    let features = [];
    if (this.state.property.propertyFeatures) {
      this.state.property.propertyFeatures.map((feature) => {
        return features.push(feature);
      });
    }
    if (this.state.loading) {
      return <StyledSpin />;
    }

    if (this.state.failed) {
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
                {this.state.property.title}
              </Card>
              <Card
                type="inner"
                style={{ marginBottom: 10 }}
                title="Description"
              >
                {this.state.property.description}
              </Card>
              <Card type="inner" style={{ marginBottom: 10 }} title="Location">
                {this.state.property.location}
              </Card>
              <Card
                type="inner"
                style={{ marginBottom: 10 }}
                title="Asking Price"
              >
                £{this.state.property.askingPrice}
              </Card>
              <Card type="inner" style={{ marginBottom: 10 }} title="Agent">
                {this.state.property.user
                  ? this.state.property.user.fullName
                  : "Couldn't retrieve agent"}
              </Card>
              <Card type="inner" style={{ marginBottom: 10 }} title="Category">
                {this.state.property.propertyCategory.title}
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
              ></List>
            </Card>
            <Card title="Message Agent">
              {this.state.messageSentSuccessfully ? (
                <Result
                  status="success"
                  title="Message sent successfully!"
                  subTitle="The agent will contact you shortly."
                  extra={[<StyledSpin />]}
                />
              ) : null}
              {this.state.sendingMessage ? <StyledSpin size="small" /> : null}
              {this.state.showMessageForm ? (
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

export default Property;
