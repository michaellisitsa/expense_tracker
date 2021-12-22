import { useState, useEffect } from "react";
import "./ExpensePeriodForm.css";
import { CSRFTOKEN } from "../../../utils/csrftoken";
import {
  addDays,
  getOverlappingDaysInIntervals,
  eachDayOfInterval,
  isWithinInterval,
  differenceInDays,
} from "date-fns";

function ExpensePeriodForm(props) {
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
          category: props.selectedCategory.id,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          props.onSubmit(res);
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
    <form className="form1" id="form1">
      <fieldset className="inputs-wrapper">
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          name="description"
          id="description"
          className="expensePeriod-input"
          placeholder="Enter Description..."
          value={formData.description}
          onChange={handleChange}
        />
        <label htmlFor="description">Start Date:</label>
        <input
          type="date"
          name="dateStart"
          id="dateStart"
          className="expensePeriod-input"
          value={formData.dateStart}
          onChange={handleChange}
        />
        <label htmlFor="description">End Date:</label>
        <input
          type="date"
          name="dateEnd"
          id="dateEnd"
          className="expensePeriod-input"
          value={formData.dateEnd}
          onChange={handleChange}
        />
      </fieldset>
      <div className="post-button">
        <button className="post-request" onClick={handleFormSubmit}>
          Post expenseTimePeriod
        </button>
        {error && <p className="post-errormsg">{errorMsg}</p>}
      </div>
    </form>
  );
}

export default ExpensePeriodForm;
