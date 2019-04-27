import { combineReducers } from 'redux';
import user_reducer from './userReducer';
import chat_reducer from './chatReducer';
import theme_reducer from './themeReducer';

export default combineReducers({
  user: user_reducer,
  chat: chat_reducer,
  theme: theme_reducer,
});
