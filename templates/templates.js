const functionalComponent = `
const :name = ({msg = "Hello!"}) => {
  return (
    <div>
      <h1>:name</h1>
      <p>{msg}</p>
    </div>
  );
};

:name.propTypes = {
  msg: PropTypes.string
};
`;

const functionalComponentTs = `
type :name = {
  msg?: string;
};

const :name = ({msg = "Hello!"}: :name) => {
  return (
    <div>
      <h1>:name</h1>
      <p>{msg}</p>
    </div>
  );
};
`;

const classComponent = `
class :name extends Component {
  state = {
    msg: "Hello!"
  }

  render() {
    return (
      <div>
        <h1>:name</h1>
        <p>{this.state.msg}</p>
      </div>
    );
  };
};

:name.propTypes = {

};
`;

const classComponentTs = `
type :nameState = {
  msg2: string;
};

type :nameProps = {
  msg?: string
};

class :name extends Component<:nameState, :nameProps> {
  static defaultProps = {
    msg: 'Hello'
  }

  state: :nameState = {
    msg2: "World!"
  }

  render() {
    return (
      <div>
        <h1>:name</h1>
        <p>{this.props.msg}</p>
        <p>{this.state.msg2}</p>
      </div>
    );
  };
};
`;

const index = `import :name from "./:name";

export default :name;
`;

const imports = {
  react: 'import React from "react";',
  reactClass: 'import React, { Component } from "react";',
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
  };
};
`;

const mapStateToProps = `
function mapStateToProps(state, ownProps) { 
  return {};
};
`;

const mapDispatchToProps = `
function mapDispatchToProps(dispatch) {  
  return {};
};
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
