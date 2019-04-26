import React, { Component } from 'react';
import { Input, Button, Icon, Segment } from 'semantic-ui-react';
import { firebase } from '../../firebase';

class MessageForm extends Component {
	state = {
		message: '',
		errors: [],
		loading: false,
		chat: this.props.chat,
		user: this.props.currentUser,
	};

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	createMessage = () => ({
		timestamp: firebase.database.ServerValue.TIMESTAMP,
		content: this.state.message,
		user: {
			id: this.state.user.uid,
			name: this.state.user.displayName,
			avatar: this.state.user.photoURL,
		},
	});

	sendMessage = () => {
		const { message, chat, errors } = this.state;
		const { firebaseMessages } = this.props;
		if (message) {
			firebaseMessages
				.child(chat.id)
				.push()
				.set(this.createMessage())
				.then(() => {
					this.setState({ loading: false, message: '', errors: [] });
				})
				.catch(error => {
					console.error(error);
					this.setState({
						loading: false,
						errors: errors.concat(error.message),
					});
				});
		} else {
			this.setState({
				errors: errors.concat({ message: 'Add a message' }),
			});
		}
	};

	render() {
		const { errors, message, loading } = this.state;
		return (
			<Segment>
				<Input
					type="text"
					placeholder="Start typing..."
					action
					fluid
					size="huge"
					name="message"
					value={message}
					className={errors.some(error => error.message.includes('message')) ? 'error' : ''}
					onChange={this.handleChange}>
					<Button icon="plus" disabled={loading} />
					<Button color="blue" icon="cloud upload" />

					<input />

					<Button color="green" icon labelPosition="left" onClick={this.sendMessage}>
						<Icon name="send" />
						SEND
					</Button>
				</Input>
			</Segment>
		);
	}
}

export default MessageForm;
