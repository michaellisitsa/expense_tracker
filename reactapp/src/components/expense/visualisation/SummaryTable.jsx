import { useState, useEffect } from "react";
import { summariseTimePeriod } from "./summariseTimePeriod";
import { subDays } from "date-fns";
const currentDate = new Date();

function SummaryTable(props) {
  const [filteredExpensePeriods, setFilteredExpensePeriods] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [expensesPerMonth, setExpensesPerMonth] = useState([]);
  const { selectedCategory, expensePeriods, expenses } = props;

  // Whenever a different category is selected, reset all filtered results
  // because the expense periods will all change, and the filters are now irrelevant.
  useEffect(() => {
    if (selectedCategory?.id) {
      const filteredExpensePeriodsTemp = expensePeriods.filter(
        (expensePeriod) => expensePeriod.category === selectedCategory.id
      );
      setFilteredExpensePeriods(filteredExpensePeriodsTemp);
      const filteredExpensesTemp = expenses.filter((expense) =>
        filteredExpensePeriodsTemp.find(
          (filteredExpensePeriod) =>
            filteredExpensePeriod.id === expense.expenseTimePeriod
        )
      );
      setFilteredExpenses(filteredExpensesTemp);
      // Get the cumulative cost of all expenses within the recent period
      setExpensesPerMonth([
        {
          period: "Week",
          expense: summariseTimePeriod(
            filteredExpensePeriodsTemp,
            filteredExpensesTemp,
            subDays(currentDate, 7),
            currentDate
          ),
        },
        {
          period: "Month",
          expense: summariseTimePeriod(
            filteredExpensePeriodsTemp,
            filteredExpensesTemp,
            subDays(currentDate, 30),
            currentDate
          ),
        },
        {
          period: "Year",
          expense: summariseTimePeriod(
            filteredExpensePeriodsTemp,
            filteredExpensesTemp,
            subDays(currentDate, 365),
            currentDate
          ),
        },
      ]);
    } else {
      setFilteredExpensePeriods(expensePeriods);
      setFilteredExpenses(expenses);
    }
  }, [selectedCategory]);

  return (
    <div>
      <h1>
        {selectedCategory.name}: ${selectedCategory.budget}
      </h1>
      <ul>
        {expensesPerMonth.map((expense) => (
          <li key={expense.period}>
            Last {expense.period}: ${expense.expense} . Diff:{" "}
            {selectedCategory.budget - expense.expense}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SummaryTable;
