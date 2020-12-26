import React from "react";
import { Result, List } from "antd";

import PropertyCard from "../PropertyCardComponent/PropertyCard";

class PropertyList extends React.Component {
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
          grid={{ gutter: 24, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3 }}
          dataSource={this.props.properties}
          renderItem={(property) => (
            <List.Item>
              <PropertyCard {...property} />
            </List.Item>
          )}
        />
      </>
    );
  }
}

export default PropertyList;
