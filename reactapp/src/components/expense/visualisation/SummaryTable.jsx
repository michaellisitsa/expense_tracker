import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { summariseTimePeriod } from "./summariseTimePeriod";
import { subDays } from "date-fns";
import { NavLink } from "react-router-dom";
import { formatNumber } from "../../../utils/formatNumber";

import "./SummaryTable.css";
import { isObservable, isObservableArray } from "mobx";
const currentDate = new Date();

function SummaryTable({
  selectedCategory,
  expensePeriodsStore,
  expensesStore,
}) {
  // const [expensesPerMonth, setExpensesPerMonth] = useState([]);
  const expensePeriods = expensePeriodsStore.list;
  const expenses = expensesStore.list;

  // Whenever a different category is selected, reset all filtered results
  // because the expense periods will all change, and the filters are now irrelevant.
  let filteredExpensePeriods;
  let filteredExpenses;
  if (selectedCategory?.id) {
    filteredExpensePeriods = [...expensePeriods].filter(
      (expensePeriod) => expensePeriod.category === selectedCategory.id
    );
    filteredExpenses = [...expenses].filter((expense) =>
      filteredExpensePeriods.find(
        (filteredExpensePeriod) =>
          filteredExpensePeriod.id === expense.expenseTimePeriod
      )
    );
  }
  const intervals = [
    { label: "YR", duration: 365 },
    { label: "QTR", duration: 91 },
    { label: "MTH", duration: 30 },
    { label: "WK", duration: 7 },
  ];

  let expensesPerMonth = [];
  if (selectedCategory?.id) {
    intervals.forEach((interval) =>
      expensesPerMonth.push({
        duration: interval.label,
        amount: summariseTimePeriod(
          filteredExpensePeriods,
          filteredExpenses,
          subDays(currentDate, interval.duration),
          currentDate
        ),
      })
    );
  }

  // Don't show table before a user has selected a Category
  if (selectedCategory) {
    if (Object.keys(selectedCategory).length === 0) {
      return <h1>Select a Category Below:</h1>;
    }
  } else {
    return (
      <h1>
        Create your first <NavLink to="/categories">Category</NavLink>
      </h1>
    );
  }

  return (
    <div className="summary-container">
      <h1>
        {selectedCategory.name}: ${selectedCategory.budget}
      </h1>
      <table className="summary-table">
        <thead>
          <tr>
            <th scope="col" className="summaryTableCells"></th>
            {expensesPerMonth.map((expense) => (
              <th
                key={expense.duration}
                scope="col"
                className="summaryTableCells"
              >
                {expense.duration}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row" className="summaryTableCells">
              EXPENSE
            </th>
            {expensesPerMonth.map((expense) => (
              <td
                key={expense.duration}
                className={`summaryTableCells diff-${
                  (isNaN(expense.amount) ||
                    selectedCategory.budget - expense.amount === 0) &&
                  "grey"
                }`}
              >
                {expense.amount > 0
                  ? `$ ${formatNumber(expense.amount)}`
                  : "N/A"}
              </td>
            ))}
          </tr>
          <tr>
            <th scope="row" className="summaryTableCells">
              REMAIN
            </th>
            {expensesPerMonth.map((expense) => (
              <td
                key={expense.duration}
                className={`summaryTableCells diff-${
                  isNaN(expense.amount)
                    ? "grey"
                    : selectedCategory.budget - expense.amount > 0
                    ? "green"
                    : "red"
                }`}
              >
                {!isNaN(expense.amount)
                  ? `$ ${formatNumber(
                      selectedCategory.budget - expense.amount
                    )}`
                  : "N/A"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default observer(SummaryTable);
