import {
  SET_CURRENT_CHAT,
  SET_PRIVATE_CHAT,
  CLEAR_CHAT,
} from '../actions/types';

const initialChatState = {
  currentChat: null,
  isPrivateChat: false,
};
const chat_reducer = (state = initialChatState, action) => {
  switch (action.type) {
    case SET_CURRENT_CHAT:
      return {
        ...state,
        currentChat: action.payload.currentChat,
      };
    case SET_PRIVATE_CHAT:
      return {
        ...state,
        isPrivateChat: action.payload.isPrivateChat,
      };
    case CLEAR_CHAT:
      return {
        ...initialChatState,
      };
    default:
      return state;
  }
};

export default chat_reducer;
