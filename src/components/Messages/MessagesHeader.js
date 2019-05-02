import React, { Component } from 'react';
import { Segment, Header, Input } from 'semantic-ui-react';

class MessagesHeader extends Component {
  render() {
    const {
      chatName,
      chatDetails,
      numUniqueUsers,
      handleChange,
      searchLoading,
      isPrivateChat,
      theme,
    } = this.props;

    return (
      <Segment clearing color={theme} inverted>
        <Header inverted as="h4" floated="left">
          {isPrivateChat ? '' : '# '}
          {chatName}
          {isPrivateChat ? (
            <Header.Subheader>Private chat</Header.Subheader>
          ) : (
            <Header.Subheader>
              {`Details: ${chatDetails}`}
              {numUniqueUsers
                ? ` ( ${numUniqueUsers} user${
                    numUniqueUsers > 1 ? 's )' : ' )'
                  }`
                : ' ( no users )'}
            </Header.Subheader>
          )}
        </Header>
        {/* Search within the current chat */}
        <Header floated="right">
          <Input
            inverted
            size="mini"
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
