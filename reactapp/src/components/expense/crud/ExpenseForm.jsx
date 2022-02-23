import { observer } from "mobx-react-lite";
import { useState, useRef } from "react";
import { CSRFTOKEN } from "../../../utils/csrftoken";
import Spinner from "../../../utils/Spinner";
import "./ExpenseForm.css";

function ExpenseForm({ selectedExpensePeriod, expensesStore }) {
  const [formData, setFormData] = useState({
    description: "",
    cost: "",
  });
  const descriptionInput = useRef(null);
  const isLoaded = expensesStore.status === "success";
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
      expensesStore.addToServer({
        description: formData.description,
        cost: formData.cost,
        expenseTimePeriod: selectedExpensePeriod.id,
      });
      if (isLoaded) {
        setFormData({
          description: "",
          cost: "",
        });
      }
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
          <p>$</p>
          <input
            type="number"
            name="cost"
            placeholder="100"
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
      {!isLoaded && (
        <div className="expense-form__loading">
          <p>{formData.description}</p>
          <p>$ {formData.cost}</p>
          <Spinner />
        </div>
      )}
    </>
  );
}

export default observer(ExpenseForm);
