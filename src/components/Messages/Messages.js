import React, { Component } from 'react';
import { Segment, Button, Container, Grid } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

import { firebaseMessages } from '../../firebase';

class Messages extends Component {
	state = {
		chat: this.props.currentChat,
		user: this.props.currentUser,
		messages: [],
		messagesLoading: true,
	};

	componentDidMount() {
		const { chat, user } = this.state;

		if (chat && user) {
			this.addListeners(chat.id);
		}
	}

	addListeners = chatId => {
		this.addMessageListener(chatId);
	};

	addMessageListener = chatId => {
		let loadedMessages = [];
		firebaseMessages.child(chatId).on('child_added', snap => {
			loadedMessages.push(snap.val());
			this.setState({
				messages: loadedMessages,
				messagesLoading: false,
			});
		});
	};

	displayMessages = messages =>
		messages.length > 0 &&
		messages.map(message => (
			<Message key={message.timestamp} message={message} user={this.state.user} />
		));

	render() {
		const { chat, user, messages } = this.state;
		return (
			<Segment style={{ height: '100vh', paddingBottom: '0px' }}>
				<MessagesHeader />
				<Segment className="messages-panel">
					<Grid compact="true">{this.displayMessages(messages)}</Grid>
				</Segment>
				<MessageForm chat={chat} currentUser={user} firebaseMessages={firebaseMessages} />
			</Segment>
		);
	}
}

export default Messages;
