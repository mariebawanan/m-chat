import { SET_THEME, CLEAR_THEME } from '../actions/types';

const initialThemeState = {
  theme: 'green',
};
const theme_reducer = (state = initialThemeState, action) => {
  switch (action.type) {
    case SET_THEME:
      return {
        theme: action.payload.theme,
      };
    case CLEAR_THEME:
      return {
        ...initialThemeState,
      };
    default:
      return state;
  }
};

export default theme_reducer;
