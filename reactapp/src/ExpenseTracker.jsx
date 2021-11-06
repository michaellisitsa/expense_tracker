import "./ExpenseTracker.css";
import React from "react";
import CategoryForm from "./CategoryForm";
import Output from "./Output";
import { getCookie } from "./utils/cookieUtils";

class ExpenseTracker extends React.Component {
  state = {
    outputEquation: "",
    csrftoken: "unset",
    postData: JSON.stringify({
      name: "API Category",
      assignee: "API Assignee",
      budget: "100",
      description: "API description",
      user: "1",
    }),
  };

  // Making a post request
  // Stack Overflow:
  // https://stackoverflow.com/questions/45308153/posting-data-to-django-rest-framework-using-javascript-fetch
  asyncFormSubmit = (e) => {
    fetch("/api/expenseCategory/", {
      method: "post",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": this.state.csrftoken,
      },
      body: this.state.postData,
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };

  asyncFormGet = () => {
    fetch("/api/expenseCategory/", {
      method: "get",
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
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

  postRequest = () => {
    this.asyncFormSubmit();
  };

  getRequest = () => {
    this.asyncFormGet();
  };

  componentDidMount() {
    this.setState({ csrftoken: getCookie("csrftoken") });
  }

  render() {
    console.log(this.state.csrftoken);
    return (
      <div className="calculator-wrapper">
        <header>
          <h1>Expense Category Form</h1>
        </header>
        <CategoryForm setOutput={this.setOutput} />
        <Output output={this.state.outputEquation} />
        <button className="post-request" onClick={this.postRequest}>
          Post expenseCategory
        </button>
        <button className="get-request" onClick={this.getRequest}>
          Get expenseCategory
        </button>
      </div>
    );
  }
}

export default ExpenseTracker;
