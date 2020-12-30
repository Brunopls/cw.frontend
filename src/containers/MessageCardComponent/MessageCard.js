import React from "react";
import PropTypes from "prop-types";
import { Card, Space, Button, Modal } from "antd";
// import {
//   EyeOutlined,
//   DeleteOutlined,
//   ExclamationCircleOutlined,
//   FolderOutlined,
// } from "@ant-design/icons";
import config from "../../core/config.json";
import { status } from "../../core/utilities/requestHandlers";

import UserContext from "../../core/contexts/user";

import { cardLayout } from "../../core/utilities/generalStyles";

const { confirm } = Modal;

class MessageCard extends React.Component {
  constructor(props) {
    super(props);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    this.showArchiveConfirm = this.showArchiveConfirm.bind(this);
    this.showMessageInfo = this.showMessageInfo.bind(this);
  }

  showDeleteConfirm() {
    const { user } = this.context;
    const { token } = user;
    const { _id, reload } = this.props;

    confirm({
      title: "Are you sure?",
      // icon: <ExclamationCircleOutlined />,
      content: "This action will permanently delete this message.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      closable: true,
      keyboard: true,
      onOk() {
        fetch(`${config.BACK_END_URL}/api/messages/${_id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(status)
          .then(() => {
            reload();
          })
          .catch(() => {});
      },
      onCancel() {},
    });
  }

  showArchiveConfirm() {
    const { user } = this.context;
    const { token } = user;
    const { _id, reload } = this.props;

    confirm({
      title: "Are you sure?",
      // icon: <ExclamationCircleOutlined />,
      content: "This message will be archived.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      closable: true,
      keyboard: true,
      onOk() {
        fetch(`${config.BACK_END_URL}/api/messages/archive/${_id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(status)
          .then(() => {
            reload();
          })
          .catch(() => {});
      },
      onCancel() {},
    });
  }

  showMessageInfo() {
    const { inquirerEmail, dateSent, property, text } = this.props;
    const { title } = property;
    Modal.info({
      title: `${inquirerEmail}`,
      content: (
        <>
          <Card style={cardLayout} type="inner" title="Property">
            {title}
          </Card>
          <Card style={cardLayout} type="inner" title="Date">
            {dateSent}
          </Card>
          <Card style={cardLayout} type="inner" title="Text">
            {text}
          </Card>
        </>
      ),
      onOk() {},
    });
  }

  render() {
    const actions = [
      <Space>
        <Button key="view" onClick={this.showMessageInfo}>
          {/* <EyeOutlined key="view" /> */}
        </Button>
        <Button key="archive" onClick={this.showArchiveConfirm}>
          {/* <FolderOutlined /> */}
        </Button>
        <Button key="delete" onClick={this.showDeleteConfirm}>
          {/* <DeleteOutlined /> */}
        </Button>
      </Space>,
    ];

    const { inquirerEmail, _id, dateSent, property } = this.props;
    const { title } = property;
    return (
      <Card
        hoverable
        title={`${inquirerEmail}`}
        key={_id}
        actions={actions}
        extra={
          <>
            <Space>{dateSent}</Space>
          </>
        }
      >
        <Card style={cardLayout} type="inner">
          Inquirer: {inquirerEmail}
        </Card>
        <Card style={cardLayout} type="inner">
          Date: {dateSent}
        </Card>
        <Card style={cardLayout} type="inner">
          Property: {title}
        </Card>
      </Card>
    );
  }
}

MessageCard.contextType = UserContext;

MessageCard.propTypes = {
  _id: PropTypes.string,
  dateSent: PropTypes.instanceOf(Date),
  inquirerEmail: PropTypes.string,
  text: PropTypes.string,
  property: {
    title: PropTypes.string,
  },
  reload: PropTypes.bool,
};

MessageCard.defaultProps = {
  _id: undefined,
  dateSent: undefined,
  inquirerEmail: undefined,
  text: undefined,
  property: {
    title: undefined,
  },
  reload: false,
};

export default MessageCard;
