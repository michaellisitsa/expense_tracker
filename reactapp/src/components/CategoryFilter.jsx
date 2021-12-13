import { useState, useEffect } from "react";

function CategoryFilter(props) {
  return (
    <div>
      <ul>
        {props.isLoaded ? (
          props.categories.map((category) => (
            <li key={category.id}>
              <button
                onClick={(event) =>
                  props.handleSelectCategory(event, category.id)
                }
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
