import React from 'react';
import './App.css';
import { Grid } from 'semantic-ui-react';
import { connect } from 'react-redux';

import SidePanel from '../SidePanel/SidePanel';
import Messages from '../Messages/Messages';

const App = ({ currentUser }) => {
	return (
		<Grid columns="equal" className="app">
			<SidePanel currentUser={currentUser} />
			<Grid.Column className="messageColumn">
				<Messages />
			</Grid.Column>
		</Grid>
	);
};
const mapStateToProps = ({ user }) => ({
	currentUser: user.currentUser,
});

export default connect(mapStateToProps)(App);
