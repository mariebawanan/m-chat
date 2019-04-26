import React, { Component } from 'react';
import { Comment, Container, Divider } from 'semantic-ui-react';

import { firebase } from '../../firebase';

class UserPanel extends Component {
	state = {
		user: this.props.currentUser,
	};

	componentWillReceiveProps(nextProps) {
		this.setState({ user: nextProps.currentUser });
	}

	handleSignOut = () => {
		firebase
			.auth()
			.signOut()
			.then(() => {
				console.log('sign out');
			});
	};

	render() {
		const { user } = this.state;
		return (
			<div>
				<Container>
					<Comment.Group>
						<Comment>
							<Comment.Avatar src={user.photoURL} />
							<Comment.Content>
								<Comment.Author as="a">{user.displayName}</Comment.Author>
								<Comment.Actions>
									<Comment.Action>Change avatar </Comment.Action>

									<Comment.Action onClick={this.handleSignOut}>Log out</Comment.Action>
								</Comment.Actions>
							</Comment.Content>
						</Comment>
					</Comment.Group>
					<Divider />
				</Container>
			</div>
		);
	}
}

export default UserPanel;
