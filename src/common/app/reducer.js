import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';

import config from '../config/reducer.js';
import ui from '../ui/reducer.js';

export default combineReducers({
  config,
  routing,
  ui,
});
