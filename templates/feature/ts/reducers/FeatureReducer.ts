import { Reducer } from "redux";

// utils
import {
  __NAME_PLACEHOLDER__State,
  __NAME_PLACEHOLDER__ActionTypes,
  PLACEHOLDER_ACTION_NAME
} from "../types/__NAME_PLACEHOLDER__Types";

const initialState: __NAME_PLACEHOLDER__State = {
  data: []
};

type __NAME_PLACEHOLDER__Reducer = Reducer<
  __NAME_PLACEHOLDER__State,
  __NAME_PLACEHOLDER__ActionTypes
>;

const __NAME_PLACEHOLDER__Reducer: __NAME_PLACEHOLDER__Reducer = (
  state = initialState,
  action: __NAME_PLACEHOLDER__ActionTypes
) => {
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

export const get__NAME_PLACEHOLDER__Selector = (
  state: __NAME_PLACEHOLDER__State
) => state.data;
