import { useState, useEffect } from "react";
import "./CategorySelect.css";
import { useParams } from "react-router-dom";

function CategorySelect(props) {
  const [categories, setCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const params = useParams();

  useEffect(() => {
    // repeating the get request here, even though its also in CategoryContainer
    // because CategoryContainer will be in a separate Route.
    // QUESTION: Would there be a better way to do the fetch request once and store it up in "ExpenseTracker" component
    fetch("/api/expenseCategory/", {
      method: "get",
    })
      .then((res) => res.json())
      .then((res) => {
        setIsLoaded(true);
        setCategories(res.results);
        // console.log(res.results.find);
        const selectedCategory = res.results.find(
          (result) => result.id === parseFloat(params.id)
        );
        if (selectedCategory) {
          props.onCategoryFormSubmit(selectedCategory);
        }
        // );
      });
  }, []);

  // When the select dropdown changes, do this.
  // Need to use event.target.value to access what is the currently selected value
  // rather than the pure HTML selected attribute on each option.
  function handleSelectCategory(event) {
    event.preventDefault();
    const selectedCategory = categories.find(
      (category) => category.id === parseFloat(event.target.value)
    );
    // pass selected category up to the top leve.
    props.onCategoryFormSubmit(selectedCategory);
  }

  // The select controlled component logic following this link:
  // https://www.pluralsight.com/guides/how-to-get-selected-value-from-a-mapped-select-input-in-react
  return (
    <div className="categorySelect">
      {isLoaded ? (
        <select
          className="categorySelect__select"
          value={props.selectedCategory.id}
          onChange={handleSelectCategory}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.id}: {category.name}
            </option>
          ))}
        </select>
      ) : (
        <p>Loading Categories...</p>
      )}
      {Object.keys(props.selectedCategory).length !== 0 ? (
        <p className="categorySelect__Text">
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

export default CategorySelect;
