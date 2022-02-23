import { observer } from "mobx-react-lite";
import React, { Children, cloneElement } from "react";
import CardLayout from "../CardLayout";
import Chart from "./Chart";
import SummaryTable from "./SummaryTable";

function Visualisation({
  selectedCategory,
  expensePeriodsStore,
  expensesStore,
}) {
  return (
    <CardLayout>
      <SummaryTable
        selectedCategory={selectedCategory}
        expensePeriodsStore={expensePeriodsStore}
        expensesStore={expensesStore}
      />
      <Chart
        selectedCategory={selectedCategory}
        expensePeriodsStore={expensePeriodsStore}
        expensesStore={expensesStore}
      />
    </CardLayout>
  );
}

export default observer(Visualisation);
