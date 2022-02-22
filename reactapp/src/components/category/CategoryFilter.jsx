import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import "./CategoryFilter.css";

function CategoryFilter({ categoriesStore }) {
  const isLoaded = categoriesStore.status === "success";
  const navigate = useNavigate();

  function handleSelectCategory(event, category) {
    event.preventDefault();
    navigate(`/expenses/${category.id}`);
  }

  function handleDelete(event, category) {
    event.preventDefault();
    category.delete();
  }

  return (
    <>
      <div className="filter-list">
        {isLoaded ? (
          categoriesStore.list.map((category) => {
            const isUpdating = category.status === "updating";
            return (
              <div className="filter-list__container" key={category.id}>
                <div
                  className={`filter-list__option ${
                    isUpdating ? "filter-list__option--deleting" : ""
                  }`}
                  onClick={(event) => handleSelectCategory(event, category)}
                >
                  {category.name}
                  <small>
                    {category.status === "failure" &&
                      `Error: ${category.errorMessage}`}
                  </small>
                </div>
                <div
                  className="filter-list__delete"
                  onClick={(event) => handleDelete(event, category)}
                >
                  X
                </div>
              </div>
            );
          })
        ) : (
          <p>Loading Categories...</p>
        )}
      </div>
    </>
  );
}

export default observer(CategoryFilter);
