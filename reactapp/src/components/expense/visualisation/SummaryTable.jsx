import { useState, useEffect } from "react";
import { summariseTimePeriod } from "./summariseTimePeriod";
import { subDays } from "date-fns";
import "./SummaryTable.css";
const currentDate = new Date();

function SummaryTable(props) {
  const [expensesPerMonth, setExpensesPerMonth] = useState([]);
  const { selectedCategory, expensePeriods, expenses } = props;

  // Whenever a different category is selected, reset all filtered results
  // because the expense periods will all change, and the filters are now irrelevant.
  useEffect(() => {
    if (selectedCategory?.id) {
      const filteredExpensePeriods = expensePeriods.filter(
        (expensePeriod) => expensePeriod.category === selectedCategory.id
      );
      const filteredExpenses = expenses.filter((expense) =>
        filteredExpensePeriods.find(
          (filteredExpensePeriod) =>
            filteredExpensePeriod.id === expense.expenseTimePeriod
        )
      );
      // Get the cumulative cost of all expenses within the recent period
      setExpensesPerMonth([
        {
          duration: "Year",
          amount: summariseTimePeriod(
            filteredExpensePeriods,
            filteredExpenses,
            subDays(currentDate, 365),
            currentDate
          ),
        },
        {
          duration: "Quarter",
          amount: summariseTimePeriod(
            filteredExpensePeriods,
            filteredExpenses,
            subDays(currentDate, 91),
            currentDate
          ),
        },
        {
          duration: "Month",
          amount: summariseTimePeriod(
            filteredExpensePeriods,
            filteredExpenses,
            subDays(currentDate, 30),
            currentDate
          ),
        },
        {
          duration: "Week",
          amount: summariseTimePeriod(
            filteredExpensePeriods,
            filteredExpenses,
            subDays(currentDate, 7),
            currentDate
          ),
        },
      ]);
    }
  }, [selectedCategory]);

  // Don't show table before a user has selected a Category
  if (Object.keys(selectedCategory).length === 0) {
    return <h2>Select a Category Below:</h2>;
  }

  return (
    <div>
      <h1>
        {selectedCategory.name}: ${selectedCategory.budget}
      </h1>
      <table className="summaryTable">
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
              SPENT:
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
                {expense.amount > 0 ? `$ ${expense.amount}` : "N/A"}
              </td>
            ))}
          </tr>
          <tr>
            <th scope="row" className="summaryTableCells">
              REMAINING:
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
                  ? `$ ${selectedCategory.budget - expense.amount}`
                  : "N/A"}
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default SummaryTable;
