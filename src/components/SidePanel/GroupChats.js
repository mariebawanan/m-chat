import React, { Component } from 'react';
import { Menu, Icon, Modal, Form, Button, Input } from 'semantic-ui-react';

import { firebaseGroupChats } from '../../firebase';

class GroupChats extends Component {
	state = {
		groupChatList: [],
		groupChatName: '',
		groupChatDetails: '',
		modal: false,
		loading: false,
	};

	addListeners = () => {
		let groupChatList = [];
		firebaseGroupChats.on('child_added', snap => {
			groupChatList.push(snap.val());
			this.setState({ groupChatList });
		});
	};

	componentDidMount() {
		this.addListeners();
	}

	closeModal = () => {
		this.setState({ modal: false });
	};

	openModal = () => {
		this.setState({ modal: true });
	};

	handleChange = event => {
		this.setState({ [event.target.name]: event.target.value });
	};

	isFormValid = ({ groupChatName, groupChatDetails }) => groupChatName && groupChatDetails;

	displayGroupChatList = groupChatList =>
		groupChatList.length > 0 &&
		groupChatList.map(groupChat => (
			<Menu.Item
				key={groupChat.id}
				onClick={console.log(groupChat)}
				name={groupChat.name}
				style={{ opacity: 0.7 }}>
				# {groupChat.name}
			</Menu.Item>
		));

	addGroupChat = () => {
		this.setState({ loading: true });
		const { groupChatDetails, groupChatName } = this.state;
		const { currentUser } = this.props;
		const key = firebaseGroupChats.push().key;

		const chatData = {
			id: key,
			name: groupChatName,
			details: groupChatDetails,
			createdBy: {
				name: currentUser.displayName,
				avatar: currentUser.photoURL,
			},
		};

		firebaseGroupChats
			.child(key)
			.update(chatData)
			.then(() => {
				this.setState({ groupChatName: '', groupChatDetails: '', modal: false, loading: false });
			});
	};

	handleSubmit = event => {
		event.preventDefault();
		if (this.isFormValid(this.state)) {
			this.addGroupChat();
		}
	};

	render() {
		const { groupChatList, modal, loading } = this.state;
		return (
			<>
				<Menu.Menu>
					<Menu.Item>
						<span>
							<Icon name="group" /> GROUP CHATS
						</span>
						<Icon name="add" onClick={this.openModal} />
					</Menu.Item>
					{this.displayGroupChatList(groupChatList)}
				</Menu.Menu>

				<Modal size="small" open={modal} onClose={this.closeModal}>
					<Modal.Header>
						<Icon name="users" /> ADD A GROUP CHAT
					</Modal.Header>
					<Modal.Content>
						<Form>
							<Form.Field>
								<Input fluid label="Name" name="groupChatName" onChange={this.handleChange} />
							</Form.Field>
							<Form.Field>
								<Input fluid label="About" name="groupChatDetails" onChange={this.handleChange} />
							</Form.Field>
						</Form>
					</Modal.Content>
					<Modal.Actions>
						<Button
							loading={loading && true}
							color="blue"
							icon="checkmark"
							labelPosition="right"
							content="Add"
							onClick={this.handleSubmit}
						/>
						<Button disabled={loading && true} color="grey" onClick={this.closeModal}>
							Cancel
						</Button>
					</Modal.Actions>
				</Modal>
			</>
		);
	}
}

export default GroupChats;
