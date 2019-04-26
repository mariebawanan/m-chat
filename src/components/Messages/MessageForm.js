import React, { Component } from 'react';
import { Input, Button, Icon, Segment } from 'semantic-ui-react';
class MessageForm extends Component {
	render() {
		return (
			<Segment>
				<Input
					type="text"
					placeholder="Start typing..."
					action
					fluid
					size="huge"
					className="messageInput">
					<Button icon="plus" />
					<Button color="blue" icon="cloud upload" />
					<input />
					<Button color="green" icon labelPosition="left">
						<Icon name="send" />
						SEND
					</Button>
				</Input>
			</Segment>
		);
	}
}

export default MessageForm;
