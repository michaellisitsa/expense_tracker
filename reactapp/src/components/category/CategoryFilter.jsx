import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function CategoryFilter(props) {
  const navigate = useNavigate();

  function handleSelectCategory(event, category) {
    event.preventDefault();
    navigate(`/expenses/${category.id}`);
  }

  return (
    <div>
      <ul>
        {props.isLoaded ? (
          props.categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={(event) => handleSelectCategory(event, category)}
              >
                {category.id}: {category.name}
              </button>
              <button
                onClick={(event) => props.onDeleteCategory(event, category)}
              >
                Delete
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
