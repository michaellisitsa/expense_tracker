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
                  props.onSelectExpensePeriod(event, expensePeriod)
                }
              >
                {expensePeriod.id}: {expensePeriod.description} from{" "}
                {expensePeriod.category}
              </button>
              <button
                onClick={(event) =>
                  props.onDeleteExpensePeriod(event, expensePeriod)
                }
              >
                Delete
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
