import { useSelector } from "react-redux";

// utils
import { get__NAME_PLACEHOLDER__Selector } from "../reducers/__NAME_PLACEHOLDER__Reducer";

const use__NAME_PLACEHOLDER__ = () => {
  const data = useSelector(get__NAME_PLACEHOLDER__Selector);

  return { data };
};

export default use__NAME_PLACEHOLDER__;
