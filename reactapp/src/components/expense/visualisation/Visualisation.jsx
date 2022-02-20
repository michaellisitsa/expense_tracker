import { observer } from "mobx-react-lite";
import React, { Children, cloneElement } from "react";
import CardLayout from "../CardLayout";

function Visualisation({
  selectedCategory,
  expensePeriodsStore,
  expensesStore,
  children,
}) {
  return (
    <CardLayout>
      {Children.map(children, (child) =>
        cloneElement(child, {
          selectedCategory,
          expensePeriodsStore,
          expensesStore,
        })
      )}
    </CardLayout>
  );
}

export default observer(Visualisation);
