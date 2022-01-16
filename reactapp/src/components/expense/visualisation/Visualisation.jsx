import React, { Children, cloneElement } from "react";
import CardLayout from "../CardLayout";
import { useExpenseContext } from "../ExpenseProvider";

function Visualisation({ children }) {
  const { selectedCategory, expensePeriods, expenses } = useExpenseContext();
  return (
    <CardLayout>
      {Children.map(children, (child) =>
        cloneElement(child, { selectedCategory, expensePeriods, expenses })
      )}
    </CardLayout>
  );
}

export default Visualisation;
