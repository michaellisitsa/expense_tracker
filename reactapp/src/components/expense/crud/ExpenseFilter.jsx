import { useState, useEffect } from "react";
import "./ExpenseFilter.css";

function ExpenseFilter(props) {
  return (
    <>
      <div className="expense-filter-list">
        {props.isLoaded ? (
          [...props.expenses].reverse().map((expense) => (
            <div className="expense-filter-list__container" key={expense.id}>
              <div className="expense-filter-list__result">
                <p className={`expense-filter-list__description`}>
                  {expense.description}
                </p>
                <p className={`expense-filter-list__cost`}>
                  $ {Math.round(expense.cost)}
                </p>
              </div>
              <div className="expense-filter-list__crud">
                <div
                  className="expense-filter-list__delete"
                  onClick={(event) => props.onDeleteExpense(event, expense)}
                >
                  X
                </div>
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
