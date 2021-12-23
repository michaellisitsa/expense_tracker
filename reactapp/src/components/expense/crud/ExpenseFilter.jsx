import { useState, useEffect } from "react";
import "./ExpenseFilter.css";

function ExpenseFilter(props) {
  return (
    <>
      <div className="filter-list">
        {props.isLoaded ? (
          props.expenses.map((expense) => (
            <div className="filter-list__container" key={expense.id}>
              <div
                className={`filter-list__option`}
                onClick={(event) => props.onSelectExpense(event, expense)}
              >
                {expense.id}: {expense.description}
              </div>
              <div
                className="filter-list__delete"
                onClick={(event) => props.onDeleteExpense(event, expense)}
              >
                X
              </div>
            </div>
          ))
        ) : (
          <p>Loading Expense...</p>
        )}
      </div>
    </>
  );
}

export default ExpenseFilter;
