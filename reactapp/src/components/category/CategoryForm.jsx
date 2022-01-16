import { useState } from "react";
import "./CategoryForm.css";
import { CSRFTOKEN } from "../../utils/csrftoken";

function CategoryForm({ setCategories }) {
  const [formData, setFormData] = useState({
    name: "",
    assignee: "",
    budget: "",
    description: "",
  });
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Making a post request
  // Stack Overflow:
  // https://stackoverflow.com/questions/45308153/posting-data-to-django-rest-framework-using-javascript-fetch
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { name, assignee, budget, description } = formData;
    fetch("/api/expenseCategory/", {
      method: "post",
      headers: {
        Accept: "application/json, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": CSRFTOKEN,
      },
      body: JSON.stringify({
        name,
        assignee,
        budget,
        description,
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
        setCategories((prevCategories) => [...prevCategories, res]);
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
    <form className="category-form">
      <fieldset className="inputs-wrapper">
        {Object.entries(formData).map((data) => (
          <label
            key={data[0]}
            className={`category-form__entry`}
            htmlFor={data[0]}
          >
            {data[0]}
            <input
              type={data[0] === "budget" ? "number" : "text"}
              name={data[0]}
              className="category-input"
              placeholder={
                data[0] === "budget" ? "$1,000.00" : `Enter ${data[0]}...`
              }
              value={formData[data]}
              onChange={handleChange}
            />
          </label>
        ))}
      </fieldset>
      <button className="category-form__button" onClick={handleFormSubmit}>
        <span>ADD</span>
      </button>
      <p className="expensePeriod-form__error">{error && `${errorMsg}`}</p>
    </form>
  );
}

export default CategoryForm;
