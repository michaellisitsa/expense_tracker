import { useEffect } from "react";
import CategoryForm from "./CategoryForm";
import CategoryFilter from "./CategoryFilter";
import "./CategoryPage.css";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/helpers/use-store";

// Component will live in a separate route in future (to allow adding and deleting categories
// which is a less frequent activity that adding expense periods & expenses so doesn't need to be on the main SPA)
function CategoryPage(props) {
  const { categoriesStore } = useStore();

  const isLoaded = categoriesStore.status === "success";

  useEffect(() => {
    categoriesStore.loadCategories();
  }, []);

  return (
    <section className="category-page">
      <CategoryForm categoriesStore={categoriesStore} />
      <CategoryFilter isLoaded={isLoaded} categoriesStore={categoriesStore} />
    </section>
  );
}

export default observer(CategoryPage);
