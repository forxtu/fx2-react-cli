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

const functionalComponentTs = `
type :nameProps = {

};

const :name: React.FC<:nameProps> = () => {
  return (
    <div className=":name">

    </div>
  )
}
`;

const classComponent = `
class :name extends Component {
  render() {
    return (
      <div className=":name">
    
      </div>
    )
  }
}

:name.propTypes = {

}
`;

const classComponentTs = `
type :nameState = {

};

type :nameProps = {

};

class :name extends React.Component<:nameState, :nameProps> {
  render() {
    return (
      <div className=":name">
    
      </div>
    )
  }
}
`;

const index = `import :name from "./:name";

export default :name;
`;

const imports = {
  react: 'import React from "react";',
  reactClass: 'import React, { Component } from "react";',
  reactTs: 'import * as React from "react";',
  hook: 'import { useState, useEffect } from "react";',
  propTypes: 'import PropTypes from "prop-types";',
  stylesheet: 'import "./:name.scss";',
  connect: 'import { connect } from "react-redux";'
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
  functionalComponent,
  functionalComponentTs,
  classComponent,
  classComponentTs,
  index,
  hook,
  imports,
  exported
};
