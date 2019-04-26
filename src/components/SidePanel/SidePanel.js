import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

import UserPanel from './UserPanel';

class SidePanel extends Component {
	render() {
		const { currentUser } = this.props;
		return (
			<Menu
				size="huge"
				fixed="left"
				vertical
				inverted
				style={{ backgroundColor: '#dfdfdf', fontSize: '20px' }}>
				<Menu.Item>
					<UserPanel currentUser={currentUser} />
				</Menu.Item>
			</Menu>
		);
	}
}

export default SidePanel;
