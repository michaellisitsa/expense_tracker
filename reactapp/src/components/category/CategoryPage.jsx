import { useState, useEffect } from "react";
import CategoryForm from "./CategoryForm";
import CategoryFilter from "./CategoryFilter";
import { CSRFTOKEN } from "../../utils/csrftoken"; // utility function to request the csrf token for create/delete requests to django
import "./CategoryPage.css";

// Component will live in a separate route in future (to allow adding and deleting categories
// which is a less frequent activity that adding expense periods & expenses so doesn't need to be on the main SPA)
function CategoryPage(props) {
  const [categories, setCategories] = useState([]);

  // The isLoaded state here is passed down to the "xxxFilter" components once the fetch is completed.
  const [isLoaded, setIsLoaded] = useState(false);

  // The get request here is passed down to the "xxxFilter" components
  useEffect(() => {
    fetch("/api/expenseCategory/", {
      method: "get",
    })
      .then((res) => res.json())
      .then((res) => {
        setCategories(res.results);
        setIsLoaded(true);
      });
  }, []);

  // Making a delete request
  function handleDeleteCategory(event, categoryToDelete) {
    event.preventDefault();
    fetch(`/api/expenseCategory/${categoryToDelete.id}`, {
      method: "delete",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        "X-CSRFToken": CSRFTOKEN,
      },
    })
      .then((res) => res.text())
      .then((res) => {
        // Filter out the delete category.
        // Comparison is on the entire object rather than just the id.
        setCategories((prev) =>
          prev.filter((category) => category.id !== categoryToDelete.id)
        );
      })
      .catch((err) => {
        // QUESTION: Don't know how to test this with an actual API. When inputting non-valid data (e.g. string vs number in budget)
        // Django will give an error but not the console message:
        // > POST http://localhost:3000/api/expenseCategory/ 400 (Bad Request)
        // > {
        //       "budget": [
        //           "A valid number is required."
        //      ]
        //   }
        // Need to add validation because currently an added entry is made but its not actually on the server
        console.log("Invalid form data:", err.message);
      });
  }

  return (
    <section className="category-page">
      <CategoryForm setCategories={setCategories} />
      <CategoryFilter
        isLoaded={isLoaded}
        categories={categories}
        onDeleteCategory={handleDeleteCategory}
      />
    </section>
  );
}

export default CategoryPage;
