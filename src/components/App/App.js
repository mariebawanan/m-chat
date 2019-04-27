import React from 'react';
import './App.css';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

import SidePanel from '../SidePanel/SidePanel';
import Messages from '../Messages/Messages';

const App = ({ currentUser, currentChat, isPrivateChat, theme }) => {
  return (
    <Grid columns="equal" className="app">
      <SidePanel
        theme={theme}
        key={currentUser && currentUser.id}
        currentUser={currentUser}
      />
      <Grid.Column className="message-column">
        <Messages
          theme={theme}
          key={currentChat && currentChat.id}
          currentUser={currentUser}
          currentChat={currentChat}
          isPrivateChat={isPrivateChat}
        />
      </Grid.Column>
    </Grid>
  );
};
const mapStateToProps = ({ user, chat, theme }) => ({
  currentUser: user.currentUser,
  currentChat: chat.currentChat,
  isPrivateChat: chat.isPrivateChat,
  theme: theme.theme,
});

export default connect(mapStateToProps)(App);
