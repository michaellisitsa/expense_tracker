import React, { Component } from "react";
import "./Form.css";

export class Form extends Component {
  state = {
    number1: "0",
    number2: "0",
    operator: "+",
  };

  handleChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () =>
        this.props.setOutput(
          this.state.number1,
          this.state.number2,
          this.state.operator
        )
    );
  };

  render() {
    return (
      <form className="form1" id="form1">
        <fieldset className="inputs-wrapper">
          <input
            type="text"
            name="number1"
            id="number1"
            className="number-input"
            placeholder="Enter Number..."
            value={this.state.number1}
            onChange={this.handleChange}
          />
          <select
            name="operator"
            id="operator"
            defaultValue={this.state.operator}
            onChange={this.handleChange}
          >
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="×">×</option>
            <option value="÷">÷</option>
          </select>
          <input
            type="text"
            name="number2"
            id="number2"
            className="number-input"
            placeholder="Enter Number..."
            value={this.state.number2}
            onChange={this.handleChange}
          />
        </fieldset>
      </form>
    );
  }
}

export default Form;
