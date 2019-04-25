import React, { Component } from 'react';
import { Grid, Header, Dropdown } from 'semantic-ui-react';

class UserPanel extends Component {
	state = {
		user: this.props.currentUser,
	};

	componentWillReceiveProps(nextProps) {
		this.setState({ user: nextProps.currentUser });
	}
	dropdownOptions = () => [
		{
			key: 'user',
			text: (
				<span>
					Signed in as <strong>Marie</strong>
				</span>
			),
			disabled: true,
		},
		{
			key: 'avatar',
			text: <span> Change Avatar </span>,
		},
		{
			key: 'signout',
			text: <span>Sign out</span>,
		},
	];

	render() {
		return (
			<div>
				<Grid style={{ background: '#4c3c4c' }}>
					<Grid.Column>
						{/* User Dropdown */}
						<Header style={{ padding: '0.25em' }} as="h4" inverted>
							<Dropdown trigger={<span>Marie</span>} options={this.dropdownOptions()} />
						</Header>
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}

export default UserPanel;
