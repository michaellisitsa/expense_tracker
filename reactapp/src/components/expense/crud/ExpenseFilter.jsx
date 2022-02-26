import { observer } from "mobx-react-lite";
import "./ExpenseFilter.css";

function ExpenseFilter({ selectedExpensePeriod, expensesStore }) {
  const expenses = expensesStore.list;
  const isLoaded = expensesStore.status === "success";
  let filteredExpenses;
  if (selectedExpensePeriod) {
    filteredExpenses = [...expenses].filter(
      (expense) => expense.expenseTimePeriod === selectedExpensePeriod.id
    );
  }

  function handleDelete(event, expense) {
    event.preventDefault();
    expense.delete();
  }
  return (
    <>
      <div className="expense-filter-list">
        {isLoaded ? (
          expenses.map((expense) =>
            filteredExpenses.find((item) => item.id === expense.id) ? (
              <div className="expense-filter-list__container" key={expense.id}>
                <div className="expense-filter-list__result">
                  <p className={`expense-filter-list__description`}>
                    {expense.description}
                  </p>
                  <p className={`expense-filter-list__cost`}>
                    $ {Math.round(expense.cost)}
                  </p>
                  {expense.date && <p>{expense.date}</p>}
                </div>
                <div className="expense-filter-list__crud">
                  <div
                    className="expense-filter-list__delete"
                    onClick={(event) => handleDelete(event, expense)}
                  >
                    X
                  </div>
                </div>
              </div>
            ) : null
          )
        ) : (
          <p>Loading Expense...</p>
        )}
      </div>
    </>
  );
}

export default observer(ExpenseFilter);
