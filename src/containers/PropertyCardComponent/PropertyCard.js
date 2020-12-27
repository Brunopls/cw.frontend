import React from "react";
import { Card, Space, Badge, Button, Image } from "antd";
import { Link } from "react-router-dom";
import { EyeOutlined, FormOutlined, DeleteOutlined } from "@ant-design/icons";

import UserContext from "../../core/contexts/user";

class PropertyCard extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {}

  static contextType = UserContext;

  render() {
    const updateLink = "/properties/edit/" + this.props._id;
    const deleteLink = "/properties/delete/" + this.props._id;
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
                  <Button>
                    <Link to={deleteLink}>
                      <DeleteOutlined />
                    </Link>
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
        actions={this.props.ownProperties ? loggedInActions : homeActions}
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
        <Card type="inner">Location: {this.props.location}</Card>
        <Card type="inner">Category: {this.props.propertyCategory.title}</Card>
        <Card type="inner">Price: £{this.props.askingPrice}</Card>
      </Card>
    );
  }
}

export default PropertyCard;
