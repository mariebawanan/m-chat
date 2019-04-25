import React from 'react';
import './App.css';
import { Grid } from 'semantic-ui-react';

import SidePanel from '../SidePanel/SidePanel';
import Messages from '../Messages/Messages';

const App = () => {
	return (
		<Grid columns="equal" className="app">
			<SidePanel />
			<Grid.Column className="messageColumn">
				<Messages />
			</Grid.Column>
		</Grid>
	);
};

export default App;
