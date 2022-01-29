import { useState, useEffect } from "react";
import "./CategorySelect.css";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateSelectedCategory } from "../../category/CategorySlice";

function CategorySelect({ selectedCategory, setSelectedCategory }) {
  const dispatch = useDispatch();
  const [categories, setCategories] = useState([]);
  // const [isLoaded, setIsLoaded] = useState(false);
  const params = useParams();
  const categoriesFromStore = useSelector((state) => state.categories);
  const isLoaded = categoriesFromStore.status === "success";

  useEffect(() => {
    const categoryFromUrlParams = categoriesFromStore.entities.find(
      (result) => result.id === parseFloat(params.id)
    );
    if (categoryFromUrlParams) {
      dispatch(updateSelectedCategory(categoryFromUrlParams.id));
      setSelectedCategory(categoryFromUrlParams);
    } else if (
      !categoryFromUrlParams &&
      categoriesFromStore.entities.length !== 0
    ) {
      dispatch(updateSelectedCategory(categoriesFromStore.entities[0].id));
      setSelectedCategory(categoriesFromStore.entities[0]);
    }
  }, [params.id, setSelectedCategory, categoriesFromStore.entities, dispatch]);

  // When the select dropdown changes, do this.
  // Need to use event.target.value to access what is the currently selected value
  // rather than the pure HTML selected attribute on each option.
  function handleSelectCategory(event) {
    event.preventDefault();
    const selectedCategory = categoriesFromStore.entities.find(
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
          size={categoriesFromStore.entities.length + 1}
        >
          <optgroup>
            {categoriesFromStore.entities.map((category) => (
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

export default CategorySelect;
