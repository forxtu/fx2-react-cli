import {
  PLACEHOLDER_ACTION_NAME,
  __NAME_PLACEHOLDER__ActionTypes,
  Data
} from "../types/__NAME_PLACEHOLDER__Types";

export const setPlaceholderAction = (
  data: Data
): __NAME_PLACEHOLDER__ActionTypes => ({
  type: PLACEHOLDER_ACTION_NAME,
  payload: data
});
