// utils
import { PLACEHOLDER_ACTION_NAME } from "../types/__NAME_PLACEHOLDER__Types";

const initialState = {
  data: []
};

const __NAME_PLACEHOLDER__Reducer = (state = initialState, action) => {
  switch (action.type) {
    case PLACEHOLDER_ACTION_NAME:
      return {
        ...state,
        data: action.payload.data
      };
    default:
      return state;
  }
};

export default __NAME_PLACEHOLDER__Reducer;

// selectors

export const get__NAME_PLACEHOLDER__Selector = state => state.data;
