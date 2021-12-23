import { useState, useEffect } from "react";
import "./ExpensePeriodFilter.css";

function ExpensePeriodFilter(props) {
  return (
    <>
      <div className="filter-list">
        {props.isLoaded ? (
          props.expensePeriods.map((expensePeriod) => (
            <div className="filter-list__container" key={expensePeriod.id}>
              <div
                className="filter-list__option"
                onClick={(event) =>
                  props.onSelectExpensePeriod(event, expensePeriod)
                }
              >
                {expensePeriod.id}: {expensePeriod.description}
              </div>
              <div
                className="filter-list__delete"
                onClick={(event) =>
                  props.onDeleteExpensePeriod(event, expensePeriod)
                }
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
