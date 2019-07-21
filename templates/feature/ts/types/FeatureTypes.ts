export const PLACEHOLDER_ACTION_NAME =
  "__NAME_PLACEHOLDER__/PLACEHOLDER_ACTION_NAME";

export type Data = any;

export type __NAME_PLACEHOLDER__State = {
  data: any;
};

type SetPlaceholderAction = {
  type: typeof PLACEHOLDER_ACTION_NAME;
  payload: Data;
};

export type __NAME_PLACEHOLDER__ActionTypes = SetPlaceholderAction;
