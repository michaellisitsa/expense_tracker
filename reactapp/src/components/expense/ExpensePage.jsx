import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { memoize } from "memoize-one";

import CRUD from "./crud/CRUD";
import Visualisation from "./visualisation/Visualisation";
import "./ExpensePage.css";
import Chart from "./visualisation/Chart";
import SummaryTable from "./visualisation/SummaryTable";
import { useStore } from "../../store/helpers/use-store";

// function loadData ()

function ExpensePage() {
  const { expensePeriodsStore } = useStore();

  // The selectedCategory needs to be known at the ExpensePage (top) level
  // because it is used for visualisation.
  // TODO - to display all categories, we might need to also pass up categories array
  const [selectedCategory, setSelectedCategory] = useState({});
  // The below state is passed up from xxxContainer to allow responsive visualisations.
  // const [expensePeriods, setExpensePeriods] = useState([]);
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    async function loadData() {
      await expensePeriodsStore.loadExpensePeriods();
    }
    loadData();
  }, []);

  return (
    <div className="wrapper">
      <Visualisation
        selectedCategory={selectedCategory}
        expensePeriodsStore={expensePeriodsStore}
        expenses={expenses}
      >
        <SummaryTable />
        <Chart />
      </Visualisation>
      <CRUD
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        expensePeriodsStore={expensePeriodsStore}
        expenses={expenses}
        setExpenses={setExpenses}
      />
    </div>
  );
}

export default observer(ExpensePage);
