import React from "react";
import {
  Form,
  Input,
  Button,
  Result,
  List,
  Card,
  Divider,
  PageHeader,
  Badge,
  Space,
} from "antd";

import PropertyCard from "../PropertyCardComponent/PropertyCard";

class PropertyList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.properties.length) {
      return (
        <Result
          status="warning"
          title="No properties found."
          subTitle="We couldn't find any properties that match your search query."
        />
      );
    }

    return (
      <>
        <List
          grid={{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }}
          dataSource={this.props.properties}
          renderItem={(item) => (
            <List.Item>
              <PropertyCard {...item} />
            </List.Item>
          )}
        />
      </>
    );
  }
}

export default PropertyList;
