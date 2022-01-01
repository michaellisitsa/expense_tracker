import { useState } from "react";
import Chart from "./Chart";
import SummaryTable from "./SummaryTable";
import React from "react";
import CardLayout from "../CardLayout";

function Visualisation(props) {
  return (
    <CardLayout>
      <SummaryTable
        selectedCategory={props.selectedCategory}
        expensePeriods={props.expensePeriods}
        expenses={props.expenses}
      />
      <Chart
        selectedCategory={props.selectedCategory}
        expensePeriods={props.expensePeriods}
        expenses={props.expenses}
      />
    </CardLayout>
  );
}

export default Visualisation;
