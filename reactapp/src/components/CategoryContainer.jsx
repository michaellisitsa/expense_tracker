import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";
import CategoryFilter from "./CategoryFilter";
import CSRFTOKEN from "../utils/csrftoken"; // utility function to request the csrf token for create/delete requests to django

// Component will live in a separate route in future (to allow adding and deleting categories
// which is a less frequent activity that adding expense periods & expenses so doesn't need to be on the main SPA)
function CategoryContainer(props) {
  // The isLoaded state here is passed down to the "xxxFilter" components once the fetch is completed.
  const [isLoaded, setIsLoaded] = useState(false);

  // The get request here is passed down to the "xxxFilter" components
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
        // Filter out the delete category.
        // Comparison is on the entire object rather than just the id.
        props.onCategoriesUpdate((prevCategories) =>
          prevCategories.filter(
            (categoryInCategories) => categoryInCategories !== category
          )
        );
      })
      .catch((err) => {
        // QUESTION: Don't know how to test this with an actual API. When inputting non-valid data (e.g. string vs number in budget)
        // Django will give an error but not the console message:
        // > POST http://localhost:3000/api/expenseCategory/ 400 (Bad Request)
        // > {
        //       "budget": [
        //           "A valid number is required."
        //      ]
        //   }
        // Need to add validation because currently an added entry is made but its not actually on the server
        console.log("Invalid form data:", err.message);
      });
  }

  // Selection can be made from CategoryFilter.
  // Once CategoryContainer (this component) is moved to a separate Route,
  // A selection will navigate to the main page route as well as selecting the select route.
  function handleSelectCategory(event, category) {
    event.preventDefault();
    props.onCategoryFormSubmit(category);
  }

  // When a post request is made:
  // 1. pass the selected category up to ExpenseTracker
  // 2. pass the updated list of all categories up to ExpenseTracker
  //    in future will rationalise so the concatenation could be done up within the ExpenseTracker function, rather than duplicating here.
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
