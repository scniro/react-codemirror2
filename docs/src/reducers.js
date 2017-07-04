export default function reducer(state = [], action) {

  switch (action.type) {

    case 'TOGGLE_THEME': {
      return Object.assign({}, state, {theme: action.theme});
    }

    default:
      return state;
  }
}