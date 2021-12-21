import {
  addDays,
  getOverlappingDaysInIntervals,
  eachDayOfInterval,
  isWithinInterval,
  differenceInDays,
} from "date-fns";

export function summariseTimePeriod(
  filteredExpensePeriods,
  filteredExpenses,
  prevDate,
  currentDate
) {
  // debugger;
  // Filter expensePeriods that fit between X days ago and currentDate.
  const filteredExpensePeriodsByDays = filteredExpensePeriods.filter(
    (expensePeriod) =>
      new Date(expensePeriod.dateStart + "T00:00") <= currentDate &&
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

  const intervalPerExpensePeriod = filteredExpensePeriodsByDays.map(
    (expense, index) => {
      return {
        start: new Date(
          filteredExpensePeriodsByDays[index].dateStart + "T00:00"
        ),
        end: new Date(filteredExpensePeriodsByDays[index].dateEnd + "T00:00"),
      };
    }
  );

  // Adjust the expensePeriod sum totals for when expensePeriod
  // partially overlaps the specified time period
  const slicedFilteredExpensesByDay = filteredExpensesByDay.map(
    (expense, index) =>
      (expense *
        getOverlappingDaysInIntervals(intervalPerExpensePeriod[index], {
          start: prevDate,
          end: currentDate,
        })) /
      differenceInDays(
        intervalPerExpensePeriod[index]["end"],
        intervalPerExpensePeriod[index]["start"]
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
    isWithinInterval(day, { start: prevDate, end: currentDate })
  );

  // Average monthly expense
  const expensesPerMonth = (30 / overlappingDays.length) * expensesTotal;

  // console.log(
  //   `expensePeriods in last `,
  //   " days:",
  //   filteredExpensePeriodsByDays,
  //   "with following totals per period",
  //   filteredExpensesByDay,
  //   "and taking into account slices",
  //   slicedFilteredExpensesByDay,
  //   "for a total of $",
  //   expensesTotal,
  //   "over",
  //   overlappingDays.length,
  //   "unique days. Averaged over the full",
  //   "d gives an average of ",
  //   expensesPerMonth,
  //   "per month"
  // );
  return parseInt(expensesPerMonth);
}
