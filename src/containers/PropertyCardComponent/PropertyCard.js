import React from "react";
import PropTypes from "prop-types";
import { Card, Space, Badge, Button, Image, Modal } from "antd";
import { Link } from "react-router-dom";
// import {
//   EyeOutlined,
//   FormOutlined,
//   DeleteOutlined,
//   ExclamationCircleOutlined,
// } from "@ant-design/icons";
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

  showDeleteConfirm() {
    const { user } = this.context;
    const { token } = user;
    const { _id, reloadProperties } = this.props;
    confirm({
      title: "Are you sure?",
      // icon: <ExclamationCircleOutlined />,
      content: "This action will permanently delete this property.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      centered: true,
      closable: true,
      keyboard: true,
      onOk() {
        fetch(`${config.BACK_END_URL}/api/properties/${_id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then(status)
          .then(() => {
            reloadProperties();
          })
          .catch(() => {});
      },
      onCancel() {},
    });
  }

  render() {
    const {
      _id,
      title,
      highPriority,
      underOffer,
      location,
      askingPrice,
      propertyCategory,
      ownProperties,
    } = this.props;
    const { title: propertyCategoryTitle } = propertyCategory;
    const updateLink = `/properties/edit/${_id}`;
    const viewLink = `/property/view/${_id}`;

    const loggedInActions = [
      <Button key="view">
        <Link to={viewLink}>View</Link>
      </Button>,
      <UserContext.Consumer>
        {(context) => {
          if (context.user.loggedIn) {
            return (
              <>
                <Space>
                  <Button>
                    <Link to={updateLink}>Edit</Link>
                  </Button>
                  <Button onClick={this.showDeleteConfirm}>Delete</Button>
                </Space>
              </>
            );
          }
          return null;
        }}
      </UserContext.Consumer>,
    ];

    const homeActions = [
      <Button key="view">
        <Link to={viewLink}>view</Link>
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
        title={title}
        key={_id}
        actions={ownProperties === true ? loggedInActions : homeActions}
        extra={
          <>
            <Space>
              {highPriority ? (
                <Badge dot text="High Priority" status="success" />
              ) : null}
              {underOffer ? (
                <Badge dot text="Under Offer" status="processing" />
              ) : null}
            </Space>
          </>
        }
      >
        <Card style={cardLayout} type="inner">
          Location: {location}
        </Card>
        <Card style={cardLayout} type="inner">
          Category: {propertyCategoryTitle}
        </Card>
        <Card style={cardLayout} type="inner">
          Price: £{askingPrice}
        </Card>
      </Card>
    );
  }
}

PropertyCard.contextType = UserContext;

PropertyCard.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  highPriority: PropTypes.bool.isRequired,
  underOffer: PropTypes.bool.isRequired,
  location: PropTypes.string.isRequired,
  askingPrice: PropTypes.number.isRequired,
  propertyCategory: PropTypes.shape({
    title: PropTypes.string.isRequired,
  }),
  ownProperties: PropTypes.bool,
  reloadProperties: PropTypes.func,
};

PropertyCard.defaultProps = {
  ownProperties: false,
  reloadProperties: undefined,
};

export default PropertyCard;
