import { useState, useEffect } from "react";
import "./ExpensePeriodFilter.css";

function ExpensePeriodFilter(props) {
  return (
    <div>
      <ul>
        {props.isLoaded ? (
          props.expensePeriods.map((expensePeriod) => (
            <li key={expensePeriod.id}>
              <button
                onClick={(event) =>
                  props.handleSelectExpensePeriod(event, expensePeriod.id)
                }
              >
                {expensePeriod.id}: {expensePeriod.description}
              </button>
            </li>
          ))
        ) : (
          <p>Loading Expense Periods...</p>
        )}
      </ul>
    </div>
  );
}

export default ExpensePeriodFilter;
