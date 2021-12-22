import { useState } from "react";
import Chart from "./Chart";
import SummaryTable from "./SummaryTable";
import "./Visualisation.css";

function Visualisation(props) {
  return (
    <section className="visualisation-container">
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
    </section>
  );
}

export default Visualisation;
