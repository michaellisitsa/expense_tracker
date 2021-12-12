import { useState, useEffect } from "react";

function CategoryFilter(props) {
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

  function handleSelectCategory(event, id) {
    event.preventDefault();
    props.onSelect(id);
  }

  return (
    <div>
      <ul>
        {isLoaded ? (
          categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={(event) => handleSelectCategory(event, category.id)}
              >
                {category.id}: {category.name}
              </button>
            </li>
          ))
        ) : (
          <p>Loading Categories...</p>
        )}
      </ul>
    </div>
  );
}

export default CategoryFilter;
