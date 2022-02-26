import { observer } from "mobx-react-lite";
import { useState, useRef } from "react";
import styled from "styled-components";
import Spinner from "../../../utils/Spinner";
import "./ExpenseForm.css";

function ExpenseForm({ selectedExpensePeriod, expensesStore }) {
  const [formData, setFormData] = useState({
    description: "",
    cost: "",
    date: "",
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
    const { description, cost, date } = formData;
    if (description === "" || cost === "") {
      setError(true);
      setErrorMsg("Not all inputs entered");
    } else {
      expensesStore.addToServer({
        description: description,
        cost: cost,
        date: date,
        expenseTimePeriod: selectedExpensePeriod.id,
      });
      if (isLoaded) {
        setFormData({
          description: "",
          cost: "",
          date: "",
        });
      }
      descriptionInput.current.focus();
    }
  };

  const handleMultipleSubmit = (e) => {
    e.preventDefault();
    const { description, cost, date } = formData;
    if (description === "" || cost === "") {
      setError(true);
      setErrorMsg("Not all inputs entered");
    } else {
      expensesStore.addMultipleToServer({
        description: description,
        cost: cost,
        date: date,
        expenseTimePeriod: selectedExpensePeriod.id,
      });
      if (isLoaded) {
        setFormData({
          description: "",
          cost: "",
          date: "",
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
      <Form>
        <Inputs>
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
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </Inputs>
        <div className="expense-form__crud">
          <button className="expense-button" onClick={handleFormSubmit}>
            +
          </button>
          <button className="expense-button" onClick={handleMultipleSubmit}>
            Multi +
          </button>
        </div>
      </Form>
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

const Inputs = styled.div`
  display: flex;
  flex: 1;

  > input:first-child {
    flex: 1;
    margin-right: 1em;
  }

  > input:last-child {
    text-align: right;
    width: 30%;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: row;
  gap: 1.5em;
  margin-bottom: 1em;
`;
