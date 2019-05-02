import { SET_USER, CLEAR_USER } from '../actions/types';

const initialUserState = {
  currentUser: null,
};
const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        currentUser: action.payload.currentUser,
      };
    case CLEAR_USER:
      return {
        ...initialUserState,
      };
    default:
      return state;
  }
};

export default user_reducer;
