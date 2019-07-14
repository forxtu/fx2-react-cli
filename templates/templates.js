const functionalComponent = `
const :name = () => {
  return (
    <div className=":name">
    </div>
  )
}
:name.propTypes = {
}
`;

const classComponent = `
class :name extends Component {
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className=":name">
    
      </div>
    )
  }
}
:name.propTypes = {
}
`;

const index = `
import :name from "./:name";

export default :name;
`;

const imports = {
  react: 'import React from "react";',
  hook: 'import { useState, useEffect } from "react";',
  propTypes: 'import PropTypes from "prop-types";',
  stylesheet: 'import "./:name.scss";',
  connect: 'import {connect} from "react-redux";'
};

const exported = {
  default: "export default :name;",
  connectDispatch: "export default connect(null, mapDispatchToProps)(:name);",
  connectStateAndDispatch:
    "export default connect(mapStateToProps, mapDispatchToProps)(:name);"
};

const hook = `
const :name = () => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    
  }, []);

  return {
    value,
    setValue
  }
}
`;

const mapStateToProps = `
function mapStateToProps(state, ownProps) { 
  return {};
};
`;

const mapDispatchToProps = `
function mapDispatchToProps(dispatch) {  
  return {};
}
`;

module.exports = {
  functionalComponent: functionalComponent,
  classComponent: classComponent,
  index,
  hook: hook,
  imports: imports,
  exported: exported
};
