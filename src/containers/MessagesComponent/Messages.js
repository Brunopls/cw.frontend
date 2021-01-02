import React from "react";
import PropTypes from "prop-types";
import {
  Divider,
  InputNumber,
  Row,
  Col,
  Card,
  Form,
  Button,
  Pagination,
  message,
} from "antd";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";

import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";
import MessageList from "../MessageListComponent/MessageList";

import UserContext from "../../core/contexts/user";

import "./Messages.css";

/**
 * Stateful component
 * @class Messages
 * @extends {React.Component}
 */
class Messages extends React.Component {
  constructor(props) {
    super(props);
    /**
     * @type {Object}
     * @property {Integer} limit
     * @property {Integer} page
     * @property {Boolean} loading
     */
    this.state = {
      limit: 3,
      page: 1,
      loading: false,
      showArchived: false,
    };
    this.loadMessages = this.loadMessages.bind(this);
    this.reloadMessages = this.reloadMessages.bind(this);
    this.toggleShowArchived = this.toggleShowArchived.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  /**
   * Calls API and loads state with response data
   */
  componentDidMount() {
    this.loadMessages();
  }

  /**
   * Form submission function
   * Takes data from the 'search' form and from the
   * state and uses it to make an API GET request
   * @param {Object} values
   * @memberof Messages
   */
  onFinish = (values) => {
    const { ...data } = values;
    this.setState((prevState) => ({
      limit: data.limit === undefined ? prevState.limit : data.limit,
      page: 1,
    }));
    this.loadMessages();
  };

  /**
   * Toggles the boolean value of 'showArchived'
   */
  toggleShowArchived() {
    this.setState((prevState) => ({
      showArchived: !prevState.showArchived,
    }));
  }

  /**
   * Makes a conditional GET request to the API for messages
   * associated to the current user
   * @memberof Property
   */
  loadMessages() {
    const { limit, page, showArchived } = this.state;
    const { user } = this.props;
    const { token } = user;
    this.setState({ loading: true });
    fetch(
      `${
        config.BACK_END_URL
      }/api/messages/?limit=${limit}&page=${page}&showArchived=${
        showArchived || ""
      }`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then(status)
      .then(json)
      .then((response) => {
        this.setState({
          messages: response.result,
          count: response.resultCount,
          loading: false,
        });
      })
      .catch(() => {});
  }

  /**
   * Calls the API again to reload the data in the component
   */
  reloadMessages() {
    this.loadMessages();
    message.success("Message archived successfully!");
  }

  /**
   * Renders the 'Messages' component
   * @memberof Messages
   */
  render() {
    const { messages, loading, limit, count } = this.state;
    // Renders only when the messages have been retrieved from the API
    if (messages) {
      return (
        <>
          <Row>
            <Divider>Messages</Divider>
            <Col span={24} xl={{ span: 18 }}>
              {loading ? (
                <StyledSpin />
              ) : (
                <MessageList
                  reloadMessages={this.reloadMessages}
                  messages={messages}
                />
              )}
            </Col>
            <Col
              xl={{ span: 6 }}
              lg={{ span: 24 }}
              md={{ span: 24 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <Card style={{ marginLeft: 10 }} title="Search Options">
                <Form
                  name="searchOptions"
                  onFinish={this.onFinish}
                  labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
                  wrapperCol={{ xs: { span: 24 }, sm: { span: 12 } }}
                  scrollToFirstError
                >
                  <Form.Item>
                    <Button
                      htmlType="submit"
                      onClick={this.toggleShowArchived}
                      block
                    >
                      Toggle Archived Posts
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
              <Card style={{ marginLeft: 10 }} title="Search Parameters">
                <Form
                  name="search"
                  onFinish={this.onFinish}
                  labelCol={{ xs: { span: 24 }, sm: { span: 6 } }}
                  wrapperCol={{ xs: { span: 24 }, sm: { span: 12 } }}
                  scrollToFirstError
                >
                  <Form.Item name="limit" label="Result Limit">
                    <InputNumber
                      min={1}
                      max={50}
                      initialValues={3}
                      defaultValue={3}
                      placeholder="Limit"
                    />
                  </Form.Item>
                  <Form.Item
                    wrapperCol={{ offset: 8, span: 16 }}
                    style={{ float: "left", marginLeft: 0 }}
                  >
                    <Button type="primary" htmlType="submit">
                      Search
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
              <Card
                style={{ marginLeft: 10 }}
                title="Pages"
                className="bottomRowSecondCol"
              >
                <div className="container">
                  <Pagination
                    class="pagination"
                    defaultCurrent={1}
                    pageSize={limit}
                    total={count}
                    onChange={this.onChangePage}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </>
      );
    }

    // If the data still hasn't been retrieved, show a spinning circle
    return <StyledSpin />;
  }
}

Messages.contextType = UserContext;

Messages.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }),
};

export default Messages;
