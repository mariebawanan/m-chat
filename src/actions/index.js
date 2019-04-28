import {
  SET_USER,
  CLEAR_USER,
  SET_CURRENT_CHAT,
  SET_PRIVATE_CHAT,
  SET_THEME,
  CLEAR_CHAT,
  CLEAR_THEME,
} from './types';

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

export const setPrivateChat = isPrivateChat => {
  return {
    type: SET_PRIVATE_CHAT,
    payload: {
      isPrivateChat,
    },
  };
};

export const clearChat = () => {
  return {
    type: CLEAR_CHAT,
  };
};

// Color Actions
export const setTheme = color => {
  return {
    type: SET_THEME,
    payload: {
      theme: color,
    },
  };
};

export const clearTheme = () => {
  return {
    type: CLEAR_THEME,
  };
};
