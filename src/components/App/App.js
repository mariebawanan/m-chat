import React from 'react';
import './App.css';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

import SidePanel from '../SidePanel/SidePanel';
import Messages from '../Messages/Messages';

const App = ({ currentUser, currentChat, isPrivateChat }) => {
  return (
    <Grid columns="equal" className="app">
      <SidePanel
        key={currentUser && currentUser.id}
        currentUser={currentUser}
      />
      <Grid.Column className="message-column">
        <Messages
          key={currentChat && currentChat.id}
          currentUser={currentUser}
          currentChat={currentChat}
          isPrivateChat={isPrivateChat}
        />
      </Grid.Column>
    </Grid>
  );
};
const mapStateToProps = ({ user, chat }) => ({
  currentUser: user.currentUser,
  currentChat: chat.currentChat,
  isPrivateChat: chat.isPrivateChat,
});

export default connect(mapStateToProps)(App);
