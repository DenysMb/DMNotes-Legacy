import { combineReducers } from "redux";

import noteReducer from "./note";

export default combineReducers({
  note: noteReducer,
});
