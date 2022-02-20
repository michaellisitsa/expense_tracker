import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import "./ExpensePeriodFilter.css";

function ExpensePeriodFilter({
  selectedCategory,
  isLoaded,
  expensePeriodsStore,
  selectedExpensePeriod,
  setSelectedExpensePeriod,
}) {
  let selectedExpensePeriodId = null;
  let filteredExpensePeriods;
  const expensePeriods = expensePeriodsStore.list;
  if (selectedCategory) {
    filteredExpensePeriods = [...expensePeriods]
      .reverse()
      .filter(
        (expensePeriod) => expensePeriod.category === selectedCategory.id
      );

    // TODO: make simpler logic for determining which expense period to select.
    // Get the id of the selected list element
    if (
      Object.keys(selectedExpensePeriod).length === 0 &&
      filteredExpensePeriods.length !== 0
    ) {
      selectedExpensePeriodId = filteredExpensePeriods[0].id;
    } else if (filteredExpensePeriods.length === 0) {
      // pass
    } else if (
      filteredExpensePeriods.filter(
        (result) => selectedExpensePeriod.id === result.id
      ).length !== 0
    ) {
      selectedExpensePeriodId = selectedExpensePeriod.id;
    } else {
      selectedExpensePeriodId = filteredExpensePeriods[0].id;
    }
  }

  useEffect(() => {
    if (selectedCategory) {
      if (selectedExpensePeriodId) {
        setSelectedExpensePeriod(
          expensePeriods.find((result) => result.id === selectedExpensePeriodId)
        );
      } else {
        setSelectedExpensePeriod({});
      }
    }
  }, [setSelectedExpensePeriod, expensePeriods, selectedExpensePeriodId]);

  console.log(expensePeriods);
  if (!selectedCategory) {
    return <p>Loading Expense Periods...</p>;
  }

  return (
    <>
      <div className="expensePeriod-filter-list">
        {isLoaded ? (
          expensePeriods.map((expensePeriod) =>
            filteredExpensePeriods.find(
              (item) => item.id === expensePeriod.id
            ) ? (
              <div
                className="expensePeriod-filter-list__container"
                key={expensePeriod.id}
              >
                <div
                  className={`expensePeriod-filter-list__option${
                    selectedExpensePeriodId === expensePeriod.id
                      ? " active"
                      : ""
                  }`}
                  onClick={() => setSelectedExpensePeriod(expensePeriod)}
                >
                  {expensePeriod.id}: {expensePeriod.description}
                </div>
                <div
                  className="expensePeriod-filter-list__delete"
                  onClick={() => expensePeriod.delete()}
                >
                  X
                </div>
              </div>
            ) : null
          )
        ) : (
          <p>Loading Expense Periods...</p>
        )}
      </div>
    </>
  );
}

export default observer(ExpensePeriodFilter);
