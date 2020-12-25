import React from "react";
import { Card, Space, Badge, Button } from "antd";
import { Link } from "react-router-dom";
import {
  EyeOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";

class PropertyCard extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card
        hoverable
        title={this.props.title}
        key={this.props._id}
        // actions={[<>
        //   <Button type="primary" key="view">
        //         <Link to="/property/"><EyeOutlined key="view" /></Link>
        //   </Button>
        //   </>
        // ]}
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
      ></Card>
    );
  }
}

export default PropertyCard;
