import { combineReducers } from 'redux';
import tomoReducer from './tomoReducer';
import lineReducer from './lineReducer';

const rootReducer = combineReducers({
  tomo: tomoReducer,
  line: lineReducer,
});

export default rootReducer;
