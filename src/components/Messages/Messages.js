import React, { Component } from 'react';
import { Segment, Feed } from 'semantic-ui-react';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';

class Messages extends Component {
	render() {
		return (
			<Segment style={{ height: '100vh', paddingBottom: '0px' }}>
				<MessagesHeader />
				<Segment className="messagesPanel">
					<Feed>
						<Feed.Event>
							<Feed.Label>
								<img
									alt="marie"
									src="https://react.semantic-ui.com/images/avatar/small/elliot.jpg"
								/>
							</Feed.Label>
							<Feed.Content>
								<Feed.Summary>
									<Feed.User>Elliot Fu</Feed.User>
									<Feed.Date>1 Hour Ago</Feed.Date>
								</Feed.Summary>
								<Feed.Extra text>
									THis is the message, hello to everybody, I hope you are all doing fine
								</Feed.Extra>
							</Feed.Content>
						</Feed.Event>
					</Feed>
				</Segment>
				<MessageForm />
			</Segment>
		);
	}
}

export default Messages;
