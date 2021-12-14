import { useState, useEffect } from "react";
import "./ExpensePeriodForm.css";
import { getCookie } from "../utils/cookieUtils";

function ExpensePeriodForm(props) {
  const [formData, setFormData] = useState({
    description: "",
    dateStart: "",
    dateEnd: "",
  });
  const [csrfToken, setCsrfToken] = useState("unset");

  // Making a post request
  // Stack Overflow:
  // https://stackoverflow.com/questions/45308153/posting-data-to-django-rest-framework-using-javascript-fetch
  const asyncFormSubmit = (e) => {
    const { description, dateStart, dateEnd } = formData;
    fetch("/api/expenseTimePeriod/", {
      method: "post",
      headers: {
        Accept: "application/json, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
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
        console.log(res);
        props.onSubmit(res.id);
      });
  };

  const postRequest = (e) => {
    e.preventDefault();
    asyncFormSubmit();
  };

  useEffect(() => {
    setCsrfToken(getCookie("csrftoken"));
  }, []);

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
      <button className="post-request" onClick={postRequest}>
        Post expenseTimePeriod
      </button>
    </form>
  );
}

export default ExpensePeriodForm;
