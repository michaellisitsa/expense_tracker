import { useExpenseContext } from "../ExpenseProvider";
import "./ExpenseFilter.css";

function ExpenseFilter({ isLoaded, onDeleteExpense }) {
  const { selectedExpensePeriod, expenses } = useExpenseContext();
  const filteredExpenses = expenses.filter(
    (expense) => expense.expenseTimePeriod === selectedExpensePeriod.id
  );
  return (
    <>
      <div className="expense-filter-list">
        {isLoaded ? (
          [...filteredExpenses].reverse().map((expense) => (
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
                  onClick={(event) => onDeleteExpense(event, expense)}
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
