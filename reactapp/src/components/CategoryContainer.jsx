import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";
import CategoryFilter from "./CategoryFilter";

function CategoryContainer(props) {
  const [selectedCategory, setSelectedCategory] = useState("");
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
  }, [selectedCategory]);

  function handleSelectCategory(event, id) {
    event.preventDefault();
    props.handleCategoryFormSubmit(id);
    handleFormSubmit(id);
  }

  function handleFormSubmit(id) {
    setSelectedCategory(id);
  }

  return (
    <div>
      <CategoryForm onSubmit={handleFormSubmit} />
      <CategoryFilter
        categories={categories}
        handleSelectCategory={handleSelectCategory}
        isLoaded={isLoaded}
      />
      {selectedCategory !== "" ? (
        <p>
          You have selected Category Id: {selectedCategory}, which will be used
          when creating an Expense Period
        </p>
      ) : (
        <p>Select Expense Category...</p>
      )}
    </div>
  );
}

export default CategoryContainer;
