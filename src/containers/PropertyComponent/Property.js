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
// import HomeOutlined from "@ant-design/icons";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";
import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";
import { emailRules, textRules } from "../../core/utilities/messageFormProps";

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
     * @property {Object} property
     * @property {Boolean} loading
     * @property {Boolean} sendingMessage
     * @property {Boolean} messageSentSuccessfully
     * @property {Boolean} showMessageForm
     */
    this.state = {
      property: {
        propertyCategory: {},
        propertyFeatures: [],
        user: {},
      },
      loading: false,
      sendingMessage: false,
      messageSentSuccessfully: false,
      showMessageForm: true,
    };
    this.loadProperty = this.loadProperty.bind(this);
  }

  /**
   * Calls API and loads state with response data
   */
  componentDidMount() {
    this.loadProperty();
  }

  /**
   * Checks if a message was successfully sent
   * If this is true, wait for 2 seconds then
   * show the message form again
   */
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

  /**
   * Clear the timeout created by 'componentDidUpdate'
   */
  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  /**
   * Form submission function
   * Takes data from the 'message' form and from the
   * state and uses it to make an API POST request
   * @param {Object} values
   * @memberof Property
   */
  sendMessage = (values) => {
    let { ...data } = values;
    const {
      property: {
        user: { _id: userID },
        _id,
      },
    } = this.state;
    data = {
      ...data,
      user: userID,
      property: _id,
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

  /**
   * Reads param 'id' value stored in props and uses it to
   * make a conditional GET request to the API
   * @memberof Property
   */
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

  /**
   * Renders the 'Property' component.
   * If there is no property matching the ID in params, renders error page.
   * If the data still hasn't been retrieved from the API, show a spinning circle.
   * @memberof Property
   */
  render() {
    // Destructuring assignment for variables stored in state
    const { loading, failed } = this.state;

    // If the page is loading, show a StyledSpin component
    if (loading) {
      return <StyledSpin />;
    }

    // If the API call returned no values, show error
    if (failed) {
      return (
        <Result
          status="warning"
          title="No property found."
          subTitle="We couldn't find a property that matches your search query."
        />
      );
    }

    // Destructuring assignment for variables stored in state
    const {
      property: {
        propertyFeatures,
        title,
        description,
        highPriority,
        underOffer,
        askingPrice,
        location,
        user,
        propertyCategory: { title: propertyCategoryTitle },
      },
      messageSentSuccessfully,
      sendingMessage,
      showMessageForm,
    } = this.state;

    // Populates an array with feature objects
    const features = [];
    if (propertyFeatures) {
      propertyFeatures.map((feature) => features.push(feature));
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
                {user.fullName}
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
                      // avatar={<HomeOutlined />}
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
                    <Form.Item name="inquirerEmail" rules={emailRules}>
                      <Input placeholder="Your e-mail address" />
                    </Form.Item>
                  </Card>
                  <Card type="inner" title="Message">
                    <Form.Item name="text" rules={textRules}>
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
