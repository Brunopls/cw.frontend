import React from "react";
import PropTypes from "prop-types";
import { Result, List } from "antd";

import MessageCard from "../MessageCardComponent/MessageCard";

const MessageList = ({ messages, reloadMessages }) => {
  if (!messages.length) {
    return (
      <Result
        status="warning"
        title="No messages found."
        subTitle="We couldn't find any messages that match your search query."
      />
    );
  }
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
        dataSource={messages}
        renderItem={({ _id, inquirerEmail, text, property, dateSent }) => (
          <List.Item>
            <MessageCard
              reloadMessages={reloadMessages}
              _id={_id}
              inquirerEmail={inquirerEmail}
              text={text}
              property={property}
              dateSent={dateSent}
            />
          </List.Item>
        )}
      />
    </>
  );
};

MessageList.propTypes = {
  messages: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      dateSent: PropTypes.instanceOf(Date),
      inquirerEmail: PropTypes.string,
      text: PropTypes.string,
      property: {
        title: PropTypes.string,
      },
    })
  ),
  reloadMessages: PropTypes.func,
};

MessageList.defaultProps = {
  messages: {
    _id: undefined,
    dateSent: undefined,
    inquirerEmail: undefined,
    text: undefined,
    property: {
      title: undefined,
    },
  },
  reloadMessages: undefined,
};

export default MessageList;