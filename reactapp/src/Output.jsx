import React, { Component } from "react";
import "./Output.css";
import classNames from "classnames";

export class Output extends Component {
  render() {
    const outputText = classNames({
      "calculator-item__description": true,
    });

    return (
      <div className="calculator-item">
        <p className={outputText}>{this.props.output}</p>
      </div>
    );
  }
}

export default Output;
