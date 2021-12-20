import { useState, useEffect } from "react";
import "./ExpenseFilter.css";

function ExpenseFilter(props) {
  return (
    <div>
      <ul>
        {props.isLoaded ? (
          props.expenses.map((expense) => (
            <li key={expense.id}>
              <button
                onClick={(event) => props.onSelectExpense(event, expense)}
              >
                {expense.id}: {expense.description}
              </button>
              <button
                onClick={(event) => props.onDeleteExpense(event, expense)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>Loading Expense...</p>
        )}
      </ul>
    </div>
  );
}

export default ExpenseFilter;
