import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';

const Spinner = () => (
	<Dimmer active inverted>
		<Loader size="massive"> Loading m-chat...</Loader>
	</Dimmer>
);

export default Spinner;
