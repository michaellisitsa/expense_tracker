import { useState, useEffect } from "react";
import CRUD from "./crud/CRUD";

function ExpensePage(props) {
  // The selectedCategory needs to be known at the ExpensePage (top) level
  // because it is used for visualisation.
  const [selectedCategory, setSelectedCategory] = useState({});
  const [expensePeriods, setExpensePeriods] = useState([]);
  const [expenses, setExpenses] = useState([]);

  function handleCategoryFormSubmit(category) {
    setSelectedCategory(category);
  }

  return (
    <div className="wrapper">
      <section className="visualisation-container"></section>
      <section className="crud-container">
        <CRUD
          selectedCategory={selectedCategory}
          onCategoryFormSubmit={handleCategoryFormSubmit}
          expensePeriods={expensePeriods}
          setExpensePeriods={setExpensePeriods}
          expenses={expenses}
          setExpenses={setExpenses}
        />
      </section>
    </div>
  );
}

export default ExpensePage;
