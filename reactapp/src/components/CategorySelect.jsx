import { useState, useEffect } from "react";
import "./CategorySelect.css";

function CategorySelect(props) {
  const [categories, setCategories] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

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

  function handleSelectCategory(event) {
    event.preventDefault();
    const selectedCategory = categories.find(
      (category) => category.id === parseFloat(event.target.value)
    );
    props.onCategoryFormSubmit(selectedCategory);
  }
  // https://www.pluralsight.com/guides/how-to-get-selected-value-from-a-mapped-select-input-in-react
  return (
    <div>
      {isLoaded ? (
        <select
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

export default CategorySelect;
