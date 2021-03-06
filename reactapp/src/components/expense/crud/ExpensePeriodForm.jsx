import { useState } from "react";
import { CSRFTOKEN } from "../../../utils/csrftoken";
import { differenceInDays } from "date-fns";
import "./ExpensePeriodForm.css";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

function ExpensePeriodForm({
  selectedCategory,
  setSelectedExpensePeriod,
  expensePeriodsStore,
}) {
  const [formData, setFormData] = useState({
    description: "",
    dateStart: "",
    dateEnd: "",
  });
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Making a post request
  // Stack Overflow:
  // https://stackoverflow.com/questions/45308153/posting-data-to-django-rest-framework-using-javascript-fetch
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { description, dateStart, dateEnd } = formData;
    const result = differenceInDays(
      new Date(dateEnd + "T00:00"),
      new Date(dateStart + "T00:00")
    );
    if (result > 0) {
      setError(false);
      setErrorMsg("");
      fetch("/api/expenseTimePeriod/", {
        method: "post",
        headers: {
          Accept: "application/json, */*",
          "Content-Type": "application/json",
          "X-CSRFToken": CSRFTOKEN,
        },
        body: JSON.stringify({
          description,
          dateStart,
          dateEnd,
          category: selectedCategory?.id,
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
          // Add the new submitted value to all expense period arrays, and reset filters
          setSelectedExpensePeriod(res);
          expensePeriodsStore.addExpensePeriod(res);
          // setExpensePeriods((prevState) => [...prevState, res]);
        })
        .catch((err) => {
          setError(true);
          setErrorMsg(err.message);
        });
    } else {
      setError(true);
      setErrorMsg("The start date is before the end date.");
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
      <p className="expensePeriod-form__error">
        {error && `${errorMsg} Select Category`}
      </p>
      <Form>
        <Inputs>
          <input
            type="text"
            name="description"
            placeholder="Enter Description:"
            value={formData.description}
            onChange={handleChange}
          />
          <InputsRow>
            <input
              type="date"
              name="dateStart"
              value={formData.dateStart}
              onChange={handleChange}
            />
            <input
              type="date"
              name="dateEnd"
              value={formData.dateEnd}
              onChange={handleChange}
            />
          </InputsRow>
        </Inputs>
        <button
          className="expensePeriod-form__button"
          onClick={handleFormSubmit}
        >
          <span>ADD</span>
        </button>
      </Form>
    </>
  );
}

export default observer(ExpensePeriodForm);

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;

  > input:first-child {
    padding: 0.5em 1em;
    border: solid 1px grey;
    border-radius: 0.5em;
  }
`;

const Form = styled.form`
  display: flex;
  background-color: white;
  border: 0;
  border-radius: 0.5em;
  flex-wrap: wrap;
`;

const InputsRow = styled.div`
  display: flex;
  justify-content: space-between;
  border: solid 1px grey;
  border-radius: 6px;
  overflow: hidden;
  gap: 0.25em;
  padding: 0.5em;
  flex-wrap: wrap;

  > input {
    border: none;
  }
`;
