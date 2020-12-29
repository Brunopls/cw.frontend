import React from "react";
import { status, json } from "../../core/utilities/requestHandlers";
import config from "../../core/config.json";
import {
  Divider,
  InputNumber,
  Row,
  Col,
  Card,
  Form,
  Button,
  Pagination,
  message
} from "antd";

import StyledSpin from "../../components/StyledSpinComponent/StyledSpin";
import MessageList from "../MessageListComponent/MessageList";

import UserContext from "../../core/contexts/user";

import { formItemLayout, tailLayout } from "../../core/utilities/generalStyles";

class Messages extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.state = {
      limit: 3,
      page: 1,
      loading: false,
    }
    this.loadMessages = this.loadMessages.bind(this);
    this.reloadMessages = this.reloadMessages.bind(this);
    this.onFinish = this.onFinish.bind(this);
  }

  componentDidMount() {
    this.loadMessages();
  }

  loadMessages() {
    this.setState({ loading: true });
    fetch(
      `${config.BACK_END_URL}/api/messages/?limit=${this.state.limit}&page=${this.state.page}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.props.user.token}`,
        }
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
      .catch((error) => {
        this.setState({ failed: true });
      });
  }

  reloadMessages() {
    this.loadMessages();
    message.success("Message archived successfully!");
  }

  onFinish = (values) => {
    const { ...data } = values;
    this.setState({
      limit: data.limit === undefined ? this.state.limit : data.limit,
      page: 1,
    });
    this.loadMessages();
  };

  render() {
    if (this.state.messages) {
      return (
        <>
          <Row>
            <Divider>Messages</Divider>
            <Col span={24} xl={{ span: 18 }}>
              {this.state.loading ? (
                <StyledSpin />
              ) : (
                  <MessageList
                    reloadMessages={this.reloadMessages}
                    messages={this.state.messages}
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
                  {...formItemLayout}
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
                    {...tailLayout}
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
            pageSize={this.state.limit}
            total={this.state.count}
            onChange={this.onChangePage}
          />
          </Row>
        </>)
    }
    return <StyledSpin />;
  }
}

export default Messages;