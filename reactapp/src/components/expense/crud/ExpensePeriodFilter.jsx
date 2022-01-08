import "./ExpensePeriodFilter.css";

function ExpensePeriodFilter({
  selectedCategory,
  isLoaded,
  expensePeriods,
  selectedExpensePeriod,
  onSelectExpensePeriod,
  onDeleteExpensePeriod,
}) {
  const filteredExpensePeriods = [...expensePeriods]
    .reverse()
    .filter((expensePeriod) => expensePeriod.category === selectedCategory.id);
  const selectedExpensePeriodId =
    Object.keys(selectedExpensePeriod).length !== 0
      ? selectedExpensePeriod.id
      : filteredExpensePeriods.length !== 0
      ? filteredExpensePeriods[0].id
      : null;
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
                onClick={(event) => onSelectExpensePeriod(event, expensePeriod)}
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
