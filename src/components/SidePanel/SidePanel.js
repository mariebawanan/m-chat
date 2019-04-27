import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

import UserPanel from './UserPanel';
import GroupChats from './GroupChats';
import PersonalMessages from './PersonalMessages';

class SidePanel extends Component {
  render() {
    const { currentUser } = this.props;
    return (
      <Menu
        size="huge"
        fixed="left"
        vertical
        color="green"
        style={{ overflowY: 'scroll', fontSize: '1.25rem' }}>
        <Menu.Item>
          <UserPanel currentUser={currentUser} />
        </Menu.Item>
        <GroupChats currentUser={currentUser} />
        <PersonalMessages currentUser={currentUser} />
      </Menu>
    );
  }
}

export default SidePanel;
