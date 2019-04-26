import { SET_CURRENT_CHAT } from '../actions/types';

const initialChatState = {
	currentChat: null,
};
const chat_reducer = (state = initialChatState, action) => {
	switch (action.type) {
		case SET_CURRENT_CHAT:
			return {
				...state,
				currentChat: action.payload.currentChat,
			};

		default:
			return state;
	}
};

export default chat_reducer;
