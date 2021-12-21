import { useState } from "react";
import SummaryTable from "./SummaryTable";

function Visualisation(props) {
  return (
    <div>
      <SummaryTable
        selectedCategory={props.selectedCategory}
        expensePeriods={props.expensePeriods}
        expenses={props.expenses}
      />
    </div>
  );
}

export default Visualisation;
