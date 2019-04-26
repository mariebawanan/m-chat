import React, { Component } from 'react';
import { Segment, Header, Input } from 'semantic-ui-react';

class MessagesHeader extends Component {
	render() {
		return (
			<Segment clearing color="green" inverted>
				<Header inverted as="h2" floated="left">
					Travel Hacks
					<Header.Subheader>123 are in this group chat</Header.Subheader>
				</Header>
				{/* Search within the current chat */}
				<Header floated="right">
					<Input
						inverted
						size="small"
						icon="search"
						name="searchKeyword"
						placeholder="Seach Messages"
					/>
				</Header>
			</Segment>
		);
	}
}

export default MessagesHeader;
