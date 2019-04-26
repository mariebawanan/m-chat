import { SET_USER, CLEAR_USER, SET_CURRENT_CHAT } from './types';

// User actions
export const setUser = user => {
	return {
		type: SET_USER,
		payload: {
			currentUser: user,
		},
	};
};

export const clearUser = () => {
	return {
		type: CLEAR_USER,
		payload: {
			currentUser: null,
		},
	};
};

// Chat actions
export const setCurrentChat = groupChat => {
	return {
		type: SET_CURRENT_CHAT,
		payload: {
			currentChat: groupChat,
		},
	};
};
