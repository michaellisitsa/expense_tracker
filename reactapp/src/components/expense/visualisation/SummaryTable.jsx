import { useState, useEffect } from "react";

function SummaryTable(props) {
  const [filteredExpensePeriods, setFilteredExpensePeriods] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const { selectedCategory, expensePeriods, expenses } = props;
  console.log(
    "selectedCategory",
    selectedCategory,
    "expensePeriods",
    expensePeriods,
    "expenses",
    expenses
  );

  // Whenever a different category is selected, reset all filtered results
  // because the expense periods will all change, and the filters are now irrelevant.
  useEffect(() => {
    if (selectedCategory?.id) {
      const filteredExpensePeriodsTemp = expensePeriods.filter(
        (expensePeriod) => expensePeriod.category === selectedCategory.id
      );
      setFilteredExpensePeriods(filteredExpensePeriodsTemp);
      setFilteredExpenses(
        expenses.filter((expense) =>
          filteredExpensePeriodsTemp.find(
            (filteredExpensePeriod) =>
              filteredExpensePeriod.id === expense.expenseTimePeriod
          )
        )
      );
    } else {
      setFilteredExpensePeriods(expensePeriods);
      setFilteredExpenses(expenses);
    }
  }, [selectedCategory]);

  return (
    <div>
      <p>ExpensePeriods</p>
      <ul>
        {filteredExpensePeriods.map((expensePeriod) => (
          <li key={expensePeriod.id}>{expensePeriod.description}</li>
        ))}
      </ul>
      <p>Expenses</p>
      <ul>
        {filteredExpenses.map((expense) => (
          <li key={expense.id}>{expense.description}</li>
        ))}
      </ul>
    </div>
  );
}

export default SummaryTable;
