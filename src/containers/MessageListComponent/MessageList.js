import React from 'react';
import { Result, List } from 'antd';

import MessageCard from '../MessageCardComponent/MessageCard';

class MessageList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (!this.props.messages.length) {
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
            gutter: 24, xs: 1, sm: 1, md: 2, lg: 3, xl: 3, xxl: 3,
          }}
          dataSource={this.props.messages}
          renderItem={(message) => (
            <List.Item>
              <MessageCard
                reloadMessages={this.props.reloadMessages}
                {...message}
              />
            </List.Item>
          )}
        />
      </>
    );
  }
}

export default MessageList;
