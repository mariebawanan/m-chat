import React, { Component } from 'react';
import { Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';

import {
  firebaseUsers,
  firebaseUsersConnect,
  firebaseUserStatus,
} from '../../firebase';
import { setCurrentChat, setPrivateChat } from '../../actions/index';

class PersonalMessages extends Component {
  state = {
    activeChat: '',
    user: this.props.currentUser,
    users: [],
    theme: this.props.theme,
  };

  componentDidMount() {
    if (this.state.user) {
      this.addListeners(this.state.user.uid);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ theme: nextProps.theme });
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    firebaseUsers.off();
    firebaseUserStatus.off();
    firebaseUsersConnect.off();
  };

  addListeners = currentUserUid => {
    let loadedUsers = [];
    firebaseUsers.on('child_added', snap => {
      let user = snap.val();
      user['uid'] = snap.key;
      user['status'] = 'offline';
      loadedUsers.push(user);
      this.setState({ users: loadedUsers });
    });

    firebaseUsersConnect.on('value', snap => {
      if (snap.val()) {
        const ref = firebaseUserStatus.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove(error => {
          if (error !== null) {
            console.log(error);
          }
        });
      }
    });

    firebaseUsersConnect.on('value', snap => {
      if (snap.val() === true) {
        const ref = firebaseUserStatus.child(currentUserUid);
        ref.set(true);
        ref.onDisconnect().remove(error => {
          if (error !== null) {
            console.error(error);
          }
        });
      }
    });

    firebaseUserStatus.on('child_added', snap => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });

    firebaseUserStatus.on('child_removed', snap => {
      if (currentUserUid !== snap.key) {
        this.addStatusToUser(snap.key);
      }
    });
  };

  addStatusToUser = (userId, connected = true) => {
    const updatedUsers = this.state.users.reduce((acc, user) => {
      if (user.uid === userId) {
        user['status'] = `${connected ? 'online' : 'offline'}`;
      }
      return acc.concat(user);
    }, []);
    this.setState({ users: updatedUsers });
  };

  isUserOnline = user => user['status'] === 'online';

  changeChat = user => {
    const chatId = this.getChatId(user.uid);
    const chatData = {
      id: chatId,
      name: user.name,
    };
    this.props.setCurrentChat(chatData);
    this.props.setPrivateChat(true);
    this.setActiveChat(user.uid);
  };

  setActiveChat = userid => {
    this.setState({
      activeChat: userid,
    });
  };

  getChatId = userId => {
    const currentUserId = this.state.user.uid;
    return userId < currentUserId
      ? `${userId}/${currentUserId}`
      : `${currentUserId}/${userId}`;
  };

  render() {
    const { users, activeChat, theme } = this.state;
    return (
      <Menu.Menu className="messages-list">
        <Menu.Item>
          <span>
            <Icon name="mail" /> PERSONAL MESSAGES
          </span>
        </Menu.Item>
        {users.map(user => (
          <Menu.Item
            key={user.uid}
            onClick={() => this.changeChat(user)}
            active={user.uid === activeChat}>
            <Icon
              name="circle"
              color={this.isUserOnline(user) ? `${theme}` : 'grey'}
            />

            {user.name}
          </Menu.Item>
        ))}
      </Menu.Menu>
    );
  }
}

export default connect(
  null,
  { setCurrentChat, setPrivateChat },
)(PersonalMessages);
