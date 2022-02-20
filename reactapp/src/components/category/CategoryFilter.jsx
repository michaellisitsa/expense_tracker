import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store/helpers/use-store";
import "./CategoryFilter.css";

function CategoryFilter(props) {
  const { categoriesStore } = useStore();
  const navigate = useNavigate();

  function handleSelectCategory(event, category) {
    event.preventDefault();
    navigate(`/expenses/${category.id}`);
  }

  return (
    <>
      <div className="filter-list">
        {props.isLoaded ? (
          categoriesStore.list.map((category) => (
            <div className="filter-list__container" key={category.id}>
              <div
                className={`filter-list__option`}
                onClick={(event) => handleSelectCategory(event, category)}
              >
                {category.name}
              </div>
              <div
                className="filter-list__delete"
                onClick={() => category.delete()}
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

export default observer(CategoryFilter);
