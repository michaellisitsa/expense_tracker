import { useState } from "react";
import "./CategoryForm.css";
import { observer } from "mobx-react-lite";

function CategoryForm({ categoriesStore }) {
  const [formData, setFormData] = useState({
    name: "",
    assignee: "",
    budget: "",
    description: "",
  });

  const handleChange = (event) => {
    setFormData((data) => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    categoriesStore.addToServer(formData);
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
      <p className="expensePeriod-form__error">
        {categoriesStore.error.status && `${categoriesStore.error.message}`}
      </p>
    </form>
  );
}

export default observer(CategoryForm);
