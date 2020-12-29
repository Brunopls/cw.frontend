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

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      limit: 3,
      page: 1,
      loading: false,
    };
    this.loadMessages = this.loadMessages.bind(this);
    this.reloadMessages = this.reloadMessages.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  componentDidMount() {
    this.loadMessages();
  }

  onFinish = (values) => {
    const { ...data } = values;
    this.setState((prevState) => ({
      limit: data.limit === undefined ? prevState.limit : data.limit,
      page: 1,
    }));
    this.loadMessages();
  };

  loadMessages() {
    const { limit, page } = this.state;
    const { user } = this.props;
    const { token } = user;
    this.setState({ loading: true });
    fetch(`${config.BACK_END_URL}/api/messages/?limit=${limit}&page=${page}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
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

  reloadMessages() {
    this.loadMessages();
    message.success("Message archived successfully!");
  }

  render() {
    const { messages, loading, limit, count } = this.state;
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
            </Col>
            <Pagination
              defaultCurrent={1}
              pageSize={limit}
              total={count}
              onChange={this.onChangePage}
            />
          </Row>
        </>
      );
    }
    return <StyledSpin />;
  }
}

Messages.contextType = UserContext;

Messages.propTypes = {
  user: {
    token: PropTypes.string.isRequired,
  },
};

export default Messages;
