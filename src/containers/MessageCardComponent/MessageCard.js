import React from "react";
import { Card, Space, Badge, Button, Image, Modal } from "antd";
import { Link } from "react-router-dom";
import {
  EyeOutlined,
  FormOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FolderOutlined
} from "@ant-design/icons";
import config from "../../core/config.json";
import { status } from "../../core/utilities/requestHandlers";

import UserContext from "../../core/contexts/user";

import { cardLayout } from "../../core/utilities/generalStyles";
const { confirm } = Modal;

class MessageCard extends React.Component {
  static contextType = UserContext;

  constructor(props) {
    super(props);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
    this.showArchiveConfirm = this.showArchiveConfirm.bind(this);
    this.showMessageInfo = this.showMessageInfo.bind(this);
  }

  showDeleteConfirm() {
    const token = this.context.user.token;
    const id = this.props._id;
    const reload = this.props.reloadMessages;
    confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />,
      content: "This action will permanently delete this message.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      closable: true,
      keyboard: true,
      onOk() {
        fetch(`${config.BACK_END_URL}/api/messages/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(status)
          .then(() => {
            reload();
          })
          .catch((err) => {
            alert("failed");
          });
      },
      onCancel() {},
    });
  }

  showArchiveConfirm() {
    const token = this.context.user.token;
    const id = this.props._id;
    const reload = this.props.reloadMessages;
    confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />,
      content: "This message will be archived.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      closable: true,
      keyboard: true,
      onOk() {
        fetch(`${config.BACK_END_URL}/api/messages/archive/${id}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(status)
          .then(() => {
            reload();
          })
          .catch((err) => {
            console.log(err);
            alert("failed");
          });
      },
      onCancel() {},
    });
  }

  showMessageInfo() {
      const email =this.props.inquirerEmail; 
      const dateSent =this.props.dateSent; 
      const property =this.props.property.title; 
      const text =this.props.text; 
    Modal.info({
      title: `${email}`,
      content: (
        <>
        <Card style={cardLayout} type="inner" title="Property">
            {property}
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
          <EyeOutlined key="view" />
        </Button>
        <Button key="archive" onClick={this.showArchiveConfirm}>
          <FolderOutlined />
        </Button>
        <Button key="delete" onClick={this.showDeleteConfirm}>
          <DeleteOutlined />
        </Button>
      </Space>,
    ];

    return (
      <Card
        hoverable
        title={`${this.props.inquirerEmail}`}
        key={this.props._id}
        actions={actions}
        extra={
          <>
            <Space>
              {this.props.dateSent}
            </Space>
          </>
        }
      >
        <Card style={cardLayout} type="inner">Inquirer: {this.props.inquirerEmail}</Card>
        <Card style={cardLayout} type="inner">Date: {this.props.dateSent}</Card>
        <Card style={cardLayout} type="inner">Property: {this.props.property.title}</Card>
      </Card>
    );
  }
}
export default MessageCard;
