import "./ExpenseTracker.css";
import React from "react";
import CategoryForm from "./CategoryForm";
import Output from "./Output";

class ExpenseTracker extends React.Component {
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
          <h1>Expense Category Form</h1>
        </header>
        <CategoryForm setOutput={this.setOutput} />
        <Output output={this.state.outputEquation} />
      </div>
    );
  }
}

export default ExpenseTracker;
