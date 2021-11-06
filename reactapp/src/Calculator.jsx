import "./Calculator.css";
import React from "react";
import Form from "./Form";
import Output from "./Output";

class Calculator extends React.Component {
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

  // Get the cookie for the csrf token, needed for API POST requests
  // https://docs.djangoproject.com/en/dev/ref/csrf/#ajax
  getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
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
    this.setState({ csrftoken: this.getCookie("csrftoken") });
  }

  render() {
    console.log(this.state.csrftoken);
    return (
      <div className="calculator-wrapper">
        <header>
          <h1>Expense Category Form</h1>
        </header>
        <Form setOutput={this.setOutput} />
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

export default Calculator;
