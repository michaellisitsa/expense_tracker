import { useState, useRef } from "react";
import { CSRFTOKEN } from "../../../utils/csrftoken";
import "./ExpenseForm.css";

function ExpenseForm(props) {
  const [formData, setFormData] = useState({
    description: "",
    cost: "",
  });
  const descriptionInput = useRef(null);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Making a post request
  // Stack Overflow:
  // https://stackoverflow.com/questions/45308153/posting-data-to-django-rest-framework-using-javascript-fetch
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { description, cost } = formData;
    if (formData.description === "" || formData.cost === "") {
      setError(true);
      setErrorMsg("Not all inputs entered");
    } else {
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
          // Clear formData
          setFormData({
            description: "",
            cost: "",
          });
          // Reset error state
          setError(false);
          setErrorMsg("");
        })
        .catch((err) => {
          setError(true);
          setErrorMsg(err.message);
        });
      descriptionInput.current.focus();
    }
  };

  const handleChange = (event) => {
    setFormData((data) => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <>
      <p className="expense-form__error">
        {error && `${errorMsg}. Select Expense Period`}
      </p>
      <form className="expense-form">
        <div className="expense-form__inputs">
          <input
            ref={descriptionInput}
            type="text"
            name="description"
            placeholder="Enter Description..."
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="number"
            name="cost"
            placeholder="$100.00"
            value={formData.cost}
            onChange={handleChange}
          />
        </div>
        <div className="expense-form__crud">
          <button className="expense-button" onClick={handleFormSubmit}>
            +
          </button>
        </div>
      </form>
    </>
  );
}

export default ExpenseForm;
