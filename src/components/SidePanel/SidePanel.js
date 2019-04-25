import React, { Component } from 'react';
import { Menu } from 'semantic-ui-react';

import UserPanel from './UserPanel';

class SidePanel extends Component {
	render() {
		return (
			<Menu
				size="huge"
				fixed="left"
				vertical
				inverted
				style={{ backgroundColor: '#000', fontSize: '20px' }}>
				<UserPanel />
			</Menu>
		);
	}
}

export default SidePanel;
