import { useState, useEffect } from "react";
import CSRFTOKEN from "../utils/csrftoken";
import "./ExpenseForm.css";

function ExpenseForm(props) {
  const [formData, setFormData] = useState({
    description: "",
    cost: "",
  });

  // Making a post request
  // Stack Overflow:
  // https://stackoverflow.com/questions/45308153/posting-data-to-django-rest-framework-using-javascript-fetch
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { description, cost } = formData;
    fetch("/api/expense/", {
      method: "post",
      headers: {
        Accept: "application/json, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": CSRFTOKEN,
      },
      body: JSON.stringify({
        description,
        cost,
        expenseTimePeriod: props.selectedExpensePeriod.id,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        props.onSubmit(res);
      });
  };

  const handleChange = (event) => {
    setFormData((data) => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form className="form1" id="form1">
      <fieldset className="inputs-wrapper">
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          name="description"
          id="description"
          className="Expense-input"
          placeholder="Enter Description..."
          value={formData.description}
          onChange={handleChange}
        />
        <label htmlFor="cost">Cost $:</label>
        <input
          type="number"
          name="cost"
          id="cost"
          className="Expense-input"
          value={formData.cost}
          onChange={handleChange}
        />
      </fieldset>
      <button className="post-request" onClick={handleFormSubmit}>
        Post Expense Form
      </button>
    </form>
  );
}

export default ExpenseForm;
