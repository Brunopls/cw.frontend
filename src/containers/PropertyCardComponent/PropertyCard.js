import React from "react";
import { Card, Space, Badge, Button, Image, Modal } from "antd";
import { Link } from "react-router-dom";
import {
  EyeOutlined,
  FormOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import config from "../../core/config.json";
import { status } from "../../core/utilities/requestHandlers";

import UserContext from "../../core/contexts/user";

import { cardLayout } from "../../core/utilities/generalStyles";
const { confirm } = Modal;

class PropertyCard extends React.Component {
  constructor(props) {
    super(props);
    this.showDeleteConfirm = this.showDeleteConfirm.bind(this);
  }

  static contextType = UserContext;

  showDeleteConfirm() {
    const token = this.context.user.token;
    const id = this.props._id;
    const reload = this.props.reloadProperties;
    confirm({
      title: "Are you sure?",
      icon: <ExclamationCircleOutlined />,
      content: "This action will permanently delete this property.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      closable: true,
      keyboard: true,
      onOk() {
        fetch(`${config.BACK_END_URL}/api/properties/${id}`, {
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

  render() {
    const updateLink = "/properties/edit/" + this.props._id;
    const viewLink = "/property/view/" + this.props._id;

    const loggedInActions = [
      <Button key="view">
        <Link to={viewLink}>
          <EyeOutlined key="view" />
        </Link>
      </Button>,
      <UserContext.Consumer>
        {(context) => {
          if (context.user.loggedIn) {
            return (
              <>
                <Space>
                  <Button>
                    <Link to={updateLink}>
                      <FormOutlined />
                    </Link>
                  </Button>
                  <Button onClick={this.showDeleteConfirm}>
                    <DeleteOutlined />
                  </Button>
                </Space>
              </>
            );
          }
        }}
      </UserContext.Consumer>,
    ];

    const homeActions = [
      <Button key="view">
        <Link to={viewLink}>
          <EyeOutlined key="view" />
        </Link>
      </Button>,
    ];

    return (
      <Card
        hoverable
        cover={
          <Image
            style={{ borderRadius: 25, padding: 15 }}
            src="https://picsum.photos/1204/720"
          />
        }
        title={this.props.title}
        key={this.props._id}
        actions={
          this.props.ownProperties === true ? loggedInActions : homeActions
        }
        extra={
          <>
            <Space>
              {this.props.highPriority ? (
                <Badge dot text="High Priority" status="success" />
              ) : null}
              {this.props.underOffer ? (
                <Badge dot text="Under Offer" status="processing" />
              ) : null}
            </Space>
          </>
        }
      >
        <Card style={cardLayout} type="inner">Location: {this.props.location}</Card>
        <Card style={cardLayout} type="inner">Category: {this.props.propertyCategory.title}</Card>
        <Card style={cardLayout} type="inner">Price: £{this.props.askingPrice}</Card>
      </Card>
    );
  }
}

export default PropertyCard;
