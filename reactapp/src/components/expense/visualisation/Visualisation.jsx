import React, { Children, cloneElement } from "react";
import CardLayout from "../CardLayout";

function Visualisation({
  selectedCategory,
  expensePeriodsStore,
  expenses,
  children,
}) {
  return (
    <CardLayout>
      {Children.map(children, (child) =>
        cloneElement(child, { selectedCategory, expensePeriodsStore, expenses })
      )}
    </CardLayout>
  );
}

export default Visualisation;
