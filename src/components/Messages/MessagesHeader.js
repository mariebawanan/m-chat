import React, { Component } from 'react';
import { Segment, Header, Input } from 'semantic-ui-react';

class MessagesHeader extends Component {
  render() {
    const {
      chatName,
      numUniqueUsers,
      handleChange,
      searchLoading,
      isPrivateChat,
    } = this.props;
    return (
      <Segment clearing color="green" inverted>
        <Header inverted as="h2" floated="left">
          {isPrivateChat ? '' : '# '}
          {chatName}
          {isPrivateChat ? (
            <Header.Subheader>Private chat</Header.Subheader>
          ) : (
            <Header.Subheader>
              {numUniqueUsers
                ? `${numUniqueUsers} user${
                    numUniqueUsers > 1 ? 's are' : ' is '
                  } participating in this chat`
                : 'no users yet. write a message'}
            </Header.Subheader>
          )}
        </Header>
        {/* Search within the current chat */}
        <Header floated="right">
          <Input
            inverted
            size="small"
            icon="search"
            name="searchKeyword"
            placeholder="Seach Messages"
            loading={searchLoading}
            onChange={handleChange}
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
