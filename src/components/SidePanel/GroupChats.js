import React, { Component } from 'react';
import {
  Menu,
  Icon,
  Modal,
  Form,
  Button,
  Input,
  Label,
  Loader,
  Dimmer,
} from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCurrentChat, setPrivateChat } from '../../actions/index';

import {
  firebaseGroupChats,
  firebaseUsers,
  firebaseMessages,
  firebaseTypingUsers,
} from '../../firebase';

class GroupChats extends Component {
  state = {
    groupChatList: [],
    groupChatName: '',
    groupChatDetails: '',
    modal: false,
    loading: false,
    initialLoad: true,
    activeChat: '',
    chat: null,
    notifications: [],
    user: this.props.currentUser,
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    let groupChatList = [];
    firebaseGroupChats.on('child_added', snap => {
      groupChatList.push(snap.val());
      this.setState({ groupChatList }, () => {
        this.setDefaultActiveChat();
      });
      this.addNotification(snap.key);
    });
  };

  addNotification = chatId => {
    firebaseMessages.child(chatId).on('value', snap => {
      if (this.state.chat) {
        this.showNotification(
          chatId,
          this.state.chat.id,
          this.state.notifications,
          snap,
        );
      }
    });
  };

  showNotification = (chatId, currentChat, notifications, snap) => {
    let lastTotal = 0;
    let index = notifications.findIndex(
      notification => notification.id === chatId,
    );

    if (index !== -1) {
      if (chatId !== currentChat) {
        lastTotal = notifications[index].total;

        if (snap.numChildren() - lastTotal > 0) {
          notifications[index].count = snap.numChildren() - lastTotal;
        }
      }
      notifications[index].lastKnownTotal = snap.numChildren();
    } else {
      notifications.push({
        id: chatId,
        total: snap.numChildren(),
        lastKnownTotal: snap.numChildren(),
        count: 0,
      });
    }
    this.setState({ notifications });
  };

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      notification => notification.id === this.state.chat.id,
    );

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  getNotificationsCount = chat => {
    let count = 0;
    this.state.notifications.forEach(notification => {
      if (notification.id === chat.id) {
        count = notification.counts;
      }
    });

    if (count > 0) return count;
  };

  removeListeners = () => {
    firebaseUsers.off();
  };

  // Set the first group chat as the default active chat during initial load
  setDefaultActiveChat = () => {
    if (this.state.initialLoad && this.state.groupChatList.length > 0) {
      this.props.setCurrentChat(this.state.groupChatList[0]);
      this.setActiveGroupChat(this.state.groupChatList[0]);
      this.setState({ chat: this.state.groupChatList[0] });
    }
    this.setState({ initialLoad: false });
  };

  closeModal = () => {
    this.setState({ modal: false });
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  // Returns true if both fields have values
  isFormValid = ({ groupChatName, groupChatDetails }) =>
    groupChatName && groupChatDetails;

  setActiveGroupChat = groupChat => {
    this.setState({ activeChat: groupChat.id });
  };

  // Change the active chat based on selected group chat
  changeGroup = groupChat => {
    const { chat, user } = this.state;
    this.setActiveGroupChat(groupChat);
    firebaseTypingUsers
      .child(chat.id)
      .child(user.uid)
      .remove();
    this.clearNotifications();
    this.props.setCurrentChat(groupChat);
    this.props.setPrivateChat(false);
    this.setState({ chat: groupChat });
  };

  // Renders the group chat list
  displayGroupChatList = groupChatList =>
    groupChatList.length > 0 &&
    groupChatList.map(groupChat => (
      <Menu.Item
        key={groupChat.id}
        onClick={() => this.changeGroup(groupChat)}
        name={groupChat.name}
        active={groupChat.id === this.state.activeChat}>
        {this.getNotificationsCount(groupChat) && (
          <Label color="green">{this.getNotificationsCount(groupChat)}</Label>
        )}
        # {groupChat.name}
      </Menu.Item>
    ));

  addGroupChat = () => {
    this.setState({ loading: true });
    const { groupChatDetails, groupChatName } = this.state;
    const { currentUser } = this.props;

    // Obtain key for the new data to be pushed
    const key = firebaseGroupChats.push().key;

    const chatData = {
      id: key,
      name: groupChatName,
      details: groupChatDetails,
      createdBy: {
        name: currentUser.displayName,
        avatar: currentUser.photoURL,
      },
    };

    // Update using the key obtained earlier and update with values
    firebaseGroupChats
      .child(key)
      .update(chatData)
      .then(() => {
        this.setState({
          groupChatName: '',
          groupChatDetails: '',
          modal: false,
          loading: false,
        });
      });
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      this.addGroupChat();
    }
  };

  render() {
    const { groupChatList, modal, loading } = this.state;
    return (
      <>
        {/* Header for the group chat section */}
        <Menu.Menu className="messages-list">
          <Menu.Item>
            <span>
              <Icon name="group" /> GROUP CHATS
            </span>
            <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {groupChatList.length ? (
            this.displayGroupChatList(groupChatList)
          ) : (
            <Dimmer active inverted>
              <Loader inverted>Loading</Loader>
            </Dimmer>
          )}
        </Menu.Menu>

        {/* Modal for creating a new group chat */}
        <Modal size="small" open={modal} onClose={this.closeModal}>
          <Modal.Header>
            <Icon name="users" /> ADD A GROUP CHAT
          </Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input
                  fluid
                  label="Name"
                  name="groupChatName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About"
                  name="groupChatDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              loading={loading && true}
              color="blue"
              icon="checkmark"
              labelPosition="right"
              content="Add"
              onClick={this.handleSubmit}
            />
            <Button
              disabled={loading && true}
              color="grey"
              onClick={this.closeModal}>
              Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </>
    );
  }
}

export default connect(
  null,
  { setCurrentChat, setPrivateChat },
)(GroupChats);
