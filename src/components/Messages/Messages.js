import React, { Component } from 'react';
import { Segment, Button, Container, Grid } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

import { firebaseMessages } from '../../firebase';

class Messages extends Component {
  state = {
    chat: this.props.currentChat,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    searchKeyword: '',
    searchLoading: false,
    searchResults: [],
  };

  componentDidMount() {
    const { chat, user } = this.state;

    if (chat && user) {
      this.addListeners(chat.id);
    }
  }

  addListeners = chatId => {
    this.addMessageListener(chatId);
  };

  addMessageListener = chatId => {
    let loadedMessages = [];
    firebaseMessages.child(chatId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false,
      });
      this.countUniqueUsers(loadedMessages);
    });
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);

    this.setState({ numUniqueUsers: uniqueUsers.length });
  };

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message key={message.timestamp} message={message} user={this.state.user} />
    ));

  displayChatName = chat => (chat ? chat.name : '');

  searchMessages = () => {
    const chatMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchKeyword, 'gi');
    const searchResults = chatMessages.reduce((acc, message) => {
      if ((message.content && message.content.match(regex)) || message.user.name.match(regex))
        acc.push(message);
      return acc;
    }, []);
    this.setState({ searchResults }, () => {
      setTimeout(() => this.setState({ searchLoading: false }), 500);
    });
  };

  handleChange = event => {
    this.setState(
      {
        searchKeyword: event.target.value,
        searchLoading: true,
      },
      () => {
        this.searchMessages();
      },
    );
  };

  render() {
    const {
      chat,
      user,
      messages,
      numUniqueUsers,
      searchResults,
      searchKeyword,
      searchLoading,
    } = this.state;
    return (
      <Segment style={{ height: '100vh', paddingBottom: '0px' }}>
        <MessagesHeader
          handleChange={this.handleChange}
          chatName={this.displayChatName(chat)}
          numUniqueUsers={numUniqueUsers}
          searchLoading={searchLoading}
        />
        <Segment className="messages-panel">
          <Grid compact="true">
            {searchKeyword ? this.displayMessages(searchResults) : this.displayMessages(messages)}
          </Grid>
        </Segment>
        <MessageForm chat={chat} currentUser={user} firebaseMessages={firebaseMessages} />
      </Segment>
    );
  }
}

export default Messages;
