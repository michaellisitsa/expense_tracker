import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { rootReducer } from "./reducer";
import thunk from "redux-thunk";

const thunkMiddleware = composeWithDevTools(applyMiddleware(thunk));

export const store = createStore(rootReducer, thunkMiddleware);
