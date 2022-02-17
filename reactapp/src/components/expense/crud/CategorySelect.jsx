import { useState, useEffect } from "react";
import "./CategorySelect.css";
import { useParams } from "react-router-dom";
import { useStore } from "../../../store/helpers/use-store";
import { observer } from "mobx-react-lite";

function CategorySelect({ selectedCategory, setSelectedCategory }) {
  // const [categories, setCategories] = useState([]);
  const { categoriesStore } = useStore();

  const isLoaded = categoriesStore.status === "success";
  // const [isLoaded, setIsLoaded] = useState(false);
  const params = useParams();

  // useEffect(() => {
  //   // repeating the get request here, even though its also in CategoryContainer
  //   // because CategoryContainer will be in a separate Route.
  //   // QUESTION: Would there be a better way to do the fetch request once and store it up in "ExpenseTracker" component
  //   fetch("/api/expenseCategory/", {
  //     method: "get",
  //   })
  //     .then((res) => res.json())
  //     .then((res) => {
  //       setIsLoaded(true);
  //       setCategories(res.results);
  //       const selectedCategory = res.results.find(
  //         (result) => result.id === parseFloat(params.id)
  //       );
  //       if (selectedCategory) {
  //         setSelectedCategory(selectedCategory);
  //       } else {
  //         setSelectedCategory(res.results[0]);
  //       }
  //       // );
  //     });
  // }, [params.id, setSelectedCategory]);

  // useEffect(() => {
  //   categoriesStore.loadCategories();
  // }, [categoriesStore]);

  useEffect(() => {
    const categoryFromParams = categoriesStore.list.find(
      (result) => result.id === parseFloat(params.id)
    );
    if (categoryFromParams) {
      setSelectedCategory(categoryFromParams);
    } else {
      setSelectedCategory(categoriesStore.list[0]);
    }
  }, [params.id, setSelectedCategory]);

  // When the select dropdown changes, do this.
  // Need to use event.target.value to access what is the currently selected value
  // rather than the pure HTML selected attribute on each option.
  function handleSelectCategory(event) {
    event.preventDefault();
    const selectedCategory = categoriesStore.list.find(
      (category) => category.id === parseFloat(event.target.value)
    );
    // pass selected category up to the top leve.
    setSelectedCategory(selectedCategory);
  }

  // The select controlled component logic following this link:
  // https://www.pluralsight.com/guides/how-to-get-selected-value-from-a-mapped-select-input-in-react
  return (
    <div className="category-select">
      <h1>Category:</h1>
      {isLoaded ? (
        <select
          className="category-select__select"
          value={selectedCategory?.id}
          onChange={handleSelectCategory}
          size={categoriesStore.list.length + 1}
        >
          <optgroup>
            {categoriesStore.list.map((category) => (
              <option
                className="category-select__option"
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </optgroup>
        </select>
      ) : (
        <p>Loading Categories...</p>
      )}
    </div>
  );
}

export default observer(CategorySelect);
