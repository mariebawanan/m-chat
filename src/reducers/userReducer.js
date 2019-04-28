import { SET_USER, CLEAR_USER } from '../actions/types';

const initialUserState = {
  currentUser: null,
  loading: true,
};
const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        currentUser: action.payload.currentUser,
        loading: false,
      };
    case CLEAR_USER:
      return {
        ...initialUserState,
        loading: false,
      };
    default:
      return state;
  }
};

export default user_reducer;
