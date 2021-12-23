import { useState, useEffect } from "react";
import { CSRFTOKEN } from "../../../utils/csrftoken";
import "./ExpenseForm.css";

function ExpenseForm(props) {
  const [formData, setFormData] = useState({
    description: "",
    cost: "",
  });
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

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
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw Error(res.statusText);
        }
      })
      .then((res) => {
        props.onSubmit(res);
      })
      .catch((err) => {
        setError(true);
        setErrorMsg(err.message);
      });
  };

  const handleChange = (event) => {
    setFormData((data) => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form className="expense-form">
      <h1>Enter an Expense:</h1>
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
      <button className="expense-button" onClick={handleFormSubmit}>
        Post Expense Form
      </button>
      <p className="expense-form__error">
        {error && `${errorMsg}. Select Expense Period`}
      </p>
    </form>
  );
}

export default ExpenseForm;
