import "./Calculator.css";
import React from "react";
import Form from "./Form";
import Output from "./Output";

class Calculator extends React.Component {
  state = {
    outputEquation: "",
  };

  setOutput = (number1, number2, operator) => {
    let outputString = `${number1} ${operator} ${number2} = `;
    if (operator == "+") {
      console.log(typeof outputString);
      outputString = outputString.concat(
        parseFloat(number1) + parseFloat(number2)
      );
    } else if (operator == "-") {
      outputString = outputString.concat(+number1 - +number2);
    } else if (operator === "×") {
      outputString = outputString.concat(+number1 * +number2);
    } else if (operator === "÷") {
      outputString = outputString.concat(+number1 / +number2);
    } else {
      console.log("passed through");
    }
    this.setState({
      outputEquation: outputString,
    });
  };
  render() {
    return (
      <div className="calculator-wrapper">
        <header>
          <h1>Calculate with React - changed!</h1>
        </header>
        <Form setOutput={this.setOutput} />
        <Output output={this.state.outputEquation} />
      </div>
    );
  }
}

export default Calculator;
