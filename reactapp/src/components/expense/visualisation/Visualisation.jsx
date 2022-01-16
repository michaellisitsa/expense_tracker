import React, { Children, cloneElement } from "react";
import CardLayout from "../CardLayout";

function Visualisation({
  selectedCategory,
  expensePeriods,
  expenses,
  children,
}) {
  return (
    <CardLayout>
      {Children.map(children, (child) =>
        cloneElement(child, { selectedCategory, expensePeriods, expenses })
      )}
    </CardLayout>
  );
}

export default Visualisation;
