import { useState, useEffect } from "react";
import "./CategoryForm.css";
import { getCookie } from "../utils/cookieUtils";

function CategoryForm(props) {
  const [formData, setFormData] = useState({
    name: "",
    assignee: "",
    budget: "",
    description: "",
  });
  const [csrfToken, setCsrfToken] = useState("unset");

  // Making a post request
  // Stack Overflow:
  // https://stackoverflow.com/questions/45308153/posting-data-to-django-rest-framework-using-javascript-fetch
  const asyncFormSubmit = (e) => {
    const { name, assignee, budget, description } = formData;
    fetch("/api/expenseCategory/", {
      method: "post",
      headers: {
        Accept: "application/json, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
      body: JSON.stringify({
        name,
        assignee,
        budget,
        description,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        props.onSubmit(res);
      });
  };

  const postRequest = (e) => {
    e.preventDefault();
    asyncFormSubmit();
  };

  useEffect(() => {
    setCsrfToken(getCookie("csrftoken"));
  }, []);

  // componentDidMount() {
  //   this.setState({ csrfToken: getCookie("csrfToken") });
  // }

  const handleChange = (event) => {
    setFormData((data) => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form className="form1" id="form1">
      <fieldset className="inputs-wrapper">
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          name="name"
          id="name"
          className="category-input"
          placeholder="Enter Name..."
          value={formData.name}
          onChange={handleChange}
        />
        <label htmlFor="assignee">Assignee:</label>
        <input
          type="text"
          name="assignee"
          id="assignee"
          className="category-input"
          placeholder="Enter Assignee..."
          value={formData.assignee}
          onChange={handleChange}
        />
        <label htmlFor="budget">Budget:</label>
        <input
          type="text"
          name="budget"
          id="budget"
          className="category-input"
          placeholder="Enter Budget..."
          value={formData.budget}
          onChange={handleChange}
        />
        <label htmlFor="description">Description:</label>
        <input
          type="text"
          name="description"
          id="description"
          className="category-input"
          placeholder="Enter Description..."
          value={formData.description}
          onChange={handleChange}
        />
      </fieldset>
      <button className="post-request" onClick={postRequest}>
        Post expense Category Form
      </button>
    </form>
  );
}

export default CategoryForm;
