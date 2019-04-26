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
		return (
			<div>
				<Container>
					<Divider horizontal>User</Divider>
					<Comment.Group>
						<Comment>
							<Comment.Avatar src="https://react.semantic-ui.com//images/avatar/small/matt.jpg" />
							<Comment.Content>
								<Comment.Author as="a">Marie</Comment.Author>
								<Comment.Actions>
									<Comment.Action>Change avatar</Comment.Action>
									<Comment.Action onClick={this.handleSignOut}>Log out</Comment.Action>
								</Comment.Actions>
							</Comment.Content>
						</Comment>
					</Comment.Group>
				</Container>
			</div>
		);
	}
}

export default UserPanel;
