import { combineReducers } from 'redux';
import user_reducer from './userReducer';
import chat_reducer from './chatReducer';

export default combineReducers({
	user: user_reducer,
	chat: chat_reducer,
});
