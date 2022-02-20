import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";
import CategoryFilter from "./CategoryFilter";
import "./CategoryPage.css";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store/helpers/use-store";

// Component will live in a separate route in future (to allow adding and deleting categories
// which is a less frequent activity that adding expense periods & expenses so doesn't need to be on the main SPA)
function CategoryPage(props) {
  // const [categories, setCategories] = useState([]);
  const { categoriesStore } = useStore();

  // The isLoaded state here is passed down to the "xxxFilter" components once the fetch is completed.
  // const [isLoaded, setIsLoaded] = useState(false);
  const isLoaded = categoriesStore.status === "success";
  // Load initial categories, and set the selectory category
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
