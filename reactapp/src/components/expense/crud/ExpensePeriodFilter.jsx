import { useEffect } from "react";
import "./ExpensePeriodFilter.css";

function ExpensePeriodFilter({
  selectedCategory,
  isLoaded,
  expensePeriods,
  selectedExpensePeriod,
  setSelectedExpensePeriod,
  onDeleteExpensePeriod,
}) {
  let selectedExpensePeriodId = null;
  let filteredExpensePeriods;
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

  if (!selectedCategory) {
    return <p>Loading Expense Periods...</p>;
  }

  return (
    <>
      <div className="expensePeriod-filter-list">
        {isLoaded ? (
          filteredExpensePeriods.map((expensePeriod) => (
            <div
              className="expensePeriod-filter-list__container"
              key={expensePeriod.id}
            >
              <div
                className={`expensePeriod-filter-list__option${
                  selectedExpensePeriodId === expensePeriod.id ? " active" : ""
                }`}
                onClick={() => setSelectedExpensePeriod(expensePeriod)}
              >
                {expensePeriod.id}: {expensePeriod.description}
              </div>
              <div
                className="expensePeriod-filter-list__delete"
                onClick={(event) => onDeleteExpensePeriod(event, expensePeriod)}
              >
                X
              </div>
            </div>
          ))
        ) : (
          <p>Loading Expense Periods...</p>
        )}
      </div>
    </>
  );
}

export default ExpensePeriodFilter;
