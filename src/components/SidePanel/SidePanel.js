import React, { Component } from 'react';
import { Menu, Divider } from 'semantic-ui-react';

import UserPanel from './UserPanel';

class SidePanel extends Component {
	render() {
		return (
			<Menu
				size="huge"
				fixed="left"
				vertical
				inverted
				style={{ backgroundColor: '#dfdfdf', fontSize: '20px' }}>
				<Menu.Item>
					<UserPanel />
				</Menu.Item>
			</Menu>
		);
	}
}

export default SidePanel;
