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
    <form className="expensePeriods-form">
      <fieldset className="inputs-wrapper">
        {Object.entries(formData).map((data) => (
          <label
            key={data[0]}
            className={`expensePeriod-form__entry`}
            htmlFor={data[0]}
          >
            {data[0]}
            <input
              type={data[0] === "description" ? "text" : "date"}
              name={data[0]}
              className="expensePeriod-input"
              placeholder={data[0] === "description" && `Enter ${data[0]}`}
              value={formData[data]}
              onChange={handleChange}
            />
          </label>
        ))}
      </fieldset>
      <button className="expensePeriod-form__button" onClick={handleFormSubmit}>
        <span>ADD</span>
      </button>
      {error && <p className="post-errormsg">{errorMsg}</p>}
    </form>
  );
}

export default ExpensePeriodForm;
