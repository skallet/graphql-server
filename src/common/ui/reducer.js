import { List, Record } from 'immutable';
import { SET_LIKES } from './actions.js';

const InitialState = Record({
  likes: List(),
});
const initialState = new InitialState;

export default function uiReducer(state = initialState, action) {
  if (!(state instanceof InitialState)) return initialState;

  switch (action.type) {

    case SET_LIKES:
      return state
        .set('likes', action.payload.list);

  }

  return state;
}
