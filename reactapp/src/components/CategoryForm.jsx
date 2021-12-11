import React, { Component } from "react";
import "./CategoryForm.css";
import { getCookie } from "../utils/cookieUtils";

export class CategoryForm extends Component {
  state = {
    name: "",
    assignee: "",
    budget: "",
    description: "",
    csrftoken: "unset",
  };

  // Making a post request
  // Stack Overflow:
  // https://stackoverflow.com/questions/45308153/posting-data-to-django-rest-framework-using-javascript-fetch
  asyncFormSubmit = (e) => {
    const { name, assignee, budget, description } = this.state;
    fetch("/api/expenseCategory/", {
      method: "post",
      headers: {
        Accept: "application/json, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": this.state.csrftoken,
      },
      body: JSON.stringify({
        name,
        assignee,
        budget,
        description,
      }),
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
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    return (
      <form className="form1" id="form1">
        <fieldset className="inputs-wrapper">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            name="name"
            id="name"
            className="category-input"
            placeholder="Enter Name..."
            value={this.state.name}
            onChange={this.handleChange}
          />
          <label htmlFor="assignee">Assignee:</label>
          <input
            type="text"
            name="assignee"
            id="assignee"
            className="category-input"
            placeholder="Enter Assignee..."
            value={this.state.assignee}
            onChange={this.handleChange}
          />
          <label htmlFor="budget">Budget:</label>
          <input
            type="text"
            name="budget"
            id="budget"
            className="category-input"
            placeholder="Enter Budget..."
            value={this.state.budget}
            onChange={this.handleChange}
          />
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            name="description"
            id="description"
            className="category-input"
            placeholder="Enter Description..."
            value={this.state.description}
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
