import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";
import CategoryFilter from "./CategoryFilter";
import { getCookie } from "../utils/cookieUtils";

function CategoryContainer(props) {
  const [selectedCategory, setSelectedCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [csrfToken, setCsrfToken] = useState("unset");

  useEffect(() => {
    setCsrfToken(getCookie("csrftoken"));
  }, []);

  useEffect(() => {
    fetch("/api/expenseCategory/", {
      method: "get",
    })
      .then((res) => res.json())
      .then((res) => {
        console.table(res.results);
        setCategories(res.results);
        setIsLoaded(true);
      });
  }, []);

  // Making a delete request
  function handleDeleteCategory(event, category) {
    event.preventDefault();
    fetch(`/api/expenseCategory/${category.id}`, {
      method: "delete",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    })
      .then((res) => res.text())
      .then((res) => {
        console.log(res);
        setCategories((prevCategories) =>
          prevCategories.filter(
            (categoryInCategories) => categoryInCategories !== category
          )
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  }

  function handleSelectCategory(event, category) {
    event.preventDefault();
    props.handleCategoryFormSubmit(category);
    setSelectedCategory(category);
  }

  function handleFormSubmit(category) {
    props.handleCategoryFormSubmit(category);
    setSelectedCategory(category);
  }

  return (
    <div>
      <CategoryForm onSubmit={handleFormSubmit} />
      <CategoryFilter
        categories={categories}
        handleSelectCategory={handleSelectCategory}
        onDeleteCategory={handleDeleteCategory}
        isLoaded={isLoaded}
      />
      {Object.keys(selectedCategory).length !== 0 ? (
        <p>
          You have selected Category Id: {selectedCategory.id}:{" "}
          {selectedCategory.name}, which will be used when creating an Expense
          Period
        </p>
      ) : (
        <p>Select Expense Category...</p>
      )}
    </div>
  );
}

export default CategoryContainer;
