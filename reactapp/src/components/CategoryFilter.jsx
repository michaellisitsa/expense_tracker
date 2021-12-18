import { useState, useEffect } from "react";

function CategoryFilter(props) {
  return (
    <div>
      <ul>
        {props.isLoaded ? (
          props.categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={(event) => props.onSelectCategory(event, category)}
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
