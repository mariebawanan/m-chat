import React from 'react';
import { Feed, Segment, Grid } from 'semantic-ui-react';
import moment from 'moment';

const isOwnMessage = (message, user) => (message.user.id === user.uid ? true : false);

const timeFromNow = timestamp => moment(timestamp).fromNow();

const Message = ({ message, user }) => (
	<Grid.Row>
		<Grid.Column floated={isOwnMessage(message, user) ? 'right' : 'left'} width={8}>
			<Feed>
				<Feed.Event>
					{!isOwnMessage(message, user) && (
						<Feed.Label>
							<img alt={message.user.displayName} src={message.user.avatar} />
						</Feed.Label>
					)}
					<Feed.Content
						style={{ fontSize: '1.25rem' }}
						className={isOwnMessage(message, user) ? 'own' : ''}>
						<Feed.Summary>
							{!isOwnMessage(message, user) && <Feed.User>{message.user.name}</Feed.User>}
							<Feed.Date>{timeFromNow(message.timestamp)}</Feed.Date>
						</Feed.Summary>
						<Feed.Extra>{message.content}</Feed.Extra>
					</Feed.Content>
				</Feed.Event>
			</Feed>
		</Grid.Column>
	</Grid.Row>
);

export default Message;