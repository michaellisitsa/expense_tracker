import React, { Component } from "react";
import "./CategoryForm.css";
import { getCookie } from "./utils/cookieUtils";

export class CategoryForm extends Component {
  state = {
    number1: "0",
    number2: "0",
    operator: "+",
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
      .then((res) => console.table(res.results));
  };

  postRequest = (e) => {
    e.preventDefault();
    this.asyncFormSubmit();
  };

  getRequest = (e) => {
    e.preventDefault();
    this.asyncFormGet();
  };

  componentDidMount() {
    this.setState({ csrftoken: getCookie("csrftoken") });
  }

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
        <button className="post-request" onClick={this.postRequest}>
          Post expenseCategory
        </button>
        <button className="get-request" onClick={this.getRequest}>
          Get expenseCategory
        </button>
      </form>
    );
  }
}

export default CategoryForm;
