import { useState, useEffect } from "react";
import CRUD from "./crud/CRUD";
import Visualisation from "./visualisation/Visualisation";

function ExpensePage(props) {
  // The selectedCategory needs to be known at the ExpensePage (top) level
  // because it is used for visualisation.
  // TODO - to display all categories, we might need to also pass up categories array
  const [selectedCategory, setSelectedCategory] = useState({});
  // The below state is passed up from xxxContainer to allow responsive visualisations.
  const [expensePeriods, setExpensePeriods] = useState([]);
  const [expenses, setExpenses] = useState([]);

  function handleCategoryFormSubmit(category) {
    setSelectedCategory(category);
  }

  return (
    <div className="wrapper">
      <section className="visualisation-container">
        <Visualisation
          selectedCategory={selectedCategory}
          expensePeriods={expensePeriods}
          expenses={expenses}
        />
      </section>
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
