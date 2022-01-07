import { useNavigate } from "react-router-dom";
import "./CategoryFilter.css";

function CategoryFilter(props) {
  const navigate = useNavigate();

  function handleSelectCategory(event, category) {
    event.preventDefault();
    navigate(`/expenses/${category.id}`);
  }

  return (
    <>
      <div className="filter-list">
        {props.isLoaded ? (
          props.categories.map((category) => (
            <div className="filter-list__container" key={category.id}>
              <div
                className={`filter-list__option`}
                onClick={(event) => handleSelectCategory(event, category)}
              >
                {category.name}
              </div>
              <div
                className="filter-list__delete"
                onClick={(event) => props.onDeleteCategory(event, category)}
              >
                X
              </div>
            </div>
          ))
        ) : (
          <p>Loading Categories...</p>
        )}
      </div>
    </>
  );
}

export default CategoryFilter;
