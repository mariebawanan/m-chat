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
    listeners: [],
  };

  componentDidMount() {
    const { chat, user, listeners } = this.state;

    if (chat && user) {
      this.removeListeners(listeners);
      this.addListeners(chat.id);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ theme: nextProps.theme });
  }

  componentWillUnmount() {
    this.removeListeners(this.state.listeners);
    firebaseUsersConnect.off();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.messagesEnd) {
      this.scrollToBottom();
    }
  }

  scrollToBottom = () => {
    this.messagesEnd.scrollIntoView({ behavior: 'smooth' });
  };

  removeListeners = listeners => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };

  addToListeners = (id, ref, event) => {
    const index = this.state.listeners.findIndex(listener => {
      return (listener.id === listener.ref) === ref && listener.event === event;
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({ listeners: this.state.listeners.concat(newListener) });
    }
  };

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

    this.addToListeners(chatId, firebaseTypingUsers, 'child_added');

    firebaseTypingUsers.child(chatId).on('child_removed', snap => {
      const index = typingUsers.findIndex(user => user.id === snap.key);
      if (index !== -1) {
        typingUsers = typingUsers.filter(user => user.id !== snap.key);
        this.setState({ typingUsers });
      }
    });

    this.addToListeners(chatId, firebaseTypingUsers, 'child_removed');

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
      <div key={user.uid}>
        <span style={{ fontStyle: 'italic' }}> {user.name} is typing...</span>
      </div>
    ));

  addMessageListener = chatId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(chatId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({
        messages: loadedMessages,
        messagesLoading: false,
      });
      this.countUniqueUsers(loadedMessages);
    });

    ref.child(this.state.chat.id).on('value', snap => {
      if (!snap.exists()) {
        this.setState({ messagesLoading: false });
      }
    });

    this.addToListeners(chatId, ref, 'child_added');
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

  displayMessagePlaceholder = () => (
    <React.Fragment>
      {[...Array(9)].map((_, i) => (
        <Placeholder key={i} />
      ))}
    </React.Fragment>
  );

  displayValue = (chat, field) => {
    if (chat) {
      if (field === 'name') return chat.name;
      else return chat.details;
    }
  };

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
        {chat && (
          <MessagesHeader
            theme={theme}
            isPrivateChat={isPrivateChat}
            handleChange={this.handleChange}
            chatName={this.displayValue(chat, 'name')}
            chatDetails={this.displayValue(chat, 'details')}
            numUniqueUsers={numUniqueUsers}
            searchLoading={searchLoading}
          />
        )}
        <Segment className="messages-panel">
          {messages.length ? (
            <Grid compact="true">
              {searchKeyword
                ? this.displayMessages(searchResults)
                : this.displayMessages(messages)}
              {this.displayTypingUsers(typingUsers)}
              <div ref={node => (this.messagesEnd = node)} />
            </Grid>
          ) : messagesLoading && chat ? (
            this.displayMessagePlaceholder()
          ) : (
            chat && (
              <Header as="h2" icon textAlign="center">
                <Icon name="write square" />
                Write the first message
                <Header.Subheader>
                  No messages found in this chat
                </Header.Subheader>
              </Header>
            )
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
