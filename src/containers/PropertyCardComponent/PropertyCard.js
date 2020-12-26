import React from "react";
import { Card, Space, Badge, Button, Image } from "antd";
import { Link } from "react-router-dom";
import { EyeOutlined } from "@ant-design/icons";

class PropertyCard extends React.Component {
  render() {
    const viewLink = "/property/view/" + this.props._id;
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
        actions={[
          <Button key="view">
            <Link to={viewLink}>
              <EyeOutlined key="view" />
            </Link>
          </Button>,
        ]}
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
