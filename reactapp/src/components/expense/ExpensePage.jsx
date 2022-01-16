import { useState, useCallback } from "react";
import CRUD from "./crud/CRUD";
import Visualisation from "./visualisation/Visualisation";
import "./ExpensePage.css";
import Chart from "./visualisation/Chart";
import SummaryTable from "./visualisation/SummaryTable";

function ExpensePage(props) {
  // The selectedCategory needs to be known at the ExpensePage (top) level
  // because it is used for visualisation.
  // TODO - to display all categories, we might need to also pass up categories array
  const [selectedCategory, setSelectedCategory] = useState({});
  // The below state is passed up from xxxContainer to allow responsive visualisations.
  const [expensePeriods, setExpensePeriods] = useState([]);
  const [expenses, setExpenses] = useState([]);

  return (
    <div className="wrapper">
      <Visualisation
        selectedCategory={selectedCategory}
        expensePeriods={expensePeriods}
        expenses={expenses}
      >
        <SummaryTable />
        <Chart />
      </Visualisation>
      <CRUD
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        expensePeriods={expensePeriods}
        setExpensePeriods={setExpensePeriods}
        expenses={expenses}
        setExpenses={setExpenses}
      />
    </div>
  );
}

export default ExpensePage;
