export default function reducer(state = [], action) {

  switch (action.type) {

    case 'TOGGLE_THEME': {
      return Object.assign({}, state, {theme: action.theme});
    }

    case 'TOGGLE_MODE': {
      return Object.assign({}, state, {mode: action.mode});
    }

    default:
      return state;
  }
}