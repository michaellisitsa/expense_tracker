import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";
import CategoryFilter from "./CategoryFilter";
import CSRFTOKEN from "../utils/csrftoken";

function CategoryContainer(props) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/expenseCategory/", {
      method: "get",
    })
      .then((res) => res.json())
      .then((res) => {
        console.table(res.results);
        props.onCategoriesUpdate(res.results);
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
        "X-CSRFToken": CSRFTOKEN,
      },
    })
      .then((res) => res.text())
      .then((res) => {
        console.log(res);
        props.onCategoriesUpdate((prevCategories) =>
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
    props.onCategoryFormSubmit(category);
  }

  function handleFormSubmit(category) {
    props.onCategoryFormSubmit(category);
    props.onCategoriesUpdate((prevCategories) => [...prevCategories, category]);
  }

  return (
    <div>
      <CategoryForm onSubmit={handleFormSubmit} />
      <CategoryFilter
        isLoaded={isLoaded}
        categories={props.categories}
        onSelectCategory={handleSelectCategory}
        onDeleteCategory={handleDeleteCategory}
      />
      {Object.keys(props.selectedCategory).length !== 0 ? (
        <p>
          You have selected Category Id: {props.selectedCategory.id}:{" "}
          {props.selectedCategory.name}, which will be used when creating an
          Expense Period
        </p>
      ) : (
        <p>Select Expense Category...</p>
      )}
    </div>
  );
}

export default CategoryContainer;
