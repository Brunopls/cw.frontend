import React from "react";
import PropTypes from "prop-types";
import { Result, List } from "antd";

import PropertyCard from "../PropertyCardComponent/PropertyCard";

/**
 * Stateless component
 * @param {Array<Object>} properties
 * @param {Function} reloadProperties
 * @param {Boolean} ownPropeties
 */
const PropertyList = ({ properties, reloadProperties, ownProperties }) => {
  // If there are no properties, show error message
  if (!properties.length) {
    return (
      <Result
        status="warning"
        title="No properties found."
        subTitle="We couldn't find any properties that match your search query."
      />
    );
  }

  /**
   * Return <List> component with 'properties' from props as a data source
   * Renders a new <PropertyCard> component for each property
   */
  return (
    <>
      <List
        grid={{
          gutter: 24,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 3,
          xxl: 3,
        }}
        dataSource={properties}
        renderItem={({
          _id,
          title,
          highPriority,
          underOffer,
          location,
          askingPrice,
          propertyCategory,
        }) => (
          <List.Item>
            <PropertyCard
              reloadProperties={reloadProperties}
              ownProperties={ownProperties}
              _id={_id}
              title={title}
              highPriority={highPriority}
              underOffer={underOffer}
              location={location}
              askingPrice={askingPrice}
              propertyCategory={propertyCategory}
            />
          </List.Item>
        )}
      />
    </>
  );
};

PropertyList.propTypes = {
  properties: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      highPriority: PropTypes.bool.isRequired,
      underOffer: PropTypes.bool.isRequired,
      location: PropTypes.string.isRequired,
      askingPrice: PropTypes.number.isRequired,
      propertyCategory: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    })
  ),
  ownProperties: PropTypes.bool,
  reloadProperties: PropTypes.func,
};

PropertyList.defaultProps = {
  ownProperties: false,
  reloadProperties: undefined,
};

export default PropertyList;
