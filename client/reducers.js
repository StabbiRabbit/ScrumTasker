//  import * as types from '../constants/actionTypes';
import { combineReducers } from "redux";

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export default combineReducers({
  reducer: reducer,
});
