import React, { Component } from 'react';
import { Segment, Grid, Header, Icon } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';
import Placeholder from './Placeholder';

import {
  firebaseMessages,
  firebasePrivateMessages,
  firebaseTypingUsers,
  firebaseUsersConnect,
} from '../../firebase';

class Messages extends Component {
  state = {
    chat: this.props.currentChat,
    user: this.props.currentUser,
    isPrivateChat: this.props.isPrivateChat,
    theme: this.props.theme,
    messages: [],
    messagesLoading: true,
    searchKeyword: '',
    searchLoading: false,
    searchResults: [],
    typingUsers: [],
  };

  componentDidMount() {
    const { chat, user } = this.state;

    if (chat && user) {
      this.addListeners(chat.id);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.messagesEnd) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  };

  componentWillReceiveProps(nextProps) {
    this.setState({ theme: nextProps.theme });
  }

  addListeners = chatId => {
    this.addMessageListener(chatId);
    this.addTypingListeners(chatId);
  };

  addTypingListeners = chatId => {
    let typingUsers = [];
    firebaseTypingUsers.child(chatId).on('child_added', snap => {
      if (snap.key !== this.state.user.uid) {
        typingUsers = typingUsers.concat({
          id: snap.key,
          name: snap.val(),
        });
        this.setState({ typingUsers });
      }
    });

    firebaseTypingUsers.child(chatId).on('child_removed', snap => {
      const index = typingUsers.findIndex(user => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== snap.key);
        this.setState({ typingUsers });
      }
    });

    firebaseUsersConnect.on('value', snap => {
      if (snap.val() === true) {
        firebaseTypingUsers
          .child(chatId)
          .child(this.state.user.uid)
          .onDisconnect()
          .remove(error => {
            if (error !== null) {
              console.error(error);
            }
          });
      }
    });
  };

  displayTypingUsers = users =>
    users.length > 0 &&
    users.map(user => (
      <div>
        <span style={{ fontStyle: 'italic' }}> {user.name} is typing...</span>
      </div>
    ));

  addMessageListener = chatId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    this.checkCurrentMessages();
    ref.child(chatId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false,
      });
      this.countUniqueUsers(loadedMessages);
    });
  };

  checkCurrentMessages = () => {
    let chatEmpty = false;
    firebaseMessages
      .child(this.state.chat.id)
      .once('value', function(snapshot) {
        chatEmpty = snapshot.val() === null;
      })
      .then(() => {
        if (chatEmpty) {
          this.setState({ messagesLoading: false });
        }
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
      <Message
        theme={this.state.theme}
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  displayMessagePlaceholder = loading =>
    loading ? (
      <React.Fragment>
        {[...Array(9)].map((_, i) => (
          <Placeholder key={i} />
        ))}
      </React.Fragment>
    ) : null;

  displayChatName = chat => (chat ? chat.name : '');

  searchMessages = () => {
    const chatMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchKeyword, 'gi');
    const searchResults = chatMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      )
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

  getMessagesRef = () =>
    this.state.isPrivateChat ? firebasePrivateMessages : firebaseMessages;

  render() {
    const {
      chat,
      user,
      messages,
      numUniqueUsers,
      searchResults,
      searchKeyword,
      searchLoading,
      isPrivateChat,
      theme,
      typingUsers,
      messagesLoading,
    } = this.state;
    return (
      <Segment style={{ height: '100vh', paddingBottom: '0px' }}>
        <MessagesHeader
          theme={theme}
          isPrivateChat={isPrivateChat}
          handleChange={this.handleChange}
          chatName={this.displayChatName(chat)}
          numUniqueUsers={numUniqueUsers}
          searchLoading={searchLoading}
        />
        <Segment className="messages-panel">
          {!messages.length && !messagesLoading ? (
            <Header as="h2" icon textAlign="center">
              <Icon name="write square" />
              Write the first message
              <Header.Subheader>No messages found</Header.Subheader>
            </Header>
          ) : (
            <>
              {this.displayMessagePlaceholder(messagesLoading)}
              <Grid compact="true">
                {searchKeyword
                  ? this.displayMessages(searchResults)
                  : this.displayMessages(messages)}
                {this.displayTypingUsers(typingUsers)}
                <div ref={node => (this.messagesEnd = node)} />
              </Grid>
            </>
          )}
        </Segment>

        <MessageForm
          theme={theme}
          isPrivateChat={isPrivateChat}
          chat={chat}
          currentUser={user}
          firebaseMessages={firebaseMessages}
          getMessagesRef={this.getMessagesRef}
        />
      </Segment>
    );
  }
}

export default Messages;
