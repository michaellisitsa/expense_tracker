import { useState, useEffect } from "react";
import {
  format,
  set,
  differenceInDays,
  addDays,
  getOverlappingDaysInIntervals,
  eachDayOfInterval,
  isWithinInterval,
} from "date-fns";

function SummaryTable(props) {
  const [filteredExpensePeriods, setFilteredExpensePeriods] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [expensesPerMonth, setExpensesPerMonth] = useState([]);
  const { selectedCategory, expensePeriods, expenses } = props;
  // console.log(
  //   "selectedCategory",
  //   selectedCategory,
  //   "expensePeriods",
  //   expensePeriods,
  //   "expenses",
  //   expenses
  // );

  function summariseTimePeriod(filteredExpensePeriods, filteredExpenses, days) {
    const now = new Date();
    const prevDate = addDays(now, -days);

    // Filter expensePeriods that fit between X days ago and now.
    const filteredExpensePeriodsByDays = filteredExpensePeriods.filter(
      (expensePeriod) =>
        new Date(expensePeriod.dateStart + "T00:00") <= now &&
        new Date(expensePeriod.dateEnd + "T00:00") >= prevDate
    );

    // Aggregate expenses into each expensePeriod, and sum these aggregate group.
    // Returns an array of total expenses per expense period
    const filteredExpensesByDay = filteredExpensePeriodsByDays.map(
      (expensePeriod) =>
        filteredExpenses.reduce(
          (accum, current) =>
            expensePeriod.id === current.expenseTimePeriod
              ? parseFloat(current.cost) + parseFloat(accum)
              : accum,
          0
        )
    );

    // Adjust the expensePeriod sum totals for when expensePeriod
    // partially overlaps the specified time period
    const slicedFilteredExpensesByDay = filteredExpensesByDay.map(
      (expense, index) =>
        getOverlappingDaysInIntervals(
          {
            start: new Date(
              filteredExpensePeriodsByDays[index].dateStart + "T00:00"
            ),
            end: new Date(
              filteredExpensePeriodsByDays[index].dateEnd + "T00:00"
            ),
          },
          { start: prevDate, end: now }
        )
    );

    // Total all slice of expense per period and convert to average expenses per month
    const expensesTotal = slicedFilteredExpensesByDay.reduce(
      (accum, current) => accum + current,
      0
    );

    // Returns an array of dates within each expensePeriod
    const uniqueDays = filteredExpensePeriodsByDays.map((period) => {
      return eachDayOfInterval({
        start: new Date(period.dateStart + "T00:00"),
        end: new Date(period.dateEnd + "T00:00"),
      });
    });

    // Join array of days from each expensePeriod
    var mergedDays = Array.prototype.concat.apply([], uniqueDays);

    // Filter out duplicated days. see for info
    // https://stackoverflow.com/a/40418572
    const mergedUniqueDays = mergedDays
      .map(function (date) {
        return date.getTime();
      })
      .filter(function (date, i, array) {
        return array.indexOf(date) === i;
      })
      .map(function (time) {
        return new Date(time);
      });

    // Filter out days outside of Last XXX days
    const overlappingDays = mergedUniqueDays.filter((day) =>
      isWithinInterval(day, { start: prevDate, end: now })
    );

    // Average monthly expense
    const expensesPerMonth = (30 / overlappingDays.length) * expensesTotal;

    console.log(
      `expensePeriods for ${selectedCategory.name} in last `,
      days,
      " days:",
      filteredExpensePeriodsByDays,
      "with following totals per period",
      filteredExpensesByDay,
      "and taking into account slices",
      slicedFilteredExpensesByDay,
      "for a total of $",
      expensesTotal,
      "over",
      overlappingDays.length,
      "unique days. Averaged over the full",
      days,
      "d gives an average of ",
      expensesPerMonth,
      "per month"
    );
    return expensesPerMonth;
  }

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
            7
          ),
        },
        {
          period: "Month",
          expense: summariseTimePeriod(
            filteredExpensePeriodsTemp,
            filteredExpensesTemp,
            30
          ),
        },
        {
          period: "Year",
          expense: summariseTimePeriod(
            filteredExpensePeriodsTemp,
            filteredExpensesTemp,
            365
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
          <li key={expense.expense}>
            Last {expense.period}: {expense.expense} . Diff:{" "}
            {selectedCategory.budget - expense.expense}
          </li>
        ))}
      </ul>
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
