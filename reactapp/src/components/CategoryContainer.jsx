import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";
import CategoryFilter from "./CategoryFilter";

function CategoryContainer(props) {
  const [selectedCategory, setSelectedCategory] = useState({});
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
